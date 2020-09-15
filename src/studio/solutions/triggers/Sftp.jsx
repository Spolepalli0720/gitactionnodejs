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

class Sftp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dataLoading: true,
            showModal: false,
            workflowLoading: true,
            modalActions: '',
            sftpConfigTableData: [],
            sftpCofigTabFields: {},
            workflows: [],
            error: {
                testConfiguration: true,
                proceedToSchedule: true,
                pullSchedule: true,
                processSchedule: true
            },
            modalTabActiveKey: 'sftpConfig'
        }
    }


    componentDidMount() {
        const initialSftpConfigTabFields = this.getSftpConfigFields();
        const { solutionId } = this.props.match.params;
        let workflows = [];
        workflowService.getWorkflows(solutionId).then(response => {
            workflows = response.filter(workflow => workflow.status === 'ACTIVE').sort((a, b) => a.name.localeCompare(b.name));
            workflows = workflows.map((workflow) => ({ value: workflow.processId, label: workflow.name }));
            workflows.unshift({ label: '', value: '' });
            this.setState({ workflowLoading: false, workflows: workflows, sftpCofigTabFields: initialSftpConfigTabFields });
        }).catch(error => {
            workflows.unshift({ label: '', value: '' });
            this.setState({ sftpCofigTabFields: initialSftpConfigTabFields, workflowLoading: false, workflows: workflows });
            console.error('workflowService.getWorkflows:', error);
            notifyError('Unable to retrieve workflows', error.message);
        });
        triggerService.getTriggerStatus('sftp').then(response => {
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
            this.setState({ dataLoading: false, sftpCofigTabFields: response })
        }).catch(error => {
            this.setState({ dataLoading: false, sftpCofigTabFields: [] });
            console.error('triggerService.getTriggerStatus:', error);
            notifyError('Unable to retrieve trigger status', error.message);
        });
    }

    getSftpConfigFields = () => {
        const { solutionId } = this.props.match.params;
        let sftpConfigForm = JSON.parse(JSON.stringify(triggerConfigData.SFTP_CONFIG_FORM));
        sftpConfigForm["solutionId"] = solutionId;
        return sftpConfigForm;
    }

    changeTableInputAction = (configObj, propName, propValue) => {
        const { sftpConfigTableData } = this.state;
        if (propName === 'isPullEnabled' && propValue === false) {
            triggerService.pauseJobs(configObj.id, 'sftp').then(response => {
                configObj.isPullEnabled = propValue
                notifySuccess('Jobs Paused', 'Service Paused successfully');
                this.setState({ sftpConfigTableData: sftpConfigTableData });
            }).catch(error => {
                console.error('triggerService.pauseJobs:', error);
                notifyError('Unable to pause the service', error.message);
            });
        } else if (propName === 'isPullEnabled' && propValue === true) {
            triggerService.resumeJobs(configObj.id, 'sftp').then(response => {
                configObj.isPullEnabled = propValue
                notifySuccess('Jobs resumed', 'Service resumed successfully');
                this.setState({ sftpConfigTableData: sftpConfigTableData });
            }).catch(error => {
                console.error('triggerService.resumeJobs:', error);
                notifyError('Unable to resume the service', error.message);
            });
        } else if (propName === "isWorkFlowEnabled" && propValue === false) {
            triggerService.pauseTrigger(configObj.id, 'sftp').then(response => {
                configObj.isWorkFlowEnabled = propValue
                notifySuccess('Trigger Service Paused', 'Trigger service paused successfully');
                this.setState({ sftpConfigTableData: sftpConfigTableData });
            }).catch(error => {
                console.error('triggerService.pauseTrigger:', error);
                notifyError('Unable to pause the trigger service', error.message);
            });
        } else if (propName === "isWorkFlowEnabled" && propValue === true) {
            triggerService.resumeTrigger(configObj.id, 'sftp').then(response => {
                configObj.isWorkFlowEnabled = propValue
                notifySuccess('Trigger Service resumed', 'Trigger service resumed successfully');
                this.setState({ sftpConfigTableData: sftpConfigTableData });
            }).catch(error => {
                console.error('triggerService.resumeTrigger:', error);
                notifyError('Unable to resume the trigger service', error.message);
            });
        }
    }

    configureSftpSource = () => {
        this.setState({ showModal: true, modalActions: 'configureSftp' })
    }

    onChangeInput = (propName, propValue) => {
        const { sftpCofigTabFields } = this.state;
        let error;
        let propPath = propName.split('.');
        if (propPath.length > 2) {
            if (propPath.length === 4) {
                ((sftpCofigTabFields[propPath[0]])[propPath[1]][propPath[2]])[propPath[3]] = propValue;
                error = this.checkValidation(sftpCofigTabFields);
            } else {
                ((sftpCofigTabFields[propPath[0]])[propPath[1]][propPath[2]]) = propValue;
                error = this.checkValidation(sftpCofigTabFields);
            }
            this.setState({ sftpCofigTabFields: sftpCofigTabFields, error: error });

        } else if (propPath.length === 2) {
            (sftpCofigTabFields[propPath[0]])[propPath[1]] = propValue;
            error = this.checkValidation(sftpCofigTabFields);
            this.setState({ sftpCofigTabFields: sftpCofigTabFields, error: error });
        } else {
            sftpCofigTabFields[propName] = propValue;
            error = this.checkValidation(sftpCofigTabFields);
            this.setState({ sftpCofigTabFields: sftpCofigTabFields, error: error })
        }
    }

    checkValidation = (sftpCofigTabFields) => {
        let error = { testConfiguration: false, proceedToSchedule: false, pullSchedule: false, processSchedule: false };
        if (sftpCofigTabFields.configutation.referenceName === '' || sftpCofigTabFields.configutation.hostName === '' || sftpCofigTabFields.configutation.portName === '' || sftpCofigTabFields.configutation.userName === '' || sftpCofigTabFields.configutation.password === '') {
            error.testConfiguration = true;
        }
        if (sftpCofigTabFields.processId === '') {
            error.proceedToSchedule = true;
        }

        if (sftpCofigTabFields.schedule.type === 'daily') {
            sftpCofigTabFields.schedule.time.forEach((inputField) => {
                Object.keys(inputField).forEach((field) => {
                    if (inputField[field] === '') {
                        error.pullSchedule = true;
                    }
                })
            })

        } else {
            sftpCofigTabFields.schedule.interval.forEach((inputField) => {
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
        const { sftpCofigTabFields } = this.state;
        let valid = true;
        Object.keys(scheduleArr[index]).forEach((scheduleField) => {
            if (scheduleArr[index][scheduleField] === '' || scheduleArr[index][scheduleField] === 0) {
                valid = false;
            }
        })
        if (valid) {
            type === 'daily' ? scheduleArr.push({ time: '', zone: '' }) : scheduleArr.push({ every: 'hours', hours: '', min: '' });
            let error = this.checkValidation(sftpCofigTabFields);
            this.setState({ sftpCofigTabFields: sftpCofigTabFields, error: error });
        }

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

    removeScheduleFields = (scheduleArr, index) => {
        const { sftpCofigTabFields } = this.state;
        scheduleArr.splice(index, 1);
        let error = this.checkValidation(sftpCofigTabFields);
        this.setState({ sftpCofigTabFields: sftpCofigTabFields, error: error })
    }

    editSftpSource = (configObj) => {
        this.setState({ sftpCofigTabFields: configObj, modalActions: 'edit', showModal: true, error: { testConfiguration: false, proceedToSchedule: false, pullSchedule: false, processSchedule: false } });
    }

    renderSftpScheduleForm = () => {
        const { sftpCofigTabFields, error } = this.state;
        let processScheduleArr = sftpCofigTabFields.schedule?.interval;
        return (
            <React.Fragment>
                <Row xs="1" md="3" className="mt-4 mb-1">
                    <Col className="pl-4">
                        <h5>{sftpCofigTabFields.schedule?.type === 'daily' ? 'Pull Schedule' : 'Process Schedule'}</h5>
                    </Col>
                    <Col>
                        {inputField('radio', 'schedule.type', 'Daily', 'daily', this.onChangeInput, { input: 'ml-2', label: 'w-auto', checked: sftpCofigTabFields.schedule?.type === 'daily' ? true : false })}
                    </Col>
                    <Col>
                        {inputField('radio', 'schedule.type', 'Set Interval', 'interval', this.onChangeInput, { input: 'ml-2', label: 'w-auto', checked: sftpCofigTabFields.schedule?.type === 'daily' ? false : true })}
                    </Col>
                </Row>
                {sftpCofigTabFields.schedule?.type === 'daily' &&
                    sftpCofigTabFields.schedule.time.map((arrItem, index) => {
                        return (
                            <Row xs="1" md="3" key={index}>
                                <Col className="pl-4">
                                    {inputField('time', `schedule.time.${index}.time`, `${index === 0 ? 'Time' : ''}`, arrItem.time, this.onChangeInput, { label: 'component-stretched', input: 'component-stretched' })}
                                </Col>
                                <Col className="pr-2">
                                    {inputField('select', `schedule.time.${index}.zone`, `${index === 0 ? 'Zone' : ''}`, arrItem.zone === ' Z' ? " +00:00" : arrItem.zone, this.onChangeInput, { label: 'component-stretched', input: 'component-stretched' }, triggerConfigData.SCHEDULE_ZONE_ARR)}
                                </Col>
                                <Col className={index === 0 ? 'mt-4 pl-0' : 'mt-1 pl-0'}>
                                    {sftpCofigTabFields.schedule.time.length > 1 &&
                                        <i className="fa fa-times text-danger enable-icon mr-2" onClick={() => this.removeScheduleFields(sftpCofigTabFields.schedule.time, index)} />}

                                    {sftpCofigTabFields.schedule.time.length - 1 === index &&
                                        <i className={`fa fa-plus studio-primary ${(sftpCofigTabFields.schedule.time[index].time !== '' && sftpCofigTabFields.schedule.time[index].zone !== '') ? 'enable-icon' : 'disable-icon'}`} onClick={() => this.addScheduleFields(sftpCofigTabFields.schedule.time, index, sftpCofigTabFields.schedule?.type)} />}
                                </Col>
                            </Row>

                        )
                    })
                }
                {sftpCofigTabFields.schedule?.type !== 'daily' &&
                    sftpCofigTabFields.schedule?.interval.map((arrItem, index) => {
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
                                    {sftpCofigTabFields.schedule.interval.length > 1 &&
                                        <i className="fa fa-times text-danger enable-icon mr-2" onClick={() => this.removeScheduleFields(sftpCofigTabFields.schedule.interval, index)} />}

                                    {sftpCofigTabFields.schedule.interval.length - 1 === index &&
                                        <i className={`fa fa-plus studio-primary ${(processScheduleArr[index]['every'] !== '' && processScheduleArr[index]['hours'] && processScheduleArr[index]['min']) ? 'enable-icon' : 'disable-icon'}`} onClick={() => this.addScheduleFields(sftpCofigTabFields.schedule.interval, index, sftpCofigTabFields.schedule?.type)} />}
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
                            'ml-2', '', true, (sftpCofigTabFields.schedule?.type === 'daily' ? error.pullSchedule : error.processSchedule), ACTION_BUTTON.PRIMARY)}

                    </Col>
                </Row>

            </React.Fragment>
        )
    }

    testConfiguration = () => {
        console.log('test config clicked');
    }

    resetConfig = () => {
        this.setState({ showModal: false, modalActions: '', sftpCofigTabFields: this.getSftpConfigFields(), modalTabActiveKey: 'sftpConfig', error: { testConfiguration: true, proceedToSchedule: true, pullSchedule: true, processSchedule: true } });
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
        const { sftpConfigTableData, sftpCofigTabFields, workflows, modalActions } = this.state;
        const parent = this;
        const configData = JSON.parse(JSON.stringify(sftpCofigTabFields));
        let scheduleTime = configData.schedule.time.map((timeObj) => timeObj.time && timeObj.time + timeObj.zone);
        scheduleTime = scheduleTime[0] === "" ? [] : scheduleTime;
        configData.schedule.time = scheduleTime;
        configData.workFlowName = workflows.filter(workflow => workflow.value === configData.processId)[0]['label'];
        delete configData['scheduleValue'];
        if (modalActions === 'edit') {
            triggerService.editTriggerConfig('sftp', configData).then(response => {
                parent.modifyScheduleTime(response);
                if (!response.schedule.interval) {
                    response.schedule.interval = [{ "every": "hours", "hours": "", "min": "" }]
                }
                let prevConfig = sftpConfigTableData.find(sftpConfigData => sftpConfigData.id === response.id);
                Object.keys(prevConfig).forEach((config) => {
                    prevConfig[config] = response[config];
                })
                parent.addScheduleValue(prevConfig);
                notifySuccess('SFTP Configuration edit', 'SFTP configuration edited successfully');
                parent.setState({ sftpConfigTableData: sftpConfigTableData });
                parent.resetConfig();
            }).catch(error => {
                console.error('triggerService.editTriggerConfig:', error);
                notifyError('Unable to edit sftp configuration', error.message);
            });
        } else {
            triggerService.saveTriggerConfig(configData).then(response => {
                notifySuccess('SFTP Configuration', 'SFTP configuration saved successfully');
                parent.modifyScheduleTime(response);
                if (!response.schedule.interval) {
                    response.schedule.interval = [{ "every": "hours", "hours": "", "min": "" }]
                }
                parent.addScheduleValue(response);
                sftpConfigTableData.push(response);
                parent.setState({ sftpConfigTableData: sftpConfigTableData });
                parent.resetConfig();
            }).catch(error => {
                console.error('triggerService.saveTriggerConfig:', error);
                notifyError('Unable to save sftp configuration', error.message);
            });
        }

    }

    toggleTab = (tabName) => {
        const { error } = this.state;
        if (tabName === 'schedule' && (!error.testConfiguration && !error.proceedToSchedule)) {
            this.setState({ modalTabActiveKey: 'schedule' })
        } else {
            this.setState({ modalTabActiveKey: 'sftpConfig' });
        }
    }



    renderSftpConfigForm = () => {
        const { sftpCofigTabFields, workflows, error } = this.state;
        return (
            <React.Fragment>
                <Row xs="1" md="1" className="mt-3 mb-1">
                    <Col className="pl-4 pr-4 mb-2">
                        {inputField('text', 'configutation.referenceName', 'Reference Name', sftpCofigTabFields.configutation?.referenceName, this.onChangeInput, { label: 'component-stretched', input: 'component-stretched', required: true })}
                    </Col>
                </Row>
                <Row xs="1" md="2" className="mb-1">
                    <Col className="pl-4 mb-2">
                        {inputField('text', 'configutation.hostName', 'Host IP', sftpCofigTabFields.configutation?.hostName, this.onChangeInput, { label: 'component-stretched', input: 'component-stretched', required: true })}
                    </Col>
                    <Col className="pl-0 pr-4 mb-2">
                        {inputField('number', 'configutation.portName', 'Port', sftpCofigTabFields.configutation?.portName, this.onChangeInput, { label: 'component-stretched', input: 'component-stretched', required: true })}
                    </Col>
                    <Col className="pl-4 mb-2">
                        {inputField('text', 'configutation.userName', 'User Name', sftpCofigTabFields.configutation?.userName, this.onChangeInput, { label: 'component-stretched', input: 'component-stretched', required: true })}
                    </Col>
                    <Col className="pl-0 pr-4 mb-1">
                        {inputField('password', 'configutation.password', 'Password', sftpCofigTabFields.configutation?.password, this.onChangeInput, { label: 'component-stretched', input: 'component-stretched', required: true })}
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
                        <Tabs defaultActiveKey={'fileName'} className="px-2" >
                            {sftpCofigTabFields['pattern']?.map((pattern, index) => {
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
                        {inputField('text', 'configutation.folderName', 'Destination Folder', sftpCofigTabFields.configutation?.folderName, this.onChangeInput, { label: 'component-stretched', input: 'component-stretched' })}
                    </Col>
                    <Col></Col>
                </Row>
                <Row xs="1" md="1" className="mb-3">
                    <Col className="pl-4 pr-4">
                        {inputField('select', 'processId', 'Assign Workflow', sftpCofigTabFields?.processId, this.onChangeInput, { label: 'component-stretched', input: 'component-stretched', required: true },
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
        const { dataLoading, showModal, modalActions, sftpConfigTableData, modalTabActiveKey, workflowLoading } = this.state;
        const toggleModal = () => this.resetConfig();
        const sftpConfigTableHeader = [
            { label: 'Workflow', key: 'workFlowName' },
            { label: 'Last Updated', key: 'updatedAt', dataFormat: 'relativeTimestamp' },
            { label: 'Pull Status', key: 'isPullEnabled', dataFormat: 'input', type: 'switch', changeAction: this.changeTableInputAction },
            { label: 'Schedule', key: 'scheduleValue' },
            { label: 'Workflow Enable/Disable', key: 'isWorkFlowEnabled', dataFormat: 'input', type: 'switch', changeAction: this.changeTableInputAction }
        ]

        const sftpConfigTableSorting = { sortIndex: 0, sortOrder: 0 };
        const sftpConfigTableAction = [
            { btnTitle: 'Edit', iconClass: 'feather icon-edit', btnAction: this.editSftpSource }
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
                                        <StudioTable tableName={'SFTP Schedule Status'} hideTableName={true}
                                            tableHeader={sftpConfigTableHeader}
                                            createAction={this.configureSftpSource.bind(this)}
                                            createLabel={'Configure'}
                                            tableData={sftpConfigTableData}
                                            tableActions={sftpConfigTableAction}
                                            styleActions={true}
                                            defaultSort={sftpConfigTableSorting}
                                        />
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                }
                <Modal centered size={'xl'} isOpen={showModal && modalActions !== ''}>
                    <ModalHeader toggle={toggleModal} className="p-3 ml-2">{'SFTP Source Configuration'}</ModalHeader>
                    <ModalBody className='p-2'>
                        <Tabs activeKey={modalTabActiveKey} className="px-2" onSelect={this.toggleTab} >
                            <Tab eventKey={'sftpConfig'} title={'SFTP Configuration'}>
                                {this.renderSftpConfigForm()}
                            </Tab>
                            <Tab eventKey={'schedule'} title={'Schedule'}>
                                {this.renderSftpScheduleForm()}
                            </Tab>
                        </Tabs>
                    </ModalBody>
                </Modal>
            </section>
        )
    }
}

export default withRouter(Sftp);