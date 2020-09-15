import React, { useState, useEffect, useReducer } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody } from "reactstrap";

import { Form, Button, Row, Col } from "react-bootstrap";

import { dashBoardService } from "../../../studio/services/AdminDashboardService";
import DatePicker from "react-datepicker";
import { notifySuccess, notifyError, notifyWarning } from "../../../studio/utils/Notifications"

import StudioTable from '../../../studio/utils/StudioTable';

import { BasicSpinner } from '../../../studio/utils/BasicSpinner';

// STATE MANAGEMENT FOR MANUAL FORM
const manualFormReducer = (manualFormData, action) => {
    switch (action.type) {
        case 'SET_PRODUCT_NAME':
            return { manualData: { ...manualFormData.manualData, name: action.payload } };
        case 'SET_PRODUCT_ID':
            return { manualData: { ...manualFormData.manualData, product_id: action.payload } };
        case 'SET_DESCRIPTION':
            return { manualData: { ...manualFormData.manualData, description: action.payload } };
        case 'SET_date_planned':
            return { manualData: { ...manualFormData.manualData, date_planned: action.payload } };
        case 'SET_QUANTITY':
            return { manualData: { ...manualFormData.manualData, product_qty: action.payload } };
        case 'SET_UNITS':
            return { manualData: { ...manualFormData.manualData, units: action.payload } };
        case 'SET_PRICE_UNIT':
            return { manualData: { ...manualFormData.manualData, price_unit: action.payload } };
        case 'SET_DEFAULT_CODE':
            return { manualData: { ...manualFormData.manualData, default_code: action.payload } };
        case 'CLEAR_ALL':
            return { manualData: { name: '', product_id: null, description: '', date_planned: new Date(), product_qty: 1, units: 0, price_unit: 0, product_uom: 1, default_code: null } };
        default:
            return manualFormData;
    }
}

// STATE MANAGEMENT FOR AUTOMATED FORM
const autoFormReducer = (autoFormData, action) => {
    switch (action.type) {
        case 'SET_LEAD_TIME':
            return { autoData: { ...autoFormData.autoData, lead_time: action.payload } }
        case 'SET_ORDER_CYCLE':
            return { autoData: { ...autoFormData.autoData, order_cycle: action.payload } }
        case 'SET_SAFETY_STOCK_PERIODS':
            return { autoData: { ...autoFormData.autoData, safety_stock_periods: action.payload } }
        case 'SET_SERVICE_LEVELS':
            return { autoData: { ...autoFormData.autoData, service_levels: action.payload } }
        case 'SET_SHELF_LIFE':
            return { autoData: { ...autoFormData.autoData, shelf_life: action.payload } }
        case 'SET_AVG_DAILY_SALES_PERIOD':
            return { autoData: { ...autoFormData.autoData, avg_daily_sales_period: action.payload } }
        case 'SET_DELIVERY_LEAD_TIME_PERIOD':
            return { autoData: { ...autoFormData.autoData, delivery_lead_time_period: action.payload } }
        case 'SET_PRODUCT_ID':
            return { autoData: { ...autoFormData.autoData, product_id: action.payload } }
        case 'SET_CATEGORY':
            return { autoData: { ...autoFormData.autoData, category: action.payload } }
        case 'SET_REORDER':
            return { autoData: { ...autoFormData.autoData, reorder: action.payload } }
        case 'SET_MIN_QUANTITY':
            return { autoData: { ...autoFormData.autoData, min_quantity: action.payload } }
        case 'SET_MAX_QUANTITY':
            return { autoData: { ...autoFormData.autoData, max_quantity: action.payload } }
        case 'SET_BIN_SIZE':
            return { autoData: { ...autoFormData.autoData, bin_size: action.payload } }
        case 'SET_ROUNDING':
            return { autoData: { ...autoFormData.autoData, rounding: action.payload } }
        case 'SET_AUTO_APPROVAL':
            return { autoData: { ...autoFormData.autoData, auto_approval: !autoFormData.autoData.auto_approval } }
        case 'SET_AUTO_FORECAST':
            return { autoData: { ...autoFormData.autoData, auto_forecast: !autoFormData.autoData.auto_forecast } }
        case 'CLEAR_ALL':
            return { autoData: { lead_time: 30, order_cycle: 2, safety_stock_periods: 0, service_levels: 90, shelf_life: 0, avg_daily_sales_period: 0, delivery_lead_time_period: 0, product_id: 0, category: '', reorder: 'PERIODIC', min_quantity: 0, max_quantity: 0, bin_size: 0, rounding: 0, auto_approval: false, auto_forecast: false } }
        default:
            return autoFormData;
    }
}

function DrillDownComponent(props) {

    // REDUCERS
    const [manualFormData, dispatch] = useReducer(manualFormReducer, {
        manualData: {
            name: '',
            product_id: null,
            description: '',
            date_planned: new Date(),
            product_qty: 1,
            units: 0,
            price_unit: 0,
            product_uom: 1,
            default_code: null
        }
    })

    const [autoFormData, dispatchAuto] = useReducer(autoFormReducer, {
        autoData: {
            lead_time: 30,
            order_cycle: 2,
            safety_stock_periods: 0,
            service_levels: 90,
            shelf_life: 0,
            avg_daily_sales_period: 0,
            delivery_lead_time_period: 0,
            product_id: 0,
            category: '',
            reorder: 'PERIODIC',
            min_quantity: 1,
            max_quantity: 1,
            bin_size: 0,
            rounding: 0,
            auto_approval: false,
            auto_forecast: false
        }
    })

    // STATES
    const [responseData, setResponseData] = useState({
        data: {},
        loading: true,
        error: false
    })

    const [showProductsModal, setShowProductsModal] = useState({
        state: false,
        action: '',
    })

    const [showPurchaseModal, setShowPurchaseModal] = useState({
        state: false,
        data: {}
    })

    // FUNCTION TO HANDLE FORM RENDERING
    function showForm() {
        return (
            showProductsModal.action === 'Automatic' ?
                <div>
                    <Form.Group>
                        <Row>
                            <Col xs="2">
                                <label className="dashboard-label-auto-form"><strong>Lead Time (days):</strong></label>
                            </Col>
                            <Col>
                                <Form.Control className="text-center" defaultValue={autoFormData.autoData.lead_time} type="number" placeholder="Enter Lead Time" min={0}
                                    onChange={(e) => {
                                        dispatchAuto({ type: 'SET_LEAD_TIME', payload: parseInt(e.target.value) })
                                    }} />
                            </Col>
                            <Col xs="2">
                                <label className="dashboard-label-auto-form"><strong>Order Cycle (days):</strong></label>
                            </Col>
                            <Col>
                                <Form.Control className="text-center" defaultValue={autoFormData.autoData.order_cycle} type="number" placeholder="Enter Order Cycle" min={0}
                                    onChange={(e) => {
                                        dispatchAuto({ type: 'SET_ORDER_CYCLE', payload: parseInt(e.target.value) })
                                    }} />
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group>
                        <Row>
                            <Col xs="2">
                                <label className="dashboard-label-auto-form"><strong>Safety Stock Periods (days):</strong></label>
                            </Col>
                            <Col>
                                <Form.Control className="text-center" defaultValue={autoFormData.autoData.safety_stock_periods} type="number" placeholder="Enter Safety Stock Periods" min={0}
                                    onChange={(e) => {
                                        dispatchAuto({ type: 'SET_SAFETY_STOCK_PERIODS', payload: parseInt(e.target.value) })
                                    }} />
                            </Col>
                            <Col xs="2">
                                <label className="dashboard-label-auto-form"><strong>Service Levels (%):</strong></label>
                            </Col>
                            <Col>
                                <Form.Control className="text-center" defaultValue={autoFormData.autoData.service_levels} type="number" placeholder="Enter Service Levels" min={0}
                                    onChange={(e) => {
                                        dispatchAuto({ type: 'SET_SERVICE_LEVELS', payload: parseInt(e.target.value) })
                                    }} />
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group>
                        <Row>
                            <Col xs="2">
                                <label className="dashboard-label-auto-form"><strong>Shelf Life (days):</strong></label>
                            </Col>
                            <Col>
                                <Form.Control className="text-center" defaultValue={autoFormData.autoData.shelf_life} type="number" placeholder="Enter Shelf Life" min={0}
                                    onChange={(e) => {
                                        dispatchAuto({ type: 'SET_SHELF_LIFE', payload: parseInt(e.target.value) })
                                    }} />
                            </Col>
                            <Col xs="2">
                                <label className="dashboard-label-auto-form"><strong>Average Daily Sales Period (days):</strong></label>
                            </Col>
                            <Col>
                                <Form.Control className="text-center" defaultValue={autoFormData.autoData.avg_daily_sales_period} type="number" placeholder="Enter Average Daily Sales Period" min={0}
                                    onChange={(e) => {
                                        dispatchAuto({ type: 'SET_AVG_DAILY_SALES_PERIOD', payload: parseInt(e.target.value) })
                                    }} />
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group>
                        <Row>
                            <Col xs="2">
                                <label className="dashboard-label-auto-form"><strong>Delivery Lead Time Period (days):</strong></label>
                            </Col>
                            <Col>
                                <Form.Control className="text-center" defaultValue={autoFormData.autoData.delivery_lead_time_period} type="number" placeholder="Enter Delivery Lead Time Period" min={0}
                                    onChange={(e) => {
                                        dispatchAuto({ type: 'SET_DELIVERY_LEAD_TIME_PERIOD', payload: parseInt(e.target.value) })
                                    }} />
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group>
                        <Row>
                            <Col xs="2">
                                <label className="dashboard-label-auto-form"><strong>Product ID:</strong></label>
                            </Col>
                            <Col>
                                <Form.Control as="select" value={autoFormData.autoData.product_id}
                                    onChange={(e) => {
                                        dispatchAuto({ type: 'SET_PRODUCT_ID', payload: e.target.value })
                                    }}
                                    placeholder="Enter product ID">
                                    <option value="">Select ID</option>
                                    {responseData.data.records.map((dataObject, dataObjectIndex) =>
                                        <option key={dataObjectIndex} value={dataObject.id}>{dataObject.name}</option>
                                    )}
                                </Form.Control>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group>
                        <Row>
                            <Col xs="2">
                                <label className="dashboard-label-auto-form"><strong>Category:</strong></label>
                            </Col>
                            <Col>
                                <Form.Control as="select" value={autoFormData.autoData.category}
                                    onChange={(e) => {
                                        dispatchAuto({ type: 'SET_CATEGORY', payload: e.target.value })
                                    }}
                                    placeholder="Enter product ID">
                                    <option value="">Select Category</option>
                                    {responseData.data.records.map((dataObject, dataObjectIndex) =>
                                        <option key={dataObjectIndex} value={dataObject.id}>{dataObject.name}</option>
                                    )}
                                </Form.Control>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group>
                        <Row>
                            <Col xs="2">
                                <label className="dashboard-label-auto-form"><strong>Replenish Strategy:</strong></label>
                            </Col>
                            <Col>
                                <Form.Control as="select" value={autoFormData.autoData.reorder}
                                    onChange={(e) => {
                                        dispatchAuto({ type: 'SET_REORDER', payload: e.target.value })
                                    }}
                                    placeholder="Enter product ID">
                                    <option value="MAXMIN">Max Min</option>
                                    <option value="PERIODIC">Periodic</option>
                                    <option value="FORECAST">Forecast</option>
                                </Form.Control>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group>
                        <Row>
                            <Col xs="2">
                                <label className="dashboard-label-auto-form"><strong>Min Quantity:</strong></label>
                            </Col>
                            <Col className="text-center">
                                <Form.Control className="text-center .dashboard-number-input"
                                    type="number"
                                    value={autoFormData.autoData.min_quantity}
                                    placeholder="Enter Minimum Quantity"
                                    min={1}
                                    onChange={(e) => {
                                        dispatchAuto({ type: 'SET_MIN_QUANTITY', payload: parseInt(e.target.value) })
                                        if (autoFormData.autoData.min_quantity >= autoFormData.autoData.max_quantity)
                                            dispatchAuto({ type: 'SET_MAX_QUANTITY', payload: parseInt(e.target.value) })
                                    }} />
                            </Col>
                            <Col xs="2">
                                <label className="dashboard-label-auto-form"><strong>Max Quantity:</strong></label>
                            </Col>
                            <Col className="text-center">
                                <Form.Control className="text-center" type="number"
                                    value={autoFormData.autoData.max_quantity}
                                    placeholder="Enter Maximum Quantity"
                                    min={autoFormData.autoData.min_quantity}
                                    onChange={(e) => {
                                        // if (autoFormData.autoData.max_quantity >= autoFormData.autoData.min_quantity)
                                        dispatchAuto({ type: 'SET_MAX_QUANTITY', payload: parseInt(e.target.value) })
                                    }} />
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group>
                        <Row>
                            <Col xs="2">
                                <label className="dashboard-label-auto-form"><strong>Bin Size:</strong></label>
                            </Col>
                            <Col className="text-center">
                                <Form.Control className="text-center" type="number" value={autoFormData.autoData.bin_size} placeholder="Enter Bin size" onChange={(e) => dispatchAuto({ type: 'SET_BIN_SIZE', payload: parseInt(e.target.value) })} min={0} />
                            </Col>
                            <Col xs="2">
                                <label className="dashboard-label-auto-form"><strong>Rounding:</strong></label>
                            </Col>
                            <Col className="text-center">
                                <Form.Control className="text-center" type="number" value={autoFormData.autoData.rounding} placeholder="Enter Rounding" onChange={(e) => dispatchAuto({ type: 'SET_ROUNDING', payload: parseInt(e.target.value) })} min={0} />
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group>
                        <Row>
                            <Col xs="2">
                                <label className="dashboard-label-auto-form"><strong>Auto Approval:</strong></label>
                            </Col>
                            <Col xs="4">
                                <Form.Check
                                    type="switch"
                                    id="auto-approval-switch"
                                    label=""
                                    onChange={() => {
                                        dispatchAuto({ type: 'SET_AUTO_APPROVAL' })
                                    }}
                                />
                            </Col>
                            <Col xs="2">
                                <label className="dashboard-label-auto-form"><strong>Auto Forecast:</strong></label>
                            </Col>
                            <Col xs="4">
                                <Form.Check
                                    type="switch"
                                    id="auto-forecast-switch"
                                    label=""
                                    onChange={() => {
                                        dispatchAuto({ type: 'SET_AUTO_FORECAST' })
                                    }}
                                />
                            </Col>
                        </Row>
                    </Form.Group>
                </div >
                :
                showProductsModal.action === "Manual" ?
                    <div>
                        <Form.Group>
                            <Row>
                                <Col xs="2">
                                    <label className="dashboard-label"><strong>Product ID:</strong></label>
                                </Col>
                                <Col>
                                    <Form.Control as="select" value={manualFormData.manualData.name}
                                        onChange={(e) => {
                                            let filteredData = responseData.data.records.find(element => element.name === e.target.value)
                                            dispatch({ type: 'SET_PRODUCT_ID', payload: filteredData.id })
                                            dispatch({ type: 'SET_PRICE_UNIT', payload: filteredData.lst_price })
                                            // if (filteredData.default_code) {
                                            dispatch({ type: 'SET_DEFAULT_CODE', payload: filteredData.default_code ? filteredData.default_code : '' })
                                            // } else {
                                            //     dispatch({ type: 'SET_DEFAULT_CODE', payload: '' })
                                            // }
                                            dispatch({ type: 'SET_PRODUCT_NAME', payload: e.target.value })
                                        }} placeholder="Enter product name">
                                        {responseData.data.records.map((dataObject, dataObjectIndex) =>
                                            <option key={dataObjectIndex} value={dataObject.name}>{dataObject.name}</option>
                                        )}
                                    </Form.Control>
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group>
                            <Row>
                                <Col xs="2">
                                    <label className="dashboard-label"><strong>Description:</strong></label>
                                </Col>
                                <Col>
                                    <Form.Control as="textarea"
                                        onChange={(e) => {
                                            dispatch({ type: 'SET_DESCRIPTION', payload: e.target.value })
                                        }}
                                        placeholder="Enter description" />
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group>
                            <Row>
                                <Col xs="2">
                                    <label className="dashboard-label"><strong>Planned Date:</strong></label>
                                </Col>
                                <Col>
                                    <DatePicker
                                        todayButton={"Today"}
                                        selected={manualFormData.manualData.date_planned}
                                        onChange={(date) => {
                                            dispatch({ type: 'SET_date_planned', payload: date })
                                        }}
                                        className="form-control text-center"
                                        placeholderText="Enter date"
                                    />
                                </Col>
                                <Col xs="2">
                                    <label className="dashboard-label"><strong>Quantity:</strong></label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        className="text-center"
                                        type="number"
                                        value={manualFormData.manualData.product_qty}
                                        placeholder="Enter Quantity"
                                        min={1}
                                        onChange={(e) => {
                                            dispatch({ type: 'SET_QUANTITY', payload: parseInt(e.target.value) })
                                        }} />
                                </Col>
                            </Row>
                        </Form.Group>
                        <Form.Group>
                            <Row>
                                <Col xs="2">
                                    <label className="dashboard-label"><strong>Units:</strong></label>
                                </Col>
                                <Col>
                                    <Form.Control
                                        className="text-center"
                                        type="number"
                                        value={manualFormData.manualData.units}
                                        placeholder="Enter the number of units"
                                        onChange={(e) => {
                                            dispatch({ type: 'SET_UNITS', payload: parseInt(e.target.value) })
                                        }}
                                        min={0} />
                                </Col>
                                <Col xs="2">
                                    <label className="dashboard-label"><strong>Unit Price ($):</strong></label>
                                </Col>
                                <Col>
                                    <Form.Control className="text-center"
                                        type="number"
                                        value={manualFormData.manualData.price_unit}
                                        placeholder="Enter unit price"
                                        onChange={(e) => {
                                            dispatch({ type: 'SET_PRICE_UNIT', payload: parseInt(e.target.value) })
                                        }}
                                        min={0} />
                                </Col>
                            </Row>
                        </Form.Group>
                    </div>
                    :
                    notifyWarning("Warining", "Mode not supported")
        )
    }

    // FUNCTION TO HANDLE SUBMITTING FORMS
    function handleSubmit(URL) {
        let submissionData = {}
        if (URL === "purchase-orders") {
            submissionData = {
                lst_price: manualFormData.manualData.price_unit,
                name: manualFormData.manualData.name,
                id: manualFormData.manualData.product_id,
                default_code: manualFormData.manualData.default_code,
                product_qty: manualFormData.manualData.product_qty,
                product_uom: manualFormData.manualData.product_uom,
                date_planned: manualFormData.manualData.date_planned
            };
        } else if (URL === "automatic") {
            submissionData = {}
        } else {
            submissionData = {}
            return;
        }
        dashBoardService.submitForm(URL, submissionData)
            .then(response => {
                notifySuccess("Submitted", "Submitted Form")
                setShowProductsModal({ state: false, action: '' })
            })
            .catch(error => {
                notifyError("Failed", "Couldn't submit the form")
                console.log(error)
                setShowProductsModal({ state: false, action: '' })
            })
    }

    // LIFECYCLE HOOK TO HANDLE ASYNCHRONOUS API CALLS
    useEffect(() => {
        dashBoardService.getData(props.component + '?limit=50')
            .then(response => {
                if (props.component === 'products') {
                    response.data.records.forEach(function (productInfo) {
                        productInfo.titleGroup = {
                            name: productInfo.name,
                            image: `https://demo.digitaldots.io/api/image?imageId=${productInfo.id}`
                        };
                        productInfo.category_name = productInfo.categ_id[1]
                    })
                } else if (props.component === 'purchaseorders') {
                    response.data.records.forEach(function (purchaseOrderInfo) {
                        purchaseOrderInfo.partner_name = purchaseOrderInfo.partner_id[1];
                        purchaseOrderInfo.company_name = purchaseOrderInfo.company_id[1];
                        purchaseOrderInfo.user_name = purchaseOrderInfo.user_id[1];
                    })

                } else if (props.component === 'sales-orders') {
                    response.data.records.forEach(function (salesOrderInfo) {
                        salesOrderInfo.partner_name = salesOrderInfo.partner_id[1];
                    })
                }
                setResponseData({ data: response.data, loading: false, error: false })
            })
            .catch(error => {
                setResponseData({ data: {}, loading: false, error: true })
                console.log("ERROR", error)
            })
    }, [responseData.loading, props.component])


    // FUNCTION TO RENDER APPROPRIATE DRILLDOWN COMPONENT
    function renderComponent() {
        const toggle = () => {
            if (props.component === "products") {
                setShowProductsModal({ state: !showProductsModal.state, action: '' })
                dispatch({ type: 'CLEAR_ALL' })
                dispatchAuto({ type: 'CLEAR_ALL' })
            } else if (props.component === "purchaseorders") {
                setShowPurchaseModal({ state: false, data: {} })
            } else {
                notifyWarning("Warning, mode not supported")
            }
        }

        //  -------------------------------------------------
        //               PRODUCT DETAILS TABLE
        //  -------------------------------------------------
        const productHeader = [
            { label: 'Title', key: 'titleGroup' },
            { label: 'Code', key: 'default_code' },
            { label: 'Quantity', key: 'qty_available' },
            { label: 'Price', key: 'lst_price' },
            { label: 'Category', key: 'category_name' },
            { label: 'Forecast', key: 'virtual_available' },
            { label: 'Variant cost', key: 'product_variant_count' },
        ];

        const manualFormAction = (mFormData) => {
            dispatch({ type: 'SET_PRODUCT_NAME', payload: mFormData.name })
            dispatch({ type: 'SET_PRODUCT_ID', payload: mFormData.id })
            dispatch({ type: 'SET_PRICE_UNIT', payload: mFormData.lst_price })
            dispatch({ type: 'SET_DEFAULT_CODE', payload: mFormData.default_code ? mFormData.default_code : '' })
            setShowProductsModal({ state: true, action: 'Manual' })
        }

        const autoFormAction = (aFormData) => {
            dispatchAuto({ type: 'SET_PRODUCT_ID', payload: aFormData.id })
            setShowProductsModal({ state: true, action: 'Automatic' })
        }

        const productActions = [
            { btnTitle: 'Manual Purchase Order', btnClass: 'btn-success', iconClass: 'fas fa-file-alt', btnAction: manualFormAction.bind(this) },
            { btnTitle: 'Automatic PO configuration', btnClass: 'btn-success', iconClass: 'fas fa-pencil-ruler', btnAction: autoFormAction.bind(this) },
        ]

        //  -------------------------------------------------
        //               PURCHASE ORDERS TABLE
        //  -------------------------------------------------
        const purchaseHeader = [
            { label: 'Reference', key: 'name' },
            { label: 'Order date', key: 'date_order' },
            { label: 'Vendor', key: 'partner_name' },
            { label: 'Company', key: 'company_name' },
            { label: 'Purchase Representative', key: 'user_name' },
            { label: 'Total', key: 'amount_total' },
            { label: 'Status', key: 'state' },
        ];

        const triggerPurchaseAction = (orderData) => {
            setShowPurchaseModal({ state: true, data: orderData })
        }

        const purchaseActions = [
            { btnTitle: 'View Purchase Order', btnClass: 'btn-success', iconClass: 'feather icon-edit', btnAction: triggerPurchaseAction.bind(this) },
        ]

        //  -------------------------------------------------
        //               SALES ORDER TABLE
        //  -------------------------------------------------
        const SalesHeader = [
            { label: 'Quotation Number', key: 'name' },
            { label: 'Create date', key: 'date_order' },
            { label: 'Vendor', key: 'partner_name' },
            // { label: 'Sales person', key: 'id' },
            { label: 'Total', key: 'amount_total' },
            { label: 'Status', key: 'state' },
        ];


        switch (props.component) {
            case 'products':
                return (
                    !responseData.loading ?
                        <div>
                            {/* <h1 className="text-center mb-2">Product Details</h1> */}
                            <StudioTable tableName={'Product Details'}
                                tableHeader={productHeader}
                                tableData={responseData.data.records}
                                tableActions={productActions}
                            // defaultSort={{ sortIndex: 0, sortOrder: 1 }}
                            />
                            {/* <Table bordered hover responsive id="products-table">
                                <thead>
                                    <tr className="text-center">
                                        <th>Title</th>
                                        <th>Code</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Category</th>
                                        <th>Forecast</th>
                                        <th>Variant Count</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {responseData.data.records.map((dataObject, dataObjectIndex) =>
                                        <tr key={dataObjectIndex}>
                                            <td>
                                                <img className="mx-4" height="50em" width="50em" src={`https://demo.digitaldots.io/api/image?imageId=${dataObject.id}`} alt={dataObject.name} />
                                                {dataObject.name}
                                            </td>
                                            <td className="text-center"> {dataObject.default_code} </td>
                                            <td className="text-center"> {dataObject.qty_available} </td>
                                            <td className="text-center"> ${dataObject.lst_price.toFixed(2)} </td>
                                            <td className="text-center"> {dataObject.categ_id[1]} </td>
                                            <td className="text-center"> {dataObject.virtual_available} </td>
                                            <td className="text-center"> {dataObject.product_variant_count} </td>
                                            <td className="text-center">
                                                <button
                                                    className="ml-1 btn btn-icon btn-outline-info"
                                                    onClick={() => {
                                                        dispatch({ type: 'SET_PRODUCT_NAME', payload: dataObject.name })
                                                        dispatch({ type: 'SET_PRODUCT_ID', payload: dataObject.id })
                                                        dispatch({ type: 'SET_PRICE_UNIT', payload: dataObject.lst_price })
                                                        dispatch({ type: 'SET_DEFAULT_CODE', payload: dataObject.default_code ? dataObject.default_code : '' })
                                                        setShowProductsModal({ state: true, action: 'Manual' })
                                                    }}
                                                >
                                                    <i className="fas fa-file-invoice"></i>
                                                </button>
                                                <button
                                                    className="ml-1 btn btn-icon btn-outline-warning"
                                                    onClick={() => {
                                                        dispatchAuto({ type: 'SET_PRODUCT_ID', payload: dataObject.id })
                                                        setShowProductsModal({ state: true, action: 'Automatic' })
                                                    }}
                                                >
                                                    <i className="fas fa-pencil-ruler"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table> */}
                            <Modal centered size={'xl'} isOpen={showProductsModal.state} toggle={toggle}>
                                <ModalHeader className="dashboard-modal-header" toggle={toggle}>
                                    {showProductsModal.action === "Manual" && <p>Manual Purchase Order</p>}
                                    {showProductsModal.action === "Automatic" && <p>Automatic PO Configuration</p>}
                                </ModalHeader>
                                <ModalBody>
                                    <div className="container-fluid">
                                        {showProductsModal.state && showForm()}
                                    </div>
                                </ModalBody>
                                <ModalFooter className="p-2">
                                    {showProductsModal.action === 'Manual' &&
                                        <div className="content-float-right">
                                            <Button onClick={() => {
                                                setShowProductsModal({ state: false, action: '' })
                                                dispatch({ type: 'CLEAR_ALL' })
                                            }} className="mx-2" variant="danger">
                                                Cancel
                                            </Button>
                                            <Button onClick={() => {
                                                // setShowProductsModal({ state: false, action: '' })
                                                handleSubmit("purchase-orders")
                                            }} className="mx-2" variant="primary">
                                                Submit
                                            </Button>
                                        </div>
                                    }
                                    {showProductsModal.action === "Automatic" &&
                                        <div className="content-float-right">
                                            <Button onClick={() => {
                                                setShowProductsModal({ state: false, action: '' })
                                                dispatchAuto({ type: 'CLEAR_ALL' })
                                            }} className="mx-2" variant="danger">
                                                Cancel
                                            </Button>
                                            <Button onClick={() => {
                                                if (autoFormData.autoData.min_quantity > autoFormData.autoData.max_quantity) {
                                                    alert("minimum quantity cannot be more than maximum quantity")
                                                } else {
                                                    // setShowProductsModal({ state: false, action: '' })
                                                    alert("Submitted Automated PO configuration form")
                                                }
                                            }
                                            } className="mx-2" variant="primary">
                                                Submit
                                            </Button>
                                        </div>
                                    }
                                </ModalFooter>
                            </Modal>
                        </div >
                        :
                        <Card>
                            <CardBody>
                                <BasicSpinner />
                            </CardBody>
                        </Card>
                )
            case 'purchaseorders':
                return (
                    !responseData.loading ?
                        <div>
                            {/* <h1 className="text-center mb-2">Purchase Orders</h1> */}
                            <StudioTable tableName={'Purchase Orders'}
                                tableHeader={purchaseHeader}
                                tableData={responseData.data.records}
                                tableActions={purchaseActions}
                                triggerPurchase={triggerPurchaseAction.bind(this)}
                                defaultSort={{ sortIndex: 0, sortOrder: 1 }}
                            />
                            {/* <Table bordered hover responsive id="purchase-table">
                                <thead>
                                    <tr>
                                        <th className="text-center">Reference</th>
                                        <th className="text-center">Order date</th>
                                        <th className="text-center">Vendor</th>
                                        <th className="text-center">Company</th>
                                        <th className="text-center">Purchase Representative</th>
                                        <th className="text-center">Total</th>
                                        <th className="text-center">Status</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {responseData.data.records.map((dataObject, dataObjectIndex) =>
                                        <tr key={dataObjectIndex} className={dataObject.state === 'cancel' ? 'text-muted' : ''}>
                                            <td className="text-center"><strong>{dataObject.name}</strong></td>
                                            <td className="text-center"><strong>{dataObject.date_order}</strong></td>
                                            <td className="text-center"><strong>{dataObject.partner_id[1]}</strong></td>
                                            <td className="text-center"><strong>{dataObject.company_id[1]}</strong></td>
                                            <td className="text-center"><strong>{dataObject.user_id[1]}</strong></td>
                                            <td className="text-right"><strong>{dataObject.currency_id[0] === 2 ? `$ ${dataObject.amount_total}` : `₹ ${dataObject.amount_total}`}</strong></td>
                                            <td className="text-center"><strong>{dataObject.state === 'done' ? 'Completed'.toLocaleUpperCase() : dataObject.state === 'cancel' ? 'Cancelled'.toLocaleUpperCase() : dataObject.state === 'purchase' ? 'Purchased'.toLocaleUpperCase() : dataObject.state.toLocaleUpperCase()}</strong></td>
                                            <td className="text-center"><strong><i className="far fa-check-circle cursor-pointor" onClick={() => setShowPurchaseModal({ state: true, data: dataObject })}></i></strong></td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table> */}
                            <Modal centered size={'lg'} isOpen={showPurchaseModal.state} toggle={toggle}>
                                <ModalHeader className="dashboard-modal-header" toggle={toggle}><p>Purchase Order Summary</p></ModalHeader>
                                <ModalBody>
                                    <div className="divider mb-2 pl-3 pr-3">
                                        <h5 className="mb-0">Reference: {showPurchaseModal.data.name}</h5>
                                        <h6 className="text-muted mb-0">Order date: {showPurchaseModal.data.date_order}</h6>
                                        <h6 className="text-muted mb-0">Vendor: {showPurchaseModal.data.partner_id}</h6>
                                        <h6 className="text-muted mb-0">Total: ${showPurchaseModal.data.amount_total}</h6>
                                    </div>
                                </ModalBody>
                                <ModalFooter></ModalFooter>
                            </Modal>
                        </div>
                        :
                        <Card>
                            <CardBody>
                                <BasicSpinner />
                            </CardBody>
                        </Card>
                )
            case 'sales-orders':
                return (
                    !responseData.loading ?
                        <div>
                            {/* <h1 className="text-center mb-2">Sales Orders</h1> */}
                            <StudioTable tableName={'Sales Orders'}
                                tableHeader={SalesHeader}
                                tableData={responseData.data.records}
                                defaultSort={{ sortIndex: 0, sortOrder: 1 }}
                            />
                            {/* <Table bordered hover responsive id="sales-table">
                                <thead>
                                    <tr>
                                        <th className="text-center">Quotation Number</th>
                                        <th className="text-center">Create date</th>
                                        <th className="text-center">Vendor</th>
                                        <th className="text-center">Sales person</th>
                                        <th className="text-center">Total</th>
                                        <th className="text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {responseData.data.records.map((dataObject, dataObjectIndex) =>
                                        <tr key={dataObjectIndex} className={dataObject.state === 'sent' ? 'text-muted' : ''}>
                                            <td className="text-center"><strong>{dataObject.name}</strong></td>
                                            <td className="text-center"><strong>{dataObject.date_order}</strong></td>
                                            <td className="text-center"><strong>{dataObject.partner_id[1]}</strong></td>
                                            <td className="text-center"><strong>{dataObject.id}</strong></td>
                                            <td className="text-right"><strong>{dataObject.currency_id[0] === 2 ? `$ ${dataObject.amount_total}` : `₹ ${dataObject.amount_total}`}</strong></td>
                                            <td className="text-center"><strong>{dataObject.state}</strong></td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table> */}
                        </div>
                        :
                        <Card>
                            <CardBody>
                                <BasicSpinner />
                            </CardBody>
                        </Card>
                )
            default:
                return;
        }
    }

    return (
        <div className="studio-container pt-0">
            {renderComponent()}
        </div >
    )
}

export default DrillDownComponent;