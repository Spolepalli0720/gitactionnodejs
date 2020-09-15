import React from 'react';
import { Card, CardBody, CardFooter, Row, Col, Modal, ModalHeader, ModalBody } from 'reactstrap';

import StudioNavigator from './StudioNavigator';
import StudioViewer from './StudioViewer';
import LowCodeDataForm from "./LowCodeDataForm";
import Infotip from '../utils/Infotip';

import { workflowService } from "../services/WorkflowService";
import { userService, USER_ACTIONS } from "../services/UserService";
import { applicationService } from "../services/ApplicationService";
import { processEngine } from "../services/ProcessEngine";
import { notifySuccess, notifyError } from '../utils/Notifications';
import { generateUUID, actionButton, badgeStyle } from "../utils/StudioUtils";

export default class WorkflowViewer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            workflow: props.workflow ? props.workflow : { id: '0', solutionId: '0', name: 'Loading....' },
            containerId: props.workflow ? props.workflow.id :
                props.match && props.match.params && props.match.params.workflowId ? props.match.params.workflowId : generateUUID()
        };

        this.zoomlevel = 1.0;
        this.viewer = undefined
    }

    componentDidMount() {
        // const parent = this;
        const { containerId, workflow } = this.state;
        let workflowId = this.props.match && this.props.match.params ? this.props.match.params.workflowId : undefined;

        const ModelerComponent = workflowId ? StudioNavigator : StudioViewer;
        this.viewer = new ModelerComponent({
            studioType: 'WORKFLOW',
            canvasContainer: document.getElementById(containerId),
        });

        if (workflowId) {
            workflowService.getWorkflow(workflowId).then(response => {
                this.setState({ workflow: response })
                this.openDiagram(response);
            });
        } else if (workflow) {
            this.openDiagram(workflow);
        }
    }

    openDiagram(workflow) {
        this.viewer.importXML(workflow.content).then(response => {
            if (response.warnings && response.warnings.length > 0) {
                console.log('WorkflowViewer :: importXML with.Warnings', workflow.name, response.warnings);
            }
            try {
                this.zoomFit();
            } catch (error) {
                console.error('WorkflowViewer :: importXML :: zoom.Error :: ', workflow.name, error);
            }
        }).catch(error => {
            console.error('WorkflowViewer :: importXML', workflow.name, error);
        })
    }

    zoomIn() {
        this.zoomlevel += 0.1;
        this.viewer.get('canvas').zoom(this.zoomlevel);
    }

    zoomOut() {
        if (this.zoomlevel > 0.5) {
            this.zoomlevel -= 0.1;
            this.viewer.get('canvas').zoom(this.zoomlevel);
        }
    }

    zoomFit() {
        this.zoomlevel = 1.0;
        this.viewer.get('canvas').zoom('fit-viewport');
    }

    loadWorkflowEditor(workflowId) {
        const { solutionId } = this.props.match.params;
        this.props.history.push(`/solutions/${solutionId}/workflows/${workflowId}/editor`);
    }

    isInputRequiredForStartInstance = () => {
        var formRequired = false;
        let formKey = undefined;
        if (this.viewer && this.viewer._definitions && this.viewer._definitions.rootElements) {
            try {
                let bpmnProcess = this.viewer._definitions.rootElements.filter(rootElement => rootElement.$type === 'bpmn:Process')[0];
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
            let bpmnProcess = this.viewer._definitions.rootElements.filter(rootElement => rootElement.$type === 'bpmn:Process')[0];
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
                this.setState({ showModal: true, mode: 'startWorkflow', startInstanceForm: inputForm });
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

    render() {
        const { containerId, workflow, showModal, startInstanceForm } = this.state;
        let workflowId = this.props.match && this.props.match.params ? this.props.match.params.workflowId : undefined;
        const toggle = () => this.setState({ showModal: false });

        return (
            <section>
                {!workflowId ?
                    <div id={containerId} className="text-center" />
                    :
                    <section className="studio-container">
                        <Row xs="1" md="1">
                            <Col className="text-left">
                                <div className="content-float-right mt-2">
                                    {actionButton('Zoom IN', this.zoomIn.bind(this), 'canvas-action-zoom-in')}
                                    {actionButton('Zoom OUT', this.zoomOut.bind(this), 'canvas-action-zoom-out')}
                                    {actionButton('Zoom zoomFit', this.zoomFit.bind(this), 'canvas-action-zoom-fit')}
                                    {userService.hasPermission(this.props.studioRouter, USER_ACTIONS.EDIT) &&
                                        actionButton('Define Workflow', this.loadWorkflowEditor.bind(this, workflowId), 'canvas-action-edit')
                                    }
                                    {workflow.status === 'ACTIVE' && userService.hasPermission(this.props.studioRouter, USER_ACTIONS.EXECUTE) &&
                                        actionButton('Execute Workflow', this.startWorkflow.bind(this), 'canvas-action-start')
                                    }
                                </div>
                                <h4 className="studio-secondary mr-0">{workflow ? workflow.name : 'Loading....'}
                                    {workflow &&
                                        <span className='ml-3 small'>
                                            <label className="badge badge-light m-0 p-0">{workflow.version ? 'v' + workflow.version : ''}</label>
                                            <label className={"ml-1 badge " + badgeStyle(workflow.status || '') + " m-0 pt-1 pb-1"}>{workflow.status || ''}</label>
                                            {workflow.status === 'ACTIVE' &&
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
                            <Col className="cards-container">
                                <Card className="studio-card mb-0">
                                    <CardBody id={containerId} className="text-center pt-0 pl-2 pr-2 studio-container-full-view" />
                                    <CardFooter className="p-2">
                                        <p className="content-description-short text-justify mb-0">{workflow.description || ''}</p>
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Row>
                        <Modal centered size={'lg'} isOpen={showModal && this.state.mode === 'startWorkflow'}>
                            <ModalHeader toggle={toggle} className="p-3">{startInstanceForm ? startInstanceForm.name : 'Start Workflow Instance'}</ModalHeader>
                            <ModalBody className="pt-0 pb-0 pl-2 pr-2">
                                <LowCodeDataForm
                                    formDesign={startInstanceForm ? startInstanceForm.content : undefined}
                                    formData={undefined}
                                    onSubmit={this.startWorkflowForm.bind(this)}
                                />
                            </ModalBody>
                        </Modal>

                    </section>
                }
            </section>
        );
    }
}
