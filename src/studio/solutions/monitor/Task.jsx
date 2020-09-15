import React from "react";
import { Card, CardBody, Row, Col } from 'reactstrap';
import { Tabs, Tab } from 'react-bootstrap';

import Timeline from "./Timeline";
import StudioTable from '../../utils/StudioTable';

import { BasicSpinner } from "../../utils/BasicSpinner";
import { processEngine } from '../../services/ProcessEngine';
import { notify, notifyError } from '../../utils/Notifications';

import './Task.scss';
export default class Task extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            taskData: [
                { id: 0, name: 'Activity', tableData: [], tableHeader: undefined, tableActions: undefined, defaultSort: undefined },
                { id: 1, name: 'Timeline', tableData: [], tableHeader: undefined, tableActions: undefined, defaultSort: undefined }
            ],
            refreshInterval: undefined
        }
    }

    componentDidMount() {
        const parent = this;
        this.getDeploymentInstance();

        const refreshInterval = setInterval(() => {
            parent.getDeploymentInstance();
        }, 30000)
        this.setState({ refreshInterval: refreshInterval });
    }

    componentWillUnmount() {
        if (this.state.refreshInterval !== null) {
            clearInterval(this.state.refreshInterval)
        }
    }

    getDeploymentInstance() {
        const { taskData } = this.state;
        const instanceId = this.props.instanceId;

        processEngine.getDeploymentInstance(instanceId).then(response => {
            response.forEach(function (arrayItem) {
                arrayItem.withAvatar = { name: arrayItem.createdBy, avatar: "/favicon.ico" }
            })
            taskData[0].tableData = response;
            taskData[1].timelineLength = response.length
            taskData[1].tableData = [{ collapsed: false, timeline: response }];
            let inputActions = [
                {
                    btnTitle: 'View Input', btnClass: 'task-input-btn', iconClass: 'feather icon-download',
                    btnAction: this.inputAction.bind(this),
                },
            ]
            let outputActions = [
                {
                    btnTitle: 'View Output', btnClass: 'task-output-btn', iconClass: 'feather icon-upload',
                    btnAction: this.outputAction.bind(this),
                },
            ]
            let statusActions = [
                {
                    btnTitle: 'Retry', btnClass: 'text-danger', iconClass: 'feather icon-repeat text-danger',
                    btnAction: this.retryAction.bind(this), btnCondition: this.actionToggle.bind(this)
                }
            ]
            taskData[0].tableHeader = [
                { label: 'Activity', key: 'taskName', dataFormat: 'linkAction', linkTitle: 'Title', linkAction: this.linkAction.bind(this) },
                { label: 'Task ID', key: 'taskId' },
                { label: 'Execution ID', key: 'executionId', },
                { label: 'Who', key: 'withAvatar' },
                { label: 'Start Time', key: 'startDate', dataFormat: 'relativeTimestamp' },
                { label: 'End Time', key: 'endDate', dataFormat: 'relativeTimestamp' },
                { label: 'Time Seconds', key: 'duration' },
                { label: 'Status ', key: 'status', dataFormat: 'statusAction', dataActions: statusActions },
                { label: 'Input ', key: 'input', dataFormat: 'dataAction', dataActions: inputActions },
                { label: 'Output ', key: 'output', dataFormat: 'dataAction', dataActions: outputActions },
            ];
            taskData[0].defaultSort = { sortIndex: 4, sortOrder: 1 };

            this.setState({ loading: false, taskData: taskData });
        }).catch(error => {
            this.setState({ loading: false });
            console.error('processEngine.getDeploymentInstance:', error);
            notifyError('Unable to retrieve deployment instance details', error.message);
        });
    }

    linkAction = (rowData, dataKey) => {
        // console.log(dataKey, rowData)
    }

    actionToggle(rowData, actionItem) {
        if (actionItem.btnTitle === 'Retry' && rowData.status === 'ERROR') {
            return true;
        } else if (actionItem.btnTitle === 'Retry') {
            return false;
        } else {
            return true;
        }
    }

    retryAction(rowData) {

    }

    inputAction = (rowData) => {
        let filteredLink = rowData.links.filter(arrayItem => arrayItem.rel === 'input');
        processEngine.getPayload(filteredLink[0].href).then(response => {
            this.exportFile(response, rowData.taskId + '_input.json')
        }).catch(error => {
            console.error('Unable to download input payload', filteredLink[0], error);
            notifyError('Unable to download payload', error.message);
        })
    }

    outputAction = (rowData) => {
        let filteredLink = rowData.links.filter(arrayItem => arrayItem.rel === 'output');
        processEngine.getPayload(filteredLink[0].href).then(response => {
            this.exportFile(response, rowData.taskId + '_output.json')
        }).catch(error => {
            console.error('Unable to download input payload', filteredLink[0], error);
            notifyError('Unable to download payload', error.message);
        })
    }

    exportFile(data, fileName) {
        var encodedData = encodeURIComponent(JSON.stringify(data, undefined, 4));
        const newAnchorTag = document.createElement('a');
        newAnchorTag.setAttribute('href', 'data:application/json;charset=UTF-8,' + encodedData);
        newAnchorTag.setAttribute('download', fileName);
        newAnchorTag.dataset.downloadurl = ['application/json', newAnchorTag.download, newAnchorTag.href].join(':');
        notify('Export Payload', 'Payload details published for download');
        newAnchorTag.click();
    }

    render() {
        const { loading, taskData } = this.state;

        return (
            <section className="studio-container p-0">
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
                            <Col>
                                <i className="feather icon-x-circle fa-2x btn p-0 content-float-right" onClick={() => this.props.goBack()}></i>
                                <h3>Monitor Instance</h3>
                            </Col>
                        </Row>
                        <Row xs="1" md="1">
                            <Col>
                                <Card className="mb-0">
                                    <CardBody className="p-0">
                                        <Tabs defaultActiveKey={taskData[0].id} className="px-2">
                                            {taskData.map((tabInfo, tabIndex) =>
                                                <Tab key={tabIndex} eventKey={tabInfo.id} title={tabInfo.name + ' (' + (tabInfo.timelineLength || tabInfo.tableData.length) + ')'}>
                                                    {tabInfo.name === 'Timeline' &&
                                                        <Timeline data={tabInfo.tableData} />
                                                    }
                                                    {tabInfo.name !== 'Timeline' &&
                                                        <StudioTable tableName={tabInfo.name} hideTableName={true}
                                                            tableHeader={tabInfo.tableHeader}
                                                            tableData={tabInfo.tableData}
                                                            tableActions={tabInfo.tableActions}
                                                            styleActions={true}
                                                            defaultSort={tabInfo.defaultSort}
                                                        />
                                                    }
                                                </Tab>
                                            )}
                                        </Tabs>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                }
            </section>
        )
    }
}