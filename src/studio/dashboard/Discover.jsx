import React, { Component } from "react";
import { Row, Col, Table } from 'reactstrap';
import { Tabs, Tab } from 'react-bootstrap';

import { actionButton, ACTION_BUTTON } from '../utils/StudioUtils';
import { inputField } from '../utils/StudioUtils';
import { notifyError } from '../utils/Notifications';
import { dashboardService } from "../services/DashboardService";

import './Discover.scss';
const REGEX_API_PARAM = /[^{]+(?=})/g

export default class Discover extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            dataSource: JSON.parse(JSON.stringify(props.dataSource || {})),
            services: [],
            activeTab: 'configure',
            configLayout: 0
        };
    }

    componentDidMount() {
        const { dataSource } = this.state;
        let services = [
            {
                host: 'http://dummy.restapiexample.com',
                path: '/api/v1/data/{key}',
                method: 'GET',
                description: 'Number of responses',
                response: [{ id: '', lifeExpectancy: '', fertilityRate: '', region: '', population: '' }]
            },
            {
                host: 'http://dummy.restapiexample.com',
                path: '/admin/api/{SELECTED_VERSION}/recurring_application_charges/#{recurring_application_charge_id}/usage_charges/#{usage_charge_id}.json',
                method: 'GET',
                description: 'Top 5 Listings This Week',
                response: [{
                    "id": 68407397834,
                    "subject_id": 99312522,
                    "created_at": "2017-06-20T20:51:40+01:00",
                    "subject_type": "Blog",
                    "verb": "create",
                    "arguments": [
                        "News"
                    ],
                    "body": null,
                    "message": "Blog was created: News</a>.",
                    "author": "Shopify",
                    "description": "Blog was created: News.",
                    "path": "/admin/pages"
                }]
            },
            {
                host: 'http://dummy.restapiexample.com',
                path: '/admin/api/{SELECTED_VERSION}/locations/#{location_id}.json',
                method: 'GET',
                description: 'Net promoter score by source',
                response: [{
                    "id": 44735946,
                    "name": "Cobourg Road",
                    "address1": "Cobourg Road",
                    "address2": "#1",
                    "city": "Wood Green",
                    "zip": "N22 6TP",
                    "province": "England",
                    "country": "GB",
                    "phone": "5551215555",
                    "created_at": "2017-06-20T20:51:40+01:00",
                    "updated_at": "2019-03-20T13:25:47+00:00",
                    "country_code": "GB",
                    "country_name": "United Kingdom",
                    "province_code": null,
                    "legacy": false,
                    "active": true,
                    "admin_graphql_api_id": "gid://shopify/Location/44735946"
                }]
            },
            {
                host: 'http://dummy.restapiexample.com',
                path: '/api/v4/data/{key}',
                method: 'GET',
                description: 'NPS by product categories compared with previous period',
                response: [{ idD: '', lifeExpectancy: '', fertilityRate: '', region: '', population: '' }]
            },
            {
                host: 'http://dummy.restapiexample.com',
                path: '/api/v5/data/{key}',
                method: 'GET',
                description: 'Overall sentiment Analysis',
                response: [{ idE: '', lifeExpectancy: '', fertilityRate: '', region: '', population: '' }]
            }
        ]
        this.setState({ services: services, activeTab: (!(dataSource.path && dataSource.method) ? 'services' : 'configure') });
    }

    getSevices() {
        const { services } = this.state;

        return services.map((service, index) => <Row key={index} className='mb-2'>
            <Col sm='1' className='p-0'>
                <input type='radio' name='selectedService' value={index} className='mr-2' onChange={(e) => this.onChangeInput('selectedService', e.target.value)} />
                <span>{service.method}</span>
            </Col>
            <Col sm='11' className='pl-2 pt-0 pb-0 pr-0'>
                <div className='text-truncate'>{service.description}</div>
                <div className='text-truncate text-muted small'>{service.host}{service.path}</div>
            </Col>
        </Row>)
    }

    getPropertyValue(propName) {
        const { dataSource } = this.state;
        let propsContainer = dataSource;
        let xpath = propName.split('.');
        if (propName.startsWith('labels.')) {
            if (propName === 'labels.all') {
                return propsContainer.labels?.filter(labelItem => !labelItem.selected).length === 0
            } else {
                propsContainer = propsContainer.labels.filter(labelItem => labelItem.key === xpath[1])[0]
                return propsContainer[xpath[2]]
            }
        } else {
            var i = 0;
            for (; propsContainer && (i < (xpath.length - 1)); i++) {
                propsContainer = propsContainer[xpath[i]];
            }
            if (propsContainer) {
                return propsContainer[xpath[i]]
            } else {
                return undefined;
            }
        }
    }

    onChangeInput(propName, propValue) {
        const { dataSource } = this.state;
        let propsContainer = dataSource;
        let xpath = propName.split('.');
        if (propName.startsWith('labels.')) {
            if (propName === 'labels.all') {
                propsContainer.labels.forEach(labelItem => labelItem.selected = propValue)
            } else {
                propsContainer = propsContainer.labels.filter(labelItem => labelItem.key === xpath[1])[0]
                propsContainer[xpath[2]] = propValue;
            }
        } else {
            var i = 0;
            for (; i < (xpath.length - 1); i++) {
                if (!propsContainer[xpath[i]]) {
                    propsContainer[xpath[i]] = {};
                }
                propsContainer = propsContainer[xpath[i]];
            }
            propsContainer[xpath[i]] = propValue;
        }
        if ('path' === propName) {
            if (!dataSource.params) {
                dataSource.params = {};
            }
            let pathMatch = dataSource.path.match(REGEX_API_PARAM) || [];
            pathMatch.forEach(paramName => {
                if (!dataSource.params[paramName]) {
                    dataSource.params[paramName] = ''
                }
            })
        }
        this.setState({ dataSource: dataSource })
    }

    configureSelectedService() {
        const { dataSource, services } = this.state;
        if (dataSource.selectedService) {
            let selectedService = services[dataSource.selectedService];
            dataSource.selectedResponse = selectedService.response;
            dataSource.host = selectedService.host
            dataSource.path = selectedService.path
            dataSource.method = selectedService.method
            dataSource.description = selectedService.description
            dataSource.selectedParam = undefined;
            dataSource.params = {}
            dataSource.labels = []
            let responseSchema = selectedService.response.length > 0 ? selectedService.response[0] : undefined;
            Object.keys(responseSchema).forEach(key => typeof responseSchema[key] !== 'object' && dataSource.labels.push({
                key: key, label: key.replace('_', ' ').match(/[A-Z]+[^A-Z]*|[^A-Z]+/g).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                    .split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '), selected: false
            }));
            let pathMatch = dataSource.path.match(REGEX_API_PARAM) || [];
            pathMatch.forEach(paramName => dataSource.params[paramName] = '')
        }
        this.setState({ dataSource: dataSource, activeTab: 'configure' });
    }

    testConfig() {
        const { dataSource } = this.state;
        dashboardService.getDashboardData(dataSource).then(response => {
            dataSource.selectedResponse = response;
            let responseSchema = response.length > 0 ? response[0] : undefined;
            if (dataSource.host === 'http://ds-metrics-api.enterprise.digitaldots.ai' && dataSource.path === '/top_issues') {
                if (dataSource.params?.positive === "true") {
                    responseSchema = response.positive_explainability[0];
                } else {
                    responseSchema = response.negative_explainability[0];
                }
            }
            dataSource.labels = []
            Object.keys(responseSchema || {}).forEach(key => typeof responseSchema[key] !== 'object' && dataSource.labels.push({
                key: key, label: key.replace('_', ' ').match(/[A-Z]+[^A-Z]*|[^A-Z]+/g).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                    .split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '), selected: false
            }));
            dataSource.selectedParam = undefined;
            this.setState({ dataSource: dataSource });
        }).catch(error => {
            console.error('dashboardService.getDashboardData:', error);
            notifyError('Unable to retrieve data', error.message);
        });
    }

    saveConfig() {
        const { dataSource } = this.state;
        delete dataSource.selectedResponse;
        delete dataSource.selectedParam;
        this.props.onSave(dataSource);
    }

    moveDataLabel(action, labelIndex) {
        const { dataSource } = this.state;
        var element;
        if ('UP' === action && labelIndex > 0) {
            element = dataSource.labels[labelIndex];
            dataSource.labels.splice(labelIndex, 1);
            dataSource.labels.splice(labelIndex - 1, 0, element);
            this.setState({ dataSource: dataSource });
        } else if ('DOWN' === action && labelIndex < (dataSource.labels.length - 1)) {
            element = dataSource.labels[labelIndex];
            dataSource.labels.splice(labelIndex, 1);
            dataSource.labels.splice(labelIndex + 1, 0, element);
            this.setState({ dataSource: dataSource });
        }
    }

    render() {
        const { dataSource, activeTab, configLayout, services } = this.state;
        let bindMethod = [{ value: '', label: '' }, { value: 'GET', label: 'GET' }, { value: 'PUT', label: 'PUT' }, { value: 'POST', label: 'POST' }];

        return (
            <section className="studio-container">
                <Row xs="1" md="1">
                    <Col>
                        <Tabs defaultActiveKey={'configure'} activeKey={activeTab} onSelect={(tabKey) => { this.setState({ activeTab: tabKey }) }} className={'px-2'}>
                            <Tab eventKey={'configure'} title='Configure'>
                                <Row xs='1' md='2'>
                                    <Col>
                                        <Row xs='1' md='1'>
                                            <Col className='p-0 mt-2'>
                                                {inputField('url', 'host', 'Host', this.getPropertyValue('host'),
                                                    this.onChangeInput.bind(this), {})
                                                }
                                            </Col>
                                            <Col className='p-0'>
                                                {inputField('text', 'path', 'Path', this.getPropertyValue('path'),
                                                    this.onChangeInput.bind(this), {})
                                                }
                                            </Col>
                                            <Col className='p-0'>
                                                <Row>
                                                    <Col className='pl-0'>
                                                        {inputField('select', 'method', 'Method', this.getPropertyValue('method'),
                                                            this.onChangeInput.bind(this), {}, bindMethod)
                                                        }
                                                    </Col>
                                                    <Col className='pr-0'>
                                                        {inputField('number', 'autoRefresh', 'Auto Refresh (Seconds)', this.getPropertyValue('autoRefresh'),
                                                            this.onChangeInput.bind(this), { min: 0, step: 1 })
                                                        }
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col className='p-0'>
                                                <Tabs defaultActiveKey="params" className="pl-0 pr-0">
                                                    <Tab eventKey={'params'} title={'Parameters'}>
                                                        {inputField('keymap', 'params', 'Query Parameters', dataSource.params, this.onChangeInput.bind(this), {})}
                                                    </Tab>
                                                    <Tab eventKey={'headers'} title={'Headers'}>
                                                        {inputField('keymap', 'headers', 'Request Headers', dataSource.headers, this.onChangeInput.bind(this), {})}
                                                    </Tab>
                                                </Tabs>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col>
                                        <Row xs='1' md='1'>
                                            <Col className='p-0 '>
                                                <Row xs='1' md='1'>
                                                    <Col className='p-0 mb-1'>
                                                        {configLayout === 0 && dataSource.selectedResponse &&
                                                            actionButton('Show Response', () => { this.setState({ configLayout: 1 }) },
                                                                'content-float-right', 'feather icon-eye')}
                                                        {configLayout === 1 && actionButton('Show Labels', () => { this.setState({ configLayout: 0 }) },
                                                            'content-float-right', 'feather icon-eye-off')}
                                                        <span>{configLayout === 0 ? 'Data Labels' : 'Response'}</span>
                                                    </Col>
                                                    {configLayout === 0 && <Col className='pl-0 pr-0 discover-data-labels-col'>
                                                        <Table responsive striped bordered hover className="mb-0 studio-table">
                                                            <thead className='studio-table-head'>
                                                                <tr className='studio-table-head-row'>
                                                                    <th width='1%' className='pl-2 pr-2 pt-0 pb-0 align-middle content-wrapped studio-table-head-col'>
                                                                        {inputField('checkbox', 'labels.all', '',
                                                                            this.getPropertyValue('labels.all'),
                                                                            this.onChangeInput.bind(this), { input: 'mt-0' })
                                                                        }
                                                                    </th>
                                                                    <th className='p-2 studio-table-head-col'>Key</th>
                                                                    <th className='p-2 studio-table-head-col'>Label</th>
                                                                    <th width='1%' className='p-2 studio-table-head-col'> </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className='studio-table-data'>
                                                                {dataSource.labels && dataSource.labels.map((labelInfo, labelIndex) =>
                                                                    <tr key={labelIndex} className='studio-table-data-row'>
                                                                        <td width='1%' className='pl-2 pr-2 pt-0 pb-0 align-middle content-wrapped studio-table-data-col'>
                                                                            {inputField('checkbox', 'labels.' + labelInfo.key + '.selected', '',
                                                                                this.getPropertyValue('labels.' + labelInfo.key + '.selected'),
                                                                                this.onChangeInput.bind(this), { input: 'mt-0' })
                                                                            }
                                                                        </td>
                                                                        <td className='pl-2 pr-2 pt-1 pb-1 align-middle content-wrapped studio-table-data-col'>
                                                                            {labelInfo.key}
                                                                        </td>
                                                                        <td className='p-0 content-wrapped studio-table-data-col'>
                                                                            {inputField('text', 'labels.' + labelInfo.key + '.label', '',
                                                                                this.getPropertyValue('labels.' + labelInfo.key + '.label'),
                                                                                this.onChangeInput.bind(this), { input: 'component-stretched' })
                                                                            }
                                                                        </td>
                                                                        <td width='1%' className='pl-1 pr-2 pt-0 pb-0 align-middle studio-table-data-col'>
                                                                            <div className="align-top text-center">
                                                                                <span className='align-top'>{actionButton('Move Up', () => this.moveDataLabel('UP', labelIndex),
                                                                                    'align-top', 'feather icon-arrow-up')}</span>
                                                                                <span className='align-top'>{actionButton('Move Down', () => this.moveDataLabel('DOWN', labelIndex),
                                                                                    'align-top', 'feather icon-arrow-down')}</span>
                                                                                <span></span>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </Table>
                                                    </Col>}
                                                    {configLayout === 1 && <Col className='pl-0 pr-0 discover-data-labels-col'>
                                                        {inputField('textarea', 'response', '',
                                                            dataSource.selectedResponse ? JSON.stringify(dataSource.selectedResponse, undefined, 4) : undefined, () => { },
                                                            { container: 'mb-0', input: 'p-0', rows: 16 })}
                                                    </Col>}
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row xs='1' md='2'>
                                    <Col className='text-right'>
                                        {actionButton('Test', this.testConfig.bind(this), '', '', true, !(dataSource.path && dataSource.method), ACTION_BUTTON.SECONDARY)}
                                    </Col>
                                    <Col className='text-right'>
                                        {actionButton('Save', this.saveConfig.bind(this), '', '', true,
                                            dataSource.labels ? dataSource.labels.filter(label => label.selected).length === 0 : true, ACTION_BUTTON.PRIMARY)}
                                    </Col>
                                </Row>
                            </Tab>
                            <Tab eventKey={'services'} title='Services'>
                                <Row className='mt-3'>
                                    <Col sm='8' className='pl-1 pr-1'>{this.getSevices()}</Col>
                                    <Col sm='4' className='pl-1 pr-1'>
                                        <Row xs='1' md='1'>
                                            <Col className='p-0'>
                                                {actionButton('Configure', this.configureSelectedService.bind(this), 'content-float-right pt-0 pb-0 mb-1', '', true, false, ACTION_BUTTON.PRIMARY)}
                                                <span className='align-bottom'>Response Schema</span>
                                            </Col>
                                            <Col className='p-0'>
                                                {inputField('textarea', 'response', '',
                                                    dataSource.selectedService ? JSON.stringify(services[dataSource.selectedService]?.response, undefined, 4) : undefined, () => { },
                                                    { container: 'mb-2', input: 'p-0', rows: 19 })}
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>
            </section>
        )
    }
}