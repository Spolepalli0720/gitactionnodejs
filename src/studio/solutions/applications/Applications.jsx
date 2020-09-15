import React, { Component } from "react";
import { Modal, Card, CardBody, Table, Row, Col, ModalHeader, ModalBody } from 'reactstrap';

import { BasicSpinner } from "../../utils/BasicSpinner";
import { badgeStyle, confirmDelete } from "../../utils/StudioUtils"
import { notifySuccess, notifyError } from '../../utils/Notifications';
import { applicationService } from "../../services/ApplicationService"
import LowCodeDataForm from "../../modeler/LowCodeDataForm";
import ApplicationConfigForm from "./ApplicationConfigForm";

import StudioImages from '../../modeler/StudioImages'
class Applications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalCreateApplication: false,
            modalCreateTaskForm: false,
            modalUpdateApplication: false,
            applications: { loading: true },
        };
    }

    componentDidMount() {
        const { solutionId } = this.props.match.params;
        applicationService.getApplications().then(response => {
            this.setState({ applications: response.filter(application => application.status !== 'ARCHIVED' && application.solutionId === solutionId) });
        }).catch(error => {
            console.error('applicationService.getApplications:', error);
            notifyError('Unable to retrieve applications', error.message);
            this.setState({ applications: { loading: false } });
        });
    }

    handleModalCreateApplication() {
        this.setState({
            formDataInput: undefined,
            modalCreateApplication: true,
            modalUpdateApplication: false,
            modalCreateTaskForm: false,
        })
    }

    handleModalEditApplication(applicationId) {
        const { applications } = this.state;
        let application = applications.filter(application => application.id === applicationId)[0]
        this.setState({
            applicationId: applicationId,
            formDataInput: { name: application.name || '', description: application.description || '', tags: (application.tags || []).toString() },
            modalCreateApplication: false,
            modalUpdateApplication: true,
            modalCreateTaskForm: false,
        })
    }

    handleModalCreateTaskForm(applicationId) {
        this.setState({
            applicationId: applicationId,
            formDataInput: undefined,
            modalCreateApplication: false,
            modalUpdateApplication: false,
            modalCreateTaskForm: true,
        })
    }

    saveInputForm(formData) {
        const { modalCreateApplication, modalUpdateApplication, modalCreateTaskForm } = this.state;

        if (modalCreateApplication) {
            this.createApplication(formData);
        } else if (modalUpdateApplication) {
            this.updateApplication(formData);
        } else if (modalCreateTaskForm) {
            this.createTaskForm(formData);
        }
    }

    createApplication(applicationInfo) {
        const { solutionId } = this.props.match.params;
        const { applications } = this.state;

        let application = {
            solutionId: solutionId,
            name: applicationInfo.name,
            description: applicationInfo.description,
            tags: (applicationInfo.tags || '').split(','),
            config: { properties: {} },
            status: 'NEW',
            version: '1.0'
        };

        const parent = this;
        applicationService.createApplication(application).then(respApplication => {
            notifySuccess('Create Application', 'Application has been successfully created');
            applications.push(respApplication);
            parent.setState({
                modalCreateApplication: false,
                applications: applications
            });
        }).catch(error => {
            console.error('applicationService.createApplication:', error);
            notifyError('Unable to create application', error.message);
            parent.setState({
                formDataInput: applicationInfo
            });
        });
    }

    updateApplication(applicationInfo) {
        const { applications, applicationId } = this.state;

        let application = applications.filter(application => application.id === applicationId)[0]
        application.name = applicationInfo.name;
        application.description = applicationInfo.description;
        application.tags = (applicationInfo.tags || '').split(',');

        const parent = this;
        applicationService.updateApplication(application).then(respApplication => {
            notifySuccess('Save Application', 'Application has been successfully saved');
            parent.setState({
                modalUpdateApplication: false,
                applications: applications
            });
        }).catch(error => {
            console.error('applicationService.updateApplication:', error);
            notifyError('Unable to save application', error.message);
            parent.setState({
                formDataInput: applicationInfo
            });
        });
    }

    deleteApplication(applicationId) {
        const { applications } = this.state;
        const parent = this;
        confirmDelete().then(function (userInput) {
            if (!userInput.dismiss) {
                // let actionComment = userInput.value;
                applicationService.deleteApplication(applicationId).then(response => {
                    notifySuccess('Delete Application', 'Application has been permanently removed');
                    let application = applications.filter(application => application.id === applicationId)[0];
                    application.status = "ARCHIVED";
                    parent.setState({ applications: applications });
                }).catch(error => {
                    console.error('applicationService.deleteApplication:', error);
                    notifyError('Unable to delete application', error.message);
                });
            }
        });
    }

    createTaskForm(formInfo) {
        const { solutionId } = this.props.match.params;
        const { applications, applicationId } = this.state;

        const parent = this;
        applicationService.createForm(solutionId, applicationId, formInfo.name, formInfo.description, formInfo.type).then(taskForm => {
            notifySuccess('Create Form', 'Form has been successfully created');
            let application = applications.filter(application => application.id === applicationId)[0];
            if (!application.forms) {
                application.forms = [];
            }
            application.forms.push(taskForm);
            parent.setState({
                modalCreateTaskForm: false,
                applications: applications
            });
            parent.props.history.push(`/solutions/${solutionId}/forms/${taskForm.id}/editor`);
        }).catch(error => {
            console.error('applicationService.createForm:', error);
            notifyError('Unable to create form', error.message);
            parent.setState({
                formDataInput: formInfo
            });
        });
    }

    handleViewTaskForm(taskFormId) {
        const { solutionId } = this.props.match.params;
        this.props.history.push(`/solutions/${solutionId}/forms/${taskFormId}`);
    }

    deleteTaskForm(applicationId, taskFormId) {
        const { applications } = this.state;
        const parent = this;
        confirmDelete().then(function (userInput) {
            if (!userInput.dismiss) {
                // let actionComment = userInput.value;
                applicationService.deleteForm(taskFormId).then(response => {
                    notifySuccess('Delete Form', 'Form has been permanently removed');
                    let application = applications.filter(application => application.id === applicationId)[0];
                    let taskForm = application.forms.filter(taskForm => taskForm.id === taskFormId)[0];
                    taskForm.status = "ARCHIVED";
                    parent.setState({ applications: applications });
                }).catch(error => {
                    console.error('applicationService.deleteForm:', error);
                    notifyError('Unable to delete form', error.message);
                });
            }
        });
    }

    toggleTaskForm(elementId) {
        if (document.getElementById(elementId)) {
            if (document.getElementById(elementId).style.display === "none") {
                document.getElementById(elementId).style.display = "block";
            } else {
                document.getElementById(elementId).style.display = "none";
            }
        }
    }

    render() {
        const { applications, modalCreateApplication, modalUpdateApplication, modalCreateTaskForm, formDataInput } = this.state;
        const toggle = () => this.setState({ modalCreateApplication: false, modalUpdateApplication: false, modalCreateTaskForm: false, formDataInput: undefined });

        return (
            <section className="studio-container">
                {applications.loading &&
                    <Card>
                        <CardBody>
                            <BasicSpinner />
                        </CardBody>
                    </Card>
                }
                {!applications.loading &&
                    <div>
                        <Row xs="1" md="1">
                            <Col className="text-left">
                                <button className="btn-sm btn-round btn-primary mr-0" style={{ float: "right" }} onClick={() => this.handleModalCreateApplication()}><i className="feather icon-plus fa-lg" /> Create</button>
                                <h3 className="mt-1">Applications</h3>
                            </Col>
                        </Row>
                        <Row xs="1" md="1">
                            <Col className="cards-container">
                                <Card className="studio-card">
                                    <CardBody className="p-1">
                                        <Table responsive striped bordered hover id="applications-data-table" className="mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th width="5%">Status</th>
                                                    <th width="5%">Version</th>
                                                    <th width="20%">Last Modified</th>
                                                    <th width="10%" className="text-center">Actions</th>
                                                </tr>
                                            </thead>
                                            {applications && applications.length > 0 && applications.map((application, applicationIndex) => application.status !== 'ARCHIVED' &&
                                                <tbody key={applicationIndex}>
                                                    <tr>
                                                        <th scope="row">{application.name}
                                                            <button id={'application-' + applicationIndex + '-toggle'}
                                                                onClick={() => this.toggleTaskForm("application" + applicationIndex + "-task-form")}
                                                                // data-toggle="collapse" data-target={'.collapse-' + applicationIndex + '-application'}
                                                                style={{ height: "30px", width: "30px", float: "right", background: "transparent", border: "medium none" }}>
                                                                <img height="12" width="12" alt="Expand/Collapse" src={StudioImages.ARROW_TB}></img>
                                                            </button>
                                                        </th>
                                                        <td><label className={"badge " + badgeStyle(application.status)}>{application.status}</label></td>
                                                        <td>{application.version}</td>
                                                        <td>{application.modifiedAt}</td>
                                                        <td className="text-center justify-content-md-center p-1">
                                                            <button className="btn btn-icon" title="Edit Application" onClick={() => { this.handleModalEditApplication(application.id) }} ><i className="feather icon-edit"></i></button>
                                                            <button className="btn btn-icon" title="Delete Application" onClick={() => { this.deleteApplication(application.id) }} ><i className="feather icon-trash-2 text-danger"></i></button>
                                                        </td>
                                                    </tr>
                                                    <tr style={{ border: "medium none" }}>
                                                        <td colSpan="5" className="p-0">
                                                            <div id={"application" + applicationIndex + "-task-form"} style={{ display: "none" }}>
                                                                <Row xs="1" md="1">
                                                                    <Col className="text-left">
                                                                        <button className="btn-sm btn-round btn-primary mr-0" style={{ float: "right" }} onClick={() => this.handleModalCreateTaskForm(application.id)}><i className="feather icon-plus fa-lg" /> Create Form</button>
                                                                        <h4 className="mt-1 mb-1 mr-1" style={{ width: `calc(100% - 200px)`, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Forms</h4>
                                                                    </Col>
                                                                </Row>
                                                                <Row xs="1" md="1">
                                                                    <Col className="cards-container">
                                                                        <Card className="studio-card pt-0 mb-0">
                                                                            <CardBody className="p-0">
                                                                                <Table responsive striped bordered hover id={"application" + applicationIndex + "-task-table"} className="mb-0">
                                                                                    <thead>
                                                                                        <tr>
                                                                                            <th>Name</th>
                                                                                            <th width="5%">Type</th>
                                                                                            <th width="5%">Status</th>
                                                                                            <th width="5%">Version</th>
                                                                                            <th width="20%">Last Modified</th>
                                                                                            <th width="10%" className="text-center">Actions</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        {application.forms && application.forms.length > 0 && application.forms.map((taskForm, taskFormIndex) => taskForm.status !== 'ARCHIVED' &&
                                                                                            <tr key={taskFormIndex}>
                                                                                                <td>{taskForm.name}</td>
                                                                                                <td>{taskForm.type}</td>
                                                                                                <td><label className={"badge " + badgeStyle(taskForm.status)}>{taskForm.status}</label></td>
                                                                                                <td>{taskForm.version}</td>
                                                                                                <td>{taskForm.modifiedAt}</td>
                                                                                                <td className="text-center justify-content-md-center p-1">
                                                                                                    <button className="btn btn-icon" title="View Form" onClick={() => { this.handleViewTaskForm(taskForm.id) }} ><i className="feather icon-eye"></i></button>
                                                                                                    <button className="btn btn-icon" title="Delete Form" onClick={() => { this.deleteTaskForm(application.id, taskForm.id) }} ><i className="feather icon-trash-2 text-danger"></i></button>
                                                                                                </td>
                                                                                            </tr>
                                                                                        )}
                                                                                    </tbody>
                                                                                </Table>
                                                                            </CardBody>
                                                                        </Card>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            )}
                                        </Table>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                }
                <Modal centered size={'lg'} isOpen={modalCreateApplication || modalUpdateApplication || modalCreateTaskForm}>
                    <ModalHeader toggle={toggle} className="p-3">{modalCreateApplication ? 'Create Application' : modalUpdateApplication ? 'Update Application' : 'Create Form'}</ModalHeader>
                    <ModalBody className="pt-0 pb-0 pl-2 pr-2">
                        <LowCodeDataForm
                            formDesign={modalCreateTaskForm ? ApplicationConfigForm.FORM_CONFIG : ApplicationConfigForm.APPLICATION_CONFIG}
                            formData={formDataInput}
                            onSubmit={this.saveInputForm.bind(this)}
                        />
                    </ModalBody>
                </Modal>
            </section>
        );
    }
}

export default Applications;