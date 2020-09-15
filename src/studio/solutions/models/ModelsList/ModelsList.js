import React, { Component } from "react";
// import { Card, CardBody, Table, Row, Col } from "reactstrap";
import ModelsViewer from './ModelViewer';
import StudioTable from "../../../utils/StudioTable";

const models = '';

class ModelsList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ModelStatus: 1,
            ModelsList: [
                {
                    Customer: "Header classifier",
                    titleGroup: {
                        name: 'Header classifier',
                        image: models
                    },
                    Default_version: "base_version",
                    Being_used_in: "Warehouse optimization",
                    Type: "classification",
                    accuracy: "1.00",
                    recall: "1.00",
                    precision: "1.00",
                    f1: "1.00",
                    Enabled: 'true',
                    Status: [3, "Draft"],
                    Actions: <i className="icon feather icon-edit f-w-600 f-16 m-r-15 text-c-green" />,
                },
                {
                    Customer: "Page group classifier",
                    titleGroup: {
                        name: 'Page group classifier',
                        image: models
                    },
                    Default_version: "base_version",
                    Being_used_in: "Inventory optimization",
                    Type: "classification",
                    accuracy: "1.00",
                    recall: "1.00",
                    precision: "1.00",
                    f1: "1.00",
                    Enabled: 'true',
                    Status: [1, "Active"],
                    Actions: <i className="icon feather icon-edit f-w-600 f-16 m-r-15 text-c-green" />,
                },
                {
                    Customer: "Paragraph classifier",
                    titleGroup: {
                        name: 'Paragraph classifier',
                        image: models
                    },
                    Default_version: "base_version",
                    Being_used_in: "PRocess automation",
                    Type: "regression",
                    accuracy: "1.00",
                    recall: "1.00",
                    precision: "1.00",
                    f1: "1.00",
                    Enabled: 'true',
                    Status: [1, "Active"],
                    Actions: <i className="icon feather icon-edit f-w-600 f-16 m-r-15 text-c-green" />,
                },
                {
                    Customer: "Key value classifier",
                    titleGroup: {
                        name: 'Key value classifier',
                        image: models
                    },
                    Default_version: "base_version",
                    Being_used_in: "User journey analysis",
                    Type: "regression",
                    accuracy: "1.00",
                    recall: "1.00",
                    precision: "1.00",
                    f1: "1.00",
                    Enabled: 'true',
                    Status: [2, "Disabled"],
                    Actions: <i className="icon feather icon-edit f-w-600 f-16 m-r-15 text-c-green" />,
                },
                {
                    Customer: "Text classifier",
                    titleGroup: {
                        name: 'Text classifier',
                        image: models
                    },
                    Default_version: "base_version",
                    Being_used_in: "Sales Analysis",
                    Type: "classification",
                    accuracy: "1.00",
                    recall: "1.00",
                    precision: "1.00",
                    f1: "1.00",
                    Enabled: 'true',
                    Status: [2, "Disabled"],
                    Actions: <i className="icon feather icon-edit f-w-600 f-16 m-r-15 text-c-green" />,
                },
            ],
            ModelName: '',
        }
    }

    renderModelViewer = (Models) => {
        this.setState({
            ModelStatus: 0,
            ModelName: Models,
        })
    }

    renderModelList = () => {
        this.setState({
            ModelStatus: 1,
            ModelName: '',
        })
    }

    render() {

        const modelsHeader = [
            { label: 'Name', key: 'Customer' },
            { label: 'Default Version', key: 'Default_version' },
            { label: 'Being used in', key: 'Being_used_in' },
            { label: 'Type', key: 'Type' },
            { label: 'Accuracy', key: 'accuracy' },
            { label: 'Recall', key: 'recall' },
            { label: 'Precision', key: 'precision' },
            { label: 'F1', key: 'f1' },
            { label: 'Enabled', key: 'Enabled' },
            { label: 'Status', key: 'Status' },
        ]

        const triggerModelView = (modelData) => {
            this.renderModelViewer(modelData.Customer)
        }

        const modelActions = [
            { btnTitle: 'View Model', btnClass: 'btn-success', iconClass: 'feather icon-edit', btnAction: triggerModelView.bind(this) },
        ]

        return (
            <div>
                {this.state.ModelStatus ?
                    <StudioTable tableName={'Models'}
                        tableHeader={modelsHeader}
                        tableData={this.state.ModelsList}
                        tableActions={modelActions}
                        defaultSort={{ sortIndex: 0, sortOrder: 0 }}
                    />
                    :
                    <ModelsViewer ModelName={this.state.ModelName} renderModelList={this.renderModelList} />
                }

            </div>
        );
    }
}

export default ModelsList;