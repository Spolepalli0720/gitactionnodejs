import React, { Component } from 'react';
import { Form, Row, Col } from "react-bootstrap";
// import { ProgressBar } from "react-bootstrap";

import SolutionConfigForm from "./SolutionConfigForm";
import { inputField, actionButton, ACTION_BUTTON } from "../utils/StudioUtils"

import "./SolutionConfig.scss";

const ReactTags = require('react-tag-autocomplete');

export default class SolutionConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            solutionConfig: this.props.formConfig,
            currentStep: Object.keys(JSON.parse(JSON.stringify(SolutionConfigForm.DATA_INPUT_FORM.design.layout)))[0],
            formProgress: {
                "DEFINE": "INITIAL",
                "CONFIGURE": "INITIAL",
                "DEPLOY": "INITIAL",
            }
        };

        this.formConfig = JSON.parse(JSON.stringify(SolutionConfigForm.DATA_INPUT_FORM));
    }

    setFormProgress() {
        let solConfig = this.state.solutionConfig;

        switch (this.state.currentStep) {
            case 1:
                if (solConfig.name.length === 0 && solConfig.description.length === 0 && solConfig.tags.length === 0) {
                    this.setState({
                        formProgress: {
                            ...this.state.formProgress,
                            DEFINE: "INITIAL"
                        }
                    })
                } else if (solConfig.name.length > 0 && solConfig.description.length > 0 && solConfig.tags.length > 0) {
                    this.setState({
                        formProgress: {
                            ...this.state.formProgress,
                            DEFINE: "COMPLETE"
                        }
                    })
                } else {
                    this.setState({
                        formProgress: {
                            ...this.state.formProgress,
                            DEFINE: "PARTIAL"
                        }
                    })
                }
                return;
            case 2:
                if (solConfig.workflow.maxFlows === 0) {
                    this.setState({
                        formProgress: {
                            ...this.state.formProgress,
                            CONFIGURE: "INITIAL"
                        }
                    })
                } else if (solConfig.solutionTemplate === "" && solConfig.storage.type === "") {
                    this.setState({
                        formProgress: {
                            ...this.state.formProgress,
                            CONFIGURE: "INITIAL"
                        }
                    })
                } else if (solConfig.solutionTemplate !== "" && solConfig.storage.type !== "") {
                    this.setState({
                        formProgress: {
                            ...this.state.formProgress,
                            CONFIGURE: "COMPLETE"
                        }
                    })
                } else {
                    this.setState({
                        formProgress: {
                            ...this.state.formProgress,
                            CONFIGURE: "PARTIAL"
                        }
                    })
                }
                return;
            case 3:
                if (solConfig.cloudDeployment === false && solConfig.cloudProvider === "" && solConfig.deploymentModel === "" && solConfig.deploymentEnvironment === "" && solConfig.deploymentStorage === "") {
                    this.setState({
                        formProgress: {
                            ...this.state.formProgress,
                            DEPLOY: "INITIAL"
                        }
                    })
                } else if (solConfig.cloudDeployment === true && solConfig.cloudProvider !== "" && solConfig.deploymentModel !== "" && solConfig.deploymentEnvironment !== "" && solConfig.deploymentStorage !== "") {
                    this.setState({
                        formProgress: {
                            ...this.state.formProgress,
                            DEPLOY: "COMPLETE"
                        }
                    })
                } else {
                    this.setState({
                        formProgress: {
                            ...this.state.formProgress,
                            DEPLOY: "PARTIAL"
                        }
                    })
                }
                return;
            default:
                return;
        }
    }

    renderForm() {
        const { currentStep, solutionConfig } = this.state;

        const inputs = this.formConfig.design.layout

        const handleFormTagsDelete = (i) => {
            let solConfig = this.state.solutionConfig;
            solConfig.tags.splice(i, 1)
            this.setState({ solutionConfig: solConfig })
        }

        const handleFormTagsAdd = (tag) => {
            let solConfig = this.state.solutionConfig;
            solConfig.tags = solConfig.tags.concat(tag)
            this.setState({ solutionConfig: solConfig })
        }

        const handleFormValuesChange = (field, child, name, val) => {
            let solConfig = this.state.solutionConfig;
            if (field.type !== "group") {
                solConfig[field.key] = val;
            } else if (field.type === "group") {
                solConfig[field.key][child.key] = val;
            }

            this.setState({ solutionConfig: solConfig })
        }

        return (
            Object.keys(inputs).map(input =>
                input === currentStep &&
                inputs[input].map((field, fieldIndex) =>
                    <div key={fieldIndex} className="mb-4">
                        {field.type !== "tags" && field.type !== "group" && inputField(field.type, field.key, field.label, solutionConfig[field.key] || field.value, handleFormValuesChange.bind(this, field, ""), {
                            container: 'mt-2',
                            label: 'w-auto',
                            input: '',
                            required: field.required,
                            disabled: !!field.disabled || (field.depends !== null && !solutionConfig[field.depends]),
                        }, field.options, field.id)
                        }
                        {field.type === "tags" && field.type !== "group" && <label className="form-tags-label">{field.label} </label>}
                        {field.type === "tags" && field.type !== "group" &&
                            <ReactTags
                                classNames={{ root: 'react-tags bootstrap-tags-input', selectedTag: 'react-tags__selected-tag btn-primary', selected: 'react-tags__selected', search: 'react-tags__search', searchWrapper: 'react-tags__search-input', searchInput: 'react-tags__search-input' }}
                                allowNew={true}
                                tags={solutionConfig[field.key] || field.value}
                                onDelete={handleFormTagsDelete.bind(this)}
                                onAddition={handleFormTagsAdd.bind(this)} />
                        }
                        {field.type === "group" && <label className="mb-0 fa-2x">{field.label}</label>}
                        {field.type === "group" &&
                            field.children.map((child, childIndex) => {
                                return (
                                    <div key={childIndex}>
                                        {inputField(child.type, child.key, child.label, solutionConfig[field.key][child.key] || field.value, handleFormValuesChange.bind(this, field, child), {
                                            container: 'mt-2',
                                            label: 'w-auto',
                                            input: '',
                                            required: child.required,
                                            disabled: !!field.disabled || (child.depends !== null && !solutionConfig[field.key][child.depends]),
                                        }, child.options, child.id)}
                                        {child.required && !solutionConfig[field.key][child.key] && <label className="text-danger">{`${child.label} is required`}</label>}
                                    </div>
                                )
                            })
                        }
                        {field.required && field.type !== "group" && !solutionConfig[field.key] && <label className="text-danger">{`${field.label} is required`}</label>}
                    </div>
                )
            )
        )
    }

    handleNavButtonClick(type, step) {
        let currentStep = this.state.currentStep;
        const inputs = Object.keys(this.formConfig.design.layout)
        if (inputs.indexOf(currentStep) < inputs.length - 1 || type === "PREV") {
            this.setState({ currentStep: step })
        } else {
            if (type === "NEXT") {
                this.props.onSubmit(this.state.solutionConfig)
            }
        }
    }

    render() {
        const { solutionConfig, currentStep } = this.state;
        const inputs = Object.keys(this.formConfig.design.layout)
        const currentIndex = inputs.indexOf(currentStep);

        let solutionCreateFormTabs = Object.keys(this.formConfig.design.layout).map(tab => {
            return {
                label: tab.slice(0, 1) + tab.slice(1).toLowerCase(),
                key: tab,
            }
        });

        return (
            <div className="solution-form-window-container">
                <div className="solution-form-tab">
                    <div className="solution-creation-form-tabs">
                        {solutionCreateFormTabs.map((step, stepIndex) =>
                            <Row key={stepIndex} className={`form-step  ${currentStep === step.key ? "selected-form-step" : ""}`}>
                                <Col sm="auto" className="step-number">{inputs.indexOf(step.key) + 1}</Col>
                                <Col className="step-text"><label>{step.label}</label></Col>
                            </Row>
                        )}
                    </div>
                </div>
                <div className="solution-form-content">
                    <div className="solution-creation-form-content">
                        {/* <div className="progress-bar-container">
                            <label className="form-progress-label">Progress:</label>
                            <ProgressBar className="form-progress-bar">
                                {solutionCreateFormTabs.map((step, stepIndex) =>
                                    <ProgressBar
                                        key={stepIndex}
                                        variant={this.state.formProgress[step.key] === "INITIAL" ? "secondary" : this.state.formProgress[step.key] === "PARTIAL" ? "warning" : this.state.formProgress[step.key] === "COMPLETE" ? "success" : ""}
                                        now={33.4}
                                        label={step.label} />
                                )}
                            </ProgressBar>
                        </div> */}
                        <div className="form-container">
                            <Form className="solution-form">
                                {this.renderForm()}
                            </Form>
                        </div>
                        <div className="button-container">
                            <Row xs={1} md={2}>
                                <Col className="text-left">
                                    {currentIndex > 0 &&
                                        actionButton(
                                            inputs[currentIndex - 1],
                                            this.handleNavButtonClick.bind(this, "PREV", inputs[currentIndex - 1]),
                                            "prev-button py-1 px-3",
                                            "fas fa-long-arrow-alt-left",
                                            true,
                                            false,
                                            ACTION_BUTTON.primary
                                        )
                                    }
                                </Col>
                                <Col className="text-right">
                                    {actionButton(
                                        currentIndex < inputs.length - 1 ?
                                            inputs[currentIndex + 1]
                                            :
                                            "SUBMIT",
                                        this.handleNavButtonClick.bind(this, "NEXT", inputs[currentIndex + 1]),
                                        "next-button py-1 px-3",
                                        "fas fa-long-arrow-alt-right",
                                        true,
                                        SolutionConfigForm.DATA_INPUT_FORM.design.layout[currentStep].map(field => {
                                            if (field.type !== "group" && field.required) {
                                                if (!!solutionConfig[field.key]) {
                                                    return false
                                                }
                                                return true
                                            } else if (field.type === "group") {
                                                return field.children.map(child => {
                                                    if (child.required) {
                                                        if (!!solutionConfig[field.key][child.key]) {
                                                            return false
                                                        }
                                                        return true
                                                    }
                                                    return false
                                                }).includes(true)
                                            }
                                            return false
                                        }).includes(true),
                                        ACTION_BUTTON.primary
                                    )}
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}