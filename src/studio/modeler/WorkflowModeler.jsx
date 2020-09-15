import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { forEach } from 'min-dash';
import { domify, query as domQuery, clear as domClear } from 'min-dom';

import StudioModeler from './StudioModeler';
import StudioImages from './StudioImages';
import StudioConfig from './StudioConfig';
import LowCodeDataForm from "./LowCodeDataForm";
import RuleConfigForm from "../solutions/rules/RuleConfigForm";
import ApplicationConfigForm from "../solutions/applications/ApplicationConfigForm";
// import RuleModeler from "./RuleModeler";
import DecisionModeler from "./DecisionModeler";
import LowCodeModeler from "./LowCodeModeler";
import Tooltip from '../utils/Tooltip';
import Infotip from '../utils/Infotip';

import { workflowService } from "../services/WorkflowService";
import { userService, USER_ACTIONS } from "../services/UserService";
import { ruleService } from "../services/RuleService";
import { applicationService } from "../services/ApplicationService"
import { processEngine } from "../services/ProcessEngine";
import { dataStoreService } from '../services/DataStoreService';
import { connectorService } from '../services/ConnectorService';
import { scraperService } from '../services/ScraperService';
import { modelService } from '../services/ModelService';
import { notify, notifySuccess, notifyError } from '../utils/Notifications';
import { confirmAction, actionButton, badgeStyle } from '../utils/StudioUtils';

import AceEditor from "react-ace";
import 'ace-builds/webpack-resolver.js';

class WorkflowModeler extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showPalette: true, showProperties: true, showModal: false, modalEvent: '', scriptFormat: '', scriptContent: ''
        };
    }

    zoomlevel = 1.0;
    modeler = null;

    componentDidMount = () => {
        window.scrollTo(0, 0);
        const { solutionId, workflowId } = this.props.match.params;
        this.hideShowPalette();
        this.hideShowProperties();

        this.modeler = new StudioModeler({
            studioType: 'WORKFLOW',
            paletteContainer: '#workflowPalette',
            paletteItems: StudioConfig.WORKFLOW_TASKS,
            canvasContainer: '#workflowCanvas',
            propertiesContainer: '#workflowProperties',
            toggleProperties: this.hideShowProperties.bind(this)
        });

        var promiseArray = []
        let apiPromise = undefined, apiResponse = {};

        apiPromise = dataStoreService.getDataStores(solutionId).then(response => {
            apiResponse.storeConfig = response.map(config => ({group: config.group, template: config.template, id: config.id, title: config.title, version: config.version }));
        }).catch(error => {
            console.error('dataStoreService.getDataStores', error);
            notifyError('Unable to retrieve store configurations', error.message);
        });
        promiseArray.push(apiPromise);

        apiPromise = connectorService.getConnectors(solutionId).then(response => {
            apiResponse.connectorConfig = response.map(config => ({group: config.group, template: config.template, id: config.id, title: config.title, version: config.version }));
        }).catch(error => {
            console.error('connectorService.getConnectors', error);
            notifyError('Unable to retrieve connector configurations', error.message);
        });
        promiseArray.push(apiPromise);

        apiPromise = scraperService.getScrapers(solutionId).then(response => {
            apiResponse.scraperConfig = response.map(config => ({group: config.group, template: config.template, id: config.id, title: config.title, version: config.version }));
        }).catch(error => {
            console.error('scraperService.getScrapers', error);
            notifyError('Unable to retrieve scraper configurations', error.message);
        });
        promiseArray.push(apiPromise);

        apiPromise = modelService.getModels(solutionId).then(response => {
            apiResponse.modelConfig = response.map(config => ({group: config.group, template: config.template, id: config.id, title: config.title, version: config.version }));
        }).catch(error => {
            console.error('modelService.getModels', error);
            notifyError('Unable to retrieve model configurations', error.message);
        });
        promiseArray.push(apiPromise);

        // apiPromise = workflowService.getWorkflows(solutionId).then(response => {
        //     apiResponse.callableTasks = response;
        // }).catch(error => {
        //     console.error('workflowService.getWorkflows:', error);
        //     notifyError('Unable to retrieve workflows', error.message);
        // });
        apiPromise = processEngine.getDeploymentSummary(solutionId).then(response => {
            apiResponse.callableTasks = response;
        }).catch(error => {
            console.error('processEngine.getDeploymentSummary:', error);
            notifyError('Unable to retrieve deployed processes', error.message);
        });
        promiseArray.push(apiPromise);

        apiPromise = ruleService.getRules(solutionId).then(response => {
            apiResponse.callableRules = response;
        }).catch(error => {
            console.error('ruleService.getRules:', error);
            notifyError('Unable to retrieve rules', error.message);
        });
        promiseArray.push(apiPromise);

        apiPromise = applicationService.getForms(solutionId).then(response => {
            apiResponse.inputForms = response;
        }).catch(error => {
            console.error('applicationService.getForms:', error);
            notifyError('Unable to retrieve forms', error.message);
        });
        promiseArray.push(apiPromise);

        apiPromise = workflowService.getWorkflow(workflowId).then(response => {
            apiResponse.workflow = response;
        }).catch(error => {
            console.error('workflowService.getWorkflow:', error);
            notifyError('Unable to retrieve workflow', error.message);
        });
        promiseArray.push(apiPromise);

        Promise.all(promiseArray).then(() => {
            StudioConfig.CALLABLE_TASKS = apiResponse.callableTasks.filter(callableTask => callableTask.processId !== apiResponse.workflow?.processId).sort((a, b) => a.name.localeCompare(b.name));
            StudioConfig.CALLABLE_RULES = apiResponse.callableRules.filter(callableRule => callableRule.status !== 'ARCHIVED').sort((a, b) => a.name.localeCompare(b.name));
            StudioConfig.INPUT_FORMS = apiResponse.inputForms.filter(inputForm => inputForm.status !== 'ARCHIVED').sort((a, b) => a.name.localeCompare(b.name));
            StudioConfig.CONNECTOR_CONFIG = apiResponse.storeConfig.concat(apiResponse.connectorConfig).concat(apiResponse.scraperConfig).concat(apiResponse.modelConfig);

            this.setState({ workflow: apiResponse.workflow })
            if(apiResponse.workflow?.content) {
                this.openDiagram(apiResponse.workflow);
            }
        }).catch(error => {
            console.error('WorkflowModeler :: saveXML', error);
            notifyError('Unable to save workflow', error.message);
        });

        this.renderPalleteEntries();
        this.enableEventListeners();
    }

    enableEventListeners() {
        document.addEventListener('scriptEditor', (e) => {
            this.setState({
                showModal: true,
                modalEvent: 'scriptEditor',
                eventSource: e.detail.eventSource,
                scriptFormat: e.detail.scriptFormat,
                scriptContent: e.detail.scriptContent
            })
        }, false);
        document.addEventListener('createForm', (e) => {
            this.setState({
                showModal: true,
                modalEvent: 'createForm',
                eventSource: e.detail.eventSource,
                formConfig: undefined
            })
        }, false);
        document.addEventListener('createRule', (e) => {
            this.setState({
                showModal: true,
                modalEvent: 'createRule',
                eventSource: e.detail.eventSource,
                ruleConfig: undefined
            })
        }, false);
    }

    openDiagram = (workflow) => {
        this.modeler.importXML(workflow.content).then(response => {
            if (response.warnings && response.warnings.length > 0) {
                console.log('WorkflowViewer :: importXML  with.Warnings', workflow.name, response.warnings);
            }
            this.updateProcessId();
            try {
                this.zoomFit();
            } catch (error) {
                console.error('WorkflowModeler :: importXML :: zoom.Error :: ', error);
            }
        }).catch(error => {
            notifyError('WorkflowModeler :: importXML', workflow.name, error.message);
        })
    }

    importWorkflow = (files) => {
        const { workflow } = this.state;
        const parent = this;
        const reader = new FileReader();
        reader.readAsText(files[0], 'UTF-8');
        reader.onloadend = () => {
            workflow.content = reader.result.replace(/camunda:/g, 'custom:');
            parent.openDiagram(workflow);
        };
    }

    saveWorkflow = () => {
        this.updateProcessId();
        const { workflow } = this.state;
        this.modeler.saveXML({ format: false }).then(xmlResponse => {
            workflow.content = xmlResponse.xml;
            workflowService.updateWorkflow(workflow).then(response => {
                notifySuccess('Save Workflow', 'Workflow has been successfully saved');
                this.setState({ workflow: response });
            }).catch(error => {
                console.error('workflowService.updateWorkflow:', error);
                notifyError('Unable to save workflow', error.message);
            });
        }).catch(error => {
            console.error('WorkflowModeler :: saveXML', error);
            notifyError('Unable to save workflow', error.message);
        });
    }

    updateProcessId = () => {
        const { workflow } = this.state;
        try {
            let uniqueId = workflow.processId ? workflow.processId.slice(1) : userService.generateUUID()
            workflow.processId = "p" + uniqueId;
            this.modeler._definitions.id = "d" + uniqueId
            let bpmnProcess = this.modeler._definitions.rootElements.filter(rootElement => rootElement.$type === 'bpmn:Process')[0];
            bpmnProcess.id = workflow.processId
        } catch (error) {
            console.error('Unable to update processId', error);
            notifyError('Unable to update processId', error.message);
        }
    }

    publishWorkflow = () => {
        const { workflow } = this.state;
        confirmAction('Publish Workflow').then(userInput => {
            // let actionComment = userInput.value;
            if (!userInput.dismiss) {
                this.modeler.saveXML({ format: false }).then(xmlResponse => {
                    workflow.content = xmlResponse.xml;
                    workflowService.publishWorkflow(workflow).then(response => {
                        notifySuccess('Publish Workflow', 'Workflow has been successfully published');
                        this.setState({ workflow: response });
                    }).catch(error => {
                        console.error('workflowService.publishWorkflow:', error);
                        notifyError('Unable to publish workflow', error.message);
                    });
                }).catch(error => {
                    console.error('WorkflowModeler :: saveXML', error);
                    notifyError('Unable to publish workflow', error.message);
                });
            }
        });
    }

    isInputRequiredForStartInstance = () => {
        var formRequired = false;
        let formKey = undefined;
        if (this.modeler && this.modeler._definitions && this.modeler._definitions.rootElements) {
            try {
                let bpmnProcess = this.modeler._definitions.rootElements.filter(rootElement => rootElement.$type === 'bpmn:Process')[0];
                let startEvents = bpmnProcess.flowElements.filter(flowElement => flowElement.$type === 'bpmn:StartEvent');
                startEvents.forEach(function (startEvent) {
                    if (startEvent.formKey) {
                        formKey = startEvent.formKey;
                        formRequired = true;
                    } else if (startEvent.extensionElements && startEvent.extensionElements.values) {
                        let formDataElements = startEvent.extensionElements.values.filter(valueElement => valueElement.$type === 'custom:FormData');
                        if (formDataElements.length > 0) {
                            formRequired = true;
                        }
                    }
                })
            } catch (error) {
                console.error('Unable to verify startEvents');
            }
        }
        return { formRequired: formRequired, formKey: formKey };
    }

    extractProcessId = () => {
        let processId;
        try {
            let bpmnProcess = this.modeler._definitions.rootElements.filter(rootElement => rootElement.$type === 'bpmn:Process')[0];
            processId = bpmnProcess.id;
        } catch (error) {
            console.error('Unable to fetch processId');
        }
        return processId;
    }

    startWorkflow = () => {
        let inputRequired = this.isInputRequiredForStartInstance();
        if (inputRequired.formKey) {
            applicationService.getForm(inputRequired.formKey).then(inputForm => {
                this.setState({ showModal: true, modalEvent: 'startWorkflow', startInstanceForm: inputForm });
            }).catch(error => {
                console.error('applicationService.getForm:', error);
                notifyError('Unable to retrieve form', error.message);
            });
        } else if (inputRequired.formRequired) {
            var input = document.createElement('input');
            input.type = 'file';
            input.accept = ".json";
            input.onchange = e => {
                this.startWorkflowFileContent(e.target.files);
            }
            input.click();
        } else {
            this.startWorkflowInstance();
        }
    }

    startWorkflowForm = (userInput) => {
        delete userInput.submit;
        let payload = {};
        Object.keys(userInput).forEach(function (inputKey) {
            payload[inputKey] = {
                value: userInput[inputKey],
                type: 'number' === typeof userInput[inputKey] ? 'Double' : 'String'
            }
        });
        this.startWorkflowInstance(payload);
    }

    startWorkflowFileContent = (files) => {
        const reader = new FileReader();
        reader.readAsText(files[0], 'UTF-8');
        // reader.readAsDataURL(file); // this is reading as data url
        reader.onloadend = () => {
            let processId = this.extractProcessId();
            if (!processId) {
                notifyError('Process ID', 'Unable to extract Instance ID');
                return;
            } else {
                let payload = JSON.parse(reader.result);
                this.startWorkflowInstance(payload, processId);
            }
        };
    }

    startWorkflowInstance = (payload, processId) => {
        const { solutionId } = this.props.match.params;
        processEngine.startWorkflowInstance(solutionId, processId || this.extractProcessId(),
            (payload && payload.variables) ? payload : { variables: payload || {} }).then(response => {
                notifySuccess('Start Workflow', 'Workflow Instance has been successfully started');
                this.setState({ showModal: false });
                let instanceId = response.id
                this.monitorProcessInstance(instanceId)
            }).catch(error => {
                console.error('processEngine.startWorkflowInstance:', error);
                notifyError('Unable to start workflow instance', error.message);
                this.setState({ showModal: false });
            });
    }

    monitorProcessInstance(instanceId) {
        const { solutionId } = this.props.match.params;
        setTimeout(() => {
            this.props.history.push(`/solutions/${solutionId}/monitor/${instanceId}`);
        }, 500);
    }

    downloadWorkflow = () => {
        const { workflowId } = this.props.match.params;
        this.modeler.saveXML({ format: true }).then(xmlResponse => {
            var encodedData = encodeURIComponent(xmlResponse.xml);
            const newAnchorTag = document.createElement('a');
            const filename = workflowId + ".xml";
            newAnchorTag.setAttribute('href', 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData);
            newAnchorTag.setAttribute('download', filename);
            newAnchorTag.dataset.downloadurl = ['application/bpmn20-xml', newAnchorTag.download, newAnchorTag.href].join(':');
            notify('Export Workflow', 'Workflow details published for download');
            newAnchorTag.click();

        }).catch(error => {
            console.error('WorkflowModeler :: saveXML', error);
            notifyError('Unable to export workflow', error.message);
        });
    }

    renderPalleteEntries = () => {
        var paletteContainer = domQuery('#workflowPalette', this._container);
        var entriesContainer = domQuery('.djs-palette-entries', paletteContainer);

        var accordion = domify('<div class="accordion" id="paletteAccordion"></div>');
        forEach(entriesContainer.childNodes, function (group, id) {
            var dataGroup = group.getAttribute("data-group");
            if (dataGroup) {
                dataGroup = dataGroup.replace(" ", "-");
                var groupId = dataGroup.toLowerCase();
                var groupName = dataGroup;

                if ('data-object' === groupId) {
                    groupId = 'data-store';
                    groupName = 'data-store';
                } else if ('collaboration' === groupId || 'artifact' === groupId) {
                    groupId = 'activity';
                }

                var cardBody = domQuery('#card-' + groupId + '-body', accordion);
                if (cardBody) {
                    forEach(group.childNodes, function (groupItem, itemId) {
                        if ('tools' === groupName) {
                            if ("separator" !== groupItem.getAttribute("class")) {
                                cardBody.appendChild(groupItem.cloneNode(true));
                            }
                        } else {
                            cardBody.appendChild(groupItem.cloneNode(true));
                        }
                    });
                } else {
                    var card = domify('<div class="card"></div>');
                    if (["tools"].indexOf(dataGroup) >= 0) {
                        card.style.display = 'none';
                    }
                    var cardHeader = domify('<div id="card-' + groupId + '-head" class="card-header"></div>');
                    var cardButton = domify('<button class="btn btn-block text-left" data-toggle="collapse" data-target="#card-' + groupId + '-body" aria-expanded="false" aria-controls="card-' + groupId + '-body">' + groupName.replace('-', ' ') + '</button>');
                    cardButton.style = "width: calc(100% - 1px); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;";
                    cardHeader.appendChild(cardButton);
                    card.appendChild(cardHeader);
                    cardBody = domify('<div id="card-' + groupId + '-body" class="card-body collapse" aria-labelledby="card-' + groupId + '-head" data-parent="#paletteAccordion"></div>');
                    forEach(group.childNodes, function (groupItem, itemId) {
                        if ('tools' === groupName) {
                            if ("separator" !== groupItem.getAttribute("class")) {
                                cardBody.appendChild(groupItem.cloneNode(true));
                            }
                        } else {
                            cardBody.appendChild(groupItem.cloneNode(true));
                        }
                    });
                    card.appendChild(cardBody);
                    accordion.appendChild(card);
                }
            }
        });
        domClear(entriesContainer);
        entriesContainer.appendChild(accordion);
    }

    hideShowPalette = () => {
        const { showPalette } = this.state;
        if (!showPalette) {
            document.getElementById("workflowPaletteContainer").style.display = "block";
        } else {
            document.getElementById("workflowPaletteContainer").style.display = "none";
        }
        this.setState({ showPalette: !showPalette })
    }

    hideShowProperties = () => {
        const { showProperties } = this.state;
        if (!showProperties) {
            document.getElementById("workflowPropertiesContainer").style.display = "block";
        } else {
            document.getElementById("workflowPropertiesContainer").style.display = "none";
        }
        this.setState({ showProperties: !showProperties })
    }

    zoomIn() {
        this.zoomlevel += 0.1;
        this.modeler.get('canvas').zoom(this.zoomlevel);
    }

    zoomOut() {
        if (this.zoomlevel > 0.5) {
            this.zoomlevel -= 0.1;
            this.modeler.get('canvas').zoom(this.zoomlevel);
        }
    }

    zoomFit() {
        this.zoomlevel = 1.0;
        this.modeler.get('canvas').zoom('fit-viewport');
        this.modeler.get('canvas').zoom(this.zoomlevel);
    }

    createForm(formConfig) {
        const { eventSource } = this.state;
        const { solutionId } = this.props.match.params;
        applicationService.createForm(solutionId, 'studio', formConfig.name.trim(),
            formConfig.description.trim(), formConfig.type).then(inputForm => {
                StudioConfig.INPUT_FORMS.unshift(inputForm);
                var eventBus = this.modeler.get('eventBus');
                var modelElement = this.modeler.get('elementRegistry').get(eventSource.id);
                // eventBus.fire('element.click', { element: modelElement });
                eventBus.fire('element.changed', { element: modelElement });

                notifySuccess('Create Form', 'Form has been successfully created');
                this.setState({ showModal: true, modalEvent: 'editForm', formConfig: inputForm });
            }).catch(error => {
                this.setState({ formConfig: formConfig, showModal: true });
                console.error('applicationService.createForm:', error);
                notifyError('Unable to create form', error.message);
            });
    }

    createRule(ruleConfig) {
        const { eventSource } = this.state;
        const { solutionId } = this.props.match.params;
        ruleService.createRule(solutionId, ruleConfig.name.trim(),
            ruleConfig.description.trim(), ruleConfig.tags.trim().split(',')).then(rule => {
                StudioConfig.CALLABLE_RULES.unshift(rule);
                var eventBus = this.modeler.get('eventBus');
                var modelElement = this.modeler.get('elementRegistry').get(eventSource.id);
                // eventBus.fire('element.click', { element: modelElement });
                eventBus.fire('element.changed', { element: modelElement });

                notifySuccess('Create Rule', 'Rule has been successfully created');
                this.setState({ showModal: true, modalEvent: 'editRule', ruleConfig: rule });
            }).catch(error => {
                this.setState({ ruleConfig: ruleConfig, showModal: true });
                console.error('ruleService.createRule:', error);
                notifyError('Unable to create rule', error.message);
            });
    }

    render = () => {
        const { workflow, showPalette, showProperties } = this.state;
        const { modalEvent, scriptFormat, scriptContent, formConfig, ruleConfig, startInstanceForm } = this.state;
        const toggleShowModal = () => this.setState({ showModal: false, modalEvent: '' });
        let canvasStyle = "p-0";

        if (showPalette && showProperties) {
            canvasStyle = 'col-md-9 ' + canvasStyle;
        } else if (!showPalette & showProperties) {
            canvasStyle = 'col-md-10 ' + canvasStyle;
        } else if (showPalette & !showProperties) {
            canvasStyle = 'col-md-11 ' + canvasStyle;
        } else {
            canvasStyle = 'col-md-12 ' + canvasStyle;
        }

        return (
            <section className="studio-container">
                <Row xs="1" md="1">
                    <Col className="text-left">
                        <div className="content-float-right mt-2">
                            {actionButton('Zoom IN', this.zoomIn.bind(this), 'canvas-action-zoom-in')}
                            {actionButton('Zoom OUT', this.zoomOut.bind(this), 'canvas-action-zoom-out')}
                            {actionButton('Zoom zoomFit', this.zoomFit.bind(this), 'canvas-action-zoom-fit')}
                            {['PENDING'].indexOf(workflow?.status) < 0 && userService.hasPermission(this.props.studioRouter, USER_ACTIONS.EDIT) &&
                                <React.Fragment>
                                    <Tooltip title="Import Workflow">
                                        <label className="canvas-action-import" htmlFor="file-import-dialog" />
                                    </Tooltip>
                                    <input id="file-import-dialog" type="file" accept=".bpmn, .xml" style={{ display: 'none' }}
                                        onChange={(e) => { this.importWorkflow(e.target.files) }} />
                                </React.Fragment>
                            }
                            {userService.hasPermission(this.props.studioRouter, USER_ACTIONS.EXPORT) &&
                                actionButton('Download Workflow', this.downloadWorkflow.bind(this), 'canvas-action-download')
                            }
                            {['PENDING'].indexOf(workflow?.status) < 0 && userService.hasPermission(this.props.studioRouter, USER_ACTIONS.EDIT) &&
                                actionButton('Save Workflow', this.saveWorkflow.bind(this), 'canvas-action-save')
                            }
                            {['DRAFT', 'ACTIVE'].indexOf(workflow?.status) >= 0 && userService.hasPermission(this.props.studioRouter, USER_ACTIONS.PUBLISH) &&
                                actionButton('Publish Workflow', this.publishWorkflow.bind(this), 'canvas-action-publish')
                            }
                            {workflow?.status === 'ACTIVE' && userService.hasPermission(this.props.studioRouter, USER_ACTIONS.EXECUTE) &&
                                actionButton('Execute Workflow', this.startWorkflow.bind(this), 'canvas-action-start')
                            }
                        </div>
                        <h4 className="studio-secondary mr-0">{workflow ? workflow.name : 'Loading....'}
                            {workflow &&
                                <span className='ml-3 small'>
                                    <label className="badge badge-light m-0 p-0">{workflow.version ? 'v' + workflow.version : ''}</label>
                                    <label className={"ml-1 badge " + badgeStyle(workflow.status || '') + " m-0 pt-1 pb-1"}>{workflow.status || ''}</label>
                                    {workflow?.status === 'ACTIVE' &&
                                        <Infotip title='Change makes status "DRAFT" and increment the "VERSION".'>
                                            <span className='ml-1 align-top feather icon-alert-circle text-dark' />
                                        </Infotip>
                                    }
                                </span>
                            }
                        </h4>
                    </Col>
                </Row>

                <Row xs="1" md="1">
                    <Col id="workflowContainer">
                        <Row>
                            <Col id="workflowPaletteContainer" className="col-md-1 p-0">
                                <div id="workflowPalette"></div>
                            </Col>
                            <Col className={canvasStyle}>
                                <div id="workflowCanvas">
                                    {showPalette ?
                                        <button type="button" title="Hide Palette" className="bpp-palette-toggle" onClick={() => { this.hideShowPalette() }} >
                                            Hide Palette <img width="15" height="15" alt="Hide Palette" src={StudioImages.ARROW_TB} />
                                        </button>
                                        :
                                        <button type="button" title="Show Palette" className="bpp-palette-toggle" onClick={() => { this.hideShowPalette() }} >
                                            Show Palette <img width="15" height="15" alt="Show Palette" src={StudioImages.ARROW_TB} />
                                        </button>
                                    }

                                    {showProperties ?
                                        <button type="button" title="Hide Properties" className="bpp-properties-toggle" onClick={() => { this.hideShowProperties() }} >
                                            Hide Properties <img width="15" height="15" alt="Hide Properties" src={StudioImages.ARROW_TB} />
                                        </button>
                                        :
                                        <button type="button" title="Show Properties" className="bpp-properties-toggle" onClick={() => { this.hideShowProperties() }} >
                                            Show Properties <img width="15" height="15" alt="Show Properties" src={StudioImages.ARROW_TB} />
                                        </button>
                                    }
                                </div>
                            </Col>
                            <Col id="workflowPropertiesContainer" className="col-md-2 p-0">
                                <div id="workflowProperties"></div>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='pl-0 pb-0 pr-0'>
                                <p id='workflowDescription' className="content-description-short text-justify mb-0">{workflow?.description}</p>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                {modalEvent === 'scriptEditor' &&
                    <Modal centered size={'xl'} isOpen={this.state.showModal && modalEvent === 'scriptEditor'}>
                        <ModalHeader className="p-3">{scriptFormat ? scriptFormat : 'javascript'} Editor</ModalHeader>
                        <ModalBody className="p-1">
                            <div className="container_editor_area">
                                <AceEditor
                                    mode={scriptFormat ? scriptFormat.toLowerCase() : 'javascript'}
                                    theme="monokai"
                                    name="ScriptEditor"
                                    onChange={(newValue) => { this.setState({ scriptContent: newValue }); }}
                                    fontSize={14}
                                    showPrintMargin={false}
                                    showGutter={false}
                                    highlightActiveLine={true}
                                    value={scriptContent || ''}
                                    width={'100%'}
                                    setOptions={{ showLineNumbers: true, tabSize: 4 }}
                                    id="ScriptEditorWindow"
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={() => {
                                var event = new CustomEvent("codeDispatch", {
                                    detail: { scriptContent: this.state.scriptContent }
                                });
                                document.dispatchEvent(event);
                                this.setState({ showModal: !this.state.showModal });
                            }} id="saveBtn">Save</Button>{' '}
                            <Button color="secondary" onClick={() => { this.setState({ showModal: !this.state.showModal }) }}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                }

                {modalEvent === 'createForm' &&
                    <Modal centered size={"lg"} isOpen={this.state.showModal && modalEvent === 'createForm'}>
                        <ModalHeader toggle={toggleShowModal} className="p-3">Create Form</ModalHeader>
                        <ModalBody className="pt-0 pb-0 pl-2 pr-2">
                            <LowCodeDataForm
                                formDesign={ApplicationConfigForm.FORM_CONFIG}
                                formData={formConfig}
                                onSubmit={this.createForm.bind(this)}
                            />
                        </ModalBody>
                    </Modal>
                }

                {modalEvent === 'editForm' &&
                    <Modal centered size={'xl'} isOpen={this.state.showModal && modalEvent === 'editForm'}>
                        <ModalHeader toggle={toggleShowModal} className="p-3">Define Form</ModalHeader>
                        <ModalBody className="p-0">
                            <LowCodeModeler
                                taskForm={formConfig}
                            />
                        </ModalBody>
                    </Modal>
                }

                {modalEvent === 'createRule' &&
                    <Modal centered size={"lg"} isOpen={this.state.showModal && modalEvent === 'createRule'}>
                        <ModalHeader toggle={toggleShowModal} className="p-3">Create Rule</ModalHeader>
                        <ModalBody className="pt-0 pb-0 pl-2 pr-2">
                            <LowCodeDataForm
                                formDesign={RuleConfigForm.DATA_INPUT_FORM}
                                formData={ruleConfig}
                                onSubmit={this.createRule.bind(this)}
                            />
                        </ModalBody>
                    </Modal>
                }

                {modalEvent === 'editRule' &&
                    <Modal centered size={'xl'} isOpen={this.state.showModal && modalEvent === 'editRule'}>
                        <ModalHeader toggle={toggleShowModal} className="p-3">Define Rule</ModalHeader>
                        <ModalBody className="p-0">
                            {/* <RuleModeler rule={ruleConfig} /> */}
                            <DecisionModeler decision={ruleConfig} />
                        </ModalBody>
                    </Modal>
                }

                {modalEvent === 'startWorkflow' &&
                    <Modal centered size={'lg'} isOpen={this.state.showModal && modalEvent === 'startWorkflow'}>
                        <ModalHeader toggle={toggleShowModal} className="p-3">{startInstanceForm ? startInstanceForm.name : 'Start Workflow Instance'}</ModalHeader>
                        <ModalBody className="pt-0 pb-0 pl-2 pr-2">
                            <LowCodeDataForm
                                formDesign={startInstanceForm ? startInstanceForm.content : undefined}
                                formData={undefined}
                                onSubmit={this.startWorkflowForm.bind(this)}
                            />
                        </ModalBody>
                    </Modal>
                }
            </section>
        )
    }
}

export default WorkflowModeler;
