import React, { Component } from "react";
import { Table, Row, Col, Card, CardBody, CardHeader, CardFooter, Modal, ModalHeader, ModalBody } from 'reactstrap';
import Timestamp from "react-timestamp";

import Tooltip from '../../utils/Tooltip';
import StudioFilter from '../../utils/StudioFilter';
// import StudioTable from '../../utils/StudioTable';
import StudioAudit from '../../utils/StudioAudit';
import LowCodeDataForm from "../../modeler/LowCodeDataForm";
import RuleConfigForm from "./RuleConfigForm";
// import RuleViewer from "../../modeler/RuleViewer";
import DecisionViewer from "../../modeler/DecisionViewer";

import { actionButton, ACTION_BUTTON } from "../../utils/StudioUtils";
import { confirmAction, confirmDelete, confirmDeploy } from "../../utils/StudioUtils";
import { notify, notifySuccess, notifyError } from '../../utils/Notifications';
import { ruleService } from "../../services/RuleService";
import { userService, USER_ACTIONS } from "../../services/UserService";
import { BasicSpinner } from "../../utils/BasicSpinner";

import "./Rules.scss";
export default class Rules extends Component {
    constructor(props) {
        super(props);

        this.state = {
            renderLayout: 0,
            loading: true,
            rules: [],
            filteredData: [],
            mode: '',
            showModal: false,
            menuClicks: []
        };
    }

    componentDidMount() {
        const { solutionId } = this.props.match.params;
        ruleService.getRules(solutionId).then(response => {
            let rules = response.filter(rule => rule.status !== 'ARCHIVED').sort((a, b) => a.status.localeCompare(b.status))
            this.setState({ loading: false, rules: rules });
        }).catch(error => {
            this.setState({ loading: false });
            console.error('ruleService.getSolution:', error);
            notifyError('Unable to retrieve rules', error.message);
        });
    }

    onChangeFilter(filteredData) {
        this.setState({ filteredData: filteredData })
    }

    loadRuleViewer(ruleId) {
        const { solutionId } = this.props.match.params;
        this.props.history.push(`/solutions/${solutionId}/rules/${ruleId}`);
    }

    loadRuleEditor(ruleId) {
        const { solutionId } = this.props.match.params;
        setTimeout(() => {
            this.props.history.push(`/solutions/${solutionId}/rules/${ruleId}/editor`);
        }, 1000);
    }

    createRule() {
        this.setState({
            mode: 'new',
            ruleConfig: undefined,
            showModal: true,
        });
    }

    editRule(ruleId) {
        const { rules } = this.state;
        let rule = rules.filter(rule => rule.id === ruleId)[0];
        let ruleConfig = {
            name: rule.name,
            description: rule.description,
            tags: (rule.tags || []).toString(),
        }
        this.setState({
            ruleId: ruleId,
            ruleConfig: ruleConfig,
            mode: 'edit',
            showModal: true,
        });
    }

    saveRule(ruleConfig) {
        const { solutionId } = this.props.match.params;
        const { rules, mode, ruleId } = this.state;
        const parent = this;

        if (mode === 'new') {
            ruleService.createRule(solutionId, ruleConfig.name.trim(),
                ruleConfig.description.trim(), ruleConfig.tags.trim().split(',')).then(rule => {
                    parent.setState({ showModal: false });
                    notifySuccess('Create Rule', 'Rule has been successfully created');
                    parent.loadRuleEditor(rule.id);
                }).catch(error => {
                    parent.setState({ ruleConfig: ruleConfig, showModal: true });
                    console.error('ruleService.createRule:', error);
                    notifyError('Unable to create rule', error.message);
                });
        } else if (mode === 'edit') {
            let rule = rules.filter(rule => rule.id === ruleId)[0];
            rule.name = ruleConfig.name.trim();
            rule.description = ruleConfig.description.trim();
            rule.tags = ruleConfig.tags.trim().split(',');
            ruleService.updateRule(rule).then(rule => {
                parent.setState({ rules: rules, showModal: false });
            }).catch(error => {
                parent.setState({ ruleConfig: ruleConfig, showModal: true });
                console.error('ruleService.updateRule:', error);
                notifyError('Unable to update rule', error.message);
            });
        }
    }

    viewHistory(rule) {
        ruleService.getRuleHistory(rule.id).then(response => {
            if (response.length > 0) {
                this.setState({
                    mode: 'history',
                    ruleHistory: { name: rule.name, data: response },
                    showModal: true,
                });
            } else {
                notify('Rule History', 'Rule History is not avaialble');
            }
        }).catch(error => {
            console.error('ruleService.getRuleHistory:', error);
            notifyError('Unable to retrieve rule history', error.message);
        });
    }

    activateRule(ruleId) {
        const { rules } = this.state;
        const parent = this;
        confirmAction('Activate Rule').then(function (userInput) {
            // let actionComment = userInput.value;
            if (!userInput.dismiss) {
                ruleService.activateRule(ruleId).then(response => {
                    notifySuccess('Activate Rule', 'Rule has been successfully activated');
                    let rule = rules.filter(rule => rule.id === ruleId)[0];
                    rule.status = response.status;
                    rule.version = response.version;
                    parent.setState({ rules: rules });
                }).catch(error => {
                    console.error('ruleService.activateRule:', error);
                    notifyError('Unable to activate rule', error.message);
                });
            }
        });
    }

    deactivateRule(ruleId) {
        const { rules } = this.state;
        const parent = this;
        confirmAction('Deactivate Rule').then(function (userInput) {
            if (!userInput.dismiss) {
                // let actionComment = userInput.value;
                ruleService.deactivateRule(ruleId).then(response => {
                    notifySuccess('Deactivate Rule', 'Rule has been successfully deactivated');
                    let rule = rules.filter(rule => rule.id === ruleId)[0];
                    rule.status = response.status;
                    rule.version = response.version;
                    parent.setState({ rules: rules });
                }).catch(error => {
                    console.error('ruleService.deactivateRule:', error);
                    notifyError('Unable to deactivate rule', error.message);
                });
            }
        });
    }

    deployRule(ruleId, version) {
        const { rules } = this.state;
        const parent = this;
        confirmDeploy('Deploy Rule').then(function (userInput) {
            if (!userInput.dismiss) {
                // let actionComment = userInput.value;
                let rule = rules.filter(rule => rule.id === ruleId)[0];
                ruleService.deployRule(ruleId, rule.solutionId, userInput.value.environment, version, userInput.value.name).then(response => {
                    notifySuccess('Deploy Rule', 'Rule has been successfully deployed');
                    rule.status = response.status;
                    rule.version = response.version;
                    parent.setState({ rules: rules });
                }).catch(error => {
                    console.error('ruleService.deployRule:', error);
                    notifyError('Unable to deploy rule', error.message);
                });
            }
        });
    }

    exportRule(rule) {
        var encodedData = encodeURIComponent(rule.content);
        const newAnchorTag = document.createElement('a');
        const filename = rule.id + ".xml";
        //const bb = new Blob([xml], { type: 'text/plain' });
        //newAnchorTag.setAttribute('href', window.URL.createObjectURL(bb));
        newAnchorTag.setAttribute('href', 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData);
        newAnchorTag.setAttribute('download', filename);
        newAnchorTag.dataset.downloadurl = ['application/bpmn20-xml', newAnchorTag.download, newAnchorTag.href].join(':');
        notify('Export Rule', 'Rule details published for download');
        newAnchorTag.click();
    }

    deleteRule(ruleId) {
        const { rules } = this.state;
        const parent = this;
        confirmDelete().then(function (userInput) {
            if (!userInput.dismiss) {
                // let actionComment = userInput.value;
                ruleService.deleteRule(ruleId).then(response => {
                    notifySuccess('Delete Rule', 'Rule has been permanently removed');
                    let rule = rules.filter(rule => rule.id === ruleId)[0];
                    rule.status = "ARCHIVED";
                    parent.setState({ rules: rules });
                }).catch(error => {
                    console.error('ruleService.deleteRule:', error);
                    notifyError('Unable to delete rule', error.message);
                });
            }
        });
    }

    isMenuOpen(ruleId) {
        const { menuClicks } = this.state;
        if (menuClicks.indexOf(ruleId) >= 0) {
            return true;
        } else {
            return false;
        }
    }

    handleMenuClick(ruleId) {
        const { menuClicks } = this.state;
        if (menuClicks.indexOf(ruleId) >= 0) {
            menuClicks.splice(menuClicks.indexOf(ruleId), 1);
        } else {
            menuClicks.push(ruleId);
        }
        this.setState({ menuClicks: menuClicks });
    }

    getBadgeType(status) {
        if ("ACTIVE" === status) {
            return "badge-primary";
        } else if ("NEW" === status) {
            return "badge-secondary";
        } else if ("DRAFT" === status) {
            return "badge-secondary";
        } else if ("APPROVED" === status) {
            return "badge-success";
        } else if ("PENDING" === status) {
            return "badge-info";
        } else if ("DISABLED" === status) {
            return "badge-warning";
        } else if ("ARCHIVED" === status) {
            return "badge-danger";
        } else {
            return "badge-dark";
        }
    }

    render() {
        const { loading, rules, filteredData, renderLayout, showModal, ruleConfig, ruleHistory } = this.state;
        const toggle = () => this.setState({ showModal: false });

        let searchKeys = ['name', 'description', 'tags']
        let filterKeys = [
            { label: 'Status', key: 'status' },
            { label: 'Version', key: 'version' },
            { label: 'Created By', key: 'createdBy' },
            { label: 'Modified By', key: 'modifiedBy' }
        ];
        // let defaultFilter = [
        //     { key: 'createdBy', values: [ userService.getLoginName() ] }
        // ]

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
                        <Row xs="1" md="1">
                            <Col className="text-left mt-0">
                                {userService.hasPermission(this.props.studioRouter, USER_ACTIONS.CREATE) &&
                                    actionButton('Create', this.createRule.bind(this),
                                        'ml-1 content-float-right', 'feather icon-plus', true, false, ACTION_BUTTON.PRIMARY)
                                }
                                <StudioFilter
                                    searchKeys={searchKeys}
                                    filterKeys={filterKeys}
                                    data={rules.filter(rule => rule.status !== 'ARCHIVED')}
                                    // defaultFilter={defaultFilter}
                                    onChangeFilter={this.onChangeFilter.bind(this)} />
                                {renderLayout === 0 &&
                                    actionButton('List View', () => { this.setState({ renderLayout: 1 }) }, 'm-0 mt-1 content-float-right', 'feather icon-list')
                                }
                                {renderLayout === 1 &&
                                    actionButton('Grid View', () => { this.setState({ renderLayout: 0 }) }, 'm-0 mt-1 content-float-right', 'feather icon-grid')
                                }
                                <h3 className="pt-1">{'Rules' +
                                    (rules.filter(rule => rule.status !== 'ARCHIVED').length > 0 ?
                                        ` (${rules.filter(rule => rule.status !== 'ARCHIVED').length})` : '')}</h3>
                            </Col>
                        </Row>
                        {renderLayout === 0 && <Row xs="1" md="3">
                            {filteredData.map((rule, ruleIndex) =>
                                <Col className="cards-container" key={ruleIndex + 1}>
                                    <Card className="studio-card mb-1">
                                        <CardHeader className="p-0">
                                            <Row xs="1" md="1" className='mt-2 mb-1'>
                                                <Col className="text-left pt-0 pb-0">
                                                    {rule.status === 'ACTIVE' && userService.hasPermission(this.props.studioRouter, USER_ACTIONS.MANAGE) &&
                                                        actionButton('Deactivate Rule', this.deactivateRule.bind(this, rule.id),
                                                            'ml-1 content-float-right', 'studio-secondary feather icon-pause-circle fa-2x')
                                                    }
                                                    {rule.status === 'DISABLED' && userService.hasPermission(this.props.studioRouter, USER_ACTIONS.MANAGE) &&
                                                        actionButton('Activate Rule', this.activateRule.bind(this, rule.id),
                                                            'ml-1 content-float-right', 'studio-primary feather icon-check-circle fa-2x')
                                                    }
                                                    <Tooltip title='Version'>
                                                        <label className="p-0 mt-0 ml-2 mb-0 badge badge-light rule-info-badge content-float-right">v{rule.version}</label>
                                                    </Tooltip>
                                                    <h5 className="mt-1 mr-0 rule-name">{rule.name}</h5>
                                                </Col>
                                                <Col className="text-left pt-0 pb-0 badge-status-ellipsis">
                                                    <h5 className="mt-0 mr-0">
                                                        <span className="badge badge-light-secondary pl-0 mr-0">
                                                            <label className={"mr-1 badge " + this.getBadgeType(rule.status || '') + " mb-0"}
                                                                title={'Created by ' + rule.createdBy}>
                                                                {rule.status || ''}
                                                            </label>
                                                            <Timestamp relative date={rule.modifiedAt || rule.createdAt} /> by {rule.modifiedBy}
                                                        </span>
                                                    </h5>
                                                </Col>
                                                <Col className="text-center pt-0 pb-0">
                                                    {userService.hasPermission(this.props.studioRouter, USER_ACTIONS.EXPORT) &&
                                                        actionButton('Export', this.exportRule.bind(this, rule),
                                                            'mt-0 ml-2 mr-2', 'feather icon-download', true)
                                                    }
                                                    {['ACTIVE'].indexOf(rule.status) < 0 &&
                                                        userService.hasPermission(this.props.studioRouter, USER_ACTIONS.DELETE) &&
                                                        actionButton('Delete', this.deleteRule.bind(this, rule.id),
                                                            'mt-0 ml-2 mr-2', 'feather icon-trash-2', true)
                                                    }
                                                    {userService.hasPermission(this.props.studioRouter, USER_ACTIONS.EDIT) &&
                                                        actionButton('Configure', this.editRule.bind(this, rule.id),
                                                            'mt-0 ml-2 mr-2', 'feather icon-edit', true)
                                                    }
                                                    {userService.hasPermission(this.props.studioRouter, USER_ACTIONS.VIEW) &&
                                                        actionButton('History', this.viewHistory.bind(this, rule),
                                                            'mt-0 ml-2 mr-2', 'fa fa-history', true)
                                                    }
                                                </Col>
                                            </Row>
                                        </CardHeader>
                                        <CardBody className="p-0">
                                            <Row xs="1" md="1">
                                                <Col className="text-center">
                                                    {/* <RuleViewer rule={rule} /> */}
                                                    <DecisionViewer decision={rule} />
                                                </Col>
                                            </Row>
                                        </CardBody>
                                        <CardFooter className="p-0">
                                            <Row xs="1" md="1">
                                                <Col className="pt-0">
                                                    <p className="content-description-short text-justify mb-0">{rule.description}</p>
                                                </Col>
                                            </Row>
                                            <Row xs="1" md="1" className='mb-1'>
                                                <Col className="text-left pt-0 pb-0 mb-1">
                                                    {userService.hasPermission(this.props.studioRouter, USER_ACTIONS.EXPLORE_RULE_MODELER) &&
                                                        actionButton('Define Rule', this.loadRuleEditor.bind(this, rule.id),
                                                            'mt-2 ml-2 mr-2 content-float-right', 'fa fa-gavel')
                                                    }
                                                    {userService.hasPermission(this.props.studioRouter, USER_ACTIONS.EXPLORE_RULE_VIEWER) &&
                                                        actionButton('View Rule', this.loadRuleViewer.bind(this, rule.id),
                                                            'mt-2 ml-2 content-float-right', 'far fa-eye')
                                                    }
                                                    <h5 className="mt-1 rule-tags">
                                                        {rule.tags && rule.tags.length > 0 && rule.tags.map((tag, tagIndex) =>
                                                            // Using 'key-tag-item' instead of 'badge badge-light-secondary p-1 mr-1'
                                                            <span key={tagIndex} className="key-tag-item">{tag || 'NA'}</span>
                                                        )}
                                                        {rule.tags && rule.tags.length === 0 &&
                                                            <span className="key-tag-item">NA</span>
                                                        }
                                                    </h5>
                                                </Col>
                                            </Row>
                                        </CardFooter>
                                    </Card>
                                </Col>
                            )}
                        </Row>}
                        {renderLayout === 1 && <Row xs="1" md="1">
                            <Col className="cards-container">
                                <Card className="studio-card">
                                    <CardBody className="p-1">
                                        <Table responsive striped bordered hover className="mb-0" >
                                            <thead>
                                                <tr>
                                                    <th width="25%">Name</th>
                                                    <th width="45%">Description</th>
                                                    <th width="15%">Tags</th>
                                                    <th width="10%" className="text-center">Status</th>
                                                    <th width="5%" className="text-center">Version</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredData.map((rule, ruleIndex) =>
                                                    <tr key={ruleIndex + 1}>
                                                        <td width="25%" className="content-wrapped text-justify">{rule.name}</td>
                                                        <td width="45%" className="content-wrapped text-justify">{rule.description}</td>
                                                        <td width="15%" className="content-wrapped">
                                                            {rule.tags.map((tagInfo, tagIndex) =>
                                                                <span key={tagIndex} className="badge badge-light mr-1">{tagInfo}</span>
                                                            )}
                                                        </td>
                                                        <td width="10%" className="text-center">{rule.status}</td>
                                                        <td width="5%" className="text-center">{rule.version}</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>

                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>}
                    </div>
                }
                <Modal centered size={'lg'} isOpen={showModal && this.state.mode !== 'history'}>
                    <ModalHeader toggle={toggle} className="p-3">{this.state.mode === 'new' ? 'Create Rule' : 'Update Rule'}</ModalHeader>
                    <ModalBody className="pt-0 pb-0 pl-2 pr-2">
                        <LowCodeDataForm
                            formDesign={RuleConfigForm.DATA_INPUT_FORM}
                            formData={ruleConfig}
                            onSubmit={this.saveRule.bind(this)}
                        />
                    </ModalBody>
                </Modal>
                <Modal scrollable centered size={'lg'} isOpen={showModal && this.state.mode === 'history'}>
                    <ModalHeader toggle={toggle} className="p-3">{`Version History ${ruleHistory ? ('- ' + ruleHistory.name) : ''}`}</ModalHeader>
                    <ModalBody className="pt-0 pb-0 pl-2 pr-2">
                        {/* <StudioTable customClass="p-0" hideTableName={true}
                            tableHeader={historyGridHeader}
                            tableData={ruleHistory ? ruleHistory.data : []}
                            defaultSort={{ sortIndex: 0, sortOrder: 1 }}
                        /> */}
                        <StudioAudit data={ruleHistory ? ruleHistory.data : []} />
                    </ModalBody>
                </Modal>
            </section>
        )
    }
}
