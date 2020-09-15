import React, { Component } from "react";
import { Row, Col } from 'reactstrap';

import Modern_Isometric from "../../assets/studio/images/modern-isometric.jpg";
import Digital_solutions from "../../assets/studio/svg/digital-solutions.svg";
import Model_Management from "../../assets/studio/images/model-management.png";
import Sensor_Fabric from "../../assets/studio/svg/sensor-fabric.svg";
import Cognitive_Fusion from "../../assets/studio/svg/cognitive-fusion.svg";
import Design from "../../assets/studio/svg/design.svg";
import Deploy from "../../assets/studio/svg/deploy.svg";
import Run from "../../assets/studio/svg/run.svg";

class About extends Component {
    state = {
        features: [
            {
                title: 'Digital Solution',
                content: 'Accelerated assembly, Any-to-Any Integrations',
                image: Digital_solutions,
            },
            {
                title: 'Model Management',
                content: 'Model Catalogue & Deployment, Monitoring & Governance',
                image: Model_Management,
            },
            {
                title: 'Cognitive Fusion',
                content: 'Scalable Data Pipeline, Artificial Intelligence',
                image: Cognitive_Fusion,
            },
            {
                title: 'Sensor Fabric',
                content: 'Edge Orchestration and Automation',
                image: Sensor_Fabric,
            },
        ],
        functions: [
            {
                title: 'Design',
                content: 'Get started with our visual IDE for designing the Applications, Workflows, Models and Rules.  A Visual IDE for Any-to-Any Enterprise Integration Solutions.  Design and Build APIs, and Integrate at a lightning speed.',
                image: Design,
            },
            {
                title: 'Deploy',
                content: 'Deploy your Apps with one click to the Environment of your choice with Cloud support for AWS, Azure, Google Cloud and OpenStack. Leverage the built CI/CD Pipeline via the Platform APIs to rapidly build, test, migrate, export and deploy the Solutions across Environments.',
                image: Deploy,
            },
            {
                title: 'Run',
                content: 'Run and Monitor APIs of your Solutions from your Enterprise Dashboard. Configure and Scale your Environments, Monitor Real-Time Health and Stability of your Solution Landscape.',
                image: Run,
            },
        ]
    }

    render() {
        const { features, functions } = this.state;
        return (
            <section className="studio-container">
                <Row xs="1" md="2">
                    <Col className="card pt-0 pb-0 mt-2 mb-2">
                        <Row xs="1" md="1">
                            <Col className="text-center mt-4">
                                <h2 className="mb-2">Digital Solution Studio</h2>
                                <p>Digital Platform for an Intuitive Enterprise</p>
                            </Col>
                            <Col className="text-center">
                                <img height="100%" width="100%" src={Modern_Isometric} alt="Modern_Isometric" />
                            </Col>
                            <Col className="text-center">
                                <button className="btn btn-primary br-10x">GET STARTED</button>
                            </Col>
                        </Row>
                    </Col>
                    <Col className="pt-0 pb-0 mt-2 mb-2">
                        <Row xs="1" md="2">
                            {features.map((dataObject, dataObjectIndex) =>
                                <Col key={dataObjectIndex}  className="card mb-2">
                                    <Row xs="1" md="1">
                                        <Col className="p-1">
                                            <h4 className="text-muted">{dataObject.title}</h4>
                                        </Col>
                                    </Row>
                                    <Row xs="1" md="2">
                                        <Col md="8" className="p-1">
                                            <p className='text-left'>{dataObject.content}</p>
                                        </Col>
                                        <Col md="4" className="text-right p-1">
                                            <img height="60rem" width="60rem" src={dataObject.image} alt={dataObject.title} />
                                        </Col>
                                    </Row>
                                    <Row xs="1" md="1">
                                        <Col className="p-1">
                                            <a href="/home">Know More &gt;&gt;</a>
                                        </Col>
                                    </Row>
                                </Col>
                            )}
                        </Row>
                        <Row xs="1" md="3" className="mt-2">
                            {functions.map((dataObject, dataObjectIndex) =>
                                <Col key={dataObjectIndex} className="card text-bottom">
                                    <Row xs="1" md="1">
                                        <Col className="p-1">
                                            <img height="30em" width="30em" src={dataObject.image} alt="Design" />
                                        </Col>
                                    </Row>
                                    <Row xs="1" md="1">
                                        <Col className="p-1">
                                            <h4 className="text-muted">{dataObject.title}</h4>
                                        </Col>
                                    </Row>
                                    <Row xs="1" md="1">
                                        <Col className="p-1">
                                            <p className="text-justify" style={{ fontSize: '0.75rem' }}>{dataObject.content}</p>
                                        </Col>
                                    </Row>
                                </Col>
                            )}
                        </Row>
                    </Col>
                </Row>
            </section>
        );
    }
}
export default About;
