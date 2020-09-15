import React, { Component } from "react";

import { Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import { Button } from "react-bootstrap";
import { connect } from 'react-redux';
import { VectorMap } from 'react-jvectormap';

import { Network, Storage, CloudSelection, AccountCreds, Services } from "../cards/cards";
// import { Compute } from "../cards/cards";

import Loki from 'react-loki';
import './dashboard.scss';
class dashboard extends Component {
    state = {
        renderWizard: true,
        storageData: [
            {
                'image': 'Amazon-Simple-Storage-Service-S3_Bucket_light-bg.svg',
                'text': {
                    'value': 24,
                    'description': 'S3 Buckets'
                }
            },
            {
                'image': 'Amazon-Elastic-Block-Store-EBS_Snapshot_light-bg.svg',
                'text': {
                    'value': 124972,
                    'description': 'Snapshots Total'
                }
            },
            {
                'image': 'Amazon-Simple-Storage-Service-S3_Bucket-with-Objects_dark-bg.svg',
                'text': {
                    'value': 3377844,
                    'description': 'Snapshots Size'
                }
            },
            {
                'image': 'Amazon-Elastic-Block-Store-EBS_Volume_light-bg.svg',
                'text': {
                    'value': 12,
                    'description': 'EBS Volumes'
                }

            },
        ],
        computeData: [
            {
                'image': 'Amazon-VPC.svg',
                'text': {
                    'value': '18',
                    'description': 'VPC'
                },
            },
            {
                'image': 'Amazon-VPC_NAT-Gateway_light-bg.svg',
                'text': {
                    'value': '0',
                    'description': 'NAT GATEWAY'
                },
            },
            {
                'image': 'AWS-Identity-and-Access-Management-IAM_Add-on_light-bg.svg',
                'text': {
                    'value': '11',
                    'description': 'KEY PAIR'
                },
            },
            {
                'image': 'VMware-Cloud-On-AWS_light-bg.svg',
                'text': {
                    'value': '18',
                    'description': 'ACL'
                },
            },
            {
                'image': 'VMware-Cloud-On-AWS_light-bg.svg',
                'text': {
                    'value': '16',
                    'description': 'INTERNET GATEWAY'
                },
            },
            {
                'image': 'Amazon-EC2-Auto-Scaling_light-bg.svg',
                'text': {
                    'value': '0',
                    'description': 'AUTOSCALING GROUP'
                },
            },
            {
                'image': 'Security-Identity-and-Compliance.svg',
                'text': {
                    'value': '98',
                    'description': 'SECURITY GROUP'
                },
            },
            {
                'image': 'Amazon-EC2_Elastic-IP-Address_light-bg.svg',
                'text': {
                    'value': '0',
                    'description': 'ELSTIC IP'
                },
            },
            {
                'image': 'Amazon-EC2-Container-Registry_Registry_light-bg.svg',
                'text': {
                    'value': '20',
                    'description': 'ROUTE TABLE'
                },
            },
        ],
        networkData: [
            {
                'image': 'fas fa-window-maximize',
                'text': {
                    'value': '1',
                    'description': 'OK'
                },
                'Functions': 0,
            },
            {
                'image': 'fas fa-window-maximize',
                'text': {
                    'value': '0',
                    'description': 'INSUFFICIENT_DATA'
                },
                'Functions': 1,
            },
            {
                'image': 'fas fa-window-maximize',
                'text': {
                    'value': '0',
                    'description': 'ALARM'
                },
                'Functions': 0,
            },
        ],
        EC2_Data: [
            {
                'image': 'fas fa-stop-circle',
                'imgColor': 'red',
                'status': 'EC2 Stopped',
                'value': '1',
            },
            {
                'image': 'fas fa-play-circle',
                'imgColor': 'green',
                'status': 'EC2 Running',
                'value': '8',
            },
            {
                'image': 'fas fa-trash-alt',
                'imgColor': 'yellow',
                'status': 'EC2 Terminated',
                'value': '0',
            },
        ],
        AWS_Regions: [
            {
                latLng: [38.13, -78.45],
                name: 'USA-east-Verginia : 12 Instances'
            },
            {
                latLng: [39.96, -83],
                name: 'USA-east-Ohio : 8 Instances'
            },
            {
                latLng: [37.35, -121.96],
                name: 'USA-west-California: 8 Instances'
            },
            {
                latLng: [46.15, -123.88],
                name: 'USA-west-Oregon: 8 Instances'
            },
            {
                latLng: [53, -8],
                name: 'EU-west-Ireland: 8 Instances'
            },
            {
                latLng: [51, -0.1],
                name: 'EU-west-London: 8 Instances'
            },
            {
                latLng: [48.86, 2.35],
                name: 'EU-west-Paris: 8 Instances'
            },
            {
                latLng: [50, 8],
                name: 'EU-central-FrankFurt: 8 Instances'
            },
            {
                latLng: [45.5, -73.6],
                name: 'CA-central-Canada Central: 8 Instances'
            },
            {
                latLng: [19.08, 72.88],
                name: 'AP-south-Mumbai: 8 Instances'
            },
            {
                latLng: [37.56, 126.98],
                name: 'AP-northeast-Seoul: 8 Instances'
            },
            {
                latLng: [35.41, 139.42],
                name: 'AP-northeast-Tokyo: 8 Instances'
            },
            {
                latLng: [-33.86, 151.2],
                name: 'AP-southeast-Sydney: 8 Instances'
            },
            {
                latLng: [1.37, 103.8],
                name: 'AP-southeast-Singapore: 8 Instances'
            },
            {
                latLng: [-23.34, -46.38],
                name: 'SA-east-Sao Paulo: 8 Instances'
            },
        ],
    }
    _mergeValues(values) {
        this.setState({
            user: {
                ...this.state.user,
                ...values
            },
        });
    }

    render() {
        const { computeData, networkData, storageData, EC2_Data, AWS_Regions, renderWizard } = this.state;
        const complexSteps = [
            {
                label: 'Step 1',
                icon:
                    <div>
                        <Row style={{ fontSize: '0.8em' }}>
                            <Col>1</Col>
                            Cloud
                        </Row>
                    </div>,
                component: <CloudSelection user={this.state.user} />
            },
            {
                label: 'Step 2',
                icon:
                    <div>
                        <Row style={{ fontSize: '0.8em' }}>
                            <Col>2</Col>
                            Accounts
                        </Row>
                    </div>,
                component: <AccountCreds user={this.state.user} />
            },
            {
                label: 'Step 3',
                icon:
                    <div>
                        <Row style={{ fontSize: '0.8em' }}>
                            <Col>3</Col>
                            Services
                        </Row>
                    </div>,
                component: <Services user={this.state.user} />
            },
        ];
        return (
            <section className="studio-container">
                <Row>
                    <Col />
                    <Col className="text-center">
                        <h1 style={{ fontSize: '3em' }}>{renderWizard ? 'Cloud Discovery' : 'Dashboard'}</h1>
                    </Col>
                    <Col className="text-right pb-2">
                        <Button variant="primary" onClick={() => this.setState({ renderWizard: !renderWizard })} >{!renderWizard ? 'Cloud Discovery' : 'Dashboard'} </Button>
                    </Col>
                </Row>
                {renderWizard ?
                    <Row>
                        <Col className="wizard-container bg-white">
                            <Loki
                                steps={complexSteps}
                                onNext={() => this._mergeValues()}
                                onBack={() => this._mergeValues()}
                                onFinish={() => this._finishWizard()}
                                noActions />
                        </Col>
                    </Row>
                    :
                    <div>
                        <Row>
                            <Col>
                                <Card>
                                    <CardBody>
                                        <Row>
                                            {EC2_Data.map((objData, objDataIndex) =>
                                                <Col key={objDataIndex} style={{ borderRight: '2px solid lightgrey' }}>
                                                    <div>
                                                        <div className="text-center" style={{ float: 'left', width: '20%', fontSize: "1.8em", color: objData.imgColor }}>
                                                            <i className={objData.image}></i>
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="text-muted" style={{ float: 'left', width: '18%', textTransform: 'uppercase', textOverflow: 'ellipsis' }}>
                                                                {objData.status}
                                                            </div>
                                                        </div>
                                                        <div className="text-left" style={{ float: 'right', width: '62%', fontSize: '2em' }}>
                                                            <strong>{objData.value}</strong>
                                                        </div>
                                                    </div>
                                                </Col>
                                            )}
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        <Row lg={3} xs={1}>
                            <Col xl={3} className="cards-container">
                                <Storage dataObject={storageData} />
                            </Col>
                            <Col xl={6} className="cards-container">
                                {/* <Compute dataObject={computeData} layoutType={this.props.layoutType} width={this.state.width} /> */}
                                <div>
                                    <Card className="br-10x">
                                        <CardBody>
                                            <CardTitle style={{ fontSize: '1.4em' }}>
                                                <strong>Elastic compute cloud</strong>
                                            </CardTitle>
                                            <p className="text-muted">Number of Instances per AWS region</p>
                                            <div style={{ height: '400px', width: '100%' }}>
                                                <VectorMap
                                                    map={"world_mill"}
                                                    zoomButtons={false}
                                                    scaleColors={["#2196F3", "#1B8BF9"]}
                                                    normalizeFunction="polynomial"
                                                    hoverOpacity={0.7}
                                                    hoverColor="!1"
                                                    regionStyle={{
                                                        initial: {
                                                            fill: this.props.layoutType !== 'dark' ? "#ff8c00" : "#0e90ff"
                                                        }
                                                    }}
                                                    ref="map"
                                                    containerStyle={{
                                                        width: "100%",
                                                        height: "100%"
                                                    }}
                                                    containerClassName="set-map"
                                                    markerStyle={{
                                                        initial: {
                                                            r: 9,
                                                            fill: this.props.layoutType !== 'dark' ? "#0e90ff" : "#ff8c00",
                                                            "fill-opacity": 0.9,
                                                            stroke: "#fff",
                                                            "stroke-width": 7,
                                                            "stroke-opacity": 0.4
                                                        },
                                                        hover: {
                                                            stroke: "#000000",
                                                            "fill-opacity": 1,
                                                            "stroke-width": 1.5
                                                        },
                                                    }}
                                                    backgroundColor="transparent"
                                                    markers={AWS_Regions}
                                                />
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div>
                                <div className="cards-container">
                                    <Row xs={1} xl={3}>
                                        {computeData.map((objData, objDataIndex) =>
                                            <Col key={objDataIndex}>
                                                <Card className="br-10x">
                                                    <CardBody>
                                                        <Row>
                                                            <Col xs={3} className="text-center">
                                                                <img height="100%" width='100%' src={require(`../../../assets/studio/svg/environment/${objData.image}`)} alt="objImg" />
                                                            </Col>
                                                            <Col>
                                                                <div style={{ fontSize: '1.5em' }}>
                                                                    <strong>{objData.text.value}</strong>
                                                                </div>
                                                                <div className="text-muted" style={{ textTransform: 'uppercase', textOverflow: 'ellipsis' }}>
                                                                    {objData.text.description}
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        )}
                                    </Row>
                                </div>
                            </Col>
                            <Col xl={3} className="cards-container">
                                <Network dataObject={networkData} />
                            </Col>
                        </Row>
                    </div>
                }

            </section >
        );
    }
}

const mapStateToProps = state => {
    return {
        layoutType: state.layoutType,
    }
}

export default connect(mapStateToProps)(dashboard);