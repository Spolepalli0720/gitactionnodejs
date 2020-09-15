import React from "react";
import { Card, CardBody, Row, Col } from 'reactstrap';

import Task from './Task';
import Timeline from './Timeline';
import StudioTable from '../../utils/StudioTable';

import { inputField, actionButton } from "../../utils/StudioUtils";
import { BasicSpinner } from "../../utils/BasicSpinner";
import { processEngine } from '../../services/ProcessEngine';
import { notifyError } from '../../utils/Notifications';
import { Chart } from "react-google-charts";

export default class Monitor extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,

            workflows: [],
            selectedDeploymentId: '',

            deploymentStatus: [],
            selectedDeploymentStatus: '',

            deploymentMetrics: [],

            deploymentDetails: [],
            selectedInstanceId: '',
            dataView: 'instanceDetail'
        }
    }

    componentDidMount() {
        const { solutionId, instanceId } = this.props.match.params;
        let selectedInstanceId = instanceId;

        processEngine.getDeploymentSummary(solutionId).then(response => {
            if (response.length > 0) {
                let selectedDeploymentId = response[0].processId;
                this.getDeploymentStatus(selectedDeploymentId);
                this.getDeploymentMetrics(selectedDeploymentId);
                this.setState({ loading: false, workflows: response, selectedDeploymentId: selectedDeploymentId, selectedInstanceId: selectedInstanceId });
            } else {
                this.setState({ loading: false, selectedInstanceId: selectedInstanceId });
            }
        }).catch(error => {
            this.setState({ loading: false, selectedInstanceId: selectedInstanceId });
            console.error('processEngine.getDeploymentSummary:', error);
            notifyError('Unable to retrieve deployment summary', error.message);
        });
    }

    getDeploymentStatus(deploymentId) {
        const { solutionId } = this.props.match.params;
        processEngine.getDeploymentStatus(solutionId, deploymentId).then(response => {
            response.sort((a, b) => b.status.localeCompare(a.status));
            if (response.length > 0) {
                let selectedDeploymentStatus = response[0].status;
                this.getDeploymentDetails(deploymentId, selectedDeploymentStatus);
                this.setState({ deploymentStatus: response, selectedDeploymentStatus: selectedDeploymentStatus, dataView: 'instanceDetail' });
            } else {
                this.setState({ deploymentStatus: [], selectedDeploymentStatus: '', deploymentDetails: [], dataView: 'instanceDetail' });
            }
        }).catch(error => {
            this.setState({ deploymentStatus: [], selectedDeploymentStatus: '', deploymentDetails: [], dataView: 'instanceDetail' });
            console.error('processEngine.getDeploymentStatus:', error);
            notifyError('Unable to retrieve deployment status', error.message);
        });
    }

    getDeploymentMetrics(deploymentId) {
        const { solutionId } = this.props.match.params;
        processEngine.getDeploymentMetrics(solutionId, deploymentId).then(response => {
            response.sort((a, b) => b.status.localeCompare(a.status));
            if (response.length > 0) {
                this.setState({ deploymentMetrics: response });
            } else {
                this.setState({ deploymentMetrics: [] });
            }
        }).catch(error => {
            this.setState({ deploymentMetrics: [] });
            console.error('processEngine.getDeploymentMetrics:', error);
            notifyError('Unable to retrieve deployment metrics', error.message);
        });
    }

    getDeploymentDetails(deploymentId, deploymentStatus) {
        const { solutionId } = this.props.match.params;
        const parent = this;
        let deploymentDetails = [];
        processEngine.getDeploymentDetails(solutionId, deploymentId, deploymentStatus).then(response => {
            response.sort((a, b) => (b.createdAt ? new Date(b.createdAt) : new Date()) - (a.createdAt ? new Date(a.createdAt) : new Date()));
            var promiseArray = [];
            response.forEach(function (arrayItem) {
                arrayItem.withAvatar = { name: arrayItem.createdBy, avatar: "/favicon.ico" }
                const childPromise = processEngine.getDeploymentInstance(arrayItem.id).then(instanceTimeline => {
                    arrayItem.timeline = instanceTimeline;
                }).catch(timelineError => {
                    arrayItem.timeline = [];
                    console.error('processEngine.getDeploymentInstance:', timelineError);
                    notifyError('Unable to retrieve deployment instance details', timelineError.message);
                });
                promiseArray.push(childPromise);
            })
            deploymentDetails = response;
            return Promise.all(promiseArray);
        }).then(() => {
            parent.setState({ deploymentDetails: deploymentDetails });
        }).catch(error => {
            parent.setState({ deploymentDetails: deploymentDetails });
            console.error('processEngine.getDeploymentDetails:', error);
            notifyError('Unable to retrieve deployment details', error.message);
        });
    }

    changeDeployment = (name, value) => {
        this.getDeploymentStatus(value);
        this.getDeploymentMetrics(value);
        this.setState({ selectedDeploymentId: value, deploymentStatus: [], selectedDeploymentStatus: '', deploymentDetails: [], dataView: 'instanceDetail' })
    }

    changeDeploymentStatus(deploymentStatus) {
        const { selectedDeploymentId } = this.state;
        this.getDeploymentDetails(selectedDeploymentId, deploymentStatus);
        this.setState({ selectedDeploymentStatus: deploymentStatus, deploymentDetails: [] });
    }

    handleNavBack = () => {
        this.setState({ selectedInstanceId: '' });
    }

    getDeploymentChart = (title, data) => {
        let chartConfig = {}
        chartConfig.chartType = "PieChart";
        chartConfig.chartEvents = [
            {
                eventName: 'select',
                callback: ({ chartWrapper }) => {
                    const chart = chartWrapper.getChart();
                    const selection = chart.getSelection();
                    const dataTable = chartWrapper.getDataTable();
                    const selectedValue = dataTable.getValue(selection[0].row, selection[0].column ? selection[0].column : 0);
                    if (selectedValue) {
                        this.changeDeploymentStatus(selectedValue);
                    }
                },
            },
        ];
        const chartData = data.map((data) => [data.status, data.count]);
        chartConfig.data = [['Status', 'Count'], ...chartData];
        chartConfig.options = {
            title: title,
            legend: { position: 'right', alignment: 'center' },
            chartArea: { width: '80%', height: '80%' },
            pieHole: 0.5,
            pieSliceText: 'value'
        }

        return (
            <Chart
                chartType={chartConfig.chartType}
                data={chartConfig.data || []}
                loader={<div>Loading Chart</div>}
                chartEvents={chartConfig.chartEvents}
                options={chartConfig.options}
            />
        )
    }

    deploymentStatusLinkAction = (rowData, columnName) => {
        this.setState({ selectedInstanceId: rowData[columnName] });
    }

    render() {
        const { loading, workflows, deploymentDetails, selectedDeploymentId, selectedDeploymentStatus, selectedInstanceId, dataView } = this.state;
        const tableHeaderInstanceDetail = [
            { label: 'ID', key: 'id', dataFormat: 'linkAction', linkTitle: 'Deployment Id', linkAction: this.deploymentStatusLinkAction.bind(this) },
            { label: 'Version', key: 'version' },
            { label: 'Created User', key: 'withAvatar' },
            { label: 'Created Date', key: 'createdAt', dataFormat: 'relativeTimestamp' },
            { label: 'Updated Date', key: 'updatedAt', dataFormat: 'relativeTimestamp' },
            { label: 'Status', key: 'status', dataFormat: 'statusAction' }
        ]

        return (
            <section className="studio-container">
                {loading &&
                    <Card>
                        <CardBody>
                            <BasicSpinner />
                        </CardBody>
                    </Card>
                }

                {!loading && !selectedInstanceId &&
                    <div>
                        <Row xs="1" md="1">
                            <Col>
                                {inputField('select', 'deploymentId', '', selectedDeploymentId, this.changeDeployment.bind(this), {
                                    container: 'content-float-right',
                                    input: 'content-border-none text-right'
                                }, workflows.map(workflow => ({ label: workflow.name, value: workflow.processId })))}
                                <h3>Monitor</h3>
                            </Col>
                        </Row>
                        <Row xs="1" md="2">
                            <Col>
                                <Card className='mb-0'>
                                    <CardBody className='p-0'>
                                        {this.getDeploymentChart('Instance Summary', this.state.deploymentStatus)}
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col>
                                <Card className='mb-0'>
                                    <CardBody className='p-0'>
                                        {this.getDeploymentChart('User Tasks', this.state.deploymentMetrics)}
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        <Row xs="1" md="1">
                            <Col className='pb-0'>
                                {dataView === 'instanceDetail' &&
                                    actionButton('Instance Timeline', () => { this.setState({ dataView: 'instanceTimeline' }) },
                                        'm-0 content-float-right', 'feather icon-clock fa-2x')
                                }
                                {dataView === 'instanceTimeline' &&
                                    actionButton('Instance Detail', () => { this.setState({ dataView: 'instanceDetail' }) },
                                        'm-0 content-float-right', 'feather icon-list fa-2x')
                                }
                                <h4 className='studio-primary'>
                                    {'Instance ' +
                                        (dataView === 'instanceTimeline' ? 'Timeline' : 'Detail') +
                                        (selectedDeploymentStatus ? ' - ' + selectedDeploymentStatus : '')
                                    }
                                </h4>
                            </Col>
                        </Row>
                        <Row xs="1" md="1">
                            <Col>
                                <Card className='mb-0'>
                                    <CardBody className="p-0">
                                        {dataView === 'instanceDetail' &&
                                            <StudioTable hideTableName={true}
                                                tableHeader={tableHeaderInstanceDetail}
                                                tableData={deploymentDetails}
                                                styleActions={true}
                                                defaultSort={{ sortIndex: 3, sortOrder: 1 }}
                                            />
                                        }
                                        {dataView === 'instanceTimeline' &&
                                            <Timeline data={deploymentDetails} />
                                        }
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                }

                {selectedInstanceId && <Task goBack={this.handleNavBack} instanceId={selectedInstanceId} />}

            </section>
        )
    }
}