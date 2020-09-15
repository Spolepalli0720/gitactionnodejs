import React, { Component } from 'react';
import { Card, CardBody, CardFooter, Row, Col } from 'reactstrap';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { forEach } from 'min-dash';
import { query as domQuery } from 'min-dom';
import { Formio } from 'react-formio';

import { confirmAction, generateUUID } from '../utils/StudioUtils';
import { notify, notifySuccess, notifyWarning, notifyError } from '../utils/Notifications';
import { applicationService } from '../services/ApplicationService';

import LowCodeViewer from "./LowCodeViewer";

export default class LowCodeModeler extends Component {
    constructor(props) {
        super(props);

        this.state = {
            containerId: props.match && props.match.params && props.match.params.formId ? props.match.params.formId : generateUUID(),
            taskForm: { content: { display: 'form' } },
            previewForm: false
        };
    }

    componentDidMount = () => {
        window.scrollTo(0, 0);

        let taskFormId;
        if (this.props.taskForm) { 
            taskFormId = this.props.taskForm.id;
        } else {
            const { formId } = this.props.match.params;
            taskFormId = formId;
        }

        if (taskFormId) {
            applicationService.getForm(taskFormId).then(response => {
                this.setState({ taskForm: response })
                this.renderFormBuilder(response);
                if(document.getElementById('taskTitle')) {
                    document.getElementById('taskTitle').innerHTML = response.name;
                }
                if(document.getElementById('taskDescription')) {
                    document.getElementById('taskDescription').innerHTML = response.description;
                }
            }).catch(error => {
                console.error('applicationService.getForm:', error);
                notifyError('Unable to retrieve form', error.message);
            });
        } else {
            this.fixPaletteStyles();
            if(document.getElementById('taskTitle')) {
                document.getElementById('taskTitle').innerHTML = 'UI FormBuilder';
            }
            if(document.getElementById('taskDescription')) {
                document.getElementById('taskDescription').innerHTML = 'FormBuilder to build UI forms, wizards';
            }
        }
    }

    componentWillUnmount() {
        if (this.renderer !== undefined) {
            this.renderer.destroy(true);
        }
    }

    renderFormBuilder(taskForm) {
        const { containerId } = this.state;
        const parent = this;
        // Formio.icons = 'fontawesome';
        Formio.builder(document.getElementById(containerId), taskForm.content).then(function (builder) {
            parent.renderer = builder;
            parent.setState({ builder: builder });
            parent.fixPaletteStyles();

            // builder.on('addComponent', function() {
            //     // Triggered when we re-order the form components
            //     console.log('Formio.builder :: addComponent'); 
            // });
            // builder.on('editComponent', function() { console.log('Formio.builder :: editComponent'); });
            // builder.on('updateComponent', function() { console.log('Formio.builder :: updateComponent'); });
            // builder.on('saveComponent', function() { console.log('Formio.builder :: saveComponent'); });
            // builder.on('cancelComponent', function() { console.log('Formio.builder :: cancelComponent'); });
            // builder.on('removeComponent', function() { console.log('Formio.builder :: removeComponent'); });
            builder.on('change', function () {
                // Triggered when form schema is changed
                // console.log('Formio.builder :: change:', builder.schema);
                parent.fixPaletteStyles();
            });
        });
    }

    saveForm() {
        const { taskForm, builder } = this.state;
        // const { formId } = this.props.match.params;
        let taskFormId;
        if (this.props.taskForm) { 
            taskFormId = this.props.taskForm.id;
        } else {
            const { formId } = this.props.match.params;
            taskFormId = formId;
        }

        if (taskFormId) {
            taskForm.content = builder.schema;
            applicationService.updateForm(taskForm).then(response => {
                notifySuccess('Save Form', 'Form has been successfully saved');
                this.setState({ taskForm: response })
            }).catch(error => {
                console.error('applicationService.updateForm:', error);
                notifyError('Unable to save form', error.message);
            });
        }
    }

    publishForm() {
        const { taskForm, builder } = this.state;
        const parent = this;
        // const { formId } = this.props.match.params;
        let taskFormId;
        if (this.props.taskForm) { 
            taskFormId = this.props.taskForm.id;
        } else {
            const { formId } = this.props.match.params;
            taskFormId = formId;
        }

        confirmAction('Publish Form').then(function (userInput) {
            // let actionComment = userInput.value;
            if (!userInput.dismiss) {
                if (taskFormId) {
                    taskForm.content = builder.schema;
                    applicationService.publishForm(taskForm).then(response => {
                        notifySuccess('Publish Form', 'Form has been successfully published');
                        parent.setState({ taskForm: response })
                    }).catch(error => {
                        console.error('applicationService.publishForm:', error);
                        notifyError('Unable to publish applications', error.message);
                    });
                }        
            }
        });
    }

    downloadForm() { 
        const { taskForm, builder } = this.state;
        // const { formId } = this.props.match.params;
        let taskFormId;
        if (this.props.taskForm) { 
            taskFormId = this.props.taskForm.id;
        } else {
            const { formId } = this.props.match.params;
            taskFormId = formId;
        }

        if (taskFormId) {
            taskForm.content = builder.schema;
            var encodedData = encodeURIComponent(JSON.stringify(taskForm));
            const newAnchorTag = document.createElement('a');
            const filename = taskFormId+".json";
            newAnchorTag.setAttribute('href', 'data:application/json;charset=UTF-8,' + encodedData);
            newAnchorTag.setAttribute('download', filename);
            newAnchorTag.dataset.downloadurl = ['application/json', newAnchorTag.download, newAnchorTag.href].join(':');
            notify('Export Form', 'Form details published for download');
            newAnchorTag.click();
        } else {
            notifyWarning('Unable to export form', 'Form details are not available');
        }
    }

    fixPaletteStyles = () => {
        var formBuilder = domQuery('.formbuilder', this._container);
        formBuilder.setAttribute("class", formBuilder.className.replace(" row ", " row pl-0 pr-0 ml-0 mr-0 "));
        var formComponents = domQuery('.formcomponents', this._container);
        formComponents.setAttribute("class", formComponents.className.replace(" col-md-2 ", " col-md-1 pl-0 pr-0 ml-0 mr-0 "));
        var formArea = domQuery('.formarea', this._container);
        formArea.setAttribute("class", formArea.className.replace(" col-md-10 ", " col-md-11 pl-2 pr-0 ml-0 mr-0 "));

        forEach(formComponents.childNodes, function (sidebar, sidebarId) {
            forEach(sidebar.childNodes, function (sidebarPanel, sidebarPanelId) {
                if (sidebarPanel.className && sidebarPanel.className.indexOf("form-builder-panel") >= 0) {
                    forEach(sidebarPanel.childNodes, function (sidebarPanelGroup, sidebarPanelGroupId) {
                        if (sidebarPanelGroup.id) {
                            forEach(sidebarPanelGroup.childNodes, function (group, groupId) {
                                if (group.id) {
                                    forEach(group.childNodes, function (groupItem, groupItemId) {
                                        if (groupItem instanceof HTMLElement) {
                                            groupItem.setAttribute("class", groupItem.className.replace("btn-primary btn-sm btn-block ", ""));
                                            let nodeTitle = '';
                                            forEach(groupItem.childNodes, function (groupItemChild, groupItemChildId) {
                                                // if('I' === groupItemChild.nodeName && groupItemChild.className.indexOf('fa-2x') < 0) {
                                                //     groupItemChild.setAttribute('class', groupItemChild.className + ' fa-2x');
                                                // } else 
                                                if ('#text' === groupItemChild.nodeName) {
                                                    nodeTitle = nodeTitle + groupItemChild.textContent.replace(/"/g, "").trim();
                                                }
                                            })
                                            if (nodeTitle) {
                                                groupItem.setAttribute("title", nodeTitle);
                                            }
                                            forEach(groupItem.childNodes, function (groupItemChild, groupItemChildId) {
                                                if ('#text' === groupItemChild.nodeName) {
                                                    nodeTitle = nodeTitle + groupItemChild.textContent.replace(/"/g, "").trim();
                                                    groupItem.removeChild(groupItemChild)
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        });
    }

    render = () => {
        const { taskType } = this.props;
        const { containerId, previewForm, builder } = this.state;
        const toggle = () => this.setState({ previewForm: false });

        return (
            <section className="studio-container">
                <Row xs="1" md="1">
                    <Col className="text-left">
                        {!taskType &&
                            <div className="canvas-action content-float-right mt-1">
                                <button className="canvas-action-open" title="Preview Form" onClick={() => { this.setState({ previewForm: true }) }}></button>
                                <button className="canvas-action-save" title="Save Form" onClick={() => { this.saveForm() }}></button>
                                <button className="canvas-action-download" title="Export Form" onClick={() => { this.downloadForm() }}></button>
                                <button className="canvas-action-publish" title="Publish Form" onClick={() => { this.publishForm() }}></button>
                            </div>
                        }
                        <h4 id='taskTitle' className="studio-secondary mr-0">Loading....</h4>
                    </Col>
                </Row>
                <Row xs="1" md="1">
                    <Col className="cards-container">
                        <Card className="studio-card mb-0">
                            <CardBody id={containerId} className="text-left studio-container-full-view">
                                {/* Placeholder for FormBuilder */}
                            </CardBody>
                            {!this.props.taskForm && <CardFooter className="text-left p-2">
                                <p id='taskDescription' className="content-description-short text-justify mb-0"></p>
                            </CardFooter>}
                        </Card>
                    </Col>
                </Row>
                {builder && <Modal centered size={'xl'} isOpen={previewForm}>
                    <ModalHeader toggle={toggle} className="p-3">Preview Form</ModalHeader>
                    <ModalBody className="pt-0 pb-0 pl-2 pr-2">
                        <LowCodeViewer viewForm={builder.schema} />
                    </ModalBody>
                </Modal>}
            </section>
        )
    }
}
