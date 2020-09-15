import React from "react";
import { Row, Col, Card } from 'react-bootstrap';
import { Chart } from "react-google-charts";

import { notifyError } from "../../../studio/utils/Notifications"
import { inputField } from "../../../studio/utils/StudioUtils";
import { demoDashboardService } from "../../services/DemoDashboardService"

import "./SalesDashboard.scss"
import { BasicSpinner } from "../../../studio/utils/BasicSpinner";

var dates = [];
var chartLabels = [];
var regionColors = ["#1e90ff", "#a5bef9", "#ffbe87", "#ff8c00"];
var salesColors = ["#1A73E8", "#FF8C00"]
var regions = [
    {
        country: "Canada",
        flag: require("../../../assets/studio/svg/canada.svg"),
    },
    {
        country: "United States",
        flag: require("../../../assets/studio/svg/united-states.svg"),
    },
    {
        country: "Europe",
        flag: require("../../../assets/studio/svg/uk.svg"),
    },
    {
        country: "Japan",
        flag: require("../../../assets/studio/svg/japan.svg"),
    },
];

export default class SalesDashboard extends React.Component {
    constructor() {
        super();
        this.state = {
            salesData: [],
            ordersData: [],
            regionSales: [],
        }
    }

    componentDidMount() {
        this.setState({ loading: true })
        demoDashboardService.getSalesData().then(response => {
            this.loadChartData(response);
        }).catch((error) => {
            this.setState({ loading: false })
            console.log("demoDashboardService.getSalesData", error)
            notifyError("Unable to retreive Sales Data", error.message)
        })
    }

    loadChartData(sales, dateSelected) {
        var chartDataItems = [];
        var regionSales = [];
        dates = sales.data.map((dailySales) => (dailySales.date))
        var daySales = [];
        var daySalesIndex = -1;
        var priorSales = [];

        if (!dateSelected) {
            dateSelected = dates[0];
        }

        for (let index = 0; index < sales.data.length; index++) {
            if (dateSelected === sales.data[index].date) {
                daySalesIndex = index;
                break;
            }
        }

        daySales = sales.data.filter(dataItem => dataItem.date === dateSelected)[0];

        chartLabels = daySales.metrics.map(daySalesData => daySalesData.hour.substring(0, daySalesData.hour.length - 4))
        // chartLabels = chartLabels.map(label => label.split(":")[0] + label.split(":")[1].slice(-2))

        var chartSeriesArra = ["sales", "orders", "relative_sales", "relative_orders"]

        chartSeriesArra.forEach(chart_series => {
            var dataItem = daySales.metrics.map(daySalesData => daySalesData[chart_series])
            var chartDataItem = {
                "label": chart_series,
                "data": dataItem,
                "date": daySales.date,
                "total_sales": parseInt(daySales.total_sales),
                "total_orders": daySales.total_orders,
                "relative_sales": daySales.relative_sales,
                "relative_orders": daySales.relative_orders,
            };
            chartDataItems.push(chartDataItem);
        });

        if (daySalesIndex + 1 < sales.data.length) {
            priorSales = sales.data[daySalesIndex + 1].metrics.map(metric => metric.sales)
        } else if (daySalesIndex + 1 === sales.data.length) {
            priorSales = sales.data[daySalesIndex].metrics.map(metric => 0)
        }

        // region sales
        for (let index = 0; index < regions.length; index++) {
            var rsales = this.getRegionSalesData(sales.regions[index], dateSelected);
            var r = {
                "region": regions[index].country,
                "flag": regions[index].flag,
                "date": dateSelected,
                "total_sales": rsales.total_sales,
                "total_orders": rsales.total_orders,
                "relative_sales": rsales.relative_sales,
                "relative_total_sales": rsales.relative_total_sales,
            }
            regionSales.push(r);
        }

        dates = dates.map(date => { return { label: date, value: date } })

        let [salesData, ordersData, relativeSalesData, relativeOrdersData] = chartDataItems;

        this.setState({
            loading: false,
            sales,
            chartlabels: chartLabels,
            salesData: salesData,
            ordersData: ordersData,
            relativeSalesData: relativeSalesData,
            relativeOrdersData: relativeOrdersData,
            labelSales: dateSelected,
            labelOrders: dateSelected,
            projections: dates,
            regionSales: regionSales,
            selectedDate: dateSelected,
            priorSales: priorSales
        });
    }

    getRegionSalesData(regionsData, dateSelected) {
        var regionDaySales = regionsData.data.filter(dataitem => dataitem.date === dateSelected)

        if (regionDaySales && regionDaySales.length > 0) {
            return {
                total_sales: parseInt(regionDaySales[0].total_sales),
                total_orders: parseInt(regionDaySales[0].total_orders),
                relative_sales: parseInt(regionDaySales[0].relative_sales),
                relative_total_sales: parseInt(regionDaySales[0].relative_total_sales)
            }
        } else {
            return {
                total_sales: 0,
                total_orders: 0,
                relative_sales: 0,
                relative_total_sales: 0
            }
        }
    }

    handleDateChange(name, value) {
        this.loadChartData(this.state.sales, value)
    }

    getFormattedValue(value) {
        if (Math.abs(value) > 999 && Math.abs(value) < 1000000) {
            return Math.abs(value) > 999 ? Math.sign(value) * ((Math.abs(value) / 1000).toFixed(1)) + 'k' : Math.sign(value) * Math.abs(value)
        } else if (Math.abs(value) > 999999) {
            return Math.abs(value) > 999999 ? Math.sign(value) * ((Math.abs(value) / 1000000).toFixed(1)) + 'M' : Math.sign(value) * Math.abs(value)
        }
    }

    // METHODS TO RENDER CHARTS

    getChart(config) {
        return (
            <Chart
                width={'100%'}
                height={config.height}
                chartType={config.type}
                loader={<div>Loading Chart</div>}
                data={config.data}
                options={config.options}
                // For tests
                rootProps={{ 'data-testid': '1' }}
                mapsApiKey="YOUR_KEY_HERE"
            />
        )
    }

    renderChartSales() {
        const { salesData, relativeSalesData } = this.state;
        let dset = [["Time", "Sales within hour", "Compared to Avg. in Hr(%)"]]
        // let ticks = []
        if (salesData.data) {
            let tempData = [];
            for (let i = 0; i < salesData.data.length; i++) {
                tempData.push([chartLabels[i], salesData.data[i], relativeSalesData.data[i]])
                // if (i % 2 === 0) {
                //     ticks.push({ v: chartLabels[i], f: chartLabels[i] })
                // }
            }
            dset = dset.concat(tempData)
        }

        let options = {
            borderColor: "black",
            pieSliceText: 'none',
            pieStartAngle: 100,
            chartArea: { left: 50, top: 40, width: '90%' },
            pieHole: 0.5,
            colors: salesColors,
            legend: {
                textStyle: { color: 'gray' },
                position: 'top',
                alignment: 'center',
            },
            vAxis: {
                format: 'short',
                scaleType: 'log',
                // gridlines: {
                //     color: 'transparent'
                // }
            },
            hAxis: {
                title: 'Time (hr)',
                titleTextStyle: {
                    fontSize: 12
                },
                // ticks: ticks,
            },
            tooltip: {
                textStyle: {
                    bold: true,
                    fontSize: 13
                },
                showColorCode: true,
            },
        }

        let config = {
            height: "250px",
            type: "AreaChart",
            data: dset,
            options: options,
        }

        return this.getChart(config)
    }

    renderChartOrders() {
        const { ordersData } = this.state

        let dset = [["Time", "Orders within Hr"]]
        if (ordersData.data) {
            let tempData = [];
            for (let i = 0; i < ordersData.data.length; i++) {
                tempData.push([chartLabels[i], ordersData.data[i]])
            }
            dset = dset.concat(tempData)
        }

        let options = {
            borderColor: "black",
            pieSliceText: 'none',
            chartArea: { left: 50, top: 40, width: '90%' },
            pieStartAngle: 100,
            pieHole: 0.5,
            colors: salesColors,
            legend: {
                textStyle: { color: 'gray' },
                position: 'top',
                alignment: 'center',
            },
            vAxis: { format: 'short', scaleType: 'log' },
            hAxis: { title: 'Time (hr)', titleTextStyle: { fontSize: 12 } },
            tooltip: {
                textStyle: {
                    bold: true,
                    fontSize: 13
                },
                showColorCode: true,
            },
        }

        let config = {
            height: "250px",
            type: "AreaChart",
            data: dset,
            options: options,
        }

        return this.getChart(config)
    }

    renderHourlySales() {
        const { salesData, priorSales } = this.state;
        let dset = [["Time", "Current Drop Sales", "Previous Drop Sales"]];
        if (salesData.data) {
            let tempData = []
            for (let i = 0; i < priorSales.length; i++) {
                tempData.push([chartLabels[i], salesData.data[i], priorSales[i]])
            }
            dset = dset.concat(tempData);
        }

        let options = {
            legend: {
                position: 'top',
                alignment: 'center',
            },
            vAxis: { format: 'short', scaleType: 'log' },
            hAxis: { title: 'Time (hr)', titleTextStyle: { fontSize: 12 } },
            chartArea: { left: 50, top: 40, width: '90%' },
            borderColor: "black",
            pieSliceText: 'none',
            colors: salesColors,
            bar: { groupWidth: "100%" },
            tooltip: {
                textStyle: {
                    bold: true,
                    fontSize: 12
                },
                showColorCode: true,
            },
        }

        let config = {
            height: "298px",
            type: "ColumnChart",
            data: dset,
            options: options,
        }

        return this.getChart(config)
    }

    renderChartSalesDistribution() {
        let dset = [['Country', 'Total Sales']]
        let regionSales = [...this.state.regionSales]
        dset = dset.concat(regionSales.map(region => { return [region.region, region.total_sales] }))

        let options = {
            borderColor: "black",
            pieStartAngle: 100,
            chartArea: { left: 50, top: 40, width: '90%', height: "90%" },
            pieHole: 0.5,
            colors: regionColors,
            legend: {
                textStyle: { color: 'gray' },
                position: 'top',
                alignment: 'center',
            },
            tooltip: {
                textStyle: {
                    bold: true,
                    fontSize: 13
                },
                showColorCode: true,
            },
        }

        let config = {
            height: "320px",
            type: "PieChart",
            data: dset,
            options: options,
        }

        return this.getChart(config)
    }

    renderChartSalesRegion() {
        let dset = [['Country', 'regionColors', { role: 'tooltip', p: { html: true } }]];
        let regionSales = [...this.state.regionSales]
        dset = dset.concat(regionSales.map((region, i) => { return [region.region === "Europe" ? "United Kingdom" : region.region, i, '$' + region.total_sales] }))

        let options = {
            colorAxis: { minValue: 0, maxValue: 3, colors: regionColors },
            legend: 'none',
            tooltip: {
                textStyle: {
                    bold: true,
                    fontSize: 13
                },
                showColorCode: true
            },
        }

        let config = {
            height: "320px",
            type: "GeoChart",
            data: dset,
            options: options,
        }

        return this.getChart(config)
    }

    render() {
        const { salesData, regionSales, selectedDate, projections, ordersData, priorSales, loading } = this.state;

        return (
            <div>
                {loading &&
                    <Card className="mt-2">
                        <Card.Body>
                            <BasicSpinner />
                        </Card.Body>
                    </Card>
                }
                {!loading &&
                    <div>
                        <Row xs={1} className="text-right">
                            <Col>
                                {inputField("select", "date", "", selectedDate, this.handleDateChange.bind(this),
                                    {
                                        container: "date-container mt-1 mb-0",
                                        input: "date-input",
                                    },
                                    projections, ""
                                )}
                                <label className="date-label">Week Ending:</label>
                            </Col>
                            <Col>
                                <span className="pb-2"> All times are in EST.</span>
                            </Col>
                        </Row>
                        <Row xs={1}>
                            <Col className="px-0">
                                <Row className="content">
                                    <Col md={12} xl={6} className="mb-3">
                                        <Card className="studio-card py-1">
                                            <Card.Body className="px-0">
                                                <Row>
                                                    <Col className="col-xs-12 text-right">
                                                        <h4 className="text-muted f-w-600 f-16 mb-3 text-center">GROSS SALES</h4>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col className="text-center px-0">
                                                        <div className="p-0 m-0">
                                                            <h1 className="studio-secondary" >${this.getFormattedValue(salesData.total_sales)}
                                                                <label className={`m-0 ml-2 ${salesData.relative_sales > 0 ? "text-success" : "text-danger"} font-small`}>{salesData.relative_sales > 0 ? '▲' : '▼'}{salesData.relative_orders}%</label>
                                                            </h1>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col sm={12} className="px-0">
                                                        {salesData.data && this.renderChartSales()}
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={12} xl={6} className="mb-3">
                                        <Card className="studio-card py-1">
                                            <Card.Body className="px-0">
                                                <Row>
                                                    <Col className="col-xs-12 text-right">
                                                        <h4 className="text-muted f-w-600 f-16 mb-3 text-center">TOTAL ORDERS</h4>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col className="text-center px-0">
                                                        <h1 className="studio-secondary">{ordersData.total_orders ? ordersData.total_orders.toLocaleString() : ordersData.total_orders}</h1>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col sm={12} className="px-0">
                                                        {this.renderChartOrders()}
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col className='px-0'>
                                        <Row xs={1} md={2} lg={4}>
                                            {(regionSales && regionSales.length) && regionSales.map((saleData, index) => (
                                                <Col key={index}>
                                                    <Card className="studio-card p-2 fa-2x">
                                                        <Card.Body>
                                                            <Row>
                                                                <Col className="col-xs-12 px-0">
                                                                    <h4 className="text-muted text-center mb-1">
                                                                        <img height="25px" width="25px" src={saleData.flag} alt={saleData.region}></img>
                                                                        <span className="ml-1 mt-1">{saleData.region}</span>
                                                                    </h4>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Col className="text-center px-0">
                                                                    <Row xs={1}>
                                                                        <Col>
                                                                            <label className="font-bold text-muted">Sales</label>
                                                                        </Col>
                                                                        <Col>
                                                                            <Row>
                                                                                <Col className="font-bold px-0 mr-1 text-right">
                                                                                    <h4 className="studio-secondary mb-0">${this.getFormattedValue(saleData.total_sales)}
                                                                                        <label className={`${saleData.relative_total_sales > 0 ? "text-success" : "text-danger"} font-small mb-0 ml-2`}>{saleData.relative_total_sales > 0 ? '▲' : '▼'}{saleData.relative_total_sales}%</label>
                                                                                    </h4>
                                                                                </Col>
                                                                            </Row>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                                <Col className="font-bold text-center px-0">
                                                                    <Row xs={1}>
                                                                        <Col>
                                                                            <label className="text-muted">Orders</label>
                                                                        </Col>
                                                                        <Col>
                                                                            <label className="studio-secondary mb-0">{saleData.total_orders}</label>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                            <Row className="text-center">
                                                                <Col>
                                                                    <p className="text-primary mb-0 mt-2">Previous Week: ${priorSales[index] ? priorSales[index].toLocaleString() : priorSales[index]}</p>
                                                                </Col>
                                                            </Row>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            ))}

                                        </Row>
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col>
                                        <Card className="studio-card">
                                            <Card.Body className="px-0">
                                                <Row>
                                                    <Col className="col-xs-12 text-right">
                                                        <h5 className="text-muted f-w-600 f-16 col-xs-12 text-center">HOURLY SALES ANALYSIS</h5>
                                                    </Col>
                                                </Row><br />
                                                <Row>
                                                    <Col className="col-xs-12 center-block text-center px-0">
                                                        {this.renderHourlySales()}
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card className="studio-card">
                                            <Card.Body className="px-0">
                                                <Row>
                                                    <Col className="col-xs-12 text-right">
                                                        <h5 className="text-muted f-w-600 f-16 col-xs-12 text-center">SALES DISTRIBUTION</h5>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col className="px-1" sm={12}>
                                                        {regionSales && regionSales.length > 3 &&
                                                            this.renderChartSalesDistribution()
                                                        }
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card className="studio-card">
                                            <Card.Body className="px-0">
                                                <Row>
                                                    <Col>
                                                        <h5 className="text-muted f-w-600 f-16 text-center">
                                                            SALES BY REGION
                                                        </h5>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col className="px-0">
                                                        {regionSales.length > 0 &&
                                                            this.renderChartSalesRegion()
                                                        }
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                }
            </div>
        );
    }
}