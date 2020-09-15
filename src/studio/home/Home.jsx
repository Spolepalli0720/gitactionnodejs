import React, { Component } from "react";

import { connect } from "react-redux";

import Modern_Isometric from "../../assets/studio/images/modern-isometric.jpg";
import Digital_solutions from "../../assets/studio/svg/digital-solutions.svg";
import Model_Management from "../../assets/studio/images/model-management.png";
import Sensor_Fabric from "../../assets/studio/svg/sensor-fabric.svg";
import Cognitive_Fusion from "../../assets/studio/svg/cognitive-fusion.svg";
import Design from "../../assets/studio/svg/design.svg";
import Deploy from "../../assets/studio/svg/deploy.svg";
import Run from "../../assets/studio/svg/run.svg";

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
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
        };
    }

    render() {
        const { features, functions } = this.state;
        return (
            <section className="studio-container">
                <div className="row">
                    <div className="col-xl-5 col-md-12 d-flex">
                        <div className="card text-center br-10x">
                            {/* <div className="card-body"> */}
                            <div className="row mt-5">
                                <div className="col">
                                    <h2 className="mb-2">Digital Solution Studio</h2>
                                    <p>Digital Platform for an Intuitive Enterprise</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <img height="100%" width="100%" src={Modern_Isometric} alt="Modern_Isometric" />
                                </div>
                            </div>
                            <div className="row mb-4">
                                <div className="col">
                                    <button className="btn btn-primary br-10x">GET STARTED</button>
                                </div>
                            </div>
                            {/* </div> */}
                        </div>
                    </div>
                    <div className="col-xl-7 col-md-12 d-flex">
                        <div className="container-fluid">
                            <div className="row align-self-flex-start">
                                {features.map((dataObject, dataObjectIndex) =>
                                    <div key={dataObjectIndex} className="col-lg-6 col-md-12">
                                        <div className="card br-10x">
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col"><h4 className="text-muted">{dataObject.title}</h4></div>
                                                </div>
                                                <div className="row">
                                                    <div className="col">
                                                        <p className='align-self-center'>{dataObject.content}</p>
                                                    </div>
                                                    <div className="col text-right">
                                                        <img height="80rem" width="80rem" src={dataObject.image} alt="Sensor_Fabric" />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col">
                                                        <a href="/home">Know More &gt;&gt;</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="row align-self-flex-end">
                                {functions.map((dataObject, dataObjectIndex) =>
                                    <div key={dataObjectIndex} className="col-lg-4 col-md-12 d-flex">
                                        <div className="card br-10x">
                                            <div className="card-body">
                                                <img height="35em" width="35em" src={dataObject.image} alt="Design" />
                                                <h5 className="text-muted">{dataObject.title}</h5>
                                                <p className="text-justify" style={{ fontSize: '0.8em' }}>
                                                    {dataObject.content}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

const mapStateToProps = state => {
    return {
        notificationMessage: state.notificationMessage
    }
}

export default connect(mapStateToProps)(Dashboard);
