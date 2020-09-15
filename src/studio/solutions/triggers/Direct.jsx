import React from 'react';
import { withRouter } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import { Row, Col, Card, CardBody, Modal, ModalHeader, ModalBody } from 'reactstrap';
import StudioTable from '../../utils/StudioTable';
import { BasicSpinner } from "../../utils/BasicSpinner";
import { notifySuccess, notifyError } from '../../utils/Notifications';
import { actionButton, ACTION_BUTTON } from "../../utils/StudioUtils";
import { triggerService } from '../../services/TriggerService';
import triggerConfigData from './TriggerConfigData';
import { workflowService } from "../../services/WorkflowService";
import { inputField } from '../../utils/StudioUtils';
import './Triggers.scss';

class Direct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataLoading: true,
            workFlowLoading: true,
            workFlowData: [],
            showModal: false,
            modalActions: '',
            selectedFile: '',
            workFlowStatusTableData: [],
            directConfig: {}
        }
    }

    componentDidMount() {
        const { solutionId } = this.props.match.params;
        const initialDirectConfigFields = this.getDirectConfigFields();
        let workflows = [];
        workflowService.getWorkflows(solutionId).then(response => {
            workflows = response.filter(workflow => workflow.status === 'ACTIVE').sort((a, b) => a.name.localeCompare(b.name));
            this.setState({ workFlowLoading: false, workFlowData: workflows, directConfig: initialDirectConfigFields });
        }).catch(error => {
            this.setState({ workFlowLoading: false, workFlowData: workflows, directConfig: initialDirectConfigFields });
            console.error('workflowService.getWorkflows:', error);
            notifyError('Unable to retrieve workflows', error.message);
        });
        triggerService.getTriggerStatus('direct').then(response => {
            this.setState({ dataLoading: false, workFlowStatusTableData: response })
        }).catch(error => {
            this.setState({ dataLoading: false, workFlowStatusTableData: [] });
            console.error('triggerService.getTriggerStatus:', error);
            notifyError('Unable to retrieve trigger status', error.message);
        });

    }


    getDirectConfigFields = () => {
        const { solutionId } = this.props.match.params;
        let directConfigForm = JSON.parse(JSON.stringify(triggerConfigData.DIRECT_CONFIG_FORM));
        directConfigForm["solutionId"] = solutionId;
        return directConfigForm;

    }

    triggerInvokeBtn = () => {
        this.setState({ showModal: true, modalActions: 'invoke' })
    }

    onChangeInput = (propName, propValue) => {
        const { directConfig } = this.state;
        directConfig[propName] = propValue
        this.setState({ directConfig: directConfig });

    }

    saveConfig = () => {
        const { workFlowStatusTableData, directConfig } = this.state;
        directConfig.payload = JSON.parse(directConfig.payload);
        const parent = this;
        triggerService.saveTriggerConfig(directConfig).then(response => {
            notifySuccess('File Uploaded', 'File has been successfully uploaded');
            Object.keys(response).forEach(function (dataKey) {
                directConfig[dataKey] = response[dataKey];
            });
            workFlowStatusTableData.push(directConfig);
            parent.setState({ workFlowStatusTableData: workFlowStatusTableData, modalActions: '', showModal: false, selectedFile: '', directConfig: this.getDirectConfigFields() });
        }).catch(error => {
            console.error('triggerService.saveTriggerConfig:', error);
            notifyError('Unable to upload file', error.message);
        });

    }

    onDrop = (accepted, rejected) => {
        if (!rejected.length && accepted.length) {
            const { directConfig } = this.state;
            var fr = new FileReader();
            fr.onload = () => {
                var pretty = JSON.stringify(JSON.parse(fr.result), undefined, 4);
                directConfig.payload = pretty;
                this.setState({
                    selectedFile: accepted.map(file =>
                        Object.assign(file, {
                            preview: URL.createObjectURL(file)
                        })
                    ),
                    directConfig: directConfig

                });
            }
            fr.readAsText(accepted[0]);
        }
    }

    displayConfig = () => {
        const { selectedFile, directConfig } = this.state;
        return (
            <React.Fragment>
                <Row xs="1" md="2" className="mt-3">
                    <Col>
                        <div className="text-center ml-2">
                            <div className="drop-inner-content border border-dark">
                                <Dropzone
                                    onDrop={(acceptedFiles, rejectedFiles) => this.onDrop(acceptedFiles, rejectedFiles)}
                                    multiple={false}
                                    accept="application/json"
                                >
                                    {({ getRootProps, getInputProps }) => (
                                        <section>
                                            {!selectedFile.length ?
                                                <div {...getRootProps()}>
                                                    <input {...getInputProps()} />
                                                    <div className="drop-area">
                                                        <div>
                                                            <i className="fas fa-upload mb-2"></i>
                                                            <p>Drag and drop json files here, or click to select json files to import</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                :
                                                <div className="drop-file-preview-area">
                                                    <div className="drop-file-preview-message">
                                                        <h5 className="mb-0">File Details</h5>
                                                        <p className="mb-0">{selectedFile[0].name}</p>
                                                        <p className="mb-0">{(selectedFile[0].size / 1024).toFixed(2)} KB</p>
                                                    </div>
                                                </div>
                                            }
                                        </section>
                                    )}
                                </Dropzone>
                            </div>
                        </div>
                    </Col>
                    <Col className="pl-0 pr-3 textarea-wrapper">
                        {inputField('textarea', 'payload', '', directConfig.payload, this.onChangeInput, { input: 'component-stretched', textareaRows: 10 })}
                    </Col>
                </Row>
                <Row xs="1" md="1">
                    <Col className="mt-3 mb-3 text-right pr-4">
                        {actionButton('Cancel', this.resetConfig.bind(this),
                            'ml-2', '', true, false, ACTION_BUTTON.DANGER)}
                        {actionButton('Submit', this.saveConfig.bind(this),
                            'ml-2', '', true, (selectedFile.length === 0 && directConfig.payload.length === 0), ACTION_BUTTON.PRIMARY)}

                    </Col>
                </Row>
            </React.Fragment>
        )
    }

    selectedWorkflow = (workflow) => {
        const { directConfig } = this.state;
        directConfig.processId = workflow.processId;
        directConfig.workFlowName = workflow.name;
        this.setState({ directConfig: directConfig, modalActions: 'config' })
    }


    displayWorkFlowCard = (workflow) => {
        return (
            <Card className="studio-card mb-3" onClick={() => this.selectedWorkflow(workflow)}>
                <CardBody>
                    <Row xs="1" md="1">
                        <Col><h5>{workflow.name}</h5></Col>
                        <Col><p className="text-muted">{workflow.description}</p></Col>
                    </Row>
                </CardBody>
            </Card>
        );
    }

    displayWorkflows = () => {
        const { workFlowData } = this.state;
        return (
            <React.Fragment>
                <Row xs="1" md="1">
                    <Col>
                        <h4 className="py-2 ml-2">Workflows</h4>
                    </Col>
                </Row>
                <Row xs="1" md="3" className='ml-0 mr-0 mb-2'>
                    {workFlowData.map((workflow) => {
                        return (
                            <Col className="cards-container pl-2 pr-2 mb-2" key={workflow.id}>
                                {this.displayWorkFlowCard(workflow)}
                            </Col>
                        )
                    })}
                </Row>
            </React.Fragment>
        )
    }

    inputAction = (configObj) => {
        this.setState({ directConfig: configObj, showModal: true, modalActions: 'displayPayload' })
    }


    resetConfig = () => {
        this.setState({ showModal: false, modalActions: '', selectedFile: '', directConfig: this.getDirectConfigFields() })
    }
    render() {
        const { dataLoading, workFlowLoading, workFlowStatusTableData, showModal, modalActions, directConfig } = this.state;
        const toggleModal = () => this.resetConfig();
        const workFlowStatusTableAction = [
            { btnTitle: 'Download', iconClass: 'feather icon-download', btnAction: this.inputAction.bind(this) }
        ]
        const workFlowStatusTableHeader = [
            { label: 'WorkFlow', key: 'workFlowName' },
            { label: 'Uploaded By', key: 'updatedBy' },
            { label: 'Uploaded At', key: 'updatedAt', dataFormat: 'relativeTimestamp' },
            { label: 'Status', key: 'status', dataFormat: 'statusAction' }
        ];
        const workFlowStatusTableSorting = { sortIndex: 0, sortOrder: 0 };
        return (
            <section className="studio-container p-0">
                {(workFlowLoading || dataLoading) &&
                    <Card>
                        <CardBody>
                            <BasicSpinner />
                        </CardBody>
                    </Card>
                }
                {!(workFlowLoading || dataLoading) &&
                    <div>
                        <Row xs="1" md="1">
                            <Col>
                                <Card className='mb-0'>
                                    <CardBody className="p-0">
                                        <StudioTable tableName={'Workflow Trigger Status'} hideTableName={true}
                                            tableHeader={workFlowStatusTableHeader}
                                            createAction={this.triggerInvokeBtn.bind(this)}
                                            createLabel={'Invoke'}
                                            tableData={workFlowStatusTableData}
                                            styleActions={true}
                                            tableActions={workFlowStatusTableAction}
                                            defaultSort={workFlowStatusTableSorting}
                                        />
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                }
                <Modal centered size={modalActions === 'displayPayload' ? 'lg' : 'xl'} isOpen={showModal && modalActions !== ''}>
                    <ModalHeader toggle={toggleModal} className="p-3">{modalActions === 'displayPayload' ? `Payload for ${directConfig.workFlowName}` : 'Trigger Workflows'}</ModalHeader>
                    <ModalBody className='p-2'>
                        {modalActions === 'invoke' && this.displayWorkflows()}
                        {modalActions === 'config' && this.displayConfig()}
                        {modalActions === 'displayPayload' &&
                            <Row xs="1" md="1" className="mt-3 mb-3">
                                <Col className="pl-4 pr-4">
                                    {inputField('textarea', 'displayPayload', '', JSON.stringify(directConfig.payload, undefined, 4), this.onChangeInput, { input: 'component-stretched', textareaRows: 10, disabled: true })}
                                </Col>
                            </Row>
                        }
                    </ModalBody>
                </Modal>
            </section>
        )
    }
}

export default withRouter(Direct);