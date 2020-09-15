import React from "react";
import { Card, CardBody, Row, Col, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Tabs, Tab } from 'react-bootstrap';
import _ from "lodash";
import { WidthProvider, Responsive } from "react-grid-layout";
import DashboardTemplate from './DashboardTemplate';
import GoogleCharts from './charts/GoogleCharts';
import GoogleChartsProperties from './charts/GoogleChartsProperties';
import WordCloudProperties from './charts/WordCloudProperties';
import WordCloud from './charts/WordCloud';
import ApexCharts from './charts/ApexCharts';
import ApexChartsProperties from './charts/ApexChartsProperties'
import ExplainabilityCard from './cards/ExplainabilityCard';

import StudioTable from '../utils/StudioTable';
import StudioShare from '../utils/StudioShare';
import StudioImages from '../modeler/StudioImages';
import LowCodeDataForm from "../modeler/LowCodeDataForm";
import Discover from './Discover';
import DashboardConfigForm from './DashboardConfigForm';

import { BasicSpinner } from "../utils/BasicSpinner";
import { confirmDelete, actionButton, ACTION_BUTTON } from '../utils/StudioUtils';
import { generateUUID, inputField } from '../utils/StudioUtils';
import { notifyError, notifySuccess } from '../utils/Notifications';
import { dashboardService } from "../services/DashboardService";
import { userService } from "../services/UserService";

import './Dashboard.scss';
import './DashboardLayout.scss';
const ResponsiveReactGridLayout = WidthProvider(Responsive);
const DEFAULT_WIDTH = 4, DEFAULT_HEIGHT = 6;
export default class Dashboard extends React.Component {
    static defaultProps = {
        className: "layout",
        cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
        rowHeight: 30,
        // compactType: 'horizontal',
        preventCollision: false
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            designMode: false,
            showPalette: false,
            showProperties: false,
            showModal: false,
            modalAction: '',

            dashboardList: [],
            selectedDashboardId: '',
            dashboard: {},
            layout: [],
            dashboardModified: false,
            selectedLayoutId: undefined,
            dashboardContent: [],
        };
    }

    componentDidMount() {
        const { solutionId } = this.props.match.params;
        dashboardService.getDashboards(solutionId, userService.getUserId()).then(response => {
            let dashboardList = response.map((dashboard) => ({ value: dashboard.id, label: dashboard.name }));
            let selectedDashboardId = '';
            if (dashboardList.length > 0) {
                selectedDashboardId = dashboardList[0].value;
                this.getDashboard(selectedDashboardId);
            }
            this.setState({ loading: false, dashboardList: dashboardList, selectedDashboardId: selectedDashboardId });
        }).catch(error => {
            console.error('dashboardService.getDashboards:', error);
            notifyError('Unable to retrieve dashboard list', error.message);
            this.setState({ loading: false })
        });
    }

    onChangeDashboardSelection(name, value) {
        this.getDashboard(value);
        this.setState({ [name]: value, loading: true, dashboardModified: false });
    }

    getDashboard(dashboardId) {
        const { solutionId } = this.props.match.params;
        const parent = this;
        let dashboard = {};
        let layout = [];
        let dashboardContent = [];
        let dashboardModified = false;
        dashboardService.getDashboard(solutionId, dashboardId).then(response => {
            dashboard = response;
            dashboardContent = dashboard.content || [];
            layout = dashboard.layout || [];

            // Verify and Fix Layout
            if (dashboardContent.length !== layout.length) {
                layout = [];
                dashboardModified = true;
                dashboardContent.forEach(function (dashboardItem) {
                    dashboardItem.id = dashboardItem.id || generateUUID();
                    parent.addLayoutItem(layout, dashboardItem.id)
                })
            }

            // Load Data
            var promiseArray = [];
            dashboardContent.forEach(function (dashboardItem) {
                if (!dashboardItem.type) {
                    let templateFilter = DashboardTemplate.DASHBOARD_ITEMS.filter(arrayItem => arrayItem.provider === dashboardItem.provider &&
                        arrayItem.group === dashboardItem.group);
                    if (templateFilter.length > 0 && templateFilter[0].variations) {
                        dashboardItem.type = templateFilter[0].variations[0].value;
                    }
                }
                const childPromise = parent.getDashboardItemData(dashboardItem);
                promiseArray.push(childPromise);
            });
            return Promise.all(promiseArray);
        }).then(() => {
            parent.setState({
                loading: false,
                dashboard: dashboard,
                dashboardContent: dashboardContent,
                layout: layout,
                dashboardModified: dashboardModified
            });
        }).catch(error => {
            parent.setState({ loading: false, dashboard: dashboard, dashboardContent: dashboardContent, layout: layout });
            console.error('dashboardService.getDashboard:', error);
            notifyError('Unable to retrieve dashboard', error.message);
        });
    }

    getDashboardItemData(dashboardItem) {
        let dataSource = dashboardItem.dataSource;
        return dashboardService.getDashboardData(dataSource).then(response => {
            if (dashboardItem.dataSource?.path?.startsWith('/local/data/chart/')) {
                dashboardItem.data = response;
            } else if ('data-table' === dashboardItem.group) {
                dashboardItem.data = response;
            } else if ('word-cloud' === dashboardItem.provider) {
                if (dashboardItem.dataSource.params?.positive === "true") {
                    dashboardItem.data = response.positive_explainability.map(positive => ({ text: positive.text, value: positive.value * 1 }));
                } else {
                    dashboardItem.data = response.negative_explainability.map(negative => ({ text: negative.text, value: negative.value * -1 }));
                }
            } else if (dataSource.labels && dataSource.labels.filter(label => label.selected).length > 0) {
                let dashboardData = [];
                let keys = dataSource.labels.filter(label => label.selected).map(label => (label.key));
                let labels = dataSource.labels.filter(label => label.selected).map(label => (label.label));
                dashboardData.push(labels);
                response.forEach(responseItem => {
                    let data = [];
                    keys.forEach(key => {
                        data.push(responseItem[key] || '');
                    })
                    dashboardData.push(data);
                })
                dashboardItem.data = dashboardData;
            }
            // else {
            //     dashboardItem.data = response;
            // }
        }).catch(error => {
            console.error('dashboardService.getDashboardData:', error);
            notifyError('Unable to retrieve data', error.message);
        });
    }

    refreshDashboardItemData(dashboardItem) {
        const { dashboardContent } = this.state;
        const parent = this;
        setTimeout(() => {
            parent.getDashboardItemData(dashboardItem).then(response => {
                parent.setState({ dashboardContent: dashboardContent });
            }).catch(error => {
                parent.setState({ dashboardContent: dashboardContent });
            });
        }, 500);
    }

    createDashboard(dashboard) {
        const { solutionId } = this.props.match.params;
        const { dashboardList } = this.state;
        dashboard.users = [
            {
                userId: userService.getUserId(),
                username: userService.getLoginName(),
                role: 'Editor'
            }
        ]
        dashboardService.createDashboard(solutionId, dashboard).then(response => {
            notifySuccess('Create Dashboard', 'Dashboard has been successfully created');
            dashboardList.unshift({ value: response.id, label: response.name });
            this.setState({ selectedDashboardId: response.id, dashboardList: dashboardList, showModal: false, modalAction: '' });
            this.onChangeDashboardSelection('selectedDashboardId', response.id);
        }).catch(error => {
            console.error('dashboardService.createDashboard:', error);
            notifyError('Unable to create dashboard', error.message);
            this.setState({ showModal: false, modalAction: '' });
        });
    }

    updateDashboard(dashboardConfig) {
        const { solutionId } = this.props.match.params;
        const { dashboard, dashboardList, layout, dashboardContent } = this.state;
        dashboard.name = dashboardConfig.name
        dashboard.description = dashboardConfig.description
        dashboard.default = dashboardConfig.default
        dashboard.layout = layout;
        dashboard.content = JSON.parse(JSON.stringify(dashboardContent));
        dashboard.content.forEach(function (dashboardItem) {
            delete dashboardItem.data
        })
        dashboardService.updateDashboard(solutionId, dashboard).then(response => {
            notifySuccess('Save Dashboard', 'Dashboard has been successfully saved');
            let dashboardItem = dashboardList.filter(dashboardItem => dashboardItem.value = response.id)[0]
            dashboardItem.label = response.name
            this.setState({ dashboard: dashboard, dashboardList: dashboardList, showModal: false, modalAction: '', modalConfig: undefined });
        }).catch(error => {
            console.error('dashboardService.saveDashboard:', error);
            notifyError('Unable to save dashboard', error.message);
            this.setState({ showModal: false, modalAction: '', modalConfig: undefined });
        });
    }

    deleteDashboard() {
        const { solutionId } = this.props.match.params;
        const { dashboard, dashboardList } = this.state;
        const parent = this;
        confirmDelete().then(function (userInput) {
            if (!userInput.dismiss) {
                // let actionComment = userInput.value;
                dashboardService.deleteDashboard(solutionId, dashboard.id).then(response => {
                    notifySuccess('Delete Dashboard', 'Dashboard has been permanently removed');
                    let filteredList = dashboardList.filter(dashboardItem => dashboardItem.value !== dashboard.id)
                    let selectedDashboardId = '';
                    if (filteredList.length > 0) {
                        selectedDashboardId = filteredList[0].value
                    }
                    parent.setState({
                        selectedDashboardId: selectedDashboardId, layout: [], dashboardContent: [],
                        dashboard: {}, dashboardList: filteredList, showModal: false, modalAction: '', modalConfig: undefined
                    });
                    if (selectedDashboardId) {
                        parent.onChangeDashboardSelection('selectedDashboardId', selectedDashboardId);
                    }
                }).catch(error => {
                    console.error('dashboardService.deleteDashboard:', error);
                    notifyError('Unable to delete dashboard', error.message);
                    parent.setState({ showModal: false, modalAction: '', modalConfig: undefined });
                });
            }
        })

    }

    saveDashboard() {
        const { solutionId } = this.props.match.params;
        const { dashboard, layout, dashboardContent } = this.state;
        dashboard.layout = layout;
        dashboard.content = JSON.parse(JSON.stringify(dashboardContent));
        dashboard.content.forEach(function (dashboardItem) {
            delete dashboardItem.data
        })
        dashboardService.updateDashboard(solutionId, dashboard).then(response => {
            notifySuccess('Save Dashboard', 'Dashboard has been successfully saved');
            this.setState({ designMode: false, dashboardModified: false })
        }).catch(error => {
            console.error('dashboardService.saveDashboard:', error);
            notifyError('Unable to save dashboard', error.message);
        });
    }

    shareDashboard(payload) {
        const { solutionId } = this.props.match.params;
        const { dashboard } = this.state;
        dashboardService.shareDashboard(solutionId, dashboard.id, payload).then(response => {
            notifySuccess('Share Dashboard', 'Dashboard has been successfully shared');
            dashboard.users = response.users
            this.setState({ dashboard: dashboard, showModal: false, modalAction: '' });
        }).catch(error => {
            console.error('dashboardService.shareDashboard:', error);
            notifyError('Unable to share dashboard', error.message);
            this.setState({ showModal: false, modalAction: '' });
        });
    }

    addLayoutItem(layout, layoutId) {
        let x = 0, y = 0;
        let sortedLayout = layout.sort((a, b) => a.y - b.y || a.x - b.x);
        if (sortedLayout.length > 0) {
            let lastItem = sortedLayout[sortedLayout.length - 1];
            x = lastItem.x + DEFAULT_WIDTH;
            if (x >= 12) {
                x = 0;
                y = lastItem.y + DEFAULT_HEIGHT;;
            }
        }
        layout.push({ x: x, y: y, w: DEFAULT_WIDTH, h: DEFAULT_HEIGHT, i: layoutId, static: false });
    }

    onDragPaletteItem = (e) => {
        e.dataTransfer.setData('id', e.target.id);
    }

    onDropPaletteItem = (e) => {
        const { layout, dashboardContent } = this.state;
        const paletteItem = e.dataTransfer.getData('id').split('.');
        let template = DashboardTemplate.DASHBOARD_ITEMS.filter(arrayItem => arrayItem.provider === paletteItem[0] && arrayItem.group === paletteItem[1])[0];
        let dashboardItem = { provider: template.provider, group: template.group };
        if (template.variations) {
            dashboardItem.type = template.variations[0].value;
        }
        dashboardItem.id = generateUUID();
        dashboardContent.push(dashboardItem);
        this.addLayoutItem(layout, dashboardItem.id);
        this.hideShowPalette();
        this.setState({ selectedLayoutId: dashboardItem.id, dashboardContent: dashboardContent, layout: layout, dashboardModified: true });
    }

    onLayoutChange(layout) {
        const prevLayout = this.state.layout;
        let isModified = this.state.dashboardModified;
        if (!isModified) {
            if (layout.length !== prevLayout.length) {
                isModified = true;
            } else {
                layout.forEach(function (newItem) {
                    if (!isModified) {
                        let filterList = prevLayout.filter(arrayItem => arrayItem.i === newItem.i);
                        if (filterList.length === 0) {
                            isModified = true;
                        } else {
                            let prevItem = filterList[0];
                            isModified = !(newItem.x === prevItem.x && newItem.y === prevItem.y && newItem.w === prevItem.w && newItem.h === prevItem.h);
                        }
                    }
                })
            }
        }

        this.setState({ layout: layout, dashboardModified: isModified });
    }

    onBreakpointChange(breakpoint, cols) {
        this.setState({ breakpoint: breakpoint, cols: cols });
    }

    hideShowPalette = () => {
        const { showPalette } = this.state;
        if (!showPalette) {
            document.getElementById("dashboardPaletteContainer").style.display = "block";
        } else {
            document.getElementById("dashboardPaletteContainer").style.display = "none";
        }
        this.setState({ showPalette: !showPalette })
    }

    hideShowProperties = () => {
        const { showProperties } = this.state;
        if (!showProperties) {
            document.getElementById("dashboardPropertiesContainer").style.display = "block";
        } else {
            document.getElementById("dashboardPropertiesContainer").style.display = "none";
        }
        this.setState({ showProperties: !showProperties })
    }

    showProperties = (layoutId) => {
        document.getElementById("dashboardPropertiesContainer").style.display = "block";
        this.setState({ selectedLayoutId: layoutId, showProperties: true });
    }

    removeLayoutItem(layoutItem) {
        this.setState({
            dashboardModified: true, showProperties: false, selectedLayoutId: undefined,
            layout: _.reject(this.state.layout, { i: layoutItem.i }),
            dashboardContent: _.reject(this.state.dashboardContent, { id: layoutItem.i })
        });
    }

    renderDashboardItem(layoutId) {
        const { dashboardContent } = this.state;
        let dashboardItem = dashboardContent.filter(arrayItem => arrayItem.id === layoutId)[0];

        return (
            <div key={layoutId} className={dashboardItem.provider + '-item'}>
                {['explainability-chart'].indexOf(dashboardItem.group) < 0 && dashboardItem.provider === 'google-charts' &&
                    <React.Fragment>
                        {dashboardItem.options && dashboardItem.options.heading?.title &&
                            <h5 className={'mt-1 ml-1 ' + (dashboardItem.options.heading.align || 'text-left')}>{dashboardItem.options.heading.title}</h5>
                        }
                        <GoogleCharts group={dashboardItem.group} chartType={dashboardItem.type} options={dashboardItem.options} data={dashboardItem.data} />
                    </React.Fragment>
                }
                {'explainability-chart' === dashboardItem.group && dashboardItem.provider === 'google-charts' &&
                    <React.Fragment>
                        {dashboardItem.options && dashboardItem.options.heading?.title &&
                            <h5 className={'mt-1 ml-1 ' + (dashboardItem.options.heading.align || 'text-left')}>{dashboardItem.options.heading.title}</h5>
                        }
                        <ExplainabilityCard group={dashboardItem.group} chartType={dashboardItem.type} options={dashboardItem.options} data={dashboardItem.data} />
                    </React.Fragment>
                }
                {dashboardItem.provider === 'apex-charts' &&
                    <React.Fragment>
                        {dashboardItem.options && dashboardItem.options.heading?.title &&
                            <h5 className={'mt-1 ml-1 ' + (dashboardItem.options.heading.align || 'text-left')}>{dashboardItem.options.heading.title}</h5>
                        }
                        <ApexCharts group={dashboardItem.group} chartType={dashboardItem.type} options={dashboardItem.options} data={dashboardItem.data} />

                    </React.Fragment>
                }
                {dashboardItem.provider === 'word-cloud' &&
                    <React.Fragment>
                        {dashboardItem.options && dashboardItem.options.heading?.title &&
                            <h5 className={'mt-1 ml-1 ' + (dashboardItem.options.heading.align || 'text-left')}>{dashboardItem.options.heading.title}</h5>
                        }
                        <WordCloud options={dashboardItem.options} data={dashboardItem.data} />
                    </React.Fragment>
                }
                {dashboardItem.provider === 'studio-dashboard' && dashboardItem.group === 'data-table' &&
                    <StudioTable tableName={dashboardItem.options?.title}
                        tableHeader={dashboardItem.dataSource?.labels.filter(labelItem => labelItem.selected)}
                        defaultSort={dashboardItem.options?.order || {}}
                        defaultRows={'5'}
                        tableData={dashboardItem.data}
                    />
                }
            </div>
        )
    }

    renderLayoutItem(layoutItem) {
        const { designMode } = this.state;
        return (
            <div className='dashboard-canvas-item' key={layoutItem.i} data-grid={layoutItem} layout-item-key={layoutItem.i}>
                {designMode &&
                    <div className='dashboard-grid-icon'>
                        {actionButton('Remove', this.removeLayoutItem.bind(this, layoutItem),
                            'mt-1 mr-1', 'feather icon-trash-2')}

                        {actionButton('Settings', this.showProperties.bind(this, layoutItem.i),
                            'mt-1 mr-2', 'feather icon-settings studio-primary')}
                    </div>
                }
                {this.renderDashboardItem(layoutItem.i)}
            </div>
        )
    }

    renderPaletteItems() {
        const parent = this;
        return DashboardTemplate.DASHBOARD_ITEMS.map(function (chartItem) {
            return (
                <div key={chartItem.group} className="dashboard-palette-item text-center" id={chartItem.provider + '.' + chartItem.group} title={chartItem.label}
                    draggable={true} onDragStart={parent.onDragPaletteItem}>
                    <i className={'dashboard-palette-icon ' + chartItem.icon} />
                    <p className="dashboard-palette-text">{chartItem.label}</p>
                </div>
            );
        });
    }

    setPropertyValue(propName, propValue) {
        const { dashboardContent, selectedLayoutId } = this.state;
        let dashboardItem = dashboardContent.filter(arrayItem => arrayItem.id === selectedLayoutId)[0];
        let xpath = propName.split('.');
        var i = 0;
        for (; i < (xpath.length - 1); i++) {
            if (!dashboardItem[xpath[i]]) {
                dashboardItem[xpath[i]] = {};
            }
            dashboardItem = dashboardItem[xpath[i]];
        }
        dashboardItem[xpath[i]] = typeof propValue === 'boolean' ? propValue : ['options.colors'].indexOf(propName) < 0 ? propValue : propValue.split(',');
        if ('dataSource.path' === propName && propValue) {
            this.refreshDashboardItemData(dashboardContent.filter(arrayItem => arrayItem.id === selectedLayoutId)[0]);
        }
        this.setState({ dashboardContent: dashboardContent, dashboardModified: true });
    }

    getPropertyValue(propName, dashboardItem) {
        let xpath = propName.split('.');
        var i = 0;
        for (; dashboardItem && (i < (xpath.length - 1)); i++) {
            dashboardItem = dashboardItem[xpath[i]];
        }
        if (dashboardItem) {
            let propValue = dashboardItem[xpath[i]]
            propValue = typeof propValue === 'object' ? propValue.toString() : propValue;
            return propValue
        } else {
            return undefined;
        }
    }

    getInputField(propField, dashboardItem) {
        let template = DashboardTemplate.DASHBOARD_ITEMS.filter(arrayItem => arrayItem.provider === dashboardItem.provider && arrayItem.group === dashboardItem.group)[0];
        const parent = this;
        let hiddenInput = false;
        if (propField.depends) {
            hiddenInput = !parent.getPropertyValue(propField.depends, dashboardItem);
        }

        if ('checkbox' === propField.inputType.toLowerCase()) {
            return inputField(propField.inputType, propField.key, propField.label, !!parent.getPropertyValue(propField.key, dashboardItem),
                parent.setPropertyValue.bind(this), {
                container: (hiddenInput ? 'dashboard-property-hidden' : 'text-center'),
                label: 'w-auto'
            });
        } else if ('select' === propField.inputType.toLowerCase()) {
            return inputField(propField.inputType, propField.key, propField.label, parent.getPropertyValue(propField.key, dashboardItem),
                parent.setPropertyValue.bind(this), {
                container: (hiddenInput ? ' dashboard-property-hidden' : ''),
                label: 'dashboard-property-label',
                input: 'dashboard-property-input ' + propField.inputType.toLowerCase()
            }, propField.selectReference ? template[propField.selectReference] : propField.selectValues);
        } else {
            return inputField(propField.inputType, propField.key, propField.label, parent.getPropertyValue(propField.key, dashboardItem),
                parent.setPropertyValue.bind(this), {
                container: (hiddenInput ? ' dashboard-property-hidden' : (propField.inputType === 'color' ? 'text-center' : '')),
                label: 'dashboard-property-label',
                input: 'dashboard-property-input ' + propField.inputType.toLowerCase(),
                min: propField.min, max: propField.max, step: propField.step, size: propField.size, maxLength: propField.maxLength,
                disabled: propField.disabled, readOnly: propField.readOnly, required: propField.required,
                pattern: propField.pattern, placeholder: propField.placeholder, autoFocus: propField.autoFocus
            });
        }
    }

    toggleProperties(propsCategoryId) {
        let propsCategory = document.getElementById(propsCategoryId);
        let propsStatus = propsCategory.getAttribute('class');
        if (propsStatus.endsWith('-hide')) {
            propsCategory.setAttribute('class', propsStatus.replace(/-hide/g, '-show'));
        } else {
            propsCategory.setAttribute('class', propsStatus.replace(/-show/g, '-hide'));
        }
    }

    renderProperties() {
        const parent = this;
        const { dashboardContent, selectedLayoutId } = this.state;
        let dashboardItem = dashboardContent.filter(arrayItem => arrayItem.id === selectedLayoutId)[0];
        let properties = undefined;
        if (dashboardItem?.provider === 'google-charts') {
            properties = GoogleChartsProperties.PROPERTIES[dashboardItem.provider];
        } else if (dashboardItem?.provider === 'apex-charts') {
            properties = ApexChartsProperties.PROPERTIES[dashboardItem.provider];
        } else if (dashboardItem?.provider === 'word-cloud') {
            properties = WordCloudProperties.PROPERTIES[dashboardItem.provider];
        }

        if (properties) {
            properties = properties[dashboardItem.type];
        }

        return properties && Object.keys(properties).map(function (category, categoryIndex) {
            let propsCategoryId = 'prop-catg-' + category.toLowerCase().replace(/ /g, '-');
            return (
                <div id={propsCategoryId} key={categoryIndex}
                    className={categoryIndex === 0 ? 'pl-0 ml-0 mt-1 dashboard-prop-catg-fields-show' : 'mt-1 dashboard-prop-catg-fields-hide'}>
                    <label className='dashboard-property-category col pb-0 btn'
                        onClick={() => { parent.toggleProperties(propsCategoryId) }}>{category}</label>
                    {properties[category].map(function (propField, fieldIndex) {
                        return (<Row key={fieldIndex} xs={1} md={1}>
                            <Col className='pb-0 pt-1'>{parent.getInputField(propField, dashboardItem)}</Col>
                        </Row>)
                    })}
                </div>
            )
        });
    }

    renderDataProperties() {
        const parent = this;
        const { dashboardContent, selectedLayoutId } = this.state;
        let dashboardItem = dashboardContent.filter(arrayItem => arrayItem.id === selectedLayoutId)[0];
        return <Row xs='1' md='1'>
            <Col className='pb-0'>
                {actionButton('Configure', () => { this.setState({ showModal: true, modalAction: 'configure' }) },
                    'content-float-right', '', true, false, ACTION_BUTTON.PRIMARY)}
            </Col>
            <Col className='pt-0 pb-0'>
                {inputField('text', 'dataSource.host', 'Host', dashboardItem.dataSource?.host,
                    () => { }, {
                    label: 'dashboard-property-label',
                    input: 'dashboard-property-input text',
                    readOnly: true
                })}
            </Col>
            <Col className='pt-0 pb-0'>
                {inputField('text', 'dataSource.path', 'Path', dashboardItem.dataSource?.path,
                    parent.setPropertyValue.bind(this), {
                    label: 'dashboard-property-label',
                    input: 'dashboard-property-input text',
                    readOnly: true
                })}
            </Col>
            <Col className='pt-0 pb-0'>
                {inputField('text', 'dataSource.method', 'Method', dashboardItem.dataSource?.method,
                    () => { }, {
                    label: 'dashboard-property-label',
                    input: 'dashboard-property-input text',
                    readOnly: true
                })}
            </Col>
            <Col className='pt-0 pb-0'>
                {inputField('number', 'dataSource.autoRefresh', 'Auto Refresh (Seconds)', dashboardItem.dataSource?.autoRefresh,
                    () => { }, {
                    label: 'dashboard-property-label',
                    input: 'dashboard-property-input text',
                    readOnly: true
                })}
            </Col>
            {dashboardItem.dataSource?.params && Object.keys(dashboardItem.dataSource.params).length > 0 && <Col className='pt-0 pb-0'>
                <label className='mb-1'>Query Parameters</label>
                <select size={5} name={'params'} className='component-stretched pl-2 pr-2'
                    readOnly={true}>
                    {Object.keys(dashboardItem.dataSource.params).map((param, paramIndex) =>
                        <option key={paramIndex} className='text-truncate' value={param}>{param}: {dashboardItem.dataSource.params[param]}</option>
                    )}
                </select>
            </Col>}
            {dashboardItem.dataSource?.headers && Object.keys(dashboardItem.dataSource.headers).length > 0 && <Col className='pt-0 pb-0'>
                <label className='mb-1'>Request Headers</label>
                <select size={5} name={'headers'} className='component-stretched pl-2 pr-2'
                    readOnly={true}>
                    {Object.keys(dashboardItem.dataSource.headers).map((param, paramIndex) =>
                        <option key={paramIndex} className='text-truncate' value={param}>{param}: {dashboardItem.dataSource.headers[param]}</option>
                    )}
                </select>
            </Col>}
            {dashboardItem.dataSource?.labels && dashboardItem.dataSource.labels.length > 0 && <Col className='pt-1 pb-0'>
                <label className='mb-1'>Data Labels</label>
                <Row xs='1' md='2'><Col className='pl-1 pt-0 pb-0 pr-1'>Key</Col><Col className='pl-0 pt-0 pb-0 pr-1'>Label</Col></Row>
                {dashboardItem.dataSource.labels.map((labelInfo, labelIndex) => labelInfo.selected &&
                    <Row key={labelIndex}>
                        <Col className='pl-1 pt-0 pb-0 pr-1'>
                            <Row>
                                <Col className='pl-0 pt-0 pb-0 pr-1'><div className='text-truncate small'>{labelInfo.key}</div></Col>
                                <Col className='pl-0 pt-0 pb-0 pr-1'><div className='text-truncate small'>{labelInfo.label}</div></Col>
                            </Row>
                        </Col>
                    </Row>
                )}
            </Col>}
        </Row>
    }

    saveDataBinding(dataSource) {
        const { selectedLayoutId, dashboardContent } = this.state;
        let dashboardItem = dashboardContent.filter(arrayItem => arrayItem.id === selectedLayoutId)[0];
        dashboardItem.dataSource = dataSource;
        this.setState({ dashboardContent: dashboardContent, showModal: false, modalAction: '', dashboardModified: true });
        this.refreshDashboardItemData(dashboardItem);
    }

    render() {
        const { loading, dashboard, dashboardContent, dashboardList, selectedDashboardId, selectedLayoutId } = this.state;
        const { designMode, dashboardModified, showPalette, showProperties, showModal, modalAction, modalConfig } = this.state;
        const toggleModal = () => this.setState({ showModal: false, modalAction: '' });
        let dashboardName = dashboard?.description || 'Dashboard'

        return (
            <section className="studio-container">
                {loading &&
                    <Card>
                        <CardBody>
                            <BasicSpinner />
                        </CardBody>
                    </Card>
                }
                {!loading &&
                    <div>
                        <Row>
                            <Col className="text-left mt-0 pb-0">
                                <h4 className="pt-0 mt-1 studio-primary">{designMode ? (dashboardName + ' Designer') : dashboardName}</h4>
                            </Col>
                            <Col sm='auto' className="text-center mt-0 pb-0">
                                {selectedDashboardId && !designMode && !dashboardModified &&
                                    actionButton('Configure', () => { this.setState({ showModal: true, modalAction: 'update', modalConfig: this.state.dashboard }) },
                                        'mt-2 ml-0 content-float-right', 'feather icon-edit', false)
                                }
                                {dashboardList.length > 0 && inputField('select', 'selectedDashboardId', '', selectedDashboardId,
                                    this.onChangeDashboardSelection.bind(this), {
                                    container: 'mb-0 mt-1 content-float-right',
                                    input: 'content-border-none text-right w-auto',
                                    disabled: designMode
                                }, dashboardList)}
                            </Col>
                            <Col className="text-center mt-0 pb-0">
                                {actionButton('Create', () => { this.setState({ showModal: true, modalAction: 'create' }) },
                                    'ml-2 content-float-right', 'feather icon-plus', true, false, ACTION_BUTTON.PRIMARY)}
                                {selectedDashboardId && !designMode &&
                                    actionButton('Design', () => {
                                        this.setState({
                                            designMode: !this.state.designMode, selectedLayoutId: undefined
                                        })
                                    }, 'mt-1 ml-2 mr-1 content-float-right', 'feather icon-layout studio-secondary', true)
                                }
                                {selectedDashboardId && designMode &&
                                    actionButton('Verify', () => {
                                        if (showProperties) {
                                            this.hideShowProperties();
                                        }
                                        this.setState({
                                            designMode: !this.state.designMode, selectedLayoutId: undefined
                                        })
                                    }, 'mt-1 ml-2 mr-1 content-float-right', 'feather icon-eye', true)
                                }
                                {selectedDashboardId && !designMode && dashboardModified &&
                                    actionButton('Save', this.saveDashboard.bind(this),
                                        'mt-1 ml-2 mr-1 content-float-right', 'feather icon-save', true)
                                }
                                {selectedDashboardId && !designMode && !dashboardModified && actionButton('Delete', this.deleteDashboard.bind(this),
                                    'mt-1 ml-2 mr-1 content-float-right', 'feather icon-trash-2', true)}
                                {selectedDashboardId && !designMode && !dashboardModified && actionButton('Share',
                                    () => { this.setState({ showModal: true, modalAction: 'share' }) },
                                    'mt-1 ml-2 mr-1 content-float-right', 'feather icon-share-2', true)}
                            </Col>
                        </Row>
                        <Row xs="1" md="1">
                            <Col className="cards-container">
                                <Card className="studio-card mb-0">
                                    <CardBody className="text-left p-0">
                                        <Row xs="1" md="1" id="dashboardContainer" className="pl-0 pr-0 ml-0 mr-0">
                                            <Col id="dashboardCanvas" className={'pt-0 pl-0 pr-0 ml-0 mr-0'} onDragOver={(e) => e.preventDefault()} onDrop={this.onDropPaletteItem}>
                                                {designMode &&
                                                    <div id="dashboardPaletteContainer" className="pl-0 pr-0 ml-0 mr-0">
                                                        {showPalette &&
                                                            <div id="dashboardPalette">
                                                                {this.renderPaletteItems()}
                                                            </div>
                                                        }
                                                    </div>
                                                }
                                                {designMode &&
                                                    <button type="button" className={"dashboard-palette-toggle" + (showPalette ? ' hide' : ' show')}
                                                        title={showPalette ? 'Hide Palette' : 'Show Palette'} onClick={() => { this.hideShowPalette() }} >
                                                        {showPalette ? 'Hide Palette' : 'Show Palette'} <img width="15" height="15" alt="Hide Palette" src={StudioImages.ARROW_TB} />
                                                    </button>
                                                }

                                                {designMode && showProperties &&
                                                    <button type="button" className={"dashboard-properties-toggle" + (showProperties ? ' hide' : ' show')}
                                                        title={showProperties ? 'Hide Properties' : 'Show Properties'} onClick={() => { this.hideShowProperties() }} >
                                                        {showProperties ? 'Hide Properties' : 'Show Properties'} <img width="15" height="15" alt="Hide Properties" src={StudioImages.ARROW_TB} />
                                                    </button>
                                                }
                                                {designMode &&
                                                    <div id="dashboardPropertiesContainer" className="pl-0 pr-0 ml-0 mr-0">
                                                        {showProperties &&
                                                            <div id="dashboardProperties">
                                                                <Tabs defaultActiveKey={'propsTab'} className={'px-2'}>
                                                                    <Tab eventKey={'propsTab'} title={'Properties'}>
                                                                        {selectedLayoutId && this.renderProperties()}
                                                                    </Tab>
                                                                    <Tab eventKey={'dataTab'} title={'Data'}>
                                                                        {selectedLayoutId && this.renderDataProperties()}
                                                                    </Tab>
                                                                </Tabs>
                                                            </div>
                                                        }
                                                    </div>
                                                }

                                                <ResponsiveReactGridLayout {...this.props}
                                                    onLayoutChange={this.onLayoutChange.bind(this)}
                                                    onBreakpointChange={this.onBreakpointChange.bind(this)}>
                                                    {_.map(this.state.layout, layoutItem => this.renderLayoutItem(layoutItem))}
                                                </ResponsiveReactGridLayout>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                }

                <Modal centered isOpen={showModal && ['create', 'update'].indexOf(modalAction) >= 0}>
                    <ModalHeader toggle={toggleModal} className="p-3">{modalAction === 'create' ? 'Create ' : 'Update '}Dashboard</ModalHeader>
                    <ModalBody className="pt-0 pb-0 pl-2 pr-2">
                        <LowCodeDataForm
                            formDesign={DashboardConfigForm.DATA_INPUT_FORM}
                            formData={modalConfig}
                            onSubmit={modalAction === 'create' ? this.createDashboard.bind(this) : this.updateDashboard.bind(this)}
                        />
                    </ModalBody>
                </Modal>
                <Modal centered size={'lg'} isOpen={showModal && modalAction === 'share'}>
                    <ModalHeader toggle={toggleModal} className="p-3">{`Share Dashboard ${this.state.dashboard ? ('- ' + this.state.dashboard.name) : ''}`}</ModalHeader>
                    <ModalBody className="pt-0 pb-0 pl-2 pr-2">
                        <StudioShare
                            users={this.state.dashboard ? this.state.dashboard.users : []}
                            onSave={this.shareDashboard.bind(this)} />
                    </ModalBody>
                </Modal>

                <Modal centered size={'xl'} isOpen={showModal && modalAction === 'configure'}>
                    <ModalHeader toggle={toggleModal} className="p-3">Configure Data Binding</ModalHeader>
                    <ModalBody className="pt-0 pb-0 pl-2 pr-2">
                        <Discover
                            dataSource={selectedLayoutId ? dashboardContent.filter(arrayItem => arrayItem.id === selectedLayoutId)[0]?.dataSource : {}}
                            onSave={this.saveDataBinding.bind(this)} />
                    </ModalBody>
                </Modal>

            </section>
        );
    }
}
