import React from 'react';
import { Form, ProgressBar } from 'react-bootstrap';
import { Row, Col } from 'reactstrap';
import { inputField, actionButton, ACTION_BUTTON } from "../utils/StudioUtils";
import './ScraperWizard.scss';

export default class ScraperWizard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            template: props.data.template,
            scraperData: this.props.data,
            properties: {},
            currentStep: Object.keys(this.props.data.design.layout)[0],
            preview: false,
        }
    }
    componentDidMount() {
        const { scraperData } = this.state;
        let properties = this.state.properties
        let scraper = scraperData
        for (const iterator of Object.keys(scraper.design.layout)) {
            for (const field of scraper.design.layout[iterator]) {
                if (field.type === "switch") {
                    if (field.value === "true")
                        properties[field.key] = true
                    else if (field.value === "false")
                        properties[field.key] = false
                }
                else
                    properties[field.key] = field.value
            }
        }
        this.setState({ properties: properties })
    }

    handleFormValuesChange(field, child, name, val) {
        let scraperData = this.state.scraperData;
        let scraperProperties = this.state.properties;
        let validUrl = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

        let key = field.key
        scraperProperties[key] = val

        if (key === "keywords") {
            scraperProperties[key] = val.split(",");
        }
        if (key === "url") {
            scraperProperties[key] = val
            if (validUrl.test(val)) {
                console.log('Valid url')
            } else {
                console.log('not valid url')
            }
        }

        scraperData.properties = scraperProperties;

        this.setState({
            properties: scraperProperties,
            scraperData: scraperData
        })
    }

    handleNavButtonClick(type, step) {
        const { scraperData } = this.state;
        let currentStep = this.state.currentStep
        let layout = Object.keys(scraperData.design.layout)

        if (type === "PREV") {
            if (currentStep === "Preview")
                this.setState({ currentStep: layout[layout.length - 1], preview: false })
            else
                this.setState({ currentStep: layout[layout.indexOf(currentStep) - 1] })
        } else if (type === "NEXT") {
            if (layout.indexOf(currentStep) !== layout.length - 1 && currentStep !== "Preview") {
                this.setState({ currentStep: layout[layout.indexOf(currentStep) + 1] })
            } else if (layout.indexOf(currentStep) === layout.length - 1 && step.design.preview) {
                this.setState({ currentStep: "Preview", preview: true })
            } else if ((layout.indexOf(currentStep) === layout.length - 1 && !step.design.preview) || currentStep === "Preview") {
                if (this.props.action !== "view")
                    console.log("Finish")
            }
        }
    }

    renderForm() {
        return (
            <div>
                {(Object.keys(this.state.scraperData.design.layout).map((step, stepIndex) =>
                    <Row xs="1" md="2" key={stepIndex}>
                        {step === this.state.currentStep &&
                            <>
                                {(this.state.scraperData.design.layout[step].map((field, fieldIndex) =>
                                    <Col key={fieldIndex}>
                                        {inputField(field.type, field.key, field.label, this.state.properties[field.key] || "", this.handleFormValuesChange.bind(this, field, ''),
                                            {
                                                input: `${field.type === "switch" ? "switch-input" : 'component-stretched'}`,
                                                label: `${field.type === "switch" ? "switch-input-label" : "configure-label"}`,
                                                textareaRows: 2,
                                                switchHeight: 20,
                                                disabled: this.props.action === "view" ? true : field.disabled ? true : step === "Basic" && field.key === "storage" && this.state.properties.storeMedia === false ? true : false,
                                                selectMultiple: field.key === "region" ? true : false
                                            },
                                            field.options,
                                            field.key
                                        )}
                                    </Col>
                                ))}
                            </>
                        }
                    </Row>
                ))}
                {this.state.scraperData.design.preview && this.state.preview && this.state.currentStep === "Preview" &&
                    <div>
                        {(Object.keys(this.state.scraperData.design.layout).map((step, stepIndex) =>
                            <div key={stepIndex}>
                                <h5>{step}</h5>
                                <Row xs="1" md="2" className="preview-content m-2">
                                    {this.state.scraperData.design.layout[step].map((field, fieldIndex) =>
                                        <Col key={fieldIndex}>
                                            <Row>
                                                <Col className="font-weight-bold pb-2">{field.label} : </Col>
                                                <Col className="font-weight-normal">{`${this.state.properties[field.key]}  `}</Col>
                                            </Row>
                                        </Col>
                                    )}
                                </Row>
                            </div>
                        ))}
                    </div>
                }
            </div>
        );
    }

    render() {
        const { scraperData, currentStep } = this.state;
        let layout = Object.keys(scraperData.design.layout)

        return (
            <div>
                <div className="scraper-configure-modal-container">
                    <div className="scraper-configure-modal-tab">
                        <div className="scraper-configure-modal-tabs">
                            {(Object.keys(this.state.scraperData.design.layout).map((step, stepIndex) =>
                                <Row key={stepIndex} className="form-step p-4">
                                    <Col sm="auto" className={`${currentStep === step ? "bg-primary text-white" : ""} step-number text-center`}>{stepIndex + 1}</Col>
                                    <Col className="step-text pl-3 pt-1">{step}</Col>
                                </Row>
                            ))}
                            {this.state.scraperData.design.preview &&
                                <Row className="form-step p-4">
                                    <Col sm="auto" className={`${currentStep === "Preview" ? "bg-primary text-white" : ""} step-number text-center`}>{Object.keys(this.state.scraperData.design.layout).length + 1}</Col>
                                    <Col className="step-text pl-3 pt-1">Preview</Col>
                                </Row>
                            }
                        </div>
                    </div>
                    <div className="scraper-configure-modal-content">
                        <Row className="mt-1 px-2">
                            <Col xs="12" md="1" className="text-right pt-2"><p className="progress-label">Progress:</p></Col>
                            <Col xs="12" md="11" className="text-left pt-2">
                                <ProgressBar className="form-progress-bar"
                                    variant={"primary"}
                                    now={currentStep === "Preview" ? 100 : this.state.scraperData.design.preview ? (100 / (Object.keys(this.state.scraperData.design.layout).length + 1) * (Object.keys(this.state.scraperData.design.layout).indexOf(currentStep) + 1)) : (100 / Object.keys(this.state.scraperData.design.layout).length) * (Object.keys(this.state.scraperData.design.layout).indexOf(currentStep) + 1)}
                                />
                            </Col>
                        </Row>
                        <div className="modal-form-container pt-3 px-3">
                            <Form className="configure-form">
                                <Form.Group>
                                    {this.renderForm()}
                                </Form.Group>
                            </Form>
                        </div>
                        <div className="modal-button-container">
                            <Row>
                                <Col className="text-left ml-2">
                                    {layout.indexOf(currentStep) !== 0 &&
                                        actionButton(currentStep === "Preview" ? layout[layout.length - 1] : layout[layout.indexOf(currentStep) - 1], this.handleNavButtonClick.bind(this, "PREV"), "modal-back-button", "fas fa-long-arrow-alt-left", true, false, ACTION_BUTTON.WARNING)
                                    }
                                </Col>
                                <Col className="text-right mr-2">
                                    {actionButton(currentStep === "Preview" ?
                                        "Finish"
                                        :
                                        layout.indexOf(currentStep) === layout.length - 1 ?
                                            this.state.scraperData.design.preview ?
                                                "Preview"
                                                :
                                                "Finish"
                                            :
                                            layout[layout.indexOf(currentStep) + 1],
                                        this.handleNavButtonClick.bind(this, "NEXT", this.state.scraperData),
                                        "modal-next-button",
                                        "fas fa-long-arrow-alt-right",
                                        true,
                                        this.props.action === "view" ? (currentStep === "Preview" ? true : layout.indexOf(currentStep) === layout.length - 1 ? !this.state.scraperData.design.preview && true : false) : false,
                                        ACTION_BUTTON.PRIMARY)}
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
