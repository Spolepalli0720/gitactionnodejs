import React, { Component } from "react";
import { Row, Col, Card, CardBody } from 'reactstrap';

import { BasicSpinner } from "../utils/BasicSpinner";
import { processEngine } from '../services/ProcessEngine';

class TaskMetrics extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true, engineSummary: []
        }
    }

    componentDidMount() {

        processEngine.getTaskSummary().then(response => {
            this.setState({ loading: false, engineSummary: response });
        }).catch(error => {
            console.warn('processEngine.getTaskSummary:', error.message);
            this.setState({ loading: false });
        });

    }

    render() {
        const { loading, engineSummary } = this.state;

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
                            <Col>
                                <h3>Task Summary</h3>
                            </Col>
                        </Row>

                        <Row xs="1" md="4">
                            {engineSummary.map((summaryInfo, summaryIndex) =>
                                <Col key={summaryIndex}>
                                    <Card className="br-10x mb-1">
                                        <CardBody className="text-center p-1">
                                            <h1 className="mt-2">{summaryInfo.count}</h1>
                                            <div className="mt-2 mb-2">{summaryInfo.name}</div>
                                        </CardBody>
                                    </Card>
                                </Col>
                            )}
                        </Row>
                    </div>
                }
            </section>
        )

    }

}
export default TaskMetrics;
