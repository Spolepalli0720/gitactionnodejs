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

class Scheduled extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dataLoading: true,
            showModal: false,
            workflowLoading: true,
            modalActions: '',
            scheduledConfigTableData: [],
            scheduledCofigTabFields: {},
            workflows: [],
            error: true,
        }
    }

    componentDidMount() {
        const initialScheduledConfigTabFields = this.getScheduledConfigFields();
        const { solutionId } = this.props.match.params;
        let workflows = [];
        workflowService.getWorkflows(solutionId).then(response => {
            workflows = response.filter(workflow => workflow.status === 'ACTIVE').sort((a, b) => a.name.localeCompare(b.name));
            workflows = workflows.map((workflow) => ({ value: workflow.processId, label: workflow.name }));
            workflows.unshift({ label: '', value: '' });
            this.setState({ workflowLoading: false, workflows: workflows, scheduledCofigTabFields: initialScheduledConfigTabFields });
        }).catch(error => {
            workflows.unshift({ label: '', value: '' });
            this.setState({ scheduledCofigTabFields: initialScheduledConfigTabFields, workflowLoading: false, workflows: workflows });
            console.error('workflowService.getWorkflows:', error);
            notifyError('Unable to retrieve workflows', error.message);
        });

        triggerService.getTriggerStatus('jms').then(response => {
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
            });

            this.setState({ dataLoading: false, scheduledConfigTableData: response })
        }).catch(error => {
            this.setState({ dataLoading: false, scheduledConfigTableData: [] });
            console.error('triggerService.getTriggerStatus:', error);
            notifyError('Unable to retrieve trigger status', error.message);
        });
    }
    getScheduledConfigFields = () => {
        const { solutionId } = this.props.match.params;
        let scheduledConfigForm = JSON.parse(JSON.stringify(triggerConfigData.SCHEDULED_CONFIG_FORM));
        scheduledConfigForm["solutionId"] = solutionId;
        return scheduledConfigForm;
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

    onChangeInput = (propName, propValue) => {
        const { scheduledCofigTabFields } = this.state;
        let error;
        let propPath = propName.split('.');
        if (propPath.length === 4) {
            ((scheduledCofigTabFields[propPath[0]])[propPath[1]][propPath[2]])[propPath[3]] = propValue;
            error = this.checkValidation(scheduledCofigTabFields);
            this.setState({ scheduledCofigTabFields: scheduledCofigTabFields, error: error });

        } else if (propPath.length === 2) {
            (scheduledCofigTabFields[propPath[0]])[propPath[1]] = propValue;
            error = this.checkValidation(scheduledCofigTabFields);
            this.setState({ scheduledCofigTabFields: scheduledCofigTabFields, error: error });
        } else {
            scheduledCofigTabFields[propName] = propValue;
            error = this.checkValidation(scheduledCofigTabFields);
            this.setState({ scheduledCofigTabFields: scheduledCofigTabFields, error: error })
        }
    }

    checkValidation = (scheduledCofigTabFields) => {
        let error = false;
        if (scheduledCofigTabFields.namee === '' || scheduledCofigTabFields.description === '' || scheduledCofigTabFields.processId === '') {
            error = true;
        }

        if (scheduledCofigTabFields.schedule.type === 'daily') {
            scheduledCofigTabFields.schedule.time.forEach((inputField) => {
                Object.keys(inputField).forEach((field) => {
                    if (inputField[field] === '') {
                        error = true;
                    }
                })
            })
        } else {
            scheduledCofigTabFields.schedule.interval.forEach((inputField) => {
                Object.keys(inputField).forEach((field) => {
                    if (inputField[field] === '' || inputField[field] === 0) {
                        error = true;
                    }
                })
            })
        }

        return error;
    }

    addScheduleFields = (scheduleArr, index, type) => {
        const { scheduledCofigTabFields } = this.state;
        let valid = true;
        Object.keys(scheduleArr[index]).forEach((scheduleField) => {
            if (scheduleArr[index][scheduleField] === '') {
                valid = false;
            }
        })
        if (valid) {
            type === 'daily' ? scheduleArr.push({ time: '', zone: '' }) : scheduleArr.push({ every: 'hours', hours: '', min: '' });
            let error = this.checkValidation(scheduledCofigTabFields);
            this.setState({ scheduledCofigTabFields: scheduledCofigTabFields, error: error });
        }

    }

    changeTableInputAction = (configObj, propName, propValue) => {
        const { scheduledConfigTableData } = this.state;
        if (propName === "isWorkFlowEnabled" && propValue === false) {
            triggerService.pauseTrigger(configObj.id, 'email').then(response => {
                configObj.isWorkFlowEnabled = propValue
                notifySuccess('Trigger Service Paused', 'Trigger service paused successfully');
                this.setState({ scheduledConfigTableData: scheduledConfigTableData });
            }).catch(error => {
                console.error('triggerService.pauseTrigger:', error);
                notifyError('Unable to pause the trigger service', error.message);
            });
        } else {
            triggerService.resumeTrigger(configObj.id, 'email').then(response => {
                configObj.isWorkFlowEnabled = propValue
                notifySuccess('Trigger Service resumed', 'Trigger service resumed successfully');
                this.setState({ scheduledConfigTableData: scheduledConfigTableData });
            }).catch(error => {
                console.error('triggerService.resumeTrigger:', error);
                notifyError('Unable to resume the trigger service', error.message);
            });
        }
    }

    removeScheduleFields = (scheduleArr, index) => {
        const { scheduledCofigTabFields } = this.state;
        scheduleArr.splice(index, 1);
        let error = this.checkValidation(scheduledCofigTabFields);
        this.setState({ scheduledCofigTabFields: scheduledCofigTabFields, error: error })
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
        const { scheduledConfigTableData, scheduledCofigTabFields, workflows } = this.state;
        const parent = this;
        const configData = JSON.parse(JSON.stringify(scheduledCofigTabFields));
        let scheduleTime = configData.schedule.time.map((timeObj) => timeObj.time && timeObj.time + timeObj.zone);
        scheduleTime = scheduleTime[0] === "" ? [] : scheduleTime;
        configData.schedule.time = scheduleTime;
        configData.workFlowName = workflows.filter(workflow => workflow.value === configData.processId)[0]['label'];
        delete configData['scheduleValue'];
        triggerService.saveTriggerConfig(configData).then(response => {
            notifySuccess('Email Configuration', 'Email configuration saved successfully');
            this.modifyScheduleTime(response);
            if (!response.schedule.interval) {
                response.schedule.interval = [{ "every": "hours", "hours": "", "min": "" }]
            }
            this.addScheduleValue(response);
            scheduledConfigTableData.push(response);
            parent.setState({ scheduledConfigTableData: scheduledConfigTableData });
            parent.resetConfig();
        }).catch(error => {
            console.error('triggerService.saveTriggerConfig:', error);
            notifyError('Unable to save email configuration', error.message);
        });


    }

    renderScheduledConfigForm = () => {
        const { scheduledCofigTabFields, error, workflows } = this.state;
        let processScheduleArr = scheduledCofigTabFields.schedule?.interval;
        return (
            <React.Fragment>
                <Row xs="1" md="1" className="mt-3">
                    <Col className="pl-4 pr-4 mb-1">
                        {inputField('text', 'name', 'Name', scheduledCofigTabFields?.name, this.onChangeInput, { label: 'component-stretched', input: 'component-stretched', required: true })}
                    </Col>
                    <Col className="pl-4 pr-4 mb-1">
                        {inputField('textarea', 'description', 'Description', scheduledCofigTabFields?.description, this.onChangeInput, { label: 'component-stretched', input: 'component-stretched', required: true })}
                    </Col>

                </Row>
                <Row xs="1" md="3" className="mt-4 mb-1">
                    <Col className="pl-4 mb-1">
                        <h5>Trigger Schedule</h5>
                    </Col>
                    <Col className="mb-1">
                        {inputField('radio', 'schedule.type', 'Daily', 'daily', this.onChangeInput, { input: 'ml-2', label: 'w-auto', checked: scheduledCofigTabFields.schedule?.type === 'daily' ? true : false })}
                    </Col>
                    <Col className="mb-1">
                        {inputField('radio', 'schedule.type', 'Set Interval', 'interval', this.onChangeInput, { input: 'ml-2', label: 'w-auto', checked: scheduledCofigTabFields.schedule?.type === 'daily' ? false : true })}
                    </Col>
                </Row>
                {scheduledCofigTabFields.schedule?.type === 'daily' &&
                    scheduledCofigTabFields.schedule.time.map((arrItem, index) => {
                        return (
                            <Row xs="1" md="3" key={index}>
                                <Col className="pl-4 mb-1">
                                    {inputField('time', `schedule.time.${index}.time`, `${index === 0 ? 'Time' : ''}`, arrItem.time, this.onChangeInput, { label: 'component-stretched', input: 'component-stretched' })}
                                </Col>
                                <Col className="pr-2 mb-1">
                                    {inputField('select', `schedule.time.${index}.zone`, `${index === 0 ? 'Zone' : ''}`, arrItem.zone === ' Z' ? " +00:00" : arrItem.zone, this.onChangeInput, { label: 'component-stretched', input: 'component-stretched' }, triggerConfigData.SCHEDULE_ZONE_ARR)}
                                </Col>
                                <Col className={index === 0 ? 'mt-4 pl-0' : 'mt-1 pl-0'}>
                                    {scheduledCofigTabFields.schedule.time.length > 1 &&
                                        <i className="fa fa-times text-danger enable-icon mr-2" onClick={() => this.removeScheduleFields(scheduledCofigTabFields.schedule.time, index)} />}

                                    {scheduledCofigTabFields.schedule.time.length - 1 === index &&
                                        <i className={`fa fa-plus studio-primary ${scheduledCofigTabFields.schedule.time[index].time !== '' && scheduledCofigTabFields.schedule.time[index].zone !== '' ? 'enable-icon' : 'disable-icon'}`} onClick={() => this.addScheduleFields(scheduledCofigTabFields.schedule.time, index, scheduledCofigTabFields.schedule?.type)} />}
                                </Col>
                            </Row>

                        )
                    })
                }
                {scheduledCofigTabFields.schedule?.type !== 'daily' &&
                    scheduledCofigTabFields.schedule?.interval.map((arrItem, index) => {
                        return (
                            <Row xs="1" md="4" key={index}>
                                <Col className="pl-4 mb-1">
                                    {inputField('select', `schedule.interval.${index}.every`, `${index === 0 ? 'Every' : ''}`, arrItem.every, this.onChangeInput, { label: 'component-stretched', input: 'component-stretched' }, triggerConfigData.SCHEDULE_HOUR_ARR)}
                                </Col>
                                <Col className="pr-2 mb-1">
                                    {inputField('number', `schedule.interval.${index}.hours`, `${index === 0 ? 'No Of Hours' : ''}`, arrItem.hours || 0, this.onChangeInput, { label: 'component-stretched', input: 'component-stretched' })}
                                </Col>
                                <Col className="pr-2 mb-1">
                                    {inputField('number', `schedule.interval.${index}.min`, `${index === 0 ? 'Minutes' : ''}`, arrItem.min || 0, this.onChangeInput, { label: 'component-stretched', input: 'component-stretched' })}
                                </Col>
                                <Col className={index === 0 ? 'mt-4 pl-0' : 'mt-1 pl-0'}>
                                    {scheduledCofigTabFields.schedule.interval.length > 1 &&
                                        <i className="fa fa-times text-danger enable-icon mr-2" onClick={() => this.removeScheduleFields(scheduledCofigTabFields.schedule.interval, index)} />}

                                    {scheduledCofigTabFields.schedule.interval.length - 1 === index &&
                                        <i className={`fa fa-plus studio-primary ${(processScheduleArr[index]['every'] !== '' && processScheduleArr[index]['hours'] !== '' && processScheduleArr[index]['min']) ? 'enable-icon' : 'disable-icon'}`} onClick={() => this.addScheduleFields(scheduledCofigTabFields.schedule.interval, index, scheduledCofigTabFields.schedule?.type)} />}
                                </Col>
                            </Row>

                        )
                    })
                }
                <Row xs="1" md="1">
                    <Col className="pl-4 pr-4 mb-1">
                        {inputField('select', 'processId', 'Assign Workflow', scheduledCofigTabFields?.processId, this.onChangeInput, { label: 'component-stretched', input: 'component-stretched', required: true },
                            workflows)}
                    </Col>
                </Row>
                <Row xs="1" md="1" className="mb-3">
                    <Col className="pl-4 pr-4 mb-1">
                        {inputField('textarea', 'payload', 'Payload', scheduledCofigTabFields?.payload, this.onChangeInput, { label: 'component-stretched', input: 'component-stretched' })}
                    </Col>
                </Row>
                <Row xs="1" md="1" className="mb-3">
                    <Col className="pl-0 pr-4 text-right">
                        {actionButton('Cancel', this.resetConfig.bind(this),
                            'ml-2', '', true, false, ACTION_BUTTON.DANGER)}
                        {actionButton('Submit', this.saveConfig.bind(this),
                            'ml-2', '', true, error, ACTION_BUTTON.PRIMARY)}
                    </Col>
                </Row>

            </React.Fragment>
        )
    }

    configureScheduled = () => {
        this.setState({ showModal: true, modalActions: 'scheduledConfig' });
    }

    resetConfig = () => {
        this.setState({ showModal: false, modalActions: '', scheduledCofigTabFields: this.getScheduledConfigFields() });
    }

    render() {
        const { dataLoading, showModal, modalActions, scheduledConfigTableData, workflowLoading } = this.state;
        const toggleModal = () => this.resetConfig();
        const scheduledConfigTableHeader = [
            { label: 'Name', key: 'name' },
            { label: 'Workflow', key: 'workFlowName' },
            { label: 'Last Updated', key: 'updatedAt', dataFormat: 'relativeTimestamp' },
            { label: 'Schedule', key: 'scheduleValue' },
            { label: 'Workflow Enable/Disable', key: 'isWorkFlowEnabled', dataFormat: 'input', type: 'switch', changeAction: this.changeTableInputAction }
        ]

        const scheduledConfigTableSorting = { sortIndex: 0, sortOrder: 0 };
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
                                        <StudioTable tableName={'Schedule Status'} hideTableName={true}
                                            tableHeader={scheduledConfigTableHeader}
                                            createAction={this.configureScheduled.bind(this)}
                                            createLabel={'Configure'}
                                            tableData={scheduledConfigTableData}
                                            styleActions={true}
                                            defaultSort={scheduledConfigTableSorting}
                                        />
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                }
                <Modal centered size={'xl'} isOpen={showModal && modalActions !== ''}>
                    <ModalHeader toggle={toggleModal} className="p-3 ml-2">{'Scheduled Trigger Configuration'}</ModalHeader>
                    <ModalBody className='p-2'>
                        <Tabs defaultActiveKey={'scheduledConfig'} className="px-2" >
                            <Tab eventKey={'scheduledConfig'} title={'Scheduled'}>
                                {this.renderScheduledConfigForm()}
                            </Tab>
                        </Tabs>
                    </ModalBody>
                </Modal>
            </section>
        )
    }
}
export default withRouter(Scheduled);