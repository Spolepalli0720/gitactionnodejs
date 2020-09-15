import React from "react";
import { Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import { Button } from 'react-bootstrap';
import { Form } from "react-bootstrap";
import { Chart as GeoChart } from "react-google-charts";
// import { VectorMap } from 'react-jvectormap';

import Chart from "react-apexcharts";

import supportChart1 from '../../charts/default-support-card-1';
import revenuChart from '../../charts/revenu-chart';

// Images
import AWS_icon from '../../../assets/studio/images/AWS_Logo.png';
import AZURE_icon from '../../../assets/studio/images/Azure_Logo.png';
import GoogleCloud_icon from '../../../assets/studio/images/GoogleCloud_Logo.png';
import CloudFoundry_icon from '../../../assets/studio/images/CloudFoundry_Logo.png';

// DASHBOARD COMPONENTS
import './cards.scss';

export const Storage = (props) => {
    return (
        <div>
            {
                props.dataObject.map((objData, objDataIndex) =>
                    <Card className="p-3 br-10x" key={objDataIndex}>
                        <Row>
                            <Col xs={2} className="flex-d align-items-middle text-center" style={{ borderRight: '1px solid lightgrey', fontSize: '1.5em', color: 'red' }}>
                                <img src={require(`../../../assets/studio/svg/environment/${objData.image}`)} alt="name" />
                            </Col>
                            <Col>
                                <div style={{ fontSize: '1.4em' }}>
                                    <strong>{objData.text.value}</strong>
                                </div>
                                <div className="text-muted" style={{ textTransform: 'uppercase' }}>
                                    {objData.text.description}
                                </div>
                            </Col>
                        </Row>
                    </Card>
                )
            }
            < Card className="br-10x" >
                <CardBody>
                    <CardTitle style={{ fontSize: '1.4em' }}>
                        <strong>Elastic Block Store</strong>
                    </CardTitle>
                    <p className="text-muted">Number of EBS volumes per type</p>
                    <Chart {...revenuChart} />
                </CardBody>
            </Card >
        </div>
    )
}

export const Compute = (props) => {
    return (
        <div>
            {/* <div>
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
                                        fill: "#ff8c00"
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
                                        fill: "#0e90ff",
                                        "fill-opacity": 0.9,
                                        stroke: "#fff",
                                        "stroke-width": 7,
                                        "stroke-opacity": 0.4
                                    },
                                    hover: {
                                        stroke: "#000000",
                                        "fill-opacity": 1,
                                        "stroke-width": 1.5
                                    }
                                }}
                                backgroundColor="transparent"
                                markers={[
                                    {
                                        latLng: [41.9, 12.45],
                                        name: "Vatican City"
                                    },
                                    {
                                        latLng: [43.73, 7.41],
                                        name: "Monaco"
                                    },
                                    {
                                        latLng: [-0.52, 166.93],
                                        name: "Nauru"
                                    },
                                    {
                                        latLng: [-8.51, 179.21],
                                        name: "Tuvalu"
                                    },
                                    {
                                        latLng: [43.93, 12.46],
                                        name: "San Marino"
                                    },
                                    {
                                        latLng: [47.14, 9.52],
                                        name: "Liechtenstein"
                                    },
                                    {
                                        latLng: [7.11, 171.06],
                                        name: "Marshall Islands"
                                    },
                                    {
                                        latLng: [17.3, -62.73],
                                        name: "Saint Kitts and Nevis"
                                    },
                                    {
                                        latLng: [3.2, 73.22],
                                        name: "Maldives"
                                    },
                                    {
                                        latLng: [35.88, 14.5],
                                        name: "Malta"
                                    },
                                    {
                                        latLng: [12.05, -61.75],
                                        name: "Grenada"
                                    },
                                    {
                                        latLng: [13.16, -61.23],
                                        name: "Saint Vincent and the Grenadines"
                                    },
                                    {
                                        latLng: [13.16, -59.55],
                                        name: "Barbados"
                                    },
                                    {
                                        latLng: [17.11, -61.85],
                                        name: "Antigua and Barbuda"
                                    },
                                    {
                                        latLng: [-4.61, 55.45],
                                        name: "Seychelles"
                                    },
                                    {
                                        latLng: [7.35, 134.46],
                                        name: "Palau"
                                    },
                                    {
                                        latLng: [42.5, 1.51],
                                        name: "Andorra"
                                    },
                                    {
                                        latLng: [14.01, -60.98],
                                        name: "Saint Lucia"
                                    },
                                    {
                                        latLng: [6.91, 158.18],
                                        name: "Federated States of Micronesia"
                                    },
                                    {
                                        latLng: [1.3, 103.8],
                                        name: "Singapore"
                                    },
                                    {
                                        latLng: [1.46, 173.03],
                                        name: "Kiribati"
                                    },
                                    {
                                        latLng: [-21.13, -175.2],
                                        name: "Tonga"
                                    },
                                    {
                                        latLng: [15.3, -61.38],
                                        name: "Dominica"
                                    },
                                    {
                                        latLng: [-20.2, 57.5],
                                        name: "Mauritius"
                                    },
                                    {
                                        latLng: [26.02, 50.55],
                                        name: "Bahrain"
                                    },
                                    {
                                        latLng: [0.33, 6.73],
                                        name: "São Tomé and Príncipe"
                                    }
                                ]}
                            />
                        </div>
                    </CardBody>
                </Card>
            </div>
            <div className="cards-container">
                <Row xs={1} xl={2}>
                    {props.dataObject.map((objData, objDataIndex) =>
                        <Col key={objDataIndex}>
                            <Card className="br-10x">
                                <CardBody>
                                    <Row>
                                        <Col xs={2} className="text-left" style={{ color: 'green' }}>
                                            <i className={objData.image}></i>
                                        </Col>
                                        <Col>
                                            <div style={{ fontSize: '1.4em' }}>
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
            </div> */}
            <div>
                <Card className="br-10x">
                    <CardBody>
                        <CardTitle style={{ fontSize: '1.4em' }}>
                            <strong>Elastic compite cloud</strong>
                        </CardTitle>
                        <p className="text-muted">Number of Instances per AWS region</p>
                        < GeoChart
                            width={'100%'}
                            height={'100%'}
                            chartType="GeoChart"
                            loader='loading...'
                            data={
                                [
                                    ['Country', 'Popularity'],
                                    ['Germany', 200],
                                    ['United States', 300],
                                    ['Brazil', 400],
                                    ['Canada', 500],
                                    ['France', 600],
                                    ['RU', 700],
                                    ['India', 400]
                                ]}
                            options={{
                                tooltip: {
                                    isHtml: true
                                },
                                legend: 'none',
                                colors: ['#ff8c00'],
                                backgroundColor: props.layoutType === 'dark' ? '#0F192F' : '#ffffff'
                            }}
                            // Note: you will need to get a mapsApiKey for your project.
                            // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
                            mapsApiKey="YOUR_KEY_HERE"
                            rootProps={{ 'data-testid': '1' }}
                        />
                    </CardBody>
                </Card>
            </div>
            <div className="cards-container">
                <Row xs={1} xl={2}>
                    {props.dataObject.map((objData, objDataIndex) =>
                        <Col key={objDataIndex}>
                            <Card className="br-10x">
                                <CardBody>
                                    <Row>
                                        <Col xs={2} className="text-left" style={{ color: 'green' }}>
                                            <i className={objData.image}></i>
                                        </Col>
                                        <Col>
                                            <div style={{ fontSize: '1.4em' }}>
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
        </div>
    )
}

export const Network = (props) => {
    return (
        <div>
            <div>
                <Card className="br-10x">
                    <CardBody>
                        <CardTitle style={{ fontSize: '1.4em' }}>
                            <strong>Total Bill</strong>
                        </CardTitle>
                        <p className="text-muted">Current month-to-date balances for March 2019</p>
                        <div className="text-center p-2">
                            <h1 className="text-muted">
                                1.30 USD
                                    </h1>
                        </div>
                        <Chart {...supportChart1} />
                    </CardBody>
                </Card>
            </div>
            <div className="cards-container">
                <Row xs={1}>
                    {props.dataObject.map((objData, objDataIndex) =>
                        <Col key={objDataIndex}>
                            <Card className="br-10x">
                                <CardBody>
                                    <Row>
                                        <Col xs={2} className="text-left" style={{ color: 'yellow' }}>
                                            <i className={objData.image}></i>
                                        </Col>
                                        <Col>
                                            <div style={{ fontSize: '1.4em' }}>
                                                <strong>{objData.text.value}</strong>
                                            </div>
                                            <div className="text-muted" style={{ textTransform: 'uppercase' }}>
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
        </div>
    )
}

// CLOUD DISCOVERY WIZARD

export function CloudSelection(props) {
    return (
        <div className="wizard-content cloud-wizard-content">
            <Row xs={1} md={2}>
                <Col className="text-center" >
                    <div className="outer-wrapper">
                        <div className="frame" onClick={props.onNext}>
                            <img src={AWS_icon} alt="icon" />
                        </div>
                    </div>
                </Col>
                <Col className="text-center" >
                    <div className="outer-wrapper">
                        <div className="frame" onClick={props.onNext}>
                            <img src={AZURE_icon} alt="icon" />
                        </div>
                    </div>
                </Col>
                <Col className="text-center" >
                    <div className="outer-wrapper">
                        <div className="frame" onClick={props.onNext}>
                            <img src={GoogleCloud_icon} alt="icon" />
                        </div>
                    </div>
                </Col>
                <Col className="text-center" >
                    <div className="outer-wrapper">
                        <div className="frame" onClick={props.onNext}>
                            <img src={CloudFoundry_icon} alt="icon" />
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export function AccountCreds(props) {
    return (
        <div className="wizard-content">
            <Row>
                <Col>
                    <h3>Cloud tool full path:</h3>
                </Col>
                <Col>
                    <input type="text" className="form-control" name="pathname" />
                </Col>
            </Row>
            <Row>
                <Col>
                    <h3>AWS Account:</h3>
                </Col>
                <Col>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Control as="select">
                            <option value="">Select one</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button variant="danger" onClick={props.onBack}>Go Back</Button>
                </Col>
                <Col>
                    <Button variant="primary" className="float-right" onClick={props.onNext}>Go to Services</Button>
                </Col>
            </Row>
        </div >
    );
}

export function Services(props) {
    return (
        <div className="wizard-content">
            <Row>
                <Col>
                    <h3>Services:</h3>
                </Col>
                <Col>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Control as="select">
                            <option value="">Select one</option>
                            <option value="COMPUTE">Compute</option>
                            <option value="NETWORK">Network</option>
                            <option value="STORAGE">Storage</option>
                            <option value="DATABASES">Databases</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button variant="danger" onClick={props.onBack}>Go Back</Button>
                </Col>
                <Col>
                    <Button variant="success" className="float-right" onClick={props.onFinish}>Finish</Button>
                </Col>
            </Row>
        </div >
    );
}