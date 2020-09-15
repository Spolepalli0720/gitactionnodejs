
import React, { Component } from "react";
import { Row, Col, Table } from 'reactstrap';

import './RoleConfig.scss';
class RoleConfig extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: (props.roleData && props.roleData.name) || '',
            name_error: '',
            description: (props.roleData && props.roleData.description) || '',
            accessResources: props.accessResources || [],
            actionNames: [
                { label: 'View', key: 'view' },
                { label: 'Create', key: 'create' },
                { label: 'Edit', key: 'edit' },
                { label: 'Delete', key: 'delete' },
                { label: 'Export', key: 'export' },
                { label: 'Manage', key: 'manage' },
                { label: 'Publish', key: 'publish' },
                { label: 'Execute', key: 'execute' },
            ],
            menuItemsToggle: false,
            searchFilter: '',
            viewEnabled: false,
            templateRoles: {
                'Leadership': [
                    'L1-Home'
                ],
                'Business User': [
                    'L1-Home',
                    'L1-Dashboard',
                    'L1-UserTask',
                ],
                'Technical Support': [
                    'L1-Home',
                    'L1-UserTask',
                    'L1-Solutions',
                    'L1-Reports',

                    'L2-Solutions-Dashboard',
                    'L2-Solutions-UserTask',
                ],
                'Devops Engineer': [
                    'L1-Home',
                    'L1-UserTask',
                    'L1-Solutions',
                    'L1-Environments',

                    'L2-Solutions-Dashboard',
                    'L2-Solutions-UserTask',

                    'L2-Environment-Dashboard',
                ],
                'Solution Designer': [
                    'L1-Home',
                    'L1-UserTask',
                    'L1-Solutions',
                    'L1-Environments',
                    'L1-Reports',

                    'L2-Solutions-Dashboard',
                    'L2-Solutions-UserTask',
                    'L2-Solutions-Workflows',
                    'L2-Solutions-Rules',
                    'L2-Solutions-Functions',
                    'L2-Solutions-Models',
                    'L2-Solutions-Forms',
                    // 'L2-Solutions-Applications',
                    'L2-Solutions-Datasets',
                    'L2-Solutions-EndPoints',
                    'L2-Solutions-DataStores',
                    'L2-Solutions-Advisor',
                    'L2-Solutions-Monitor',
                    'L2-Solutions-Simulations',

                    'L2-Solutions-Workflows-Viewer',
                    'L2-Solutions-Workflows-Modeler',
                    'L2-Solutions-Rules-Viewer',
                    'L2-Solutions-Rules-Modeler',
                    'L2-Solutions-Forms-Viewer',
                    'L2-Solutions-Forms-Modeler',
                    // 'L2-Solutions-Applications-Viewer',
                    // 'L2-Solutions-Applications-Modeler',

                    'L2-Environment-Dashboard',
                ],
                'Enterprise Admin': [
                    // ALL
                ],
            }
        }
    }

    componentDidMount() {
        const { accessResources } = this.state;
        const permissions = (this.props.roleData && this.props.roleData.permissions) || [];
        // const parent = this;

        permissions.forEach(function (permissionItem) {
            let filteredResources = accessResources.filter(arrayItem => arrayItem.id === permissionItem.resource);
            filteredResources.forEach(function (resourceItem) {
                resourceItem.enabled = true;
                //{ resource: accessItem.id, action: actionKey, allowed: accessItem.actions[actionKey] }
                if (resourceItem.actions && resourceItem.actions[permissionItem.action] !== undefined) {
                    resourceItem.actions[permissionItem.action] = permissionItem.allowed || false;
                }
                resourceItem.all = true;
                Object.keys(resourceItem.actions).forEach(function (actionKey) {
                    if (!resourceItem.actions[actionKey]) {
                        resourceItem.all = false;
                    }
                });
            });
        });

        this.setState({ accessResources: accessResources });
    }

    formField = (type, required, label, name, value, error, onChange) => {
        return (
            <div className="form-group fill mb-0">
                <label className={"mb-0 pb-2" + (required ? ' field-required' : '')}>{label}</label>
                {['text', 'number', 'password', 'email'].indexOf(type) >= 0 &&
                    <input type="text" autoComplete="off" placeholder={label}
                        name={name} value={value}
                        className={`form-control`}
                        onChange={onChange}
                    />
                }
                {type === 'textarea' &&
                    <textarea type="text" autoComplete="off" placeholder={name}
                        name={name} value={value}
                        className={`form-control`}
                        onChange={onChange}
                    />
                }
                <div className="invalid-form-input">{error}</div>
            </div>
        );
    }

    handlePropsChange = (changeEvent) => {
        const { name, value } = changeEvent.target;
        let name_error = ''
        if (name === 'name' && value.trim() === '') {
            name_error = 'Name is required';
        } else if (name === 'name' && (this.props.roleNames || []).indexOf(value.trim()) >= 0) {
            name_error = 'Duplicate Name';
        }
        this.setState({ [name]: value, name_error: name_error });
    }

    handleAccessChange = (item, changeEvent) => {
        const { accessResources } = this.state;
        const { name, checked } = changeEvent.target;
        const parent = this;

        if ('menuItemsToggle' === name) {
            accessResources.forEach(function (arrayItem) {
                if (!arrayItem.disabled) {
                    arrayItem.enabled = checked;
                    if (!checked) {
                        arrayItem.all = checked;
                        Object.keys(arrayItem.actions).forEach(function (actionKey) {
                            arrayItem.actions[actionKey] = checked;
                        });
                    }
                }
            });
            parent.setState({ [name]: checked, accessResources: accessResources });
            return;
        }

        let accessItem = accessResources.filter(arrayItem => arrayItem.id === item.id)[0];
        let parentItem = undefined;
        if (accessItem.parentId) {
            parentItem = accessResources.filter(arrayItem => arrayItem.id === item.parentId)[0];
        }

        if ('enabled' === name && checked && parentItem && !parentItem.enabled) {
            this.checkParentItems(parentItem, accessResources);
        }


        if ('enabled' === name) {
            accessItem.enabled = checked;
            if (!checked) {
                if (accessItem.isGroup) {
                    this.unCheckChildItems(accessItem, accessResources);
                } else {
                    accessItem.all = checked;
                    Object.keys(accessItem.actions).forEach(function (actionKey) {
                        accessItem.actions[actionKey] = false;
                    });
                }
            }
            parent.setState({ accessResources: accessResources });
        } else if ('all' === name) {
            accessItem.all = checked;
            Object.keys(accessItem.actions).forEach(function (actionKey) {
                accessItem.actions[actionKey] = checked;
            });
            parent.setState({ accessResources: accessResources });
        } else {
            accessItem.actions[name] = checked;
            accessItem.all = checked;
            Object.keys(accessItem.actions).forEach(function (actionKey) {
                if (!accessItem.actions[actionKey]) {
                    accessItem.all = false;
                }
            });
            parent.setState({ accessResources: accessResources });
        }
    }

    checkParentItems(parentItem, accessResources) {
        parentItem.enabled = true;
        if (parentItem.actions && parentItem.actions.view !== undefined) {
            parentItem.actions.view = true;
        }

        if (parentItem.parentId) {
            this.checkParentItems(accessResources.filter(arrayItem => arrayItem.id === parentItem.parentId)[0], accessResources);
        }
    }

    unCheckChildItems(accessItem, accessResources) {
        const parent = this;
        accessItem.enabled = false;
        accessItem.all = false;
        Object.keys(accessItem.actions).forEach(function (actionKey) {
            accessItem.actions[actionKey] = false;
        });
        let childItems = accessResources.filter(arrayItem => arrayItem.parentId === accessItem.id);
        childItems.forEach(function (arrayItem) {
            parent.unCheckChildItems(arrayItem, accessResources);
        });
    }

    applyTemplateRoles(roleKey) {
        const { templateRoles, accessResources } = this.state;
        if (roleKey === 'Enterprise Admin') {
            accessResources.forEach(function (accessItem) {
                accessItem.enabled = true;
                accessItem.all = true;
                Object.keys(accessItem.actions).forEach(function (actionKey) {
                    accessItem.actions[actionKey] = true;
                });
            });
        } else {
            let definedRoles = templateRoles[roleKey] || [];
            definedRoles.forEach(function (roleId) {
                let roleItems = accessResources.filter(arrayItem => arrayItem.id === roleId);
                roleItems.forEach(function (accessItem) {
                    accessItem.enabled = true;
                    accessItem.all = true;
                    Object.keys(accessItem.actions).forEach(function (actionKey) {
                        accessItem.actions[actionKey] = true;
                    });
                });
            })
        }
        this.setState({ accessResources: accessResources });
    }

    saveRole = () => {
        const { name, description, accessResources } = this.state;
        const roleData = this.props.roleData || {};
        roleData.name = name.trim();
        roleData.description = description.trim();
        roleData.permissions = [];
        accessResources.forEach(function (accessItem) {
            if (accessItem.enabled) {
                if (accessItem.actions) {
                    Object.keys(accessItem.actions).forEach(function (actionKey) {
                        if (accessItem.actions[actionKey]) {
                            roleData.permissions.push(
                                { resource: accessItem.id, action: actionKey, allowed: accessItem.actions[actionKey] }
                            );
                        }
                    });
                }

                if (roleData.permissions.filter(arrayItem => arrayItem.resource === accessItem.id).length === 0) {
                    roleData.permissions.push(
                        { resource: accessItem.id }
                    );
                }
            }
        });

        this.props.onSubmit(roleData);
    }

    toggleItemGroupCollapse = (toggleItem) => {
        const { accessResources } = this.state;

        let accessItem = accessResources.filter(arrayItem => arrayItem.id === toggleItem.id)[0];
        accessItem.collapsed = !accessItem.collapsed;
        if(!accessItem.collapsed) {
            let childItems = accessResources.filter(arrayItem => arrayItem.parentId === accessItem.id);
            childItems.forEach(function (arrayItem) {
                arrayItem.hidden = false;
            });
        } else {
            this.hideChildItems(accessItem.id, accessResources)
        }

        this.setState({ accessResources: accessResources });
    }

    hideChildItems(parentId, accessResources) {
        const parent = this;
        let childItems = accessResources.filter(arrayItem => arrayItem.parentId === parentId);
        childItems.forEach(function (arrayItem) {
            arrayItem.hidden = true;
            if(arrayItem.isGroup) {
                arrayItem.collapsed = true;
                parent.hideChildItems(arrayItem.id, accessResources);
            }
        });
    }

    render() {
        const { templateRoles, accessResources, actionNames, searchFilter, viewEnabled } = this.state;

        return (
            <section className="studio-container">
                <Row xs="1" md="2">
                    <Col className="pl-0 pr-2 pt-0 pb-0">{this.formField('text', true, 'Name', 'name', this.state.name, this.state.name_error, this.handlePropsChange.bind(this))}</Col>
                    <Col className="pl-2 pr-0 pt-0 pb-0">{this.formField('text', false, 'Description', 'description', this.state.description, '', this.handlePropsChange.bind(this))}</Col>
                </Row>
                <Row xs="1" md="1">
                    <Col className="p-0 pt-1 text-center"><label className="feather text-muted" title="Copy from Role Templates">Role Template:</label>
                        {Object.keys(templateRoles).map((roleKey, roleIndex) =>
                            <i key={roleIndex} className="p-0 ml-2 feather icon-copy btn" title={roleKey + ' roles'}
                            onClick={() => { this.applyTemplateRoles(roleKey) }} > {roleKey}</i>
                        )}
                    </Col>
                </Row>
                <Row xs="1" md="1" className="pt-2">
                    <Col className="p-0 rule-config-table-col">
                        <Table responsive striped bordered hover className="mb-0">
                            <thead className="hidden">
                                <tr>
                                    <th colSpan={2} className="p-2 text-left align-middle">
                                        <input className="content-search" name="searchFilter" type="text"
                                            placeholder="Search" onChange={(e) => { this.setState({ searchFilter: e.target.value }) }}
                                        />
                                    </th>
                                    <th colSpan={9} className="p-2 text-center align-middle">Actions</th>
                                </tr>
                                <tr>
                                    <th width='1%' className="p-2 text-center">
                                        <input type="checkbox" name="menuItemsToggle"
                                            checked={this.state.menuItemsToggle} className='role-access-checkbox'
                                            onChange={this.handleAccessChange.bind(this, undefined)} />
                                    </th>
                                    <th className="p-2 align-middle"><label className="p-0 mb-0">Menu Item</label>
                                        <button className={'btn transparent p-0 pt-1 pull-right feather icon-eye' + (viewEnabled === false ? '' : '-off')}
                                            title={(viewEnabled === false ? 'Show Enabled Menu Items Only' : 'Show All Menu Items')}
                                            onClick={() => { this.setState({ viewEnabled: !viewEnabled }) }} />
                                    </th>
                                    <th width='7%' className="p-2 text-center align-middle">ALL</th>
                                    {actionNames.map((action, actionIndex) =>
                                        <th key={actionIndex} width='7%' className="p-2 text-center align-middle">{action.label}</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {accessResources.map((item, itemIndex) => (viewEnabled === false ? true : item.enabled ) 
                                    && (searchFilter && searchFilter.length > 0 ? item.title.search(new RegExp(searchFilter, "i")) >= 0 : true) &&
                                    <tr key={itemIndex} className={item.hidden ? "rule-config-table-row-hidden" : ""}>
                                        <td width='1%' className="p-2 text-center">
                                            <input type="checkbox" name="enabled" disabled={item.disabled}
                                                checked={item.enabled} className='role-access-checkbox'
                                                onChange={this.handleAccessChange.bind(this, item)} />
                                        </td>
                                        <td className={"p-1 " + item.className}>
                                            {item.icon &&
                                                <i className={'role-access-icon ' + item.icon} />
                                            }
                                            <label className={"role-access-label" + (item.icon ? '' : ' pt-1')} title={item.tooltip}>{item.title}</label>
                                            {item.isGroup && 
                                                <i className={"pull-right pt-1 pl-2 mt-1 feather fa-1x icon-chevrons-" + (item.collapsed ? "down" : "up")}
                                                    onClick={() => this.toggleItemGroupCollapse(item)}
                                                />
                                            }
                                            {item.isGroup && item.collapsed && 
                                                <label className="pull-right badge-secondary badge-pill p-0 pl-2 pr-2 mt-1 mb-0 text-center">{item.childCount}</label>
                                            }
                                        </td>
                                        <td width='7%' className="p-2 text-center">
                                            {item.actions && Object.keys(item.actions).length > 1 &&
                                                <input type="checkbox" name="all" disabled={!item.enabled}
                                                    title='All'
                                                    checked={item.all} className='role-access-checkbox'
                                                    onChange={this.handleAccessChange.bind(this, item)} />
                                            }
                                        </td>
                                        {actionNames.map((action, actionIndex) =>
                                            <td key={actionIndex} width='7%' className="p-2 text-center">
                                                {item.actions && item.actions[action.key] !== undefined &&
                                                    <input type="checkbox" name={action.key} disabled={!item.enabled}
                                                        title={action.key.replace(/(^\w|\s\w)/g, m => m.toUpperCase())}
                                                        checked={item.actions[action.key]} className='role-access-checkbox'
                                                        onChange={this.handleAccessChange.bind(this, item)} />
                                                }
                                            </td>
                                        )}
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Col>
                    <Col>
                        <div className='form-group has-feedback formio-component formio-component-button formio-component-submit text-center form-group mt-3 mb-1'>
                            <button className='btn btn-primary btn-md text-center'
                                disabled={(this.state.name === '' || this.state.name_error !== '') ? true : false}
                                onClick={() => this.saveRole()}>Save</button>
                        </div>
                    </Col>
                </Row>
            </section>
        )
    }
}
export default RoleConfig;