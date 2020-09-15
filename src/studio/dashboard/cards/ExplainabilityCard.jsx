import React, { useState } from 'react';
import { Row, Col } from 'reactstrap';
import { Chart } from "react-google-charts";
import { dashboardService } from "../../services/DashboardService";

import { notifyError } from "../../utils/Notifications";

import "../Dashboard.scss"

export default function ExplainabilityCard(props) {
    const [responseProps, setResponseProps] = useState([])
    // let options = JSON.parse(JSON.stringify(props.options || {}));
    let options = {
        showTitle: true,
        showLabel: false,
        showCategoryAxis: true,
        showValueAxis: true,
        title: 'Overall sentiment Analysis',
        sortBubblesBySize: true,
        "hAxis": {
            "title": "",
            "textStyle": {
                "fontName": "Arial",
                "color": "#FFFFFF"
            },
            "titleTextStyle": {
                "color": "#FFFFFF"
            },
            "baselineColor": "#FFFFFF",
            "gridlines": {
                "color": "#FFFFFF"
            }
        },
        "vAxis": {
            "titleTextStyle": {
                "color": "#FFFFFF"
            },
            "baselineColor": "#FFFFFF",
            "textStyle": {
                "fontName": "Arial",
                "color": "#FFFFFF"
            },
            "minValue": 0,
            "gridlines": {
                "color": "#FFFFFF"
            }
        },
        bubble: { textStyle: { fontSize: 10, auraColor: 'none' } },
        colors: ['#93f291', "#e87166"]
    }

    const getData = (dataSource) => {
        dashboardService.getDashboardData(dataSource).then(response => {
            setResponseProps(response)
        }).catch(error => {
            console.error('dashboardService.getDashboardData:', error);
            notifyError('Unable to retrieve Dashboard Data', error.message);
        })
    }

    const getChart = () => {
        console.log(props.data)
        return (
            <Chart
                chartType={props.chartType}
                data={props.data || []}
                loader={<div>Loading Chart</div>}
                chartEvents={[
                    {
                        eventName: 'select',
                        callback: ({ chartWrapper }) => {
                            const chart = chartWrapper.getChart();
                            const selection = chart.getSelection();
                            const dataTable = chartWrapper.getDataTable();
                            const selectedValue = dataTable.getValue(selection[0].row, selection[0].column ? selection[0].column : 0);
                            if (selectedValue) {
                                getData(props.dataSource)
                            }
                        },
                    },
                ]}
                options={options}
            />
        )
    }

    return (
        <Row xs={1} md={2}>
            <Col sm="auto" className="text-center">
                {getChart()}
            </Col>
            <Col className="text-center">
                {responseProps.length > 0 && <table className="explaination-card-table">
                    <thead>
                        <tr>
                            {Object.keys(responseProps[0]).map((properties, propertiesIndex) =>
                                <th key={propertiesIndex}>
                                    {properties}
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {responseProps.map((property, propertyIndex) =>
                            <tr key={propertyIndex}>
                                {Object.keys(property).map((prop, propIndex) =>
                                    <td key={propIndex}>{property[prop]}</td>
                                )}
                            </tr>
                        )}
                    </tbody>
                </table>
                }
            </Col>
        </Row>
    )
}