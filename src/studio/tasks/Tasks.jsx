import React, { Component } from "react";
import { Row, Col, Card, CardBody, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Tabs, Tab } from 'react-bootstrap';

import userTaskService from '../services/UserTaskService';
import { BasicSpinner } from "../utils/BasicSpinner";
import { userService } from '../services/UserService';
import { processEngine } from '../services/ProcessEngine';
import { applicationService } from "../services/ApplicationService"
import helperMethod from '../shared/HelperMethod'
import { notifySuccess, notifyError } from '../utils/Notifications';
import StudioTable from '../utils/StudioTable';
import LowCodeDataForm from "../modeler/LowCodeDataForm";

class Tasks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ordersLoading: true, showModal: false, tasksLoading: true, userTasks: []
        }
    }

    componentDidMount() {
        const { userTasks } = this.state;

        userService.getUsers().then(response => {
            this.setState({ users: response });
        }).catch(error => {
            console.warn('processEngine.getUsers:', error.message);
        });

        userTasks.push({ id: '0', name: 'My Orders', resourceType: 'Order', data: [] });
        userTasks.push({ id: '1', name: 'All Orders', resourceType: 'Order', data: [] });
        userTasks.push({ id: '2', name: 'Tasks', resourceType: 'Task', data: [] });

        this.refreshOrders(userTasks);

        this.refreshTasks(userTasks);
    }

    refreshOrders(userTasks) {
        const parent = this;
        userTaskService.getOrderData().then(response => {
            response.data.records = response.data.records.sort((a, b) => a.name.localeCompare(b.name));
            response.data.records.reverse();
            response.data.records.forEach(function (taskInfo) {
                taskInfo.vendor_name = taskInfo.partner_id[1];
                taskInfo.status = (taskInfo.state || '').toUpperCase();
            });
            userTasks[0].data = response.data.records.filter(order => order.state === 'draft');
            userTasks[1].data = response.data.records;
            parent.setState({ ordersLoading: false, userTasks: userTasks });
        }).catch(error => {
            console.error('userTaskService.getOrderData:', error);
            notifyError('Unable to pull Orders', error.message);
            parent.setState({ ordersLoading: false, userTasks: userTasks });
        });
    }

    refreshTasks(userTasks) {
        // const { solutionId } = this.props.match.params;
        processEngine.getDeploymentTasks().then(response => {
            userTasks[2].data = response;
            this.setState({ tasksLoading: false, userTasks: userTasks });
        }).catch(error => {
            console.warn('processEngine.getDeploymentTasks:', error.message);
            this.setState({ tasksLoading: false, userTasks: userTasks });
        });
    }

    refreshTasksCamunda(userTasks) {
        const parent = this;

        processEngine.taskFilter().then(response => {
            var promiseArray = [];
            response.forEach(function (filterInfo) {
                let taskData;
                userTasks.forEach(function (taskInfo) {
                    if (taskInfo.id === filterInfo.id) {
                        taskData = taskInfo;
                    }
                });
                if (!taskData) {
                    taskData = { id: filterInfo.id, name: filterInfo.name, resourceType: filterInfo.resourceType, data: [] };
                    userTasks.push(taskData);
                } else {
                    taskData.data = [];
                }

                const childPromise = parent.fetchTaskData(filterInfo.id, taskData);
                promiseArray.push(childPromise);
            });
            return Promise.all(promiseArray);
        }).then(() => {
            parent.setState({ tasksLoading: false, userTasks: userTasks });
        }).catch(error => {
            console.warn('processEngine.taskFilter:', error.message);
            parent.setState({ tasksLoading: false, userTasks: userTasks });
        });
    }

    fetchTaskData(filterId, taskInfo) {
        return processEngine.taskFilter(filterId).then(filterResponse => {
            // taskInfo.data = filterResponse
            // Temporary:  Sorting to be handled in StudioTable
            taskInfo.data = filterResponse.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
        }).catch(error => {
            console.warn('processEngine.taskFilter by filterID:', error.message);
        });
    }

    triggerEditOrder = (orderInfo) => {
        userTaskService.getOrderDetails(orderInfo.id).then(response => {
            this.setState({
                showModal: true, modalEvent: 'Order', orderInfo: orderInfo,
                modalTitle: orderInfo.name, modalInputForm: undefined, modalInputData: response.data.result
            });
        }).catch(error => {
            console.error('userTaskService.getOrderDetails:', error);
            notifyError('Unable to fetch Order Details', error.message);
        });
    }

    acceptOrder = (id) => {
        const { userTasks } = this.state;
        const parent = this;
        userTaskService.confirmOrder(id).then(res => {
            if (res.status === 200 && res.data.id) {
                notifySuccess('Success', 'Order has been accepted')
                parent.refreshOrders(userTasks);
            } else {
                notifyError('Error', 'Someting went wrong,Please try again after sometimes');
            }
            this.setState({ showModal: false });
        }).catch(err => {
            notifyError('Error', 'Someting went wrong,Please try again after sometimes');
            console.log('Accept order error', err);
            this.setState({ showModal: false });
        });
    }

    rejectOrder = (id) => {
        const { userTasks } = this.state;
        const parent = this;
        userTaskService.rejectOrder(id).then(res => {
            if (res.status === 200 && res.data.id) {
                notifySuccess('Success', 'Order has been rejected');
                parent.refreshOrders(userTasks);
            } else {
                notifyError('Error', 'Someting went wrong,Please try again after sometimes');
            }
            this.setState({ showModal: false });
        }).catch(err => {
            notifyError('Error', 'Someting went wrong,Please try again after sometimes');
            console.log('Reject order error', err)
            this.setState({ showModal: false });
        })
    }

    triggerClaimTask(taskInfo) {
        const { userTasks } = this.state;
        processEngine.claimHumanTask(taskInfo.id).then(response => {
            this.refreshTasks(userTasks);
        }).catch(error => {
            console.error('processEngine.claimHumanTask:', error);
            notifyError('Unable to claim task', error.message);
        });
    }

    triggerEditTask(taskInfo) {
        const { users } = this.state;

        processEngine.getFormVariables(taskInfo.id).then(formVariables => {
            if (taskInfo.formKey) {
                applicationService.getForm(taskInfo.formKey).then(inputForm => {
                    if (taskInfo.name && taskInfo.name.startsWith('Assign')) {
                        let reviewerInfo = inputForm.content.components.filter(component => component.key === 'reviewer');
                        if (reviewerInfo.length > 0) {
                            users.forEach(function (userInfo) {
                                reviewerInfo[0].data.values.push({
                                    label: (userInfo.firstName && userInfo.lastName) ? userInfo.firstName + ' ' + userInfo.lastName : userInfo.username,
                                    value: userInfo.username.split('@')[0]
                                });
                            });
                        }
                    }
                    Object.keys(formVariables).forEach(function (formKey) {
                        let formVariable = formVariables[formKey];
                        if ('String' === formVariable.type && formVariable.value &&
                            (formVariable.value.startsWith('{') || formVariable.value.startsWith('['))
                        ) {
                            formVariables[formKey] = JSON.parse(formVariable.value);
                        } else if ('object' === formVariable.type) {
                            formVariables[formKey] = formVariable.value;
                        } else {
                            formVariables[formKey] = formVariable.value;
                        }
                    });
                    this.setState({
                        showModal: true, modalEvent: 'Task', taskInfo: taskInfo,
                        modalTitle: taskInfo.name || taskInfo.taskDefinitionKey, modalInputForm: inputForm.content, modalInputData: formVariables
                    });
                }).catch(error => {
                    console.log('Error:', error);
                    let inputForm = this.buildInputForm(taskInfo, formVariables);
                    this.setState({
                        showModal: true, modalEvent: 'Task', taskInfo: taskInfo,
                        modalTitle: taskInfo.name || taskInfo.taskDefinitionKey, modalInputForm: inputForm, modalInputData: formVariables
                    });
                });
            } else {
                let inputForm = this.buildInputForm(taskInfo, formVariables);
                this.setState({
                    showModal: true, modalEvent: 'Task', taskInfo: taskInfo,
                    modalTitle: taskInfo.name || taskInfo.taskDefinitionKey, modalInputForm: inputForm, modalInputData: formVariables
                });
            }
        }).catch(error => {
            console.error('processEngine.getFormVariables:', error);
            notifyError('Unable to fetch form variables', error.message);
        });
    }

    buildInputForm(taskInfo, formVariables) {
        const { users } = this.state;
        let inputFormDesign = { type: 'form', display: 'form', components: [] };
        var inputElementDesign;
        Object.keys(formVariables).forEach(function (formKey) {
            let formVariable = formVariables[formKey];
            if ('String' === formVariable.type && formVariable.value &&
                (formVariable.value.startsWith('{') || formVariable.value.startsWith('['))
            ) {
                formVariables[formKey] = JSON.parse(formVariable.value);

                inputElementDesign = {
                    label: formKey.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                    key: formKey,
                    type: "textarea",
                    editor: 'ace',
                    as: 'json',
                    rows: 10,
                    input: true,
                    disabled: false,
                    customClass: 'mb-0'
                };
                inputFormDesign.components.push(inputElementDesign);
            } else if ('object' === formVariable.type) {
                formVariables[formKey] = formVariable.value;

                inputElementDesign = {
                    label: formKey.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                    key: formKey,
                    type: "textarea",
                    editor: 'ace',
                    as: 'json',
                    rows: 10,
                    input: true,
                    disabled: false,
                    customClass: 'mb-0'
                };
                inputFormDesign.components.push(inputElementDesign);
            } else {
                inputElementDesign = {
                    label: formKey.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                    key: formKey,
                    input: true,
                    disabled: true,
                    customClass: 'mb-0'
                };

                if ('boolean' === formVariable.type.toLowerCase()) {
                    inputElementDesign.type = 'checkbox';
                    inputElementDesign.inputType = 'checkbox';
                    formVariables[formKey] = formVariable.value;
                } else if ('double' === formVariable.type.toLowerCase() || 'number' === formVariable.type.toLowerCase()) {
                    inputElementDesign.type = 'number';
                    formVariables[formKey] = formVariable.value;
                } else if ('string' === formVariable.type.toLowerCase()) {
                    inputElementDesign.type = 'textfield';
                    formVariables[formKey] = formVariable.value;
                }

                if (inputElementDesign.type && formVariables[formKey]) {
                    inputFormDesign.components.push(inputElementDesign);
                }
            }
        });

        if (taskInfo.name?.startsWith('Assign') && !formVariables.reviewer) {
            let reviewer = {
                label: 'Reviewer',
                key: 'reviewer',
                type: 'select',
                input: true,
                data: {
                    values: []
                },
                dataSrc: 'values',
                template: '<span>{{ item.label }}</span>'
            }
            users.forEach(function (userInfo) {
                reviewer.data.values.push({
                    label: (userInfo.firstName && userInfo.lastName) ? userInfo.firstName + ' ' + userInfo.lastName : userInfo.username,
                    value: userInfo.username.split('@')[0]
                });
            });
            inputFormDesign.components.push(reviewer);
        }

        let inputRemarks = {
            label: 'Remarks', key: 'remarks', input: true, type: 'textfield', customClass: 'mb-0'
        };
        let btnSubmit = {
            label: "Approve", key: "submit", type: 'button', theme: 'primary', customClass: "pull-right ml-2 mt-2", input: true,
            tableView: false, showValidations: false, disableOnInvalid: true
        };
        let btnCancel = {
            label: "Reject", key: "cancel", type: 'button', theme: 'danger', customClass: "pull-right mt-2", input: true,
            tableView: false, showValidations: false, disableOnInvalid: false
        };

        if (taskInfo.name?.startsWith('Assign')) {
            btnSubmit.label = 'Assign';
            inputFormDesign.components.push(btnSubmit);
        } else if (taskInfo.name?.startsWith('Review')) {
            btnSubmit.label = 'Clarified';
            btnCancel.label = 'Not Clear';
            if (!formVariables.remarks) {
                inputFormDesign.components.push(inputRemarks);
            }
            inputFormDesign.components.push(btnSubmit);
            inputFormDesign.components.push(btnCancel);
        } else if (taskInfo.name?.startsWith('Approve')) {
            btnSubmit.label = 'Approve';
            btnCancel.label = 'Reject';
            if (!formVariables.remarks) {
                inputFormDesign.components.push(inputRemarks);
            }
            inputFormDesign.components.push(btnSubmit);
            inputFormDesign.components.push(btnCancel);
        } else {
            btnSubmit.label = 'Complete';
            inputFormDesign.components.push(btnSubmit);
        }
        return inputFormDesign;
    }

    saveTask(taskData) {
        const parent = this;
        const { userTasks, taskInfo } = this.state;

        if (taskInfo.name && taskInfo.name.startsWith('Assign')) {
            processEngine.assignHumanTask(taskInfo.id, taskInfo.reviewer).then(response => {
                parent.setState({ showModal: false });
                this.refreshTasks(userTasks);
            }).catch(error => {
                console.error('processEngine.submitHumanTask:', error);
                notifyError('Unable to save task', error.message);
                parent.setState({ showModal: false, modalInputData: taskData });
            });
        } else {
            let payload;
            if (taskInfo.name && taskInfo.name.startsWith('Review')) {
                payload = {
                    variables: {
                        clarified: { value: taskData.submit, type: "Boolean", valueInfo: {} },
                        remarks: { value: taskData.remarks, type: "String", valueInfo: {} }
                    }
                }
            } else if (taskInfo.name && taskInfo.name.startsWith('Approve')) {
                payload = {
                    variables: {
                        approved: { value: taskData.submit, type: "Boolean", valueInfo: {} },
                        remarks: { value: taskData.remarks, type: "String", valueInfo: {} }
                    }
                }
            } else {
                payload = {
                    variables: {}
                }
            }

            processEngine.submitHumanTask(taskInfo.id, payload).then(response => {
                parent.setState({ showModal: false });
                this.refreshTasks(userTasks);
            }).catch(error => {
                console.error('processEngine.submitHumanTask:', error);
                notifyError('Unable to save task', error.message);
                parent.setState({ showModal: false, modalInputData: taskData });
            });
        }
    }

    render() {
        const { ordersLoading, tasksLoading, userTasks, modalEvent, modalTitle, modalInputForm, modalInputData, orderInfo } = this.state;
        const toggleModal = () => this.setState({ showModal: false });

        const orderHeader = [
            { label: 'Name', key: 'name' },
            { label: 'Order Date', key: 'date_order' },
            { label: 'Vendor', key: 'vendor_name' },
            { label: 'Total', key: 'amount_total' },
            { label: 'Status', key: 'status' },
        ];
        const orderActions = [
            { btnTitle: 'Edit', btnClass: 'btn-success', iconClass: 'feather icon-edit', btnAction: this.triggerEditOrder.bind(this) },
        ]
        const orderSorting = { sortIndex: 0, sortOrder: 0 };

        const taskHeader = [
            { label: 'Name', key: 'name' },
            { label: 'Description', key: 'description' },
            { label: 'Priority', key: 'priority' },
            { label: 'Created', key: 'createdAt' },
            { label: 'Follow Up', key: 'followUp' },
            { label: 'Due', key: 'due' },
            { label: 'Assignee', key: 'assignee' }
        ];
        const taskActions = [
            { btnTitle: 'Claim', btnClass: 'btn-info', iconClass: 'feather icon-check-circle', btnAction: this.triggerClaimTask.bind(this) },
            { btnTitle: 'Edit', btnClass: 'btn-success', iconClass: 'feather icon-edit', btnAction: this.triggerEditTask.bind(this) },
        ]
        const taskSorting = { sortIndex: 5, sortOrder: 0 };

        return (
            <section className="studio-container">
                {(ordersLoading || tasksLoading) &&
                    <Card>
                        <CardBody>
                            <BasicSpinner />
                        </CardBody>
                    </Card>
                }
                {!(ordersLoading || tasksLoading) &&
                    <div>
                        <Row xs="1" md="1">
                            <Col>
                                <h3>Tasks</h3>
                            </Col>
                        </Row>
                        {userTasks.length > 0 &&
                            <Row xs="1" md="1">
                                <Col>
                                    <Card className="mb-0">
                                        <CardBody className="p-0">
                                            <Tabs defaultActiveKey={userTasks[0].id} className="px-2">
                                                {userTasks.map((taskInfo, taskIndex) =>
                                                    <Tab key={taskIndex} eventKey={taskInfo.id} title={taskInfo.name + ' (' + taskInfo.data.length + ')'}>
                                                        <StudioTable tableName={taskInfo.name} hideTableName={true}
                                                            tableHeader={taskInfo.resourceType === 'Order' ? orderHeader : taskHeader}
                                                            tableData={taskInfo.data}
                                                            tableActions={taskInfo.resourceType === 'Order' ? orderActions : taskActions}
                                                            styleActions={false}
                                                            defaultSort={taskInfo.resourceType === 'Order' ? orderSorting : taskSorting}
                                                        />
                                                    </Tab>
                                                )}
                                            </Tabs>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        }
                    </div>
                }

                <Modal centered size={"lg"} isOpen={this.state.showModal && 'Order' === modalEvent}>
                    <ModalHeader toggle={toggleModal} className="text-center">{'Order Summary - ' + modalTitle}</ModalHeader>
                    <ModalBody className="p-1 studio-container-max-height">
                        {/* <h4 className="divider mb-2" >{name}</h4> */}
                        {modalInputData && modalInputData.length > 0 ? modalInputData.map((itemObj) => {
                            return (
                                <div key={helperMethod.uniqueKeyGenerator()} className="divider mb-2 pl-3 pr-3">
                                    <h6 className="mb-0">Item Name: {itemObj.name}</h6>
                                    <p className="text-muted mb-0">Quantity: {itemObj.product_qty}</p>
                                    <p className="text-muted mb-0">Unit price: {`${helperMethod.getCurrencySymbol(itemObj.currency_id[1])} ${itemObj.price_unit}`}</p>
                                    <p className="text-muted mb-0">Total: {`${helperMethod.getCurrencySymbol(itemObj.currency_id[1])} ${itemObj.price_subtotal}`}</p>
                                </div>
                            )
                        }) : <h6 className="text-muted text-center p-5"> No Details to display</h6>}
                    </ModalBody>
                    {orderInfo && (orderInfo.state || '').toUpperCase() === 'DRAFT' && modalInputData && modalInputData.length > 0 &&
                        <ModalFooter>
                            <button type="button" className="btn btn-danger mr-1" title={'Reject'} onClick={() => this.rejectOrder(orderInfo.id)}>Reject</button>
                            <button type="button" className="btn btn-success mr-1" title={'Accept'} onClick={() => this.acceptOrder(orderInfo.id)}>Accept</button>
                        </ModalFooter>
                    }
                </Modal>

                <Modal centered size={"lg"} isOpen={this.state.showModal && 'Task' === modalEvent}>
                    <ModalHeader toggle={toggleModal} className="p-3">{modalTitle}</ModalHeader>
                    <ModalBody className="pt-0 pb-0 pl-2 pr-2 studio-container-max-height">
                        <LowCodeDataForm
                            formDesign={modalInputForm}
                            formData={modalInputData}
                            onSubmit={this.saveTask.bind(this)}
                        />
                    </ModalBody>
                </Modal>
            </section>
        )
    }
}
export default Tasks;
