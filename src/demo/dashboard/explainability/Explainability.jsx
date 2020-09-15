import React from 'react';
import { Row, Col } from 'reactstrap';

import ExplainabilityChart from "./ExplainabilityChart";
import { inputField, actionButton, ACTION_BUTTON } from "../../../studio/utils/StudioUtils"
import { notifyError } from '../../../studio/utils/Notifications';
import { BasicSpinner } from "../../../studio/utils/BasicSpinner"
import { demoDashboardService } from "../../services/DemoDashboardService";

import "./Explainability.scss"

export default class ExplainabilityCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            productData: {
                "name": "",
                "rootNode": true,
                "children": []
            },
            explainabilityData: {
                channel: "",
                product: "",
            },
        }
    }

    componentDidMount() {
        this.getChannels()
    }

    getChannels() {
        this.setState({ loadingRegions: true })
        demoDashboardService.getChannels().then(response => {
            let channelsList = response.result.map(res => {
                return {
                    label: res,
                    value: res
                }
            })
            this.getProducts(channelsList[1].value)
            this.setState({
                loadingRegions: false,
                channelsList: channelsList, explainabilityData: {
                    ...this.state.explainabilityData,
                    channel: channelsList[1].value
                }
            })
        }).catch(error => {
            this.setState({ loadingRegions: false })
            console.log("demoDashboardService.getChannels", error)
            notifyError("Unable to retreive Channels", error.message)
        })
    }

    getProducts(channel) {
        this.setState({ loadingProducts: true })
        demoDashboardService.getProducts(channel).then(response => {
            let productsList = response.result.map(res => {
                return {
                    label: res,
                    value: res
                }
            })
            this.getProductInsights(productsList[0].value)
            this.setState({
                loadingProducts: false,
                productsList: productsList, explainabilityData: {
                    ...this.state.explainabilityData,
                    product: productsList[0].value
                }
            })
        }).catch(error => {
            this.setState({ loadingProducts: false })
            console.log("demoDashboardService.getProducts", error)
            notifyError("Unable to retreive Products", error.message)
        })
    }

    getProductInsights(product) {
        this.setState({ loadingChart: true })
        demoDashboardService.getProductInsights("10-01-2000 00:00:00", "20-07-2020 23:00:00", product).then(response => {
            let productData = this.state.productData;
            productData.name = this.state.explainabilityData.product;
            productData.children = response.result.map(res => {
                return {
                    name: res.entity,
                    value: res.count,
                    percentage: res.percentage
                }
            })
            let tempResp = JSON.parse(JSON.stringify(productData))
            this.setState({ loadingChart: false, productData: tempResp })
        }).catch(error => {
            this.setState({ loadingChart: false })
            console.log("demoDashboardService.getProductInsights", error)
            notifyError("Unable to retreive product Insights", error.message)
        })
    }

    getInsightData(index) {
        this.setState({ loadingInsightData: true })
        let productData = this.state.productData;
        let productName = productData.name
        let entity = productData.children.filter(product => product.name === index.name)[0].name
        demoDashboardService.getInsightData("10-01-2000 00:00:00", "20-07-2020 23:00:00", productName, entity).then(response => {
            this.setState({ loadingInsightData: false, showNer: true, insightData: response })
            this.renderInsightData(response, "NER")
        }).catch(error => {
            this.setState({ loadingInsightData: false })
            console.log("demoDashboardService.getInsightData", error)
            notifyError("Unable to retrieve Instght Data", error.message)
        })
    }

    onSelectDropdown(name, value) {
        if (name === "channel") {
            this.setState({ insightData: [], loadingChart: true })
            this.getProducts(value)
        } else if (name === "product") {
            this.getProductInsights(value)
            this.setState({ insightData: [] })
        }
        document.getElementById("insight-container").innerHTML = []
        this.setState({
            explainabilityData: {
                ...this.state.explainabilityData,
                [name]: value
            }
        })
    }

    renderInsightData(insight, content) {
        let insightContainer = document.getElementById("insight-container");
        insightContainer.innerHTML = "";

        const getContent = (divEl, data, content) => {
            if (content === "NER") {
                divEl.insertAdjacentHTML("beforeend", data)
                divEl.lastChild.className = "insight-data-div"
                divEl.lastChild.style.padding = "0.8em"
                divEl.lastChild.append(addToggleButton(divEl, "NER"))
            } else if (content === "EXPLAIN") {
                let innerDiv = document.createElement("div")
                let deeperDiv = document.createElement("div")
                deeperDiv.insertAdjacentHTML("beforeend", divEl.dataset.insightExplain)
                innerDiv.className = "insight-data-div"
                innerDiv.append(deeperDiv)
                innerDiv.append(addToggleButton(divEl, "EXPLAIN"))
                divEl.append(innerDiv)
            }
        }

        const handleToggleClick = (divEl, type) => {
            divEl.innerHTML = ""

            if (type === "NER") {
                getContent(divEl, divEl.dataset.insightExplain, "EXPLAIN")
            } else if (type === "EXPLAIN") {
                getContent(divEl, divEl.dataset.insightNer, "NER")
            }
        }

        const addToggleButton = (child, type) => {
            let toggleButton = document.createElement("button");
            if (type === "NER") {
                toggleButton.innerHTML = `<i class="fa fa-magic" aria-hidden="true"></i>`
            } else if (type === "EXPLAIN") {
                toggleButton.innerHTML = `<i class="fa fa-tags" aria-hidden="true"></i>`
            }
            toggleButton.onclick = () => handleToggleClick(child, type);
            toggleButton.className = "btn p-0 studio-primary"
            toggleButton.style.float = "right";

            return toggleButton;
        }

        for (const insght of insight) {
            let nerContent = insght.model_predictions.NER[1].result_html;
            let explainContent = insght.model_predictions.explain;
            let divEl = document.createElement("div");

            divEl.setAttribute("data-insight-ner", nerContent)
            divEl.setAttribute("data-insight-explain", explainContent.replaceAll(/\\n/g, ""))

            if (content === "NER") {
                getContent(divEl, nerContent, "NER")
            } else if (content === "EXPLAIN") {
                getContent(divEl, explainContent, "EXPLAIN")
            }

            insightContainer.append(divEl)
        }
    }

    toggleInsightOverall() {
        const { showNer, insightData } = this.state
        this.setState({ showNer: !this.state.showNer })
        if (insightData) {
            if (showNer) {
                this.renderInsightData(insightData, "EXPLAIN")
            } else {
                this.renderInsightData(insightData, "NER")
            }
        }
    }

    render() {
        const { explainabilityData, channelsList, productsList, productData, insightData, showNer, loadingChart, loadingInsightData, loadingRegions, loadingProducts } = this.state;

        return (
            <div className="explainability-container">
                <Row xs={1} md={2}>
                    <Col></Col> {/* PLACED HERE TO PUSH THE TWO DROPDOWNS TO THE RIGHT (CLASS "text-right" DOESN'T WORK, IT ONLY ALIGNS THE LABEL OF THE DROPDOWNS TO THE RIGHT) */}
                    <Col>
                        <Row xs={1} md={2}>
                            <Col>
                                {inputField("select", "channel", "Channel", explainabilityData.channel || "", this.onSelectDropdown.bind(this), { label: "font-weight-bolder", disabled: loadingInsightData || loadingChart || loadingProducts || loadingRegions }, channelsList || [], "channels_id")}
                            </Col>
                            <Col>
                                {inputField("select", "product", "Product", explainabilityData.product || "", this.onSelectDropdown.bind(this), { label: "font-weight-bolder", disabled: explainabilityData.channel.length === 0 || loadingInsightData || loadingChart || loadingProducts || loadingRegions }, productsList || [], "products_id")}
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {(loadingRegions || loadingProducts) &&
                    <BasicSpinner />
                }
                {!(loadingRegions || loadingProducts) &&
                    <Row xs={1} md={2}>
                        <Col className="text-center">
                            {loadingChart && <BasicSpinner />}
                            {!loadingChart &&
                                <ExplainabilityChart
                                    productData={productData}
                                    disableClick={loadingInsightData}
                                    getInsightData={(index) => this.getInsightData(index)}
                                />
                            }
                        </Col>
                        <Col className="text-center h-100">
                            {loadingInsightData && <BasicSpinner />}
                            {!loadingInsightData &&
                                <Row xs={1}>
                                    <Col className="text-right">
                                        {insightData && insightData.length > 0 &&
                                            <>
                                                <label className="mr-2 font-weight-bold">{!showNer ? "Show Entity Tagging" : "Show Explainability"}</label>
                                                {actionButton(!showNer ? "Show NER" : "Show Explainability", () => this.toggleInsightOverall(), "", `${!showNer ? "fa fa-tags" : "fa fa-magic"} fa-2x`, false, false, ACTION_BUTTON.PRIMARY)}
                                            </>
                                        }
                                    </Col>
                                    <Col>
                                        <div className="insight-data-container" id="insight-container"></div>
                                    </Col>
                                </Row>
                            }
                        </Col>
                    </Row>
                }
            </div>
        )
    }
}