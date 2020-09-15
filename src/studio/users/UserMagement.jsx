import React, { Component } from "react";
import { Row, Col, Card, CardBody, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Tabs, Tab } from 'react-bootstrap';
import StudioTable from '../utils/StudioTable';
import { notifySuccess, notifyWarning, notifyError } from '../utils/Notifications';
import { confirmWarning, confirmAction, confirmDelete } from '../utils/StudioUtils';
import { userService } from "../services/UserService";
import { roleService } from "../services/RoleService";
import { BasicSpinner } from "../utils/BasicSpinner";

import LowCodeDataForm from "../modeler/LowCodeDataForm";
// import LowCodeDataGrid from "../modeler/LowCodeDataGrid";
import UserConfigForm from "./UserConfigForm";
import RoleConfig from './RoleConfig';
// import roleAccess from './RoleAccess';

class UserMagement extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loadingResources: true,
            loadingRoles: true,
            loadingUsers: true,
            userManagement: [
                { id: 0, name: 'Users', tableData: [], tableHeader: undefined, tableActions: undefined, defaultSort: undefined },
                { id: 1, name: 'Roles', tableData: [], tableHeader: undefined, tableActions: undefined, defaultSort: undefined }
            ],
            accessResources: []
        }
    }

    componentDidMount() {
        this.loadResources();
        this.loadRoles();
        this.loadUsers();
    }

    loadResources() {
        const parent = this;
        const accessResources = [];

        // console.log('roleAccess:', roleAccess);
        // roleAccess.items.forEach(function (arrayItem) {
        //     if (arrayItem.children && arrayItem.children.length > 0) {
        //         parent.buildResourceList(arrayItem.children, 2, undefined, '', accessResources);
        //     }
        // });
        // parent.setState({ loadingResources: false, accessResources: accessResources });

        roleService.getResources().then(response => {
            response.forEach(function (arrayItem) {
                if (arrayItem.children && arrayItem.children.length > 0) {
                    parent.buildResourceList(arrayItem.children, 2, undefined, '', accessResources);
                }
            });
            parent.setState({ loadingResources: false, accessResources: accessResources });
        }).catch(error => {
            parent.setState({ loadingResources: false });
            console.error('roleService.getResources:', error);
            notifyError('Unable to retrieve resources', error.message);
        });
    }

    buildResourceList(items, level, parentId, breadcrumb, accessResources) {
        const parent = this;
        items.forEach(function (arrayItem) {
            accessResources.push({
                id: arrayItem.name,
                title: arrayItem.title,
                tooltip: breadcrumb + arrayItem.title,
                icon: arrayItem.icon,
                actions: arrayItem.actions,
                className: `pl-${level}`,
                isGroup: (arrayItem.children && arrayItem.children.length > 0) ? true : false,
                collapsed: (arrayItem.children && arrayItem.children.length > 0) ? true : false,
                childCount: (arrayItem.children && arrayItem.children.length > 0) ? arrayItem.children.length : 0,
                parentId: parentId,
                hidden: parentId ? true : false,
                enabled: (['L1-SignOut'].indexOf(arrayItem.name) < 0) ? false : true,
                disabled: (['L1-SignOut'].indexOf(arrayItem.name) < 0) ? false : true,
                all: false,
            })

            if (arrayItem.children && arrayItem.children.length > 0) {
                parent.buildResourceList(arrayItem.children, level + 1, arrayItem.name, breadcrumb + arrayItem.title + ' » ', accessResources);
            }
        })
    }


    loadRoles() {
        const parent = this;
        // const accessRoles = require('../../role-access.js');
        roleService.getRoles().then(response => {
            const userManagement = parent.state.userManagement;
            userManagement[1].tableData = response;
            userManagement[1].tableHeader = [
                { label: 'Name', key: 'name' },
                { label: 'Description', key: 'description' },
            ];
            userManagement[1].tableActions = [
                {
                    btnTitle: 'Edit', btnClass: 'btn-success', iconClass: 'feather icon-edit',
                    btnAction: parent.triggerEditRole.bind(this)
                },
                {
                    btnTitle: 'Delete', btnClass: 'btn-danger', iconClass: 'feather icon-trash-2',
                    btnAction: parent.triggerDeleteRole.bind(this)
                },
            ]
            userManagement[1].defaultSort = { sortIndex: 0, sortOrder: 0 };
            userManagement[1].createAction = this.triggerCreateRole.bind(this);
            userManagement[1].createLabel = "Create";
            parent.setState({ loadingRoles: false, userManagement: userManagement });
        }).catch(error => {
            parent.setState({ loadingRoles: false });
            console.error('userService.getRoles:', error);
            notifyError('Unable to retrieve roles', error.message);
        });
    }

    loadUsers() {
        const parent = this;
        userService.getUsers().then(response => {
            const userManagement = parent.state.userManagement;
            userManagement[0].tableData = response;
            userManagement[0].tableHeader = [
                { label: 'Login Name', key: 'username' },
                { label: 'First Name', key: 'firstName' },
                { label: 'Last Name', key: 'lastName' },
                // { label: 'Roles', key: 'roles' },
                { label: 'Phone Number', key: 'phoneNo' },
                { label: 'Active', key: 'active' }
            ];
            userManagement[0].tableActions = [
                {
                    btnTitle: 'Verify', btnClass: 'btn-primary', iconClass: 'feather icon-eye',
                    btnAction: this.triggerVerifyUser.bind(this), btnCondition: this.gridUserActionToggle.bind(this)
                },
                {
                    btnTitle: 'Activate', btnClass: 'btn-primary', iconClass: 'feather icon-user-check',
                    btnAction: this.triggerActivateUser.bind(this), btnCondition: this.gridUserActionToggle.bind(this)
                },
                {
                    btnTitle: 'Edit', btnClass: 'btn-success', iconClass: 'feather icon-edit',
                    btnAction: parent.triggerEditUser.bind(this), btnCondition: this.gridUserActionToggle.bind(this)
                },
                {
                    btnTitle: 'Deactivate', btnClass: 'btn-warning', iconClass: 'feather icon-user-x',
                    btnAction: this.triggerDeactivateUser.bind(this), btnCondition: this.gridUserActionToggle.bind(this)
                },
                {
                    btnTitle: 'Reset Password', btnClass: 'btn-warning', iconClass: 'feather icon-refresh-ccw',
                    btnAction: parent.triggerResetPassword.bind(this), btnCondition: this.gridUserActionToggle.bind(this)
                },
                {
                    btnTitle: 'Delete', btnClass: 'btn-danger', iconClass: 'feather icon-trash-2',
                    btnAction: parent.triggerDeleteUser.bind(this)
                },
            ]
            userManagement[0].defaultSort = { sortIndex: 0, sortOrder: 0 };
            userManagement[0].createAction = this.triggerCreateUser.bind(this);
            userManagement[0].createLabel = "Create";

            parent.setState({ loadingUsers: false, userManagement: userManagement });
        }).catch(error => {
            parent.setState({ loadingUsers: false });
            console.error('userService.getUsers:', error);
            notifyError('Unable to retrieve users', error.message);
        });
    }

    gridUserActionToggle(userData, actionButton) {
        var btnVisible = false;
        if (actionButton.btnTitle === 'Verify' && !userData.verified) {
            btnVisible = true;
        } else if (actionButton.btnTitle === 'Edit' && userData.verified) {
            btnVisible = true;
        } else if (actionButton.btnTitle === 'Activate' && userData.verified && !userData.active) {
            btnVisible = true;
        } else if (actionButton.btnTitle === 'Deactivate' && userData.verified && userData.active) {
            btnVisible = true;
        } else if (actionButton.btnTitle === 'Reset Password' && userData.verified && userData.active) {
            btnVisible = true;
        }
        return btnVisible;
    }

    triggerCreateUser() {
        const { userManagement } = this.state;
        const roleElement = UserConfigForm.DATA_INPUT_FORM.components[0].columns[4].components[0];
        let roleValues = userManagement[1].tableData.map((roleInfo) => roleInfo.status !== 'ARCHIVED' && ({ label: roleInfo.name, value: roleInfo.id }));
        roleValues = roleValues.sort((a, b) => a.label.localeCompare(b.label));
        roleElement.data.values = roleValues;
        this.setState({ showModal: true, modalEvent: 'createUser', modalData: undefined });
    }

    triggerVerifyUser(userData) {
        userData.configMode = 'verifyUser';
        this.setState({ showModal: true, modalEvent: 'verifyUser', modalData: userData });
    }

    triggerEditUser(userData) {
        const { userManagement } = this.state;
        const roleElement = UserConfigForm.DATA_INPUT_FORM.components[0].columns[4].components[0];
        let roleValues = userManagement[1].tableData.map((roleInfo) => roleInfo.status !== 'ARCHIVED' && ({ label: roleInfo.name, value: roleInfo.id }));
        roleValues = roleValues.sort((a, b) => a.label.localeCompare(b.label));
        roleElement.data.values = roleValues;
        userData.configMode = 'updateUser';
        this.setState({ showModal: true, modalEvent: 'updateUser', modalData: userData });
    }

    triggerActivateUser(userData) {
        const { userManagement } = this.state;
        const parent = this;

        confirmAction('Activate User ' + userData.username).then(function (userInput) {
            if (!userInput.dismiss) {
                userService.activateUser(userData.id).then(response => {
                    let user = userManagement[0].tableData.filter(arrayItem => arrayItem.id === userData.id)[0]
                    user.active = true;
                    notifySuccess('Activate User', 'User has been successfully activated');
                    parent.setState({ userManagement: userManagement, showModal: false, modalEvent: undefined, modalData: undefined });
                }).catch(error => {
                    console.error('userService.activateUser:', error);
                    notifyError('Unable to activate user', error.message);
                    parent.setState({ showModal: false, modalEvent: undefined, modalData: undefined });
                });
            }
        });
    }

    triggerDeactivateUser(userData) {
        const { userManagement } = this.state;
        const parent = this;

        confirmAction('Deactivate User ' + userData.username).then(function (userInput) {
            if (!userInput.dismiss) {
                userService.deactivateUser(userData.id).then(response => {
                    let user = userManagement[0].tableData.filter(arrayItem => arrayItem.id === userData.id)[0]
                    user.active = false;
                    notifySuccess('Deactivate User', 'User has been successfully deactivated');
                    parent.setState({ userManagement: userManagement, showModal: false, modalEvent: undefined, modalData: undefined });
                }).catch(error => {
                    console.error('userService.deactivateUser:', error);
                    notifyError('Unable to deactivate user', error.message);
                    parent.setState({ showModal: false, modalEvent: undefined, modalData: undefined });
                });
            }
        });
    }

    triggerResetPassword(userData) {
        const parent = this;

        confirmAction('Reset password of User ' + userData.username).then(function (userInput) {
            if (!userInput.dismiss) {
                userService.resetPassword(userData.username).then(response => {
                    notifySuccess('Password Reset', 'Password has been successfully reset');
                    parent.setState({ showModal: false, modalEvent: undefined, modalData: undefined });
                }).catch(error => {
                    console.error('userService.resetPassword:', error);
                    notifyError('Unable to reset password', error.message);
                    parent.setState({ showModal: false, modalEvent: undefined, modalData: undefined });
                });
            }
        });
    }

    triggerDeleteUser(userData) {
        const { userManagement } = this.state;
        const parent = this;

        confirmDelete().then(function (userInput) {
            if (!userInput.dismiss) {
                userService.deleteUser(userData.id).then(response => {
                    let user = userManagement[0].tableData.filter(arrayItem => arrayItem.id === userData.id)[0]
                    user.status = 'ARCHIVED';
                    notifySuccess('Delete User', 'User has been permanently removed');
                    parent.setState({ userManagement: userManagement, showModal: false, modalEvent: undefined, modalData: undefined });
                }).catch(error => {
                    console.error('userService.deleteUser:', error);
                    notifyError('Unable to delete user', error.message);
                    parent.setState({ showModal: false, modalEvent: undefined, modalData: undefined });
                });
            }
        });
    }

    saveUser(userData) {
        const { userManagement, modalEvent } = this.state;
        const parent = this;

        delete userData.configMode;
        delete userData.submit;

        if (modalEvent === 'createUser') {
            userService.createUser(userData).then(response => {
                userManagement[0].tableData.push(response);
                notifySuccess('Create User', 'User has been successfully created');
                parent.setState({ userManagement: userManagement, showModal: false, modalEvent: undefined, modalData: undefined });
            }).catch(error => {
                console.error('userService.createUser:', error);
                notifyError('Unable to create user', error.message);
                parent.setState({ showModal: false, modalEvent: undefined, modalData: undefined });
            });
        } else if (modalEvent === 'verifyUser') {
            userService.verifyUser(userData.id).then(response => {
                let user = userManagement[0].tableData.filter(arrayItem => arrayItem.id === userData.id)[0]
                user.verified = true;
                notifySuccess('Verify User', 'User has been successfully verified');
                parent.setState({ userManagement: userManagement, showModal: false, modalEvent: undefined, modalData: undefined });
            }).catch(error => {
                console.error('userService.verifyUser:', error);
                notifyError('Unable to verify user', error.message);
                parent.setState({ showModal: false, modalEvent: undefined, modalData: undefined });
            });
        } else if (modalEvent === 'updateUser') {
            userService.updateUser(userData).then(response => {
                let user = userManagement[0].tableData.filter(arrayItem => arrayItem.id === userData.id)[0]
                Object.keys(response).forEach(function (dataKey) {
                    user[dataKey] = response[dataKey];
                });
                notifySuccess('Update User', 'User has been successfully updated');
                parent.setState({ userManagement: userManagement, showModal: false, modalEvent: undefined, modalData: undefined });
            }).catch(error => {
                console.error('userService.updateUser:', error);
                notifyError('Unable to update user', error.message);
                parent.setState({ showModal: false, modalEvent: undefined, modalData: undefined });
            });
        } else {
            notifyWarning('Pending Implementation', 'Pending implementation');
            parent.setState({ showModal: false, modalEvent: undefined, modalData: undefined });
        }
    }

    triggerCreateRole() {
        this.setState({ showModal: true, modalEvent: 'createRole', modalData: undefined });
    }

    triggerEditRole(roleData) {
        this.setState({ showModal: true, modalEvent: 'updateRole', modalData: roleData });
    }

    triggerDeleteRole(roleData) {
        const { userManagement } = this.state;
        const parent = this;

        let assignedUsers = [];
        userManagement[0].tableData.map((userInfo) =>
            userInfo.roles.map((role) => role === roleData.id && assignedUsers.push(userInfo.username))
        );

        if (assignedUsers.length > 0) {
            confirmWarning("Delete Restricted", 'Following Users are associated to this role: ' +
                assignedUsers.slice(0, 5).toString().replace(/,/g, ', ') + (assignedUsers.length > 5 ? ' ...more' : '')
            ).then(function (userInput) {
                // console.log('userInput:', userInput);
            });
        } else {
            confirmDelete().then(function (userInput) {
                if (!userInput.dismiss) {
                    roleService.deleteRole(roleData.id).then(response => {
                        let role = userManagement[1].tableData.filter(arrayItem => arrayItem.id === roleData.id)[0]
                        role.status = 'ARCHIVED';
                        notifySuccess('Delete Role', 'Role has been permanently removed');
                        parent.setState({ userManagement: userManagement, showModal: false, modalEvent: undefined, modalData: undefined });
                    }).catch(error => {
                        console.error('roleService.deleteRole:', error);
                        notifyError('Unable to delete role', error.message);
                        parent.setState({ showModal: false, modalEvent: undefined, modalData: undefined });
                    });
                }
            });
        }
    }

    saveRole(roleData) {
        const { modalEvent, userManagement } = this.state;
        const parent = this;

        if (modalEvent === 'createRole') {
            roleService.createRole(roleData).then(response => {
                userManagement[1].tableData.push(response);
                notifySuccess('Create Role', 'Role has been successfully created');
                parent.setState({ userManagement: userManagement, showModal: false, modalEvent: undefined, modalData: undefined });
            }).catch(error => {
                console.error('roleService.createRole:', error);
                notifyError('Unable to create role', error.message);
                parent.setState({ showModal: false, modalEvent: undefined, modalData: undefined });
            });

        } else if (modalEvent === 'updateRole') {
            roleService.updateRole(roleData).then(response => {
                let role = userManagement[1].tableData.filter(arrayItem => arrayItem.id === roleData.id)[0]
                Object.keys(response).forEach(function (dataKey) {
                    role[dataKey] = response[dataKey];
                });
                notifySuccess('Update Role', 'Role has been successfully updated');
                parent.setState({ userManagement: userManagement, showModal: false, modalEvent: undefined, modalData: undefined });
            }).catch(error => {
                console.error('roleService.updateRole:', error);
                notifyError('Unable to update role', error.message);
                parent.setState({ showModal: false, modalEvent: undefined, modalData: undefined });
            });
        } else {
            notifyWarning('Pending Implementation', 'Pending implementation');
            parent.setState({ showModal: false, modalEvent: undefined, modalData: undefined });
        }
    }

    render() {
        const { loadingUsers, loadingResources, loadingRoles, userManagement, accessResources, showModal, modalEvent, modalData } = this.state;
        const toggle = () => this.setState({ showModal: false, modalEvent: undefined, modalData: undefined });

        return (
            <section className="studio-container">
                {(loadingResources || loadingRoles || loadingUsers) &&
                    <Card>
                        <CardBody>
                            <BasicSpinner />
                        </CardBody>
                    </Card>
                }
                {!(loadingResources || loadingRoles || loadingUsers) &&
                    <div>
                        <Row xs="1" md="1">
                            <Col>
                                <h3>User Management</h3>
                            </Col>
                        </Row>
                        <Row xs="1" md="1">
                            <Col>
                                <Card className="mb-0">
                                    <CardBody className="p-0">
                                        <Tabs defaultActiveKey={userManagement[0].id} className="px-2">
                                            {userManagement.map((tabInfo, tabIndex) =>
                                                <Tab key={tabIndex} eventKey={tabInfo.id} title={tabInfo.name + ' (' + tabInfo.tableData.length + ')'}>
                                                    <StudioTable tableName={tabInfo.name} hideTableName={true}
                                                        tableHeader={tabInfo.tableHeader}
                                                        tableData={tabInfo.tableData.filter(arrayItem => arrayItem.status !== 'ARCHIVED')}
                                                        createAction={tabInfo.createAction}
                                                        createLabel={tabInfo.createLabel}
                                                        tableActions={tabInfo.tableActions}
                                                        styleActions={false}
                                                        defaultSort={tabInfo.defaultSort}
                                                    />
                                                </Tab>
                                            )}
                                        </Tabs>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                }
                <Modal centered size={'lg'} isOpen={showModal && (['createUser', 'verifyUser', 'updateUser'].indexOf(modalEvent) >= 0)}>
                    <ModalHeader toggle={toggle} className="p-3">{modalEvent === 'createUser' ? 'Create User' : modalEvent === 'verifyUser' ? 'Verify User' : 'Update User'}</ModalHeader>
                    <ModalBody className="pt-0 pb-0 pl-2 pr-2">
                        <LowCodeDataForm
                            readOnly={modalEvent === 'verifyUser' ? true : false}
                            formDesign={UserConfigForm.DATA_INPUT_FORM}
                            formData={modalData}
                            onSubmit={this.saveUser.bind(this)}
                        />
                        {modalEvent === 'verifyUser' &&
                            <div className='form-group has-feedback formio-component formio-component-button formio-component-submit text-center form-group mb-3'>
                                <button className='btn btn-primary btn-md text-center'
                                    onClick={() => this.saveUser(modalData)}>Verify</button>
                            </div>
                        }
                    </ModalBody>
                </Modal>
                <Modal centered size={'xl'} isOpen={showModal && (modalEvent === 'createRole' || modalEvent === 'updateRole')}>
                    <ModalHeader toggle={toggle} className="p-3">{modalEvent === 'createRole' ? 'Create Role' : 'Update Role'}</ModalHeader>
                    <ModalBody className="pt-0 pb-0 pl-2 pr-2">
                        <RoleConfig
                            accessResources={JSON.parse(JSON.stringify(accessResources))}
                            roleData={modalData}
                            roleNames={modalData ?
                                userManagement[1].tableData.map((roleInfo) => roleInfo.name !== modalData.name && roleInfo.status !== 'ARCHIVED' && roleInfo.name)
                                : userManagement[1].tableData.map((roleInfo) => roleInfo.status !== 'ARCHIVED' && roleInfo.name)}
                            onSubmit={this.saveRole.bind(this)}
                        />
                    </ModalBody>
                </Modal>
            </section>
        )
    }
}
export default UserMagement;
