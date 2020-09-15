import React, { Component } from "react";
// import { Card, CardBody, Table } from "reactstrap";
import FunctionViewer from './FunctionViewer';
import StudioTable from "../../../utils/StudioTable";

const func = '';

class FunctionList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            FunctionState: true,
            FunctionList: [
                {
                    Function: "Calculate Interest",
                    titleGroup: {
                        name: "Calculate Interest",
                        image: func
                    },
                    Version: "8.6",
                    Runtime: "Java",
                    Modified_by: "Rahul",
                    Modified_on: "12-Jan-2020 05:20:45",
                    Status: [1, "Active"],
                    Actions: "edit",
                },
                {
                    Function: "Extract Contour",
                    titleGroup: {
                        name: "Extract Contour",
                        image: func
                    },
                    Version: "3.5",
                    Runtime: "Python",
                    Modified_by: "Murali",
                    Modified_on: "31-Jan-2020 11:05:20",
                    Status: [2, "Disabled"],
                    Actions: "enable/disable",
                },
                {
                    Function: "Parse Temperature",
                    titleGroup: {
                        name: "Parse Temperature",
                        image: func
                    },
                    Version: "5.3",
                    Runtime: "JavaScript",
                    Modified_by: "Aleem",
                    Modified_on: "05-Feb-2020 16:00:31",
                    Status: [3, "Draft"],
                    Actions: "delete",
                },
                {
                    Function: "Image Segmentation",
                    titleGroup: {
                        name: "Image Segmentation",
                        image: func
                    },
                    Version: "6.9",
                    Runtime: "Java",
                    Modified_by: "Venkat",
                    Modified_on: "05-Feb-2020 14:00:31",
                    Status: [2, "Disabled"],
                    Actions: "publish",
                },
            ],
            FunctionName: '',
        }
    }

    renderFunctionViewer = (functions) => {
        this.setState({
            ...this.state,
            FunctionState: 0,
            FunctionName: functions,
        });
    }

    renderFunctionList = () => {
        this.setState({
            FunctionState: 1,
            FunctionName: ''
        })
    }

    render() {

        const functionsHeader = [
            { label: 'Name', key: 'Function' },
            { label: 'Version', key: 'Version' },
            { label: 'Runtime', key: 'Runtime' },
            { label: 'Modified By', key: 'Modified_by' },
            { label: 'Modified On', key: 'Modified_by' },
            { label: 'Status', key: 'Status' },
        ]

        const triggerFunctionView = (functionData) => {
            this.renderFunctionViewer(functionData.Function)
        }

        const functionActions = [
            { btnTitle: 'View Function', btnClass: 'btn-success', iconClass: 'feather icon-edit', btnAction: triggerFunctionView.bind(this) },
        ]

        return (
            <React.Fragment>
                {this.state.FunctionState ?
                    <StudioTable tableName={'Functions'}
                        tableHeader={functionsHeader}
                        tableData={this.state.FunctionList}
                        tableActions={functionActions}
                        defaultSort={{ sortIndex: 0, sortOrder: 0 }}
                    />
                    :
                    <FunctionViewer functions={this.state.FunctionName} renderFunctionList={this.renderFunctionList} />
                }
            </React.Fragment>
        );
    }
}

export default FunctionList;