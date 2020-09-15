import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Carousel } from 'react-bootstrap';
import Chart from "react-apexcharts";

import radialChart from '../../charts/radial-bar-chart-1';
import { BasicSpinner } from "../../../studio/utils/BasicSpinner";
import { notifyError } from '../../../studio/utils/Notifications';
import { dashBoardService } from '../../../studio/services/AdminDashboardService';

import './DashComponents.scss';

export { SalesActivity, InventorySummary, ProductDetails, SellingVariants, PurchaseOrders, SalesOrders }

function SalesActivity(props) {
    const [SalesOrders, setSalesOrders] = useState({
        data: {},
        loading: true,
        error: false
    })
    useEffect(() => {
        dashBoardService.getData('salesorders').then(response => {
            if (response.error)
                notifyError('ERROR', 'Could not retrieve Sales Activity')
            setSalesOrders({
                data: response.data,
                loading: response.loading,
                error: response.error
            })
        })
        // .catch(error => {
        //     notifyError('ERROR', 'Could not retrieve Sales Activity')
        //     setSalesOrders({
        //         loading: false,
        //         error: true
        //     })
        //     console.log(error)
        // })
        // console.log(SalesOrders)
        // .then(response => {
        //     setSalesOrders({
        //         data: response.data,
        //         loading: false,
        //         error: false
        //     });
        // })
        // .catch(error => {
        //     notifyError('ERROR', 'Could not retrieve Sales Activity')
        //     setSalesOrders({
        //         loading: false,
        //         error: true
        //     })
        //     console.log(error)
        // })
    }, [props])
    return (
        <div className="container-fluid pl-0">
            <h2 className="text-muted ml-3 mb-4">Sales Activity</h2>
            {!SalesOrders.error && !SalesOrders.loading ?
                SalesOrders.data.result.map((dataObject) =>
                    <Row key={dataObject.id} className="text-muted">
                        <Col xl={4}>
                            <Card className="br-10x">
                                <Card.Body className="text-center">
                                    <h1> {dataObject.qty_to_invoice} </h1>
                                    <label>CONFIRMED</label>
                                    <i className="fas fa-check-circle ml-2 content-green"></i>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={4}>
                            <Card className="br-10x">
                                <Card.Body className="text-center">
                                    <h1> {dataObject.qty_invoiced} </h1>
                                    <label>INVOICED</label>
                                    <i className="fas fa-file-invoice ml-2 content-yellow"></i>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={4}>
                            <Card className="br-10x">
                                <Card.Body className="text-center">
                                    <h1> {dataObject.qty_delivered} </h1>
                                    <label>DELIVERED</label>
                                    <i className="fas fa-truck ml-2 content-blue"></i>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )
                :
                <Card className="border-radius ml-3">
                    <Card.Body className="text-center">
                        {SalesOrders.error ?
                            'Data Could not be Retrieved'
                            :
                            <BasicSpinner />
                        }

                    </Card.Body>
                </Card>
            }
        </div>
    );
}

function InventorySummary(props) {
    const [InventoryStatus, setInventoryStatus] = useState({
        loading: true,
        data: {},
        error: false
    })
    useEffect(() => {
        dashBoardService.getData('inventoryStatus').then(response => {
            if (response.error)
                notifyError('ERROR', 'Could not retrieve Inventory Summary')
            setInventoryStatus({
                data: response.data,
                loading: response.loading,
                error: response.error
            })
        })
        // dashBoardService.getData('inventoryStatus')
        //     .then(response => {
        //         setInventoryStatus({
        //             data: response.data,
        //             loading: false,
        //             error: false,
        //         })
        //     })
        //     .catch(error => {
        //         notifyError('ERROR', 'Could not retrieve Inventory Summary')
        //         setInventoryStatus({
        //             loading: false,
        //             error: true,
        //         })
        //         console.log(error)
        //     })
    }, [props])
    let qtyInHand = 0;
    let qtyToBeReceived = 0;
    if (!InventoryStatus.error && !InventoryStatus.loading) {
        InventoryStatus.data.records.forEach(element => {
            if (element.qty_available > 0) {
                qtyInHand += element.qty_available
            } else {
                qtyToBeReceived += element.qty_available * -1
            }
        })
    }
    return (
        <div className="container-fluid">
            <h4 className="text-muted">Inventory summary</h4>
            {!InventoryStatus.error && !InventoryStatus.loading ?
                <div>
                    <Card className="br-10x text-uppercase">
                        <Row>
                            <Col xs={10} className="p-3 text-muted border-right content-float-left">
                                <strong>Quantity in Hand</strong>
                            </Col>
                            <Col xs={2} className="pt-2 pb-2 text-center content-float-right">
                                <h4><strong>{qtyInHand}</strong></h4>
                            </Col>
                        </Row>
                    </Card>
                    <Card className="br-10x text-uppercase">
                        <Row>
                            <Col xs={10} className="p-3 text-muted border-right content-float-left">
                                <strong>Quantity to be Received</strong>
                            </Col>
                            <Col xs={2} className="pt-2 pb-2 text-center content-float-right">
                                <h4><strong>{qtyToBeReceived}</strong></h4>
                            </Col>
                        </Row>
                    </Card>
                </div>
                :
                <Card className="br-10x text-uppercase">
                    <Card.Body className="text-center">
                        {InventoryStatus.error ?
                            'Data Could not be Retrieved'
                            :
                            <BasicSpinner />
                        }
                    </Card.Body>
                </Card>
            }
        </div>
    );
}

function ProductDetails(props) {
    const [InventorySummary, setInventorySummary] = useState({
        loading: true,
        data: {},
        error: false
    })
    useEffect(() => {
        dashBoardService.getData('inventorySummary').then(response => {
            if (response.error)
                notifyError('ERROR', 'Could not retrieve Product Details')
            setInventorySummary({
                data: response.data,
                loading: response.loading,
                error: response.error
            })
        })
        // dashBoardService.getData('inventorySummary')
        //     .then(response => {
        //         setInventorySummary({
        //             data: response.data,
        //             loading: false,
        //             error: false,
        //         })
        //     })
        //     .catch(error => {
        //         notifyError('ERROR', 'Could not retrieve Product Details')
        //         setInventorySummary({
        //             loading: false,
        //             error: true
        //         })
        //         console.log(error)
        //     })
    }, [props])
    let allVariants = 0;
    if (!InventorySummary.error && !InventorySummary.loading) {
        InventorySummary.data.result.forEach(element => {
            allVariants += element.__count
        });
    }

    function handleDrillDownClick() {
        if (!InventorySummary.loading)
            props.initiateDrilldown(dashBoardService.purchaseOrdersDrilldown, 'products')
    }

    return (
        <Card className="dashboard-card-1 br-10x cursor-pointor">
            <Row className="mt-3 ml-3">
                <Col xs={12} md={9} onClick={() => handleDrillDownClick()}>
                    <h4 className="text-uppercase">Product Details</h4>
                </Col>
                <Col xs={12} md={3} className="text-center">
                    <select className="bg-white content-border-none" >
                        <option>This month</option>
                        <option>January</option>
                        <option>Febbruary</option>
                    </select>
                </Col>
            </Row>
            <hr />
            {!InventorySummary.error && !InventorySummary.loading ?
                <Card.Body onClick={() => handleDrillDownClick()}>
                    <div className="dashboard-chart-content content-float-left border-right h-100">
                        <div className="container-fluid p-3">
                            <Row>
                                <Col md={9} xs={6} className="content-float-left">
                                    <h5>Low Stock Variants</h5>
                                </Col>
                                <Col md={3} xs={6} className="content-float-left">
                                    <h5>{InventorySummary.data.result.length}</h5>
                                </Col>
                            </Row>
                        </div>
                        <div className="container-fluid p-3">
                            <Row>
                                <Col xs={9} className="content-float-left">
                                    <h5>All Variants</h5>
                                </Col>
                                <Col xs={3} className="content-float-left">
                                    <h5>{allVariants}</h5>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div className="dashboard-chart">
                        <Chart {...radialChart} />
                    </div>
                </Card.Body>
                :
                <Card.Body className="text-center">
                    {InventorySummary.error ?
                        'Data Could not be Retrieved'
                        :
                        <BasicSpinner />
                    }
                </Card.Body>
            }
        </Card>
    );
}

function SellingVariants(props) {
    const [SalesData, setSalesData] = useState({
        data: {},
        loading: true,
        error: false
    })
    useEffect(() => {
        dashBoardService.getData('sales').then(response => {
            if (response.error)
                notifyError('ERROR', 'Could not retrieve Selling Variants')
            setSalesData({
                data: response.data,
                loading: response.loading,
                error: response.error
            })
        })
        // dashBoardService.getData('sales')
        //     .then(response => {
        //         setSalesData({
        //             data: response.data,
        //             loading: false,
        //             error: false
        //         })
        //     })
        //     .catch(error => {
        //         notifyError('ERROR', 'Could not retrieve Selling Variants')
        //         setSalesData({
        //             loading: false,
        //             error: true
        //         })
        //         console.log(error)
        //     })
    }, [props])
    let evenArray = [];
    let oddArray = [];
    // if (!SalesData.error && !SalesData.loading) {
    //     function sortArray() {
    //         SalesData.data.result.forEach((element, index) => {
    //             if (index % 2 === 0) {
    //                 evenArray = evenArray.concat(element)
    //             } else {
    //                 oddArray = oddArray.concat([element])
    //             }
    //         });
    //     }
    //     if (SalesData.data.result.length % 2 === 0) {
    //         sortArray();
    //     } else {
    //         sortArray();
    //         oddArray = oddArray.concat(evenArray[0])
    //     }
    // }
    if (!SalesData.error && !SalesData.loading) {
        evenArray = SalesData.data.result.filter(element => SalesData.data.result.indexOf(element) % 2 === 0)
        oddArray = SalesData.data.result.filter(element => SalesData.data.result.indexOf(element) % 2 !== 0)
        oddArray = oddArray.concat(evenArray[0])
    }
    return (
        <Card className="dashboard-card-1 br-10x">
            <Row className="mt-3 ml-3">
                <Col xs={12} md={8}>
                    <h4 className="text-uppercase">Top Selling Variants</h4>
                </Col>
                <Col xs={12} md={4} className="text-center">
                    <select className="bg-white content-border-none">
                        <option>Ths month</option>
                        <option>January</option>
                        <option>Febbruary</option>
                    </select>
                </Col>
            </Row>
            <hr />
            {!SalesData.error && !SalesData.loading ?
                <Card.Body>
                    <Carousel fade={false} indicators={false} interval={3000}>
                        {evenArray.map((dataObject, dataObjectIndex) =>
                            <Carousel.Item key={dataObjectIndex}>
                                <Row>
                                    <Col xs={6} className="text-center">
                                        <div className="h-50">
                                            <img height="90em" width="100em" src={`https://demo.digitaldots.io/api/image?imageId=${evenArray[dataObjectIndex].product_id[0]}`} alt={evenArray[dataObjectIndex].product_id[1]} />
                                        </div>
                                        <div className="h-50">
                                            <h5>{evenArray[dataObjectIndex].product_id[1]}</h5>
                                            <p><strong>Quantity: {evenArray[dataObjectIndex].__count}</strong></p>
                                            <p><strong>Total Price: $ {evenArray[dataObjectIndex].price_subtotal}</strong></p>
                                        </div>
                                    </Col>
                                    {oddArray[dataObjectIndex] &&
                                        <Col xs={6} className="text-center">
                                            <div className="h-50">
                                                <img height="90em" width="100em" src={`https://demo.digitaldots.io/api/image?imageId=${oddArray[dataObjectIndex].product_id[0]}`} alt={oddArray[dataObjectIndex].product_id[1]} />
                                            </div>
                                            <div className="h-50">
                                                <h5>{oddArray[dataObjectIndex].product_id[1]}</h5>
                                                <p><strong>Quantity: {oddArray[dataObjectIndex].__count}</strong></p>
                                                <p><strong>Total Price: $ {oddArray[dataObjectIndex].price_subtotal}</strong></p>
                                            </div>
                                        </Col>
                                    }
                                </Row>
                            </Carousel.Item>
                        )}
                    </Carousel>
                </Card.Body>
                :
                <Card.Body className="text-center">
                    {SalesData.error ?
                        'Data Could not be Retrieved'
                        :
                        <BasicSpinner />
                    }
                </Card.Body>
            }
        </Card >
    );
}

function PurchaseOrders(props) {
    const [PurchaseOrdersData, setPurchaseOrdersData] = useState({
        data: {},
        loading: true,
        error: false
    })
    useEffect(() => {
        dashBoardService.getData('purchaseordersSummary').then(response => {
            if (response.error)
                notifyError('ERROR', 'Could not retrieve Purchase Orders')
            setPurchaseOrdersData({
                data: response.data,
                loading: response.loading,
                error: response.error
            })
        })
        // dashBoardService.getData('purchaseordersSummary')
        //     .then(response => {
        //         setPurchaseOrdersData({
        //             data: response.data,
        //             error: false,
        //             loading: false
        //         })
        //     })
        //     .catch(error => {
        //         notifyError('ERROR', 'Could not retrieve Purchase Orders')
        //         setPurchaseOrdersData({
        //             loading: false,
        //             error: true
        //         })
        //         console.log(error)
        //     })
    }, [props])

    function handleDrillDownClick() {
        if (!PurchaseOrdersData.loading)
            props.initiateDrilldown(dashBoardService.purchaseOrdersDrilldown, 'purchaseorders')
    }

    return (
        <Card className="dashboard-card-2 br-10x cursor-pointor">
            <Row className="mt-3 ml-3">
                <Col xs={12} md={9} onClick={() => handleDrillDownClick()}>
                    <h4 className="text-uppercase">Purchase Orders</h4>
                </Col>
                <Col xs={12} md={3} className="text-center">
                    <select className="bg-white content-border-none">
                        <option>This month</option>
                        <option>January</option>
                        <option>Febbruary</option>
                    </select>
                </Col>
            </Row>
            <hr />
            <div className="container-fluid text-center overflow-auto" onClick={() => handleDrillDownClick()}>
                {!PurchaseOrdersData.error && !PurchaseOrdersData.loading ?
                    <Table responsive hover borderless>
                        <thead>
                            <tr>
                                <th></th>
                                <th>No. of Orders</th>
                                <th>Ordered</th>
                                <th>Items to be Billed</th>
                                <th>Items Billed</th>
                                <th>Items Received</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[].concat(PurchaseOrdersData.data.result)
                                .sort((a, b) => b.__count - a.__count)
                                .map((dataObject, dataObjectIndex) =>
                                    <tr key={dataObjectIndex}>
                                        <th> {dataObject.state === 'done' ? 'Completed'.toLocaleUpperCase() : dataObject.state === 'cancel' ? 'Cancelled'.toLocaleUpperCase() : dataObject.state === 'purchase' ? 'Purchased'.toLocaleUpperCase() : dataObject.state.toLocaleUpperCase()} </th>
                                        <td> {dataObject.__count} </td>
                                        <td> {dataObject.qty_ordered} </td>
                                        <td> {dataObject.qty_to_be_billed} </td>
                                        <td> {dataObject.qty_billed} </td>
                                        <td> {dataObject.qty_received} </td>
                                    </tr>
                                )}
                        </tbody>
                    </Table>
                    :
                    PurchaseOrdersData.error ?
                        'Data Could not be Retrieved'
                        :
                        <BasicSpinner />
                }
            </div>
        </Card>
    );
}

function SalesOrders(props) {
    const [SalesOrderSummary, setSalesOrderSummary] = useState({
        data: {},
        loading: true,
        error: false
    })
    useEffect(() => {
        dashBoardService.getData('salesSummary').then(response => {
            if (response.error)
                notifyError('ERROR', 'Could not retrieve Sales Orders')
            setSalesOrderSummary({
                data: response.data,
                loading: response.loading,
                error: response.error
            })
        })
        // dashBoardService.getData('salesSummary')
        //     .then(response => {
        //         setSalesOrderSummary({
        //             data: response.data,
        //             error: false,
        //             loading: false
        //         })
        //     })
        //     .catch(error => {
        //         notifyError('ERROR', 'Could not retrieve Sales Orders')
        //         setSalesOrderSummary({
        //             loading: false,
        //             error: true
        //         });
        //         console.log(error)
        //     })
    }, [props])

    function handleDrillDownClick() {
        if (!SalesOrderSummary.loading)
            props.initiateDrilldown(dashBoardService.purchaseOrdersDrilldown, 'sales-orders')
    }

    return (
        <Card className="dashboard-card-2 br-10x cursor-pointor">
            <Row className="mt-3 ml-3">
                <Col xs={12} md={9} onClick={() => handleDrillDownClick()}>
                    <h4 className="text-uppercase">Sales Orders</h4>
                </Col>
                <Col xs={12} md={3} className="text-center">
                    <select className="bg-white content-border-none">
                        <option>This month</option>
                        <option>January</option>
                        <option>Febbruary</option>
                    </select>
                </Col>
            </Row>
            <hr />
            <div className="container-fluid text-center overflow-auto" onClick={() => handleDrillDownClick()}>
                {!SalesOrderSummary.error && !SalesOrderSummary.loading ?
                    <Table responsive hover borderless>
                        <thead>
                            <tr>
                                <th></th>
                                <th>No of Orders</th>
                                <th>Ordered</th>
                                <th>To Invoice</th>
                                <th>Invoiced</th>
                                <th>Delivered</th>
                                <th>Sales($)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {SalesOrderSummary.data.result.map((dataObject, dataObjectIndex) =>
                                <tr key={dataObjectIndex}>
                                    <th> {dataObject.team_id[1]} </th>
                                    <td> {dataObject.__count} </td>
                                    <td> {dataObject.product_uom_qty} </td>
                                    <td> {dataObject.qty_to_invoice} </td>
                                    <td> {dataObject.qty_invoiced} </td>
                                    <td> {dataObject.qty_delivered} </td>
                                    <td> {dataObject.price_total} </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    :
                    SalesOrderSummary.error ?
                        'Data Could not be Retrieved'
                        :
                        <BasicSpinner />
                }
            </div>
        </Card>
    );
}