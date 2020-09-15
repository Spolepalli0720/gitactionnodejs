import React, { Component } from "react";
import { Table, Row, Col, Card, CardBody, CardHeader, CardFooter, Modal, ModalHeader, ModalBody } from 'reactstrap';
import Timestamp from "react-timestamp";

import Tooltip from '../../utils/Tooltip';
import StudioFilter from '../../utils/StudioFilter';
// import StudioTable from '../../utils/StudioTable';
import StudioAudit from '../../utils/StudioAudit';
import LowCodeDataForm from "../../modeler/LowCodeDataForm";
import ApplicationConfigForm from "./ApplicationConfigForm";

import { actionButton, ACTION_BUTTON } from "../../utils/StudioUtils";
import { confirmAction, confirmDelete } from "../../utils/StudioUtils";
import { notify, notifySuccess, notifyError } from '../../utils/Notifications';
import { applicationService } from "../../services/ApplicationService";
import { userService, USER_ACTIONS } from "../../services/UserService";
import { BasicSpinner } from "../../utils/BasicSpinner";

import "./Forms.scss";
class Forms extends Component {
    constructor(props) {
        super(props);

        this.state = {
            renderLayout: 0,
            loading: true,
            forms: [],
            filteredData: [],
            mode: '',
            showModal: false,
            menuClicks: []
        };
    }

    componentDidMount() {
        const { solutionId } = this.props.match.params;
        applicationService.getForms(solutionId).then(response => {
            let forms = response.filter(form => form.status !== 'ARCHIVED').sort((a, b) => a.status.localeCompare(b.status));
            this.setState({ loading: false, forms: forms });
        }).catch(error => {
            console.error('applicationService.getForms:', error);
            notifyError('Unable to retrieve forms', error.message);
            this.setState({ loading: false, forms: [] });
        });
    }

    onChangeFilter(filteredData) {
        this.setState({ filteredData: filteredData })
    }

    loadFormViewer(formId) {
        const { solutionId } = this.props.match.params;

        this.props.history.push(`/solutions/${solutionId}/forms/${formId}`);
    }

    loadFormEditor(formId) {
        const { solutionId } = this.props.match.params;

        setTimeout(() => {
            this.props.history.push(`/solutions/${solutionId}/forms/${formId}/editor`);
        }, 1000);
    }

    createForm() {
        this.setState({
            mode: 'new',
            formConfig: undefined,
            showModal: true,
        });
    }

    editForm(formId) {
        const { forms } = this.state;

        let form = forms.filter(form => form.id === formId)[0];
        let formConfig = {
            name: form.name || '',
            description: form.description || '',
            type: form.type || '',
        }
        this.setState({
            formId: formId,
            formConfig: formConfig,
            mode: 'edit',
            showModal: true,
        });
    }

    saveForm(formConfig) {
        const { solutionId } = this.props.match.params;
        const { forms, mode, formId } = this.state;
        const parent = this;

        if (mode === 'new') {
            applicationService.createForm(solutionId, 'studio', formConfig.name.trim(), formConfig.description.trim(), formConfig.type).then(form => {
                parent.setState({ showModal: false });
                notifySuccess('Create Form', 'Form has been successfully created');
                parent.loadFormEditor(form.id);
            }).catch(error => {
                parent.setState({ formConfig: formConfig, showModal: true });
                console.error('applicationService.createForm:', error);
                notifyError('Unable to create form', error.message);
            });
        } else if (mode === 'edit') {
            let form = forms.filter(form => form.id === formId)[0];
            form.name = formConfig.name.trim();
            form.description = formConfig.description.trim();
            form.type = formConfig.type;
            applicationService.updateForm(form).then(form => {
                parent.setState({ forms: forms, showModal: false });
            }).catch(error => {
                parent.setState({ formConfig: formConfig, showModal: true });
                console.error('applicationService.updateForm:', error);
                notifyError('Unable to update form', error.message);
            });
        }
    }

    viewHistory(form) {
        applicationService.getFormHistory(form.id).then(response => {
            if (response.length > 0) {
                this.setState({
                    mode: 'history',
                    formHistory: { name: form.name, data: response },
                    showModal: true,
                });
            } else {
                notify('Form History', 'Form History is not avaialble');
            }
        }).catch(error => {
            console.error('applicationService.getFormHistory:', error);
            notifyError('Unable to retrieve form history', error.message);
        });
    }

    activateForm(formId) {
        const { forms } = this.state;
        const parent = this;
        confirmAction('Activate Form').then(function (userInput) {
            // let actionComment = userInput.value;
            if (!userInput.dismiss) {
                applicationService.activateForm(formId).then(response => {
                    notifySuccess('Activate Form', 'Form has been successfully activated');
                    let form = forms.filter(form => form.id === formId)[0];
                    form.status = response.status;
                    form.version = response.version;
                    parent.setState({ forms: forms });
                }).catch(error => {
                    console.error('applicationService.activateForm:', error);
                    notifyError('Unable to activate form', error.message);
                });
            }
        });
    }

    deactivateForm(formId) {
        const { forms } = this.state;
        const parent = this;
        confirmAction('Deactivate Form').then(function (userInput) {
            if (!userInput.dismiss) {
                // let actionComment = userInput.value;
                applicationService.deactivateForm(formId).then(response => {
                    notifySuccess('Deactivate Form', 'Form has been successfully deactivated');
                    let form = forms.filter(form => form.id === formId)[0];
                    form.status = response.status;
                    form.version = response.version;
                    parent.setState({ forms: forms });
                }).catch(error => {
                    console.error('applicationService.deactivateForm:', error);
                    notifyError('Unable to deactivate form', error.message);
                });
            }
        });
    }

    exportForm(form) {
        var encodedData = encodeURIComponent(JSON.stringify(form));
        const newAnchorTag = document.createElement('a');
        const filename = form.id + ".json";
        newAnchorTag.setAttribute('href', 'data:application/json;charset=UTF-8,' + encodedData);
        newAnchorTag.setAttribute('download', filename);
        newAnchorTag.dataset.downloadurl = ['application/json', newAnchorTag.download, newAnchorTag.href].join(':');
        notify('Export Form', 'Form details published for download');
        newAnchorTag.click();
    }

    deleteForm(formId) {
        const { forms } = this.state;
        const parent = this;

        confirmDelete().then(function (userInput) {
            if (!userInput.dismiss) {
                // let actionComment = userInput.value;
                applicationService.deleteForm(formId).then(response => {
                    notifySuccess('Delete Form', 'Form has been permanently removed');
                    let form = forms.filter(form => form.id === formId)[0];
                    form.status = "ARCHIVED";
                    parent.setState({ forms: forms });
                }).catch(error => {
                    console.error('applicationService.deleteForm:', error);
                    notifyError('Unable to delete form', error.message);
                });
            }
        });
    }

    isMenuOpen(formId) {
        const { menuClicks } = this.state;
        if (menuClicks.indexOf(formId) >= 0) {
            return true;
        } else {
            return false;
        }
    }

    handleMenuClick(formId) {
        const { menuClicks } = this.state;
        if (menuClicks.indexOf(formId) >= 0) {
            menuClicks.splice(menuClicks.indexOf(formId), 1);
        } else {
            menuClicks.push(formId);
        }
        this.setState({ menuClicks: menuClicks });
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
        const { loading, forms, filteredData, renderLayout, showModal, formConfig, formHistory } = this.state;
        const toggle = () => this.setState({ showModal: false });

        let searchKeys = ['name', 'description']
        let filterKeys = [
            { label: 'Type', key: 'type' },
            { label: 'Status', key: 'status' },
            { label: 'Version', key: 'version' },
            { label: 'Created By', key: 'createdBy' },
            { label: 'Modified By', key: 'modifiedBy' }
        ];
        // let defaultFilter = [
        //     { key: 'createdBy', values: [ userService.getLoginName() ] }
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
                                    actionButton('Create', this.createForm.bind(this),
                                        'ml-1 content-float-right', 'feather icon-plus', true, false, ACTION_BUTTON.PRIMARY)
                                }
                                <StudioFilter
                                    searchKeys={searchKeys}
                                    filterKeys={filterKeys}
                                    data={forms.filter(form => form.status !== 'ARCHIVED')}
                                    // defaultFilter={defaultFilter}
                                    onChangeFilter={this.onChangeFilter.bind(this)} />
                                {renderLayout === 0 &&
                                    actionButton('List View', () => { this.setState({ renderLayout: 1 }) }, 'm-0 mt-1 content-float-right', 'feather icon-list')
                                }
                                {renderLayout === 1 &&
                                    actionButton('Grid View', () => { this.setState({ renderLayout: 0 }) }, 'm-0 mt-1 content-float-right', 'feather icon-grid')
                                }
                                <h3 className="pt-1">{'Forms' +
                                    (forms.filter(form => form.status !== 'ARCHIVED').length > 0 ?
                                        ` (${forms.filter(form => form.status !== 'ARCHIVED').length})` : '')}</h3>
                            </Col>
                        </Row>
                        {renderLayout === 0 && <Row xs="1" md="3">
                            {filteredData.map((form, formIndex) =>
                                <Col className="cards-container" key={formIndex + 1}>
                                    <Card className="studio-card mb-1">
                                        <CardHeader className="p-0">
                                            <Row xs="1" md="1" className='mt-2 mb-1'>
                                                <Col className="text-left pt-0 pb-0">
                                                    {form.status === 'ACTIVE' && userService.hasPermission(this.props.studioRouter, USER_ACTIONS.MANAGE) &&
                                                        actionButton('Deactivate Form', this.deactivateForm.bind(this, form.id),
                                                            'ml-1 content-float-right', 'studio-secondary feather icon-pause-circle fa-2x')
                                                    }
                                                    {form.status === 'DISABLED' && userService.hasPermission(this.props.studioRouter, USER_ACTIONS.MANAGE) &&
                                                        actionButton('Activate Form', this.activateForm.bind(this, form.id),
                                                            'ml-1 content-float-right', 'studio-primary feather icon-check-circle fa-2x')
                                                    }
                                                    <Tooltip title='Version'>
                                                        <label className="p-0 mt-0 ml-2 mb-0 badge badge-light form-info-badge content-float-right">v{form.version}</label>
                                                    </Tooltip>
                                                    <h5 className="mt-1 mr-0 form-name">{form.name}</h5>
                                                </Col>
                                                <Col className="text-left pt-0 pb-0 badge-status-ellipsis">
                                                    <h5 className="mt-0 mr-0">
                                                        <span className="badge badge-light-secondary pl-0 mr-0">
                                                            <label className={"mr-1 badge " + this.getBadgeType(form.status || '') + " mb-0"}
                                                                title={'Created by ' + form.createdBy}>
                                                                {form.status || ''}
                                                            </label>
                                                            <Timestamp relative date={form.modifiedAt || form.createdAt} /> by {form.modifiedBy}
                                                        </span>
                                                    </h5>
                                                </Col>
                                                <Col className="text-center pt-0 pb-0">
                                                    {userService.hasPermission(this.props.studioRouter, USER_ACTIONS.EXPORT) &&
                                                        actionButton('Export', this.exportForm.bind(this, form),
                                                            'mt-1 ml-2 mr-2', 'feather icon-download', true)
                                                    }
                                                    {['ACTIVE'].indexOf(form.status) < 0 &&
                                                        userService.hasPermission(this.props.studioRouter, USER_ACTIONS.DELETE) &&
                                                        actionButton('Delete', this.deleteForm.bind(this, form.id),
                                                            'mt-1 ml-2 mr-2', 'feather icon-trash-2', true)
                                                    }
                                                    {userService.hasPermission(this.props.studioRouter, USER_ACTIONS.EDIT) &&
                                                        actionButton('Configure', this.editForm.bind(this, form.id),
                                                            'mt-1 ml-2 mr-2', 'feather icon-edit', true)
                                                    }
                                                    {userService.hasPermission(this.props.studioRouter, USER_ACTIONS.VIEW) &&
                                                        actionButton('History', this.viewHistory.bind(this, form),
                                                            'mt-1 ml-2 mr-2', 'fa fa-history', true)
                                                    }
                                                </Col>
                                            </Row>
                                        </CardHeader>
                                        <CardBody className="p-1">
                                            <Row xs="1" md="1">
                                                <Col className='p-1'>
                                                    <p className="content-description text-justify mb-0 pt-1 pb-1 pl-1 pr-3">{form.description}</p>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                        <CardFooter className="p-0">
                                            <Row xs="1" md="1" className='mb-1'>
                                                <Col>
                                                    {userService.hasPermission(this.props.studioRouter, USER_ACTIONS.EXPLORE_FORM_MODELER) &&
                                                        actionButton('Define Form', this.loadFormEditor.bind(this, form.id),
                                                            'mt-2 ml-2 mr-2 content-float-right', 'fab fa-wpforms')
                                                    }
                                                    {userService.hasPermission(this.props.studioRouter, USER_ACTIONS.EXPLORE_RULE_VIEWER) &&
                                                        actionButton('View Form', this.loadFormViewer.bind(this, form.id),
                                                            'mt-2 ml-2 content-float-right', 'far fa-eye')
                                                    }
                                                </Col>
                                            </Row>
                                        </CardFooter>
                                    </Card>
                                </Col>
                            )}
                        </Row>}
                        {renderLayout === 1 && <Row xs="1" md="1">
                            <Col className="cards-container">
                                <Card className="studio-card">
                                    <CardBody className="p-1">
                                        <Table responsive striped bordered hover className="mb-0" >
                                            <thead>
                                                <tr>
                                                    <th width="25%">Name</th>
                                                    <th width="45%">Description</th>
                                                    <th width="15%">Type</th>
                                                    <th width="10%" className="text-center">Status</th>
                                                    <th width="5%" className="text-center">Version</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredData.map((form, formIndex) =>
                                                    <tr key={formIndex + 1}>
                                                        <td width="25%" className="content-wrapped text-justify">{form.name}</td>
                                                        <td width="45%" className="content-wrapped text-justify">{form.description}</td>
                                                        <td width="15%" className="content-wrapped">{form.type}</td>
                                                        <td width="10%" className="text-center">{form.status}</td>
                                                        <td width="5%" className="text-center">{form.version}</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>}
                    </div>
                }
                <Modal centered size={'lg'} isOpen={showModal && this.state.mode !== 'history'}>
                    <ModalHeader toggle={toggle} className="p-3">{this.state.mode === 'new' ? 'Create Form' : 'Update Form'}</ModalHeader>
                    <ModalBody className="pt-0 pb-0 pl-2 pr-2">
                        <LowCodeDataForm
                            formDesign={this.state.mode === 'new' ? ApplicationConfigForm.FORM_CONFIG : ApplicationConfigForm.FORM_EDIT_CONFIG}
                            formData={formConfig}
                            onSubmit={this.saveForm.bind(this)}
                        />
                    </ModalBody>
                </Modal>
                <Modal scrollable centered size={'lg'} isOpen={showModal && this.state.mode === 'history'}>
                    <ModalHeader toggle={toggle} className="p-3">{`Version History ${formHistory ? ('- ' + formHistory.name) : ''}`}</ModalHeader>
                    <ModalBody className="pt-0 pb-0 pl-2 pr-2">
                        {/* <StudioTable customClass="p-0" hideTableName={true}
                            tableHeader={historyGridHeader}
                            tableData={formHistory ? formHistory.data : []}
                            defaultSort={{ sortIndex: 0, sortOrder: 1 }}
                        /> */}
                        <StudioAudit data={formHistory ? formHistory.data : []} />
                    </ModalBody>
                </Modal>
            </section>
        )
    }
}
export default Forms;