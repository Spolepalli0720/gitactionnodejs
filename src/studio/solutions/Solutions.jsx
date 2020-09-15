import React, { Component } from "react";
import { Row, Col, Card, CardBody, CardFooter, Modal, ModalHeader, ModalBody } from 'reactstrap';
import Timestamp from "react-timestamp";

import Tooltip from '../utils/Tooltip';
import StudioFilter from '../utils/StudioFilter';
import StudioTable from '../utils/StudioTable';
import StudioAudit from '../utils/StudioAudit';
import StudioShare from '../utils/StudioShare';
// import LowCodeDataForm from "../modeler/LowCodeDataForm";
// import SolutionConfigForm from "./SolutionConfigForm";

import SolutionConfig from "./SolutionConfig";
import SolutionOptions from "./SolutionOptions";
// import ShareSolution from "./ShareSolution"

// import SolutionForm from "./utils/form/SolutionForm";

import { notify, notifySuccess, notifyError } from '../utils/Notifications';
import { solutionService } from "../services/SolutionService";
import { userService, USER_ACTIONS } from "../services/UserService";
import { BasicSpinner } from "../utils/BasicSpinner";
import { confirmDelete, actionButton, ACTION_BUTTON } from "../utils/StudioUtils";

import "./Solutions.scss";

const SOLUTION_TYPE = {
    'INTEGRATION': { label: 'Integration', image: require('../../assets/studio/svg/blue-integration.svg') },
    'AIPOWERED': { label: 'AI Powered', image: require('../../assets/studio/svg/blue-ai-powered.svg') },
    'FUSION': { label: 'Cognitive Fusion', image: require('../../assets/studio/svg/blue-cognitive-fusion.svg') },
    'FABRIC': { label: 'Fabric', image: require('../../assets/studio/svg/blue-sensor-fabric.svg') }
}
const DEPLOY_TARGET = {
    'AWS': { label: 'Amazon', image: require('../../assets/studio/svg/amazon-web-services.svg') },
    'Azure': { label: 'Azure', image: require('../../assets/studio/svg/azure.svg') },
    'AZURE': { label: 'Azure', image: require('../../assets/studio/svg/azure.svg') },
    'Google': { label: 'Google', image: require('../../assets/studio/svg/google.svg') },
    'GOOGLE': { label: 'Google', image: require('../../assets/studio/svg/google.svg') },
}
const SOLUTIONS_EMPTY = { label: "No solutions", image: require("../../assets/studio/svg/No-Solutions.svg") }

export default class Solutions extends Component {

    constructor(props) {
        super(props);

        this.state = {
            renderLayout: 0,
            loading: true,
            solutions: [],
            filteredData: [],

            renderForm: 0,
            formConfig: {},
        };
    }

    componentDidMount() {
        const parent = this;
        solutionService.getSolutions().then(response => {
            let solutions = response.filter(solution => solution.status !== 'ARCHIVED').sort((a, b) => a.status.localeCompare(b.status));
            this.setState({ loading: false, solutions: solutions });
        }).catch(error => {
            parent.setState({ loading: false });
            console.error('solutionService.getSolutions:', error);
            notifyError('Unable to retrieve solutions', error.message);
        });
    }

    onChangeFilter(filteredData) {
        this.setState({ filteredData: filteredData })
    }

    loadSolutionDashboard(solutionId) {
        this.props.history.push(`/solutions/${solutionId}/dashboard`);
    }

    loadSolutionWorkflows(solutionId) {
        setTimeout(() => {
            this.props.history.push(`/solutions/${solutionId}/workflows`);
        }, 1000);
    }

    exploreSolution(solutionId, component) {
        this.props.history.push(`/solutions/${solutionId}/${component}`);
    }

    createSolution() {
        this.setState({
            mode: 'new',
            solutionConfig: undefined,
            showModal: true,
            formConfig: {},
            renderForm: 0,
        });
    }

    editSolution(solutionId) {
        const { solutions } = this.state;
        let solution = solutions.filter(solution => solution.id === solutionId)[0];

        if (!solution.config) {
            solution.config = {
                properties: {
                    template: {},
                    workflow: {},
                    storage: {},
                    deployment: {}
                }
            };
        } else if (!solution.config.properties) {
            solution.config.properties = {
                template: {},
                workflow: {},
                storage: {},
                deployment: {}
            };
        }
        if (!solution.config.properties.template) {
            solution.config.properties.template = {};
        }
        if (!solution.config.properties.workflow) {
            solution.config.properties.workflow = {};
        }
        if (!solution.config.properties.storage) {
            solution.config.properties.storage = {};
        }
        if (!solution.config.properties.deployment) {
            solution.config.properties.deployment = {};
        }

        this.setState({
            renderForm: 1,
            mode: 'edit',
            solutionId: solutionId,
            solutionConfig: {
                name: solution.name || '',
                description: solution.description || '',
                type: solution.type || '',
                tags: (solution.tags.map(tag => { return { name: tag } }) || []),
                solutionTemplate: solution.config.properties.template.type || 'DEFAULT',
                workflow: {
                    asyncSupport: solution.config.properties.workflow.ASYNC || false,
                    auditing: solution.config.properties.workflow.AUDITING || false,
                    authorization: solution.config.properties.workflow.SECURED || false,
                    maxFlows: solution.config.properties.maxFlows || 0,
                },
                storage: {
                    persistent: solution.config.properties.storage.persistent || false,
                    type: solution.config.properties.storage.type || '',
                },
                cloudDeployment: solution.config.properties.deployment.isCloud || false,
                cloudProvider: solution.config.properties.deployment.targetCloud || '',
                deploymentModel: solution.config.properties.deployment.mode || '',
                deploymentEnvironment: solution.config.properties.deployment.environment || '',
                deploymentStorage: solution.config.properties.deployment.storage || 'SHARED',
            },
            // showModal: true,
        });
    }

    saveSolution(solutionConfig) {
        const { solutions, solutionId, mode } = this.state;
        var solution;
        if (mode === 'edit') {
            solution = solutions.filter(solution => solution.id === solutionId)[0];
        } else {
            solution = {
                status: 'NEW',
                version: "1.0",
                template: {
                    name: '',
                    description: ''
                },
                workflows: [],
                metrics: {
                    process: { active: 0, paused: 0 },
                    executions: { pending: 0, completed: 0 },
                    health: { status: "23" }
                }
            };
        }

        if (!solution.config) {
            solution.config = {
                properties: {
                    template: {},
                    workflow: {},
                    storage: {},
                    deployment: {}
                }
            };
        } else if (!solution.config.properties) {
            solution.config.properties = {
                template: {},
                workflow: {},
                storage: {},
                deployment: {}
            };
        } else if (!solution.config.properties.template) {
            solution.config.properties.template = {};
        } else if (!solution.config.properties.workflow) {
            solution.config.properties.workflow = {};
        } else if (!solution.config.properties.storage) {
            solution.config.properties.storage = {};
        } else if (!solution.config.properties.deployment) {
            solution.config.properties.deployment = {};
        }

        solution.name = solutionConfig.name.trim();
        solution.description = solutionConfig.description.trim();
        solution.type = solutionConfig.type;
        solution.tags = solutionConfig.tags.map(tag => { return tag.name });
        solution.config.properties.template.type = solutionConfig.solutionTemplate;
        solution.config.properties.workflow.ASYNC = solutionConfig.workflow.asyncSupport;
        solution.config.properties.workflow.AUDITING = solutionConfig.workflow.auditing;
        solution.config.properties.workflow.SECURED = solutionConfig.workflow.authorization;
        solution.config.properties.maxFlows = solutionConfig.workflow.maxFlows;
        solution.config.properties.storage.persistent = solutionConfig.storage.persistent;
        solution.config.properties.storage.type = solutionConfig.storage.type;
        solution.config.properties.deployment.isCloud = solutionConfig.cloudDeployment;
        solution.config.properties.deployment.targetCloud = solutionConfig.cloudProvider;
        solution.config.properties.deployment.mode = solutionConfig.deploymentModel;
        solution.config.properties.deployment.environment = solutionConfig.deploymentEnvironment;
        solution.config.properties.deployment.storage = solutionConfig.deploymentStorage;

        const parent = this;
        if (mode === 'edit') {
            solutionService.updateSolution(solution).then(solution => {
                parent.setState({
                    showModal: false,
                    renderForm: 0,
                });
                notifySuccess('Save Solution', 'Solution has been successfully saved');
            }).catch(error => {
                parent.setState({ solutionConfig: solutionConfig });
                console.error('solutionService.updateSolution:', error);
                notifyError('Unable to save solution', error.message);
            });
        } else {
            solutionService.createSolution(solution).then(solution => {
                parent.setState({ showModal: false });
                notifySuccess('Create Solution', 'Solution has been successfully created');
                parent.loadSolutionWorkflows(solution.id);
            }).catch(error => {
                parent.setState({ solutionConfig: solutionConfig });
                console.error('solutionService.createSolution:', error);
                notifyError('Unable to create solution', error.message);
            });
        }
    }

    viewHistory(solution) {
        solutionService.getSolutionHistory(solution.id).then(response => {
            if (response.length > 0) {
                this.setState({
                    mode: 'history',
                    solutionHistory: { name: solution.name, data: response },
                    showModal: true,
                });
            } else {
                notify('Solution History', 'Solution History is not avaialble');
            }
        }).catch(error => {
            console.error('solutionService.getSolutionHistory:', error);
            notifyError('Unable to retrieve solution history', error.message);
        });
    }

    shareSolution(solutionId) {
        const { solutions } = this.state;
        let solution = solutions.filter(solution => solution.id === solutionId)[0];

        this.setState({
            mode: 'share',
            showModal: true,
            sharedSolution: solution
        })
    }

    saveSharingUpdates(payload) {
        const { solutions, sharedSolution } = this.state;
        const parent = this;
        let solutionId = sharedSolution.id;

        solutionService.shareSolution(solutionId, payload).then(response => {
            notifySuccess("SUCCESS", "Solution has been successfully shared")
            let solution = solutions.filter(solution => solution.id === solutionId)[0];
            solution.users = response.users;
            this.setState({ solutions: solutions, mode: '', showModal: false, sharedSolution: undefined });
        }).catch(error => {
            parent.setState({ mode: '', showModal: false, sharedSolution: undefined })
            notifyError('Unable to share solution', error.message)
            console.error('solutionService.shareSolution:', error);
        })
    }

    activateSolution(solutionId) {
        const { solutions } = this.state;
        solutionService.activateSolution(solutionId).then(response => {
            notifySuccess("SUCCESS", "Solution has been successfully activated")
            let solution = solutions.filter(solution => solution.id === solutionId)[0];
            solution.status = 'ACTIVE';
            this.setState({ solutions: solutions })
        }).catch(error => {
            notifyError('Unable to activate solution', error.message)
            console.error('solutionService.activateSolution:', error);
        })
    }

    deactivateSolution(solutionId) {
        const { solutions } = this.state;
        solutionService.deactivateSolution(solutionId).then(response => {
            notifySuccess("SUCCESS", "Solution has been successfully deactivated")
            let solution = solutions.filter(solution => solution.id === solutionId)[0];
            solution.status = 'DISABLED';
            this.setState({ solutions: solutions })
        }).catch(error => {
            notifyError('Unable to deactivate solution', error.message)
            console.error('solutionService.deactivateSolution:', error);
        })
    }

    deleteSolution(solutionId) {
        const { solutions } = this.state;
        const parent = this;
        confirmDelete().then(function (userInput) {
            if (!userInput.dismiss) {
                // let actionComment = userInput.value;
                solutionService.deleteSolution(solutionId).then(response => {
                    notifySuccess('Delete Solution', 'Solution has been permanently removed');
                    let solution = solutions.filter(solution => solution.id === solutionId)[0];
                    solution.status = "ARCHIVED";
                    parent.setState({ solutions: solutions });
                }).catch(error => {
                    console.error('solutionService.deleteSolution:', error);
                    notifyError('Unable to delete solution', error.message);
                });
            }
        });
    }

    exportSolution(solutionId) {
        const { solutions } = this.state;
        let solution = solutions.filter(solution => solution.id === solutionId)[0];
        var encodedData = encodeURIComponent(JSON.stringify(solution));
        const newAnchorTag = document.createElement('a');
        const filename = solution.id + ".json";
        newAnchorTag.setAttribute('href', 'data:application/json;charset=UTF-8,' + encodedData);
        newAnchorTag.setAttribute('download', filename);
        newAnchorTag.dataset.downloadurl = ['application/json', newAnchorTag.download, newAnchorTag.href].join(':');
        notify('Export Solution', 'Solution details published for download');
        newAnchorTag.click();
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
        const { loading, solutions, filteredData, renderLayout, solutionConfig, showModal, solutionHistory, sharedSolution, renderForm, formConfig } = this.state;
        const toggle = () => this.setState({ showModal: false });

        const tableHeader = [
            { label: 'Name', key: 'name' },
            { label: 'Description', key: 'description' },
            // { label: 'Type', key: 'type' },
            { label: 'Tags', key: 'tags' },
            { label: 'Status', key: 'status' },
            { label: 'Version', key: 'version' }
        ];
        let searchKeys = ['name', 'description', 'tags', 'template', 'config']
        let filterKeys = [
            {
                label: 'Type', key: 'type', options: [
                    { label: 'Integration', value: 'INTEGRATION' },
                    { label: 'AI Powered', value: 'AIPOWERED' },
                    { label: 'Cognitive Fusion', value: 'FUSION' },
                    { label: 'Fabric', value: 'FABRIC' }
                ]
            },
            { label: 'Status', key: 'status' },
            { label: 'Version', key: 'version' },
            { label: 'Created By', key: 'createdBy' },
            { label: 'Modified By', key: 'modifiedBy' }
        ];
        // let defaultFilter = [
        //     { key: 'createdBy', values: [userService.getLoginName()] }
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
                                    actionButton('Create', this.createSolution.bind(this),
                                        'ml-1 content-float-right', 'feather icon-plus', true, false, ACTION_BUTTON.PRIMARY)
                                }

                                <StudioFilter
                                    searchKeys={searchKeys}
                                    filterKeys={filterKeys}
                                    data={solutions.filter(solution => solution.status !== 'ARCHIVED')}
                                    // defaultFilter={defaultFilter}
                                    onChangeFilter={this.onChangeFilter.bind(this)} />

                                {renderLayout === 0 &&
                                    actionButton('List View', () => { this.setState({ renderLayout: 1 }) }, 'm-0 mt-1 content-float-right', 'feather icon-list')
                                }
                                {renderLayout === 1 &&
                                    actionButton('Grid View', () => { this.setState({ renderLayout: 0 }) }, 'm-0 mt-1 content-float-right', 'feather icon-grid')
                                }
                                <h3 className="pt-1">{'Solutions' +
                                    (solutions.filter(solution => solution.status !== 'ARCHIVED').length > 0 ?
                                        ` (${solutions.filter(solution => solution.status !== 'ARCHIVED').length})` : '')}
                                </h3>
                            </Col>
                        </Row>
                        {renderForm === 0 && renderLayout === 0 && filteredData.length !== 0 && <Row xs="1" md="3">
                            {filteredData.map((solution, solutionIndex) =>
                                <Col className="cards-container" key={solutionIndex + 1}>
                                    <Card className="studio-card mb-1">
                                        <CardBody className="p-0">
                                            <Row xs="1" md="1">
                                                <Col className="text-left pb-0">
                                                    {solution.status === 'ACTIVE' && userService.hasPermission(this.props.studioRouter, USER_ACTIONS.MANAGE) &&
                                                        actionButton('Deactivate Solution', this.deactivateSolution.bind(this, solution.id),
                                                            'ml-1 content-float-right', 'studio-secondary feather icon-pause-circle fa-2x')
                                                    }
                                                    {solution.status === 'DISABLED' && userService.hasPermission(this.props.studioRouter, USER_ACTIONS.MANAGE) &&
                                                        actionButton('Activate Solution', this.activateSolution.bind(this, solution.id),
                                                            'ml-1 content-float-right', 'studio-primary feather icon-check-circle fa-2x')
                                                    }
                                                    <Tooltip title='Version'>
                                                        <label className="p-0 mt-0 mb-0 badge badge-light solution-info-badge content-float-right">v{solution.version}</label>
                                                    </Tooltip>

                                                    {SOLUTION_TYPE[solution.type] &&
                                                        <img height='16px' width='16px' src={SOLUTION_TYPE[solution.type].image} alt={SOLUTION_TYPE[solution.type].label} />
                                                    }
                                                    {SOLUTION_TYPE[solution.type] &&
                                                        <span className='ml-1 mb-0'>{SOLUTION_TYPE[solution.type].label}</span>
                                                    }
                                                    {solution.template.name &&
                                                        <span><i className="studio-primary feather icon-crosshair ml-2" /> <span>{solution.template.name}</span></span>
                                                    }
                                                </Col>
                                            </Row>
                                            <Row xs="1" md="1">
                                                <Col className="text-left pt-0 pb-0">
                                                    {solution.createdBy === userService.getLoginName() &&
                                                        actionButton('Share Solution', this.shareSolution.bind(this, solution.id),
                                                            'ml-1 mr-1 content-float-right', 'feather icon-share-2 studio-primary')
                                                    }
                                                    {solution.createdBy === userService.getLoginName() && solution.users && solution.users.length > 3 &&
                                                        <span className='content-float-right'><sup>+{solution.users.length - 3}</sup></span>
                                                    }
                                                    {solution.createdBy === userService.getLoginName() && solution.users &&
                                                        solution.users.map((sharedUser, shareIndex) => shareIndex < 3 &&
                                                            <Tooltip key={shareIndex} title={sharedUser.role + ': ' + sharedUser.username}>
                                                                <img className='solution-shared-user mt-1 content-float-right'
                                                                    src={userService.getAvatar(sharedUser.userId)} alt={sharedUser.username} />
                                                            </Tooltip>
                                                        )
                                                    }
                                                    <h5 className="mt-0 mr-0 solution-name">{solution.name}</h5>
                                                </Col>
                                                <Col className="text-left pt-0 pb-0 badge-status-ellipsis">
                                                    <h5 className="mt-0 mr-0">
                                                        <span className="badge badge-light-secondary pl-0 mr-0"
                                                            title={'Created by ' + solution.createdBy}>
                                                            <label className={"mr-1 badge " + this.getBadgeType(solution.status || '') + " mb-0 pull-left"}>
                                                                {solution.status || ''}
                                                            </label>
                                                            <Timestamp relative date={solution.modifiedAt || solution.createdAt} /> by {solution.modifiedBy}
                                                        </span>
                                                    </h5>
                                                </Col>
                                                <Col className="text-center pt-0 pb-0">
                                                    {userService.hasPermission(this.props.studioRouter, USER_ACTIONS.EXPORT) &&
                                                        actionButton('Export', this.exportSolution.bind(this, solution.id),
                                                            'mt-1 ml-2 mr-2', 'feather icon-download', true)
                                                    }
                                                    {['NEW', 'ACTIVE'].indexOf(solution.status) < 0 &&
                                                        userService.hasPermission(this.props.studioRouter, USER_ACTIONS.DELETE) &&
                                                        actionButton('Delete', this.deleteSolution.bind(this, solution.id),
                                                            'mt-1 ml-2 mr-2', 'feather icon-trash-2', true)
                                                    }
                                                    {['NEW'].indexOf(solution.status) < 0 &&
                                                        userService.hasPermission(this.props.studioRouter, USER_ACTIONS.EDIT) &&
                                                        actionButton('Configure', this.editSolution.bind(this, solution.id),
                                                            'mt-1 ml-2 mr-2', 'feather icon-edit', true)
                                                    }
                                                    {userService.hasPermission(this.props.studioRouter, USER_ACTIONS.VIEW) &&
                                                        actionButton('History', this.viewHistory.bind(this, solution),
                                                            'mt-1 ml-2 mr-2', 'fa fa-history', true)
                                                    }
                                                </Col>
                                            </Row>
                                            <Row xs="1" md="1" className='mb-1'>
                                                <Col>
                                                    <p className="content-description text-justify mb-0 pt-1 pb-1 pl-1 pr-3">{solution.description}</p>
                                                </Col>
                                                <Col className="text-left pt-0 pb-0">
                                                    <h5 className="mt-0">
                                                        {solution.tags && solution.tags.length > 0 && solution.tags.map((tag, tagIndex) =>
                                                            // Using 'key-tag-item' instead of 'badge badge-light-secondary p-1 mr-1'
                                                            <span key={tagIndex} className="key-tag-item">{tag || 'NA'}</span>
                                                        )}
                                                        {solution.tags && solution.tags.length === 0 &&
                                                            // Using 'key-tag-item' instead of 'badge badge-light-secondary p-1 mr-1'
                                                            <span className="key-tag-item">NA</span>
                                                        }
                                                    </h5>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                        <CardFooter className="p-0">
                                            <Row xs="1" md="3">
                                                <Col className="text-left pb-0">
                                                    {solution?.config?.properties?.deployment?.targetCloud &&
                                                        <img className='mt-0' height='32px' width='32px' src={DEPLOY_TARGET[solution.config.properties.deployment.targetCloud].image}
                                                            alt={DEPLOY_TARGET[solution.config.properties.deployment.targetCloud].label} />
                                                    }
                                                </Col>
                                                <Col className="text-center pt-1 pb-0">
                                                    {userService.hasPermission(this.props.studioRouter, USER_ACTIONS.EXPLORE_SOLUTION_DASHBOARD) &&
                                                        actionButton('Solution Dashboard', this.loadSolutionDashboard.bind(this, solution.id),
                                                            'mt-2 mb-2 ml-2 mr-1', 'fa fa-chart-bar')
                                                    }
                                                    {userService.hasPermission(this.props.studioRouter, USER_ACTIONS.EXPLORE_SOLUTION_TASKS) &&
                                                        actionButton('Solution Tasks', this.exploreSolution.bind(this, solution.id, 'usertask'),
                                                            'mt-2 mb-2 ml-2 mr-1', 'fa fa-tasks')
                                                    }
                                                </Col>
                                                <Col className="text-right pt-1 pb-0">
                                                    {userService.hasPermission(this.props.studioRouter, USER_ACTIONS.EXPLORE_SOLUTION_WORKFLOWS) &&
                                                        <Tooltip title="Explore Workflows">
                                                            <button className='btn p-0 mt-2 mb-2 ml-1 mr-0'
                                                                onClick={() => { this.exploreSolution(solution.id, 'workflows') }} >
                                                                <span className='align-top'>Explore</span>
                                                                <i className='studio-primary feather icon-chevrons-right icon-explore-right' />
                                                            </button>
                                                        </Tooltip>
                                                    }
                                                </Col>
                                            </Row>
                                        </CardFooter>
                                    </Card>
                                </Col>
                            )}
                        </Row>}
                        {renderForm === 0 && renderLayout === 1 && filteredData.length !== 0 &&
                            <StudioTable customClass="p-0"
                                hideTableName={true}
                                hideTableSearch={true}
                                tableHeader={tableHeader}
                                tableData={filteredData}
                                // createAction={this.createSolution.bind(this)}
                                // createLabel={'Create'}
                                defaultSort={{ sortIndex: 4, sortOrder: 0 }}
                                searchKeys={searchKeys}
                                filterKeys={filterKeys}
                            />
                        }
                        {renderForm === 0 && filteredData.length === 0 &&
                            <div className="text-center">
                                <img height='30%' width='30%' src={SOLUTIONS_EMPTY.image} alt={SOLUTIONS_EMPTY.label} />
                                <br />
                                <span className="fa-2x">No Solutions Available. Please click Create to provision a new solution.</span>
                            </div>
                        }
                        {renderForm === 1 &&
                            <div>
                                <div className="form-close-btn">
                                    <Tooltip title="Cancel" placement='left'>
                                        <button className="content-float-right btn p-0" onClick={() => this.setState({ renderForm: 0 })}><i className='feather icon-x-circle fa-2x' /></button>
                                    </Tooltip>
                                </div>
                                <SolutionConfig
                                    mode={this.state.mode}
                                    formConfig={this.state.mode === "new" ? formConfig : solutionConfig}
                                    onSubmit={(solutionConfig) => this.saveSolution(solutionConfig)} />
                            </div>
                        }
                    </div>
                }
                <Modal centered size={'xl'} isOpen={showModal && this.state.mode !== 'history' && this.state.mode !== 'share'}>
                    <ModalHeader toggle={toggle} className="p-3">
                        {this.state.mode === 'new' ? 'Create Solution' : 'Update Solution'}
                    </ModalHeader>
                    <ModalBody className="p-0">
                        {this.state.mode === 'new' &&
                            <SolutionOptions
                                solutions={solutions}
                                onSelect={(formConfig) => {
                                    this.setState({
                                        showModal: false,
                                        formConfig: formConfig,
                                        renderForm: 1,
                                    })
                                }}
                            />
                        }
                    </ModalBody>
                </Modal>
                <Modal scrollable centered size={'lg'} isOpen={showModal && this.state.mode === 'history'}>
                    <ModalHeader toggle={toggle} className="p-3">{`Version History ${solutionHistory ? ('- ' + solutionHistory.name) : ''}`}</ModalHeader>
                    <ModalBody className="pt-0 pb-0 pl-2 pr-2">
                        <StudioAudit data={solutionHistory ? solutionHistory.data : []} />
                    </ModalBody>
                </Modal>
                <Modal centered size={'lg'} isOpen={showModal && this.state.mode === 'share'}>
                    <ModalHeader toggle={toggle} className="p-3">
                        <label className="fas fa-user-plus color-blue mr-2"></label>{`Share Solution (${sharedSolution ? sharedSolution.name : ''})`}
                    </ModalHeader>
                    <ModalBody className="pt-0 pb-0 pl-2 pr-2">
                        <StudioShare
                            users={sharedSolution ? sharedSolution.users : []}
                            onSave={this.saveSharingUpdates.bind(this)} />
                    </ModalBody>
                </Modal>
            </section >
        )
    }
}
