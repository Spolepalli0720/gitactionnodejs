import React from 'react';
import { Card, CardBody, CardFooter, Row, Col } from 'reactstrap';
import { Formio } from 'react-formio';

import { applicationService } from '../services/ApplicationService';
import { generateUUID } from "../utils/StudioUtils";

export default class LowCodeViewer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            taskForm: props.taskForm,
            viewForm: props.viewForm,
            containerId: props.taskForm ? props.taskForm.id :
                props.match && props.match.params && props.match.params.formId ? props.match.params.formId : generateUUID()
        };
    }

    componentDidMount() {
        const { taskForm, viewForm, containerId } = this.state;
        const parent = this;
        let taskFormId;
        if (this.props.match) {
            const { formId } = this.props.match && this.props.match.params;
            taskFormId = formId;
        }

        // Formio.icons = 'fontawesome';
        if (taskFormId) {
            applicationService.getForm(taskFormId).then(response => {
                this.setState({ taskFormId: response.id })
                document.getElementById('taskTitle').innerHTML = response.name;
                document.getElementById('taskDescription').innerHTML = response.description;
                Formio.createForm(document.getElementById(containerId), response.content, { 
                    readOnly: false,
                    buttonSettings: {
                        showCancel: false,
                        showSubmit: false
                    }
                }).then(function (form) {
                    parent.renderer = form;
                    form.on('submit', function (submission) {
                        console.log(submission);
                    });
                });
            });
        } else if (taskForm) {
            if(document.getElementById('taskTitle')) {
                document.getElementById('taskTitle').innerHTML = taskForm.name;
            }
            if(document.getElementById('taskDescription')) {
                document.getElementById('taskDescription').innerHTML = taskForm.description;
            }
            Formio.createForm(document.getElementById(containerId), taskForm.content, { 
                readOnly: false,
                buttonSettings: {
                    showCancel: false,
                    showSubmit: false
                }
            }).then(function (form) {
                parent.renderer = form;
                form.on('submit', function (submission) {
                    console.log(submission);
                });
            });
        } else if (viewForm) {
            Formio.createForm(document.getElementById(containerId), viewForm, { 
                readOnly: !!this.props.readOnly,
                buttonSettings: {
                    showCancel: false,
                    showSubmit: false
                }
            }).then(function (form) {
                parent.renderer = form;
                form.on('submit', function (submission) {
                    console.log(submission);
                });
            });
        }
    }

    componentWillUnmount() {
        if (this.renderer !== undefined) {
            this.renderer.destroy(true);
        }
    }

    editForm() {
        const { solutionId, formId } = this.props.match.params;
        this.props.history.push(`/solutions/${solutionId}/forms/${formId}/editor`);
    }

    render() {
        const { taskFormId, containerId, viewForm } = this.state;

        return (
            <section className={"studio-container" + (viewForm ? " p-0" : "")}>
                {!viewForm && <Row xs="1" md="1">
                    <Col className="text-left">
                        {taskFormId &&
                            <div className="canvas-action content-float-right mt-1">
                                <button className="canvas-action-edit" title="Edit Form" onClick={() => { this.editForm() }}></button>
                            </div>
                        }
                        <h4 id='taskTitle' className="studio-secondary mr-0">Loading....</h4>
                    </Col>
                </Row>}
                <Row xs="1" md="1">
                    <Col className={"cards-container" + (viewForm ? " p-0" : "")}>
                        <Card className={"studio-card" + (viewForm ? " m-0" : " mb-0")}>
                            <CardBody id={containerId}
                                className={"text-left studio-container-max-height" + ((this.props.match && this.props.match.params && this.props.match.params.formId) ? ' studio-container-full-view' : ' p-1')}>
                                {/* Placeholder for FormBuilder */}
                            </CardBody>
                            {!viewForm && <CardFooter className="text-left p-2">
                                <p id='taskDescription' className="content-description-short text-justify mb-0"></p>
                            </CardFooter>}
                        </Card>
                    </Col>
                </Row>
            </section>
        );
    }
}
