import React from 'react';
import { Form, ProgressBar, Row, Col } from 'react-bootstrap';
import { Button, CardBody, Card, } from 'reactstrap';
import { inputField } from "../utils/StudioUtils";
import './NewScraper.scss';


const LOGO = require("../../assets/studio/images/python-logo.png");
const SCRAPY = require("../../assets/studio/images/Scrapy.png");
const BEAUTIFUL_SOUP = require("../../assets/studio/images/Beautiful-Soup.png");
const SELINIUM = require("../../assets/studio/images/selinium.png");




export default class NewScraper extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            formStep: 1,
            scraperCreateValues: {
                name: "",
                image: "",
                scraperType: "",
                description: "",

            },
            formProgress: {
                "STEP_1": "INITIAL",
                "STEP_2": "INITIAL",
                "STEP_3": "INITIAL",
                "STEP_4": "INITIAL",
                "STEP_5": "INITIAL",
                "STEP_6": "INITIAL",
                "STEP_7": "INITIAL",
            }
        }
        this.formConfig = {
            "STEP_1": [
                {
                    "label": "Name",
                    "key": "name",
                    "id": "name",
                    "type": "text",
                    "required": true,
                },
                {
                    "label": "Image",
                    "key": "image",
                    "id": "image",
                    "type": "img",
                    "required": true,
                },
                {
                    "label": "Scraper Type",
                    "key": "scraper_type",
                    "id": "scraper_type",
                    "type": "select",
                    "required": false,
                    "options": [
                        {
                        },
                        {
                        },
                        {
                        },
                    ]
                },
                {
                    "label": "Description",
                    "key": "description",
                    "id": "description",
                    "type": "textarea",
                }
            ],
            "STEP_2": [
                {
                    "label": "Scrapy",
                    "key": "scrapy",
                    "id": "scrapy",
                    "type": "img",
                    "background": SCRAPY,
                    "logo": LOGO

                },
                {
                    "label": "Beautiful Soup",
                    "key": "beautiful_soup",
                    "id": "beautiful_soup",
                    "type": "image",
                    "background": BEAUTIFUL_SOUP,
                    "logo": LOGO

                },
                {
                    "label": "Selinium",
                    "key": "selinium",
                    "id": "selinium",
                    "type": "image",
                    "background": SELINIUM,
                    "logo": LOGO
                },
            ],
            "STEP_3": [
                {
                    "label": "code Editor",
                }
            ],
            "STEP_4": [
                {
                    "lable": "Swagger UI",
                },
            ],
            "STEP_5": [
                {
                    "label": "Deployment",
                },
            ],
            "STEP_6": [
                {
                    "label": "Testing",
                },
            ],
            "STEP_7": [
                {
                    "label": "Publish Template",
                }
            ],
        }
        this.configTabs = [
            {
                label: "General",
                key: "STEP_1",
                index: 1
            },
            {
                label: "Select Framework",
                key: "STEP_2",
                index: 2
            },
            {
                label: "Code",
                key: "STEP_3",
                index: 3
            },
            {
                label: "Swagger",
                key: "STEP_4",
                index: 4
            },
            {
                label: "Deploy",
                key: "STEP_4",
                index: 5
            },
            {
                label: "Test",
                key: "STEP_4",
                index: 6
            },
            {
                label: "Publish",
                key: "STEP_4",
                index: 7
            },
        ]
    }

    renderForm() {
        const { formStep, scraperCreateValues } = this.state;

        const handleValuesChange = (field, child, name, val) => {
            let scraperCreate = this.state.scraperCreateValues;
            switch (field.id) {
                case "name":
                    scraperCreate.name = val;
                    break;
                case "image":
                    scraperCreate.image = val;
                    break;
                case "scraper_type":
                    scraperCreate.scraperType = val;
                    break;
                case "description":
                    scraperCreate.description = val;
                    break;
                default:
                    break;

            }
            this.setState({ scraperCreateValues: scraperCreate })
        }

        switch (formStep) {
            case 1:
                return (
                    <>
                        {this.formConfig.STEP_1.map((field, fieldIndex) =>
                            <div key={fieldIndex}>
                                {inputField(field.type, field.key, field.label, scraperCreateValues[field.key], handleValuesChange.bind(this, field, ''),
                                    {
                                        container: 'form-container-style',
                                        label: 'form-label-style',
                                        input: 'form-input-style',
                                        required: true,
                                    }, "", field.key)}
                            </div>
                        )}
                    </>
                );
            case 2:
                return (

                    <>
                        <h5>Select Framework</h5>
                        <Row xs='1' md='3'>
                            {this.formConfig.STEP_2.map((field, fieldIndex) =>
                                <Col key={fieldIndex}>
                                    <Card>
                                        <CardBody no-padding>
                                            <Row xs="1">
                                                <Col className="text-right py-1">{field.logo ? <img src={field.logo} height="20px" width="20px" alt=""></img> : ''}</Col>
                                                <Col className="text-center">{field.background ? <img src={field.background} height="50px" width="50px" alt=' ' ></img> : ''}</Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                            )}
                        </Row>
                    </>
                );
            case 3:
                return (
                    <>
                        {this.formConfig.STEP_3.map((field, fieldIndex) =>
                            <Form.Group key={fieldIndex}>
                                <Form.Label>{field.label}</Form.Label>
                            </Form.Group>
                        )}
                    </>
                );
            case 4:
                return (
                    <>
                        {this.formConfig.STEP_4.map((field, fieldIndex) =>
                            <Form.Group key={fieldIndex}>
                                <Form.Label>{field.label}</Form.Label>
                            </Form.Group>
                        )}
                    </>
                );
            case 5:
                return (
                    <>
                        {this.formConfig.STEP_5.map((field, fieldIndex) =>
                            <Form.Group key={fieldIndex}>
                                <Form.Label>{field.label}</Form.Label>
                            </Form.Group>
                        )}
                    </>
                );
            case 6:
                return (
                    <>
                        {this.formConfig.STEP_6.map((field, fieldIndex) =>
                            <Form.Group key={fieldIndex}>
                                <Form.Label>{field.label}</Form.Label>
                            </Form.Group>
                        )}
                    </>
                );
            case 7:
                return (
                    <>
                        {this.formConfig.STEP_7.map((field, fieldIndex) =>
                            <Form.Group key={fieldIndex}>
                                <Form.Label>{field.label}</Form.Label>
                            </Form.Group>
                        )}
                    </>
                );
            default:
                return;
        }
    }

    render() {
        return (
            <div className="scraper-create-modal-container">
                <div className="scraper-create-modal-tab">
                    <div className="scraper-create-modal-tabs">
                        {this.configTabs.map((step, stepIndex) =>
                            <div key={stepIndex} className={`form-step ${this.state.formStep === step.index ? "selected-form-step" : ""}`}>
                                <div className={`step-number  progress-${this.state.formProgress[step.key]}`}>{step.index}</div>
                                <div className="step-text">{step.label}</div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="scraper-create-modal-content">
                    <div className="modal-form-container">
                        <div className="progress-bar-container">
                            {this.state.formStep === 1 && <ProgressBar className="form-progress-bar" variant="secondary" now={14} />}
                            {this.state.formStep === 2 && <ProgressBar className="form-progress-bar" variant="secondary" now={28} />}
                            {this.state.formStep === 3 && <ProgressBar className="form-progress-bar" variant="secondary" now={42} />}
                            {this.state.formStep === 4 && <ProgressBar className="form-progress-bar" variant="secondary" now={56} />}
                            {this.state.formStep === 5 && <ProgressBar className="form-progress-bar" variant="secondary" now={70} />}
                            {this.state.formStep === 6 && <ProgressBar className="form-progress-bar" variant="secondary" now={85} />}
                            {this.state.formStep === 7 && <ProgressBar className="form-progress-bar" variant="secondary" now={100} />}
                            <label className="form-progress-label">Progress:</label>
                        </div>
                        <Form className="create-form">
                            <Form.Group>
                                {this.renderForm()}
                            </Form.Group>
                        </Form>
                    </div>
                    <div className="modal-button-container">
                        {this.state.formStep === 1 && <Button className="modal-framework-button right" onClick={() => { this.setState({ formStep: this.state.formStep + 1 }) }}>Select Framework <i className="fas fa-long-arrow-alt-right"></i></Button>}

                        {this.state.formStep === 2 && <Button className="modal-general-button" onClick={() => { this.setState({ formStep: this.state.formStep - 1 }) }}><i className="fas fa-long-arrow-alt-left"></i> General</Button>}
                        {this.state.formStep === 2 && <Button className="modal-code-button right" onClick={() => { this.setState({ formStep: this.state.formStep + 1 }) }}>code<i className="fas fa-long-arrow-alt-right"></i></Button>}

                        {this.state.formStep === 3 && <Button className="modal-framework-button left" onClick={() => { this.setState({ formStep: this.state.formStep - 1 }) }}><i className="fas fa-long-arrow-alt-left"></i>Select Framework</Button>}
                        {this.state.formStep === 3 && <Button className="modal-swagger-button right" onClick={() => { this.setState({ formStep: this.state.formStep + 1 }) }}>Swagger<i className="fas fa-long-arrow-alt-right"></i></Button>}

                        {this.state.formStep === 4 && <Button className="modal-code-button left" onClick={() => { this.setState({ formStep: this.state.formStep - 1 }) }}><i className="fas fa-long-arrow-alt-left"></i>Code</Button>}
                        {this.state.formStep === 4 && <Button className="modal-deploy-button right" onClick={() => { this.setState({ formStep: this.state.formStep + 1 }) }}>Deploy<i className="fas fa-long-arrow-alt-right"></i></Button>}

                        {this.state.formStep === 5 && <Button className="modal-swagger-button left" onClick={() => { this.setState({ formStep: this.state.formStep - 1 }) }}><i className="fas fa-long-arrow-alt-left"></i>Swagger</Button>}
                        {this.state.formStep === 5 && <Button className="modal-test-button right" onClick={() => { this.setState({ formStep: this.state.formStep + 1 }) }}>Test<i className="fas fa-long-arrow-alt-right"></i></Button>}

                        {this.state.formStep === 6 && <Button className="modal-deploy-button left" onClick={() => { this.setState({ formStep: this.state.formStep - 1 }) }}><i className="fas fa-long-arrow-alt-left"></i>Deploy</Button>}
                        {this.state.formStep === 6 && <Button className="modal-publish-button right" onClick={() => { this.setState({ formStep: this.state.formStep + 1 }) }}>Publish<i className="fas fa-long-arrow-alt-right"></i></Button>}

                        {this.state.formStep === 7 && <Button className="modal-test-button left" onClick={() => { this.setState({ formStep: this.state.formStep - 1 }) }}><i className="fas fa-long-arrow-alt-left"></i>Test</Button>}
                        {this.state.formStep === 7 && <Button className="modal-publish-button right">Publish<i className="fas fa-long-arrow-alt-right"></i></Button>}
                    </div>
                </div>
            </div>
        )
    }
}