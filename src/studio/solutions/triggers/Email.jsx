import React from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Card, CardBody, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Tabs, Tab } from 'react-bootstrap';

import StudioTable from '../../utils/StudioTable';
import { BasicSpinner } from "../../utils/BasicSpinner";
import { notifySuccess, notifyError } from '../../utils/Notifications';
import { triggerService } from '../../services/TriggerService';
import triggerConfigData from './TriggerConfigData';
import { actionButton, ACTION_BUTTON } from "../../utils/StudioUtils";
import { workflowService } from "../../services/WorkflowService";
import { inputField } from '../../utils/StudioUtils';



class Email extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataLoading: true,
            showModal: false,
            workflowLoading: true,
            modalActions: '',
            emailConfigTableData: [],
            emailCofigTabFields: {},
            workflows: [],
            error: {
                testConfiguration: true,
                pullSchedule: true,
                proceedToSchedule: true,
                processSchedule: true
            },
            modalTabActiveKey: 'emailConfig'
        }
    }

    componentDidMount() {
        const initialEmailConfigTabFields = this.getEmailConfigFields();
        const { solutionId } = this.props.match.params;
        let workflows = [];
        workflowService.getWorkflows(solutionId).then(response => {
            workflows = response.filter(workflow => workflow.status === 'ACTIVE').sort((a, b) => a.name.localeCompare(b.name));
            workflows = workflows.map((workflow) => ({ value: workflow.processId, label: workflow.name }));
            workflows.unshift({ label: '', value: '' });
            this.setState({ workflowLoading: false, workflows: workflows, emailCofigTabFields: initialEmailConfigTabFields });
        }).catch(error => {
            workflows.unshift({ label: '', value: '' });
            this.setState({ emailCofigTabFields: initialEmailConfigTabFields, workflowLoading: false, workflows: workflows });
            console.error('workflowService.getWorkflows:', error);
            notifyError('Unable to retrieve workflows', error.message);
        });

        triggerService.getTriggerStatus('email').then(response => {
            response.forEach((resObj) => {
                if (resObj.schedule.time.length > 0) {
                    let timeArr = resObj.schedule.time.map((time) => {
                        return { time: time.substr(0, 5), zone: time.substr(5) }
                    })
                    resObj.schedule.time = timeArr;
                } else {
                    resObj.schedule.time.push({ time: "", zone: "" });
                }
                if (!resObj.schedule.interval) {
                    resObj.schedule.interval = [{ "every": "hours", "hours": "", "min": "" }]
                }
                this.addScheduleValue(resObj);

            })
            this.setState({ dataLoading: false, emailConfigTableData: response })
        }).catch(error => {
            this.setState({ dataLoading: false, emailConfigTableData: [] });
            console.error('triggerService.getTriggerStatus:', error);
            notifyError('Unable to retrieve trigger status', error.message);
        });

    }

    getEmailConfigFields = () => {
        const { solutionId } = this.props.match.params;
        let emailConfigForm = JSON.parse(JSON.stringify(triggerConfigData.EMAIL_CONFIG_FORM));
        emailConfigForm["solutionId"] = solutionId;
        return emailConfigForm;
    }


    changeTableInputAction = (configObj, propName, propValue) => {
        const { emailConfigTableData } = this.state;
        if (propName === 'isPullEnabled' && propValue === false) {
            triggerService.pauseJobs(configObj.id, 'email').then(response => {
                configObj.isPullEnabled = propValue
                notifySuccess('Jobs Paused', 'Service Paused successfully');
                this.setState({ emailConfigTableData: emailConfigTableData });
            }).catch(error => {
                console.error('triggerService.pauseJobs:', error);
                notifyError('Unable to pause the service', error.message);
            });
        } else if (propName === 'isPullEnabled' && propValue === true) {
            triggerService.resumeJobs(configObj.id, 'email').then(response => {
                configObj.isPullEnabled = propValue
                notifySuccess('Jobs resumed', 'Service resumed successfully');
                this.setState({ emailConfigTableData: emailConfigTableData });
            }).catch(error => {
                console.error('triggerService.resumeJobs:', error);
                notifyError('Unable to resume the service', error.message);
            });
        } else if (propName === "isWorkFlowEnabled" && propValue === false) {
            triggerService.pauseTrigger(configObj.id, 'email').then(response => {
                configObj.isWorkFlowEnabled = propValue
                notifySuccess('Trigger Service Paused', 'Trigger service paused successfully');
                this.setState({ emailConfigTableData: emailConfigTableData });
            }).catch(error => {
                console.error('triggerService.pauseTrigger:', error);
                notifyError('Unable to pause the trigger service', error.message);
            });
        } else if (propName === "isWorkFlowEnabled" && propValue === true) {
            triggerService.resumeTrigger(configObj.id, 'email').then(response => {
                configObj.isWorkFlowEnabled = propValue
                notifySuccess('Trigger Service resumed', 'Trigger service resumed successfully');
                this.setState({ emailConfigTableData: emailConfigTableData });
            }).catch(error => {
                console.error('triggerService.resumeTrigger:', error);
                notifyError('Unable to resume the trigger service', error.message);
            });
        }
    }


    configureEmailSource = () => {
        this.setState({ showModal: true, modalActions: 'configureEmail' })
    }

    onChangeInput = (propName, propValue) => {
        const { emailCofigTabFields } = this.state;
        let error;
        let propPath = propName.split('.');
        if (propPath.length > 2) {
            if (propPath.length === 4) {
                ((emailCofigTabFields[propPath[0]])[propPath[1]][propPath[2]])[propPath[3]] = propValue;
                error = this.checkValidation(emailCofigTabFields);
            } else {
                ((emailCofigTabFields[propPath[0]])[propPath[1]][propPath[2]]) = propValue;
                error = this.checkValidation(emailCofigTabFields);
            }
            this.setState({ emailCofigTabFields: emailCofigTabFields, error: error });

        } else if (propPath.length === 2) {
            (emailCofigTabFields[propPath[0]])[propPath[1]] = propValue;
            error = this.checkValidation(emailCofigTabFields);
            this.setState({ emailCofigTabFields: emailCofigTabFields, error: error });
        } else {
            emailCofigTabFields[propName] = propValue;
            error = this.checkValidation(emailCofigTabFields);
            this.setState({ emailCofigTabFields: emailCofigTabFields, error: error })
        }
    }

    checkValidation = (emailCofigTabFields) => {
        let error = { testConfiguration: false, proceedToSchedule: false, pullSchedule: false, processSchedule: false };
        if (emailCofigTabFields.configutation.userName === '' || emailCofigTabFields.configutation.password === '' || emailCofigTabFields.configutation.hostName === '' || emailCofigTabFields.configutation.portName === 0) {
            error.testConfiguration = true;
        }

        if (emailCofigTabFields.processId === '') {
            error.proceedToSchedule = true;
        }

        if (emailCofigTabFields.schedule.type === 'daily') {
            emailCofigTabFields.schedule.time.forEach((inputField) => {
                Object.keys(inputField).forEach((field) => {
                    if (inputField[field] === '') {
                        error.pullSchedule = true;
                    }
                })
            })

        } else {
            emailCofigTabFields.schedule.interval.forEach((inputField) => {
                Object.keys(inputField).forEach((field) => {
                    if (inputField[field] === '' || inputField[field] === 0) {
                        error.processSchedule = true;
                    }
                })
            })

        }
        return error;
    }

    addScheduleFields = (scheduleArr, index, type) => {
        const { emailCofigTabFields } = this.state;
        let valid = true;
        Object.keys(scheduleArr[index]).forEach((scheduleField) => {
            if (scheduleArr[index][scheduleField] === '' || scheduleArr[index][scheduleField] === 0) {
                valid = false;
            }
        })
        if (valid) {
            type === 'daily' ? scheduleArr.push({ time: '', zone: '' }) : scheduleArr.push({ every: 'hours', hours: '', min: '' });
            let error = this.checkValidation(emailCofigTabFields);
            this.setState({ emailCofigTabFields: emailCofigTabFields, error: error });
        }

    }

    removeScheduleFields = (scheduleArr, index) => {
        const { emailCofigTabFields } = this.state;
        scheduleArr.splice(index, 1);
        let error = this.checkValidation(emailCofigTabFields);
        this.setState({ emailCofigTabFields: emailCofigTabFields, error: error })
    }

    editEmailSource = (configObj) => {
        this.setState({ emailCofigTabFields: configObj, modalActions: 'edit', showModal: true, error: { testConfiguration: false, proceedToSchedule: false, pullSchedule: false, processSchedule: false } });
    }

    renderEmailScheduleForm = () => {
        const { emailCofigTabFields, error } = this.state;
        let processScheduleArr = emailCofigTabFields.schedule?.interval;
        return (
            <React.Fragment>
                <Row xs="1" md="3" className="mt-4 mb-1">
                    <Col className="pl-4">
                        <h5>{emailCofigTabFields.schedule?.type === 'daily' ? 'Pull Schedule' : 'Process Schedule'}</h5>
                    </Col>
                    <Col>
                        {inputField('radio', 'schedule.type', 'Daily', 'daily', this.onChangeInput, { input: 'ml-2', label: 'w-auto', checked: emailCofigTabFields.schedule?.type === 'daily' ? true : false })}
                    </Col>
                    <Col>
                        {inputField('radio', 'schedule.type', 'Set Interval', 'interval', this.onChangeInput, { input: 'ml-2', label: 'w-auto', checked: emailCofigTabFields.schedule?.type === 'daily' ? false : true })}
                    </Col>
                </Row>
                {emailCofigTabFields.schedule?.type === 'daily' &&
                    emailCofigTabFields.schedule.time.map((arrItem, index) => {
                        return (
                            <Row xs="1" md="3" key={index}>
                                <Col className="pl-4">
                                    {inputField('time', `schedule.time.${index}.time`, `${index === 0 ? 'Time' : ''}`, arrItem.time, this.onChangeInput, { label: 'component-stretched', input: 'component-stretched' })}
                                </Col>
                                <Col className="pr-2">
                                    {inputField('select', `schedule.time.${index}.zone`, `${index === 0 ? 'Zone' : ''}`, arrItem.zone === ' Z' ? " +00:00" : arrItem.zone, this.onChangeInput, { label: 'component-stretched', input: 'component-stretched' }, triggerConfigData.SCHEDULE_ZONE_ARR)}
                                </Col>
                                <Col className={index === 0 ? 'mt-4 pl-0' : 'mt-1 pl-0'}>
                                    {emailCofigTabFields.schedule.time.length > 1 &&
                                        <i className="fa fa-times text-danger enable-icon mr-2" onClick={() => this.removeScheduleFields(emailCofigTabFields.schedule.time, index)} />}

                                    {emailCofigTabFields.schedule.time.length - 1 === index &&
                                        <i className={`fa fa-plus studio-primary ${emailCofigTabFields.schedule.time[index].time !== '' && emailCofigTabFields.schedule.time[index].zone !== '' ? 'enable-icon' : 'disable-icon'}`} onClick={() => this.addScheduleFields(emailCofigTabFields.schedule.time, index, emailCofigTabFields.schedule?.type)} />}
                                </Col>
                            </Row>

                        )
                    })
                }
                {emailCofigTabFields.schedule?.type !== 'daily' &&
                    emailCofigTabFields.schedule?.interval.map((arrItem, index) => {
                        return (
                            <Row xs="1" md="4" key={index}>
                                <Col className="pl-4">
                                    {inputField('select', `schedule.interval.${index}.every`, `${index === 0 ? 'Every' : ''}`, arrItem.every, this.onChangeInput, { label: 'component-stretched', input: 'component-stretched' }, triggerConfigData.SCHEDULE_HOUR_ARR)}
                                </Col>
                                <Col className="pr-2">
                                    {inputField('number', `schedule.interval.${index}.hours`, `${index === 0 ? 'No Of Hours' : ''}`, arrItem.hours || 0, this.onChangeInput, { label: 'component-stretched', input: 'component-stretched' })}
                                </Col>
                                <Col className="pr-2">
                                    {inputField('number', `schedule.interval.${index}.min`, `${index === 0 ? 'Minutes' : ''}`, arrItem.min || 0, this.onChangeInput, { label: 'component-stretched', input: 'component-stretched' })}
                                </Col>
                                <Col className={index === 0 ? 'mt-4 pl-0' : 'mt-1 pl-0'}>
                                    {emailCofigTabFields.schedule.interval.length > 1 &&
                                        <i className="fa fa-times text-danger enable-icon mr-2" onClick={() => this.removeScheduleFields(emailCofigTabFields.schedule.interval, index)} />}

                                    {emailCofigTabFields.schedule.interval.length - 1 === index &&
                                        <i className={`fa fa-plus studio-primary ${(processScheduleArr[index]['every'] !== '' && processScheduleArr[index]['hours'] && processScheduleArr[index]['min']) ? 'enable-icon' : 'disable-icon'}`} onClick={() => this.addScheduleFields(emailCofigTabFields.schedule.interval, index, emailCofigTabFields.schedule?.type)} />}
                                </Col>
                            </Row>

                        )
                    })
                }
                <Row xs="1" md="1" className="mb-3 mt-2">
                    <Col className="pl-0 pr-4 text-right">
                        {actionButton('Cancel', this.resetConfig.bind(this),
                            'ml-2', '', true, false, ACTION_BUTTON.DANGER)}
                        {actionButton('Submit', this.saveConfig.bind(this),
                            'ml-2', '', true, (emailCofigTabFields.schedule?.type === 'daily' ? error.pullSchedule : error.processSchedule), ACTION_BUTTON.PRIMARY)}

                    </Col>
                </Row>

            </React.Fragment>
        )
    }

    testConfiguration = () => {
        console.log('test config clicked');
    }

    addScheduleValue = (response) => {
        let scheduleValue;
        let selectedTimeString;
        if (response.schedule?.time.length > 0 && response.schedule?.time[0].time) {
            let time = response.schedule?.time[0].time;
            selectedTimeString = (response.schedule?.time.length - 1) > 0 ? `+${response.schedule?.time.length - 1}` : '';
            scheduleValue = `Daily at ${time} ${selectedTimeString}`;
            response.scheduleValue = scheduleValue;
        } else {
            selectedTimeString = (response.schedule?.interval.length - 1) > 0 ? `+${(response.schedule?.interval.length - 1)}` : '';
            scheduleValue = `Every ${response.schedule?.interval[0].hours}hr ${response.schedule?.interval[0].min}min ${selectedTimeString}`;
            response.scheduleValue = scheduleValue;
        }

    }

    resetConfig = () => {
        this.setState({ showModal: false, modalActions: '', emailCofigTabFields: this.getEmailConfigFields(), modalTabActiveKey: 'emailConfig', error: { testConfiguration: true, proceedToSchedule: true, pullSchedule: true, processSchedule: true } });
    }

    modifyScheduleTime = (response) => {
        if (response.schedule.time.length > 0) {
            let timeArr = response.schedule.time.map((time) => {
                return { time: time.substr(0, 5), zone: time.substr(5) }
            })
            response.schedule.time = timeArr;
        } else {
            response.schedule.time.push({ time: "", zone: "" });
        }
    }

    saveConfig = () => {
        const { emailConfigTableData, emailCofigTabFields, workflows, modalActions } = this.state;
        const parent = this;
        const configData = JSON.parse(JSON.stringify(emailCofigTabFields));
        let scheduleTime = configData.schedule.time.map((timeObj) => timeObj.time && timeObj.time + timeObj.zone);
        scheduleTime = scheduleTime[0] === "" ? [] : scheduleTime;
        configData.schedule.time = scheduleTime;
        configData.workFlowName = workflows.filter(workflow => workflow.value === configData.processId)[0]['label'];
        delete configData['scheduleValue'];
        if (modalActions === 'edit') {
            triggerService.editTriggerConfig('email', configData).then(response => {
                parent.modifyScheduleTime(response);
                if (!response.schedule.interval) {
                    response.schedule.interval = [{ "every": "hours", "hours": "", "min": "" }]
                }
                let prevConfig = emailConfigTableData.find(emailConfigData => emailConfigData.id === response.id);
                Object.keys(prevConfig).forEach((config) => {
                    prevConfig[config] = response[config];
                })
                parent.addScheduleValue(prevConfig);
                notifySuccess('Email Configuration edit', 'Email configuration edited successfully');
                parent.setState({ emailConfigTableData: emailConfigTableData });
                parent.resetConfig();
            }).catch(error => {
                console.error('triggerService.editTriggerConfig:', error);
                notifyError('Unable to edit email configuration', error.message);
            });
        } else {
            triggerService.saveTriggerConfig(configData).then(response => {
                notifySuccess('Email Configuration', 'Email configuration saved successfully');
                parent.modifyScheduleTime(response);
                if (!response.schedule.interval) {
                    response.schedule.interval = [{ "every": "hours", "hours": "", "min": "" }]
                }
                parent.addScheduleValue(response);
                emailConfigTableData.push(response);
                parent.setState({ emailConfigTableData: emailConfigTableData });
                parent.resetConfig();
            }).catch(error => {
                console.error('triggerService.saveTriggerConfig:', error);
                notifyError('Unable to save email configuration', error.message);
            });
        }

    }


    toggleTab = (tabName) => {
        const { error } = this.state;
        if (tabName === 'schedule' && (!error.testConfiguration && !error.proceedToSchedule)) {
            console.log('in');
            this.setState({ modalTabActiveKey: 'schedule' })
        } else {
            this.setState({ modalTabActiveKey: 'emailConfig' });
        }
    }


    renderEmailConfigForm = () => {
        const { emailCofigTabFields, workflows, error } = this.state;
        return (
            <React.Fragment>
                <Row xs="1" md="2" className="mt-3 mb-1">
                    <Col className="pl-4 mb-2">
                        {inputField('email', 'configutation.userName', 'Email Address', emailCofigTabFields.configutation?.userName, this.onChangeInput, { label: 'component-stretched', input: 'component-stretched', required: true })}
                    </Col>
                    <Col className="pl-0 pr-4 mb-2">
                        {inputField('password', 'configutation.password', 'Password', emailCofigTabFields.configutation?.password, this.onChangeInput, { label: 'component-stretched', input: 'component-stretched', required: true })}
                    </Col>
                    <Col className="pl-4 mb-2">
                        {inputField('text', 'configutation.hostName', 'IMAP Address', emailCofigTabFields.configutation?.hostName, this.onChangeInput, { label: 'component-stretched', input: 'component-stretched', required: true })}
                    </Col>
                    <Col className="pl-0 pr-4 mb-1">
                        {inputField('number', 'configutation.portName', 'Port Number', emailCofigTabFields.configutation?.portName, this.onChangeInput, { label: 'component-stretched', input: 'component-stretched', required: true })}
                    </Col>
                </Row>
                <Row xs="1" md="1">
                    <Col className="pl-0 pr-4 text-right">
                        {actionButton('Test Configuration', this.testConfiguration.bind(this),
                            '', '', true, error.testConfiguration, ACTION_BUTTON.PRIMARY)}
                    </Col>
                </Row>
                <Row xs="1" md="1" className="mb-1">

                    <Col>
                        <h5 className="ml-2 mb-0">Pattern</h5>
                        <Tabs defaultActiveKey={'sender'} className="px-2" >
                            {emailCofigTabFields['pattern']?.map((pattern, index) => {
                                return (
                                    <Tab eventKey={pattern.patternType} key={pattern.patternType} title={pattern.patternType.charAt(0).toUpperCase() + pattern.patternType.slice(1)}>
                                        <Row xs="1" md="1" className="mt-2">
                                            <Col className="pl-4 pr-4">
                                                {inputField('textarea', `pattern.${index}.regex`, '', pattern['regex'], this.onChangeInput, { label: 'component-stretched', input: 'component-stretched', textareaRows: 2 })}
                                            </Col>
                                        </Row>
                                    </Tab>
                                )
                            })}
                        </Tabs>
                    </Col>
                </Row>
                <Row xs="1" md="2" className="mb-3">
                    <Col className="pl-4">
                        {inputField('text', 'configutation.folderName', 'Destination Folder', emailCofigTabFields.configutation?.folderName, this.onChangeInput, { label: 'component-stretched', input: 'component-stretched' })}
                    </Col>
                    <Col></Col>
                </Row>
                <Row xs="1" md="1" className="mb-3">
                    <Col className="pl-4 pr-4">
                        {inputField('select', 'processId', 'Assign Workflow', emailCofigTabFields.processId, this.onChangeInput, { label: 'component-stretched', input: 'component-stretched', required: true },
                            workflows)}
                    </Col>
                </Row>
                <Row xs="1" md="1" className="mb-3">
                    <Col className="pl-0 pr-4 text-right">
                        {actionButton('Cancel', this.resetConfig.bind(this),
                            'ml-2', '', true, false, ACTION_BUTTON.DANGER)}
                        {actionButton('Proceed to Schedule', this.toggleTab.bind(this, 'schedule'),
                            'ml-2', '', true, (error.proceedToSchedule || error.testConfiguration), ACTION_BUTTON.PRIMARY)}

                    </Col>
                </Row>
            </React.Fragment>
        )
    }


    render() {
        const { dataLoading, showModal, modalActions, emailConfigTableData, modalTabActiveKey, workflowLoading } = this.state;
        const toggleModal = () => this.resetConfig();
        const emailConfigTableHeader = [
            { label: 'Workflow', key: 'workFlowName' },
            { label: 'Last Updated', key: 'updatedAt', dataFormat: 'relativeTimestamp' },
            { label: 'Pull Status', key: 'isPullEnabled', dataFormat: 'input', type: 'switch', changeAction: this.changeTableInputAction },
            { label: 'Schedule', key: 'scheduleValue' },
            { label: 'Workflow Enable/Disable', key: 'isWorkFlowEnabled', dataFormat: 'input', type: 'switch', changeAction: this.changeTableInputAction }
        ]

        const emailConfigTableSorting = { sortIndex: 0, sortOrder: 0 };
        const emailConfigTableAction = [
            { btnTitle: 'Edit', iconClass: 'feather icon-edit', btnAction: this.editEmailSource }
        ]

        return (
            <section className="studio-container p-0">
                {(dataLoading || workflowLoading) &&
                    <Card>
                        <CardBody>
                            <BasicSpinner />
                        </CardBody>
                    </Card>
                }
                {!(dataLoading || workflowLoading) &&
                    <div>
                        <Row xs="1" md="1">
                            <Col>
                                <Card className='mb-0'>
                                    <CardBody className="p-0">
                                        <StudioTable tableName={'Email Schedule Status'} hideTableName={true}
                                            tableHeader={emailConfigTableHeader}
                                            createAction={this.configureEmailSource.bind(this)}
                                            createLabel={'Configure'}
                                            tableData={emailConfigTableData}
                                            tableActions={emailConfigTableAction}
                                            styleActions={true}
                                            defaultSort={emailConfigTableSorting}
                                        />
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                }
                <Modal centered size={'xl'} isOpen={showModal && modalActions !== ''}>
                    <ModalHeader toggle={toggleModal} className="p-3 ml-2">{'Email Source Configuration'}</ModalHeader>
                    <ModalBody className='p-2'>
                        <Tabs activeKey={modalTabActiveKey} className="px-2" onSelect={this.toggleTab} >
                            <Tab eventKey={'emailConfig'} title={'Email Configuration'}>
                                {this.renderEmailConfigForm()}
                            </Tab>
                            <Tab eventKey={'schedule'} title={'Schedule'}>
                                {this.renderEmailScheduleForm()}
                            </Tab>
                        </Tabs>
                    </ModalBody>
                </Modal>
            </section>
        )
    }
}

export default withRouter(Email);