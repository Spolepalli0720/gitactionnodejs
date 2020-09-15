import React, { Component } from "react";
import { Row, Col } from 'reactstrap';

import Timestamp from "react-timestamp";
import Dropzone from 'react-dropzone';

import SolutionConfigForm from "./SolutionConfigForm";

import "./SolutionOptions.scss";

const SOLUTION_TYPE = {
    'INTEGRATION': { label: 'Integration', image: require('../../assets/studio/svg/blue-integration.svg') },
    'AIPOWERED': { label: 'AI Powered', image: require('../../assets/studio/svg/blue-ai-powered.svg') },
    'FUSION': { label: 'Cognitive Fusion', image: require('../../assets/studio/svg/blue-cognitive-fusion.svg') },
    'FABRIC': { label: 'Fabric', image: require('../../assets/studio/svg/blue-sensor-fabric.svg') },
    'BANKING': { label: 'Fabric', image: require('../../assets/studio/svg/bank.svg') },
    'RETAIL': { label: 'Fabric', image: require('../../assets/studio/svg/retail.svg') },
    'ENERGY': { label: 'Fabric', image: require('../../assets/studio/svg/energy.svg') },
    'HEALTH_CARE': { label: 'Fabric', image: require('../../assets/studio/svg/health-care.svg') },
}

export default class SolutionConfig extends Component {
    constructor(props) {
        super(props);

        this.state = {
            solutions: this.props.solutions,
            solutionConfig: {},
            selectionConfig: {
                mainTab: Object.keys(JSON.parse(JSON.stringify(SolutionConfigForm.DATA_OPTIONS)))[0],
                selectedTab: "",
                importedFile: [],
            },
        }
        this.dataOptions = JSON.parse(JSON.stringify(SolutionConfigForm.DATA_OPTIONS))
    }

    renderSolutionSelection() {
        const { selectionConfig, solutions } = this.state;

        let solutionOptions = this.dataOptions;
        let innerCont = solutionOptions[selectionConfig.mainTab].innerContent;
        let getFromData = solutionOptions[selectionConfig.mainTab].getContentFromData;

        if (getFromData) {
            innerCont = JSON.parse(JSON.stringify(solutionOptions[selectionConfig.mainTab].innerContent));

            for (let solution of solutions) {
                let solutionConfig = {};

                // IF THE WHOLE CONFIG OBJECT IS UNDEFINED/NULL
                if (!solution.config) {
                    solution.config = {
                        properties: {
                            template: {},
                            workflow: {},
                            storage: {},
                            deployment: {}
                        }
                    };
                } else if (!solution.config.properties) {
                    // IF THE PROPERTIES OBJECT IS UNDEFINED/NULL
                    solution.config.properties = {
                        template: {},
                        workflow: {},
                        storage: {},
                        deployment: {}
                    };
                }
                // IF THE ENTRIES OF PROPERTIES OBJECT ARE UNDEFINED/NULL
                if (!solution.config.properties.template)
                    solution.config.properties.template = {};
                if (!solution.config.properties.workflow)
                    solution.config.properties.workflow = {};
                if (!solution.config.properties.storage)
                    solution.config.properties.storage = {};
                if (!solution.config.properties.deployment)
                    solution.config.properties.deployment = {};

                // IF THE ENTRIES OF DEPLOYMENT OBJECT IN PROPERTIES ARE UNDEFINED/NULL
                if (!solution.config.properties.deployment.isCloud)
                    solution.config.properties.deployment.isCloud = false;
                if (!solution.config.properties.deployment.targetCloud)
                    solution.config.properties.deployment.targetCloud = "";
                if (!solution.config.properties.deployment.environment)
                    solution.config.properties.deployment.environment = "";
                if (!solution.config.properties.deployment.mode)
                    solution.config.properties.deployment.mode = "";
                if (!solution.config.properties.deployment.storage)
                    solution.config.properties.deployment.storage = "";

                // IF THE ENTRIES OF TEMPLATE OBJECT IN PROPERTIES ARE UNDEFINED/NULL
                if (!solution.config.properties.template.type)
                    solution.config.properties.template.type = {};

                // IF THE ENTRIES OF WORKFLOW OBJECT IN PROPERTIES ARE UNDEFINED/NULL
                if (!solution.config.properties.workflow.ASYNC)
                    solution.config.properties.workflow.ASYNC = false;
                if (!solution.config.properties.workflow.AUDITING)
                    solution.config.properties.workflow.AUDITING = false;
                if (!solution.config.properties.workflow.SECURED)
                    solution.config.properties.workflow.SECURED = false;

                // IF THE ENTRIES OF STORAGE OBJECT IN PROPERTIES ARE UNDEFINED/NULL
                if (!solution.config.properties.storage.persistent)
                    solution.config.properties.storage.persistent = false;
                if (!solution.config.properties.storage.type)
                    solution.config.properties.storage.type = "";

                // CONSTRUCTING THE solutionConfig OBJECT
                solutionConfig.cloudDeployment = solution.config.properties.deployment.isCloud;
                solutionConfig.cloudProvider = solution.config.properties.deployment.targetCloud;
                solutionConfig.deploymentEnvironment = solution.config.properties.deployment.environment;
                solutionConfig.deploymentModel = solution.config.properties.deployment.mode;
                solutionConfig.deploymentStorage = solution.config.properties.deployment.storage;
                solutionConfig.description = solution.description || "";
                solutionConfig.name = "";
                solutionConfig.solutionTemplate = solution.config.properties.template.type;
                solutionConfig.storage = {
                    persistent: solution.config.properties.storage.persistent,
                    type: solution.config.properties.storage.type,
                };
                solutionConfig.tags = solution.tags.map(tag => { return { name: tag } });
                solutionConfig.type = solution.type;
                solutionConfig.workflow = {
                    asyncSupport: solution.config.properties.workflow.ASYNC,
                    auditing: solution.config.properties.workflow.AUDITING,
                    authorization: solution.config.properties.workflow.SECURED,
                    maxFlows: solution.config.properties.maxFlows || 0,
                }

                innerCont[solution.type].push({
                    title: solution.name,
                    description: solution.description,
                    type: solution.type,
                    solutionConfig: solutionConfig,
                })
            }
        }

        const renderInnerContent = () => {
            const { selectedTab } = this.state.selectionConfig;

            const getCards = (title, desc, dataObj) => {
                return (
                    <div className="card solution-modal-card br-10x">
                        <div className="card-body">
                            <div className="sol-card-heading">
                                <h6>{title}</h6>
                            </div>
                            <div className="sol-card-body">
                                <div className="sol-card-desc">
                                    <p className="align-self-center">{desc}</p>
                                </div>
                                <div className="sol-card-img text-right">
                                    <img src={SOLUTION_TYPE[dataObj.type].image} alt={SOLUTION_TYPE[dataObj.type].label} />
                                </div>
                            </div>
                            <button className="sol-card-btn" onClick={() => this.props.onSelect(dataObj.solutionConfig)}>{getFromData ? "Clone" : "Create"}</button>
                        </div>
                    </div>
                )
            }

            return (
                <Row xs={1} lg={2}>
                    {solutionOptions[selectionConfig.mainTab].hasTabs ?
                        innerCont[selectedTab].map((dataObj, dataObjIndex) =>
                            <Col className="px-4 py-0" key={dataObjIndex}>
                                {getCards(dataObj.title, dataObj.description, dataObj)}
                            </Col>
                        )
                        :
                        Object.keys(innerCont).map((dataObj, dataObjIndex) =>
                            <Col className="px-4 py-0" key={dataObjIndex}>
                                {getCards(innerCont[dataObj].title, innerCont[dataObj].description, innerCont[dataObj])}
                            </Col>
                        )
                    }
                </Row>
            );
        }

        if (!!solutionOptions[selectionConfig.mainTab].hasTabs) {
            return (
                <div className="text-center">
                    <div className="modal-inner-tabs">
                        <Row xs={4} md={4} className="tabs-row">
                            {Object.keys(solutionOptions[selectionConfig.mainTab].innerContent).map((tab, tabIndex) =>
                                <Col className="tabs-content" key={tabIndex}
                                    onClick={() =>
                                        this.setState({
                                            selectionConfig: {
                                                ...this.state.selectionConfig,
                                                selectedTab: tab
                                            }
                                        })
                                    }>
                                    <label className={selectionConfig.selectedTab === tab ? "selected-inner-tag" : ""}>{tab.slice(0, 1) + tab.slice(1).toLowerCase()}</label>
                                </Col>
                            )}
                        </Row>
                    </div>
                    <div className="modal-inner-content">
                        {renderInnerContent()}
                    </div>
                </div>
            )
        } else {
            if (selectionConfig.mainTab === "IMPORT") {
                const onDrop = (accepted, rejected) => {
                    if (!rejected.length && accepted.length) {
                        addFile(accepted);
                        // console.log(accepted[0].preview);

                        var blobPromise = new Promise((resolve, reject) => {
                            const reader = new window.FileReader();
                            reader.readAsText(accepted[0]);
                            reader.onloadend = () => {
                                const base64data = reader.result;
                                resolve(base64data);
                            };
                        });
                        blobPromise.then(value => {
                            // console.log(value);
                        });
                    }
                };
                const addFile = file => {
                    console.log("FILE", file);
                    this.setState({
                        selectionConfig: {
                            ...this.state.selectionConfig,
                            importedFile: file.map(file =>
                                Object.assign(file, {
                                    preview: URL.createObjectURL(file)
                                })
                            )
                        }
                    });
                };
                return (
                    <div className="text-center">
                        <div className="modal-inner-tabs">
                            <label className="dropzone-label selected-inner-tag">Upload solution zip file</label>
                        </div>
                        <div className="modal-inner-content">
                            <Dropzone
                                onDrop={(acceptedFiles, rejectedFiles) => onDrop(acceptedFiles, rejectedFiles)}
                                multiple={false}
                                accept="application/zip"
                            >
                                {({ getRootProps, getInputProps }) => (
                                    <section>
                                        {!selectionConfig.importedFile.length ?
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                <div className="dropzone-area">
                                                    <div>
                                                        <i className="fas fa-upload"></i>
                                                        <p>Drag and drop files here, or click to select files to import</p>
                                                    </div>
                                                </div>
                                            </div>
                                            :
                                            <div className="file-preview-area">
                                                <div className="file-preview-message">
                                                    <label>File name: </label>
                                                    <p className="upload-success">{selectionConfig.importedFile[0].name}</p><br />
                                                    <label>File size: </label>
                                                    <p className="upload-success">{(selectionConfig.importedFile[0].size / 1024).toFixed(2)} KB</p><br />
                                                    <label>File modified: </label>
                                                    <p className="upload-success">{<Timestamp relative date={selectionConfig.importedFile[0].lastModified} />}</p><br />
                                                </div>
                                                <div className="file-preview-button">
                                                    <button className="btn btn-secondary" onClick={() => {
                                                        this.setState({
                                                            selectionConfig: {
                                                                ...this.state.selectionConfig,
                                                                importedFile: []
                                                            }
                                                        })
                                                    }}>Cancel</button>
                                                    <button className="btn btn-primary" onClick={() => {
                                                        // SERVICE CALL
                                                    }}>Upload</button>
                                                </div>
                                            </div>
                                        }
                                    </section>
                                )}
                            </Dropzone>
                        </div>
                    </div>
                );
            }
            return (
                <div className="text-center">
                    {renderInnerContent()}
                </div>
            )
        }
    }

    render() {
        const { selectionConfig } = this.state
        let solutionOptions = this.dataOptions

        return (
            <div className="solution-creation-modal-container">
                <div className="solution-creation-modal-tab">
                    {Object.keys(solutionOptions).map((tab, tabIndex) =>
                        <div key={tabIndex}
                            className={`tab-list ${selectionConfig.mainTab === tab ? "tab-selected" : ""}`}
                            onClick={() => this.setState({
                                selectionConfig: {
                                    ...this.state.selectionConfig,
                                    mainTab: tab,
                                    selectedTab: solutionOptions[tab].hasTabs && Object.keys(solutionOptions[tab].innerContent)[0],
                                }
                            })
                            }>
                            <label className="tab-title">{solutionOptions[tab].label}</label>
                            <label className="tab-description">{solutionOptions[tab].description}</label>
                        </div>
                    )}
                </div>
                <div className="solution-creation-modal-content">
                    {this.renderSolutionSelection()}
                </div>
            </div>
        )
    }
}