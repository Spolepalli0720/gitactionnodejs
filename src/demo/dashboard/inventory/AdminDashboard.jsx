import React from 'react';
import { Row, Col } from 'reactstrap';
import { connect } from 'react-redux';

import { InventorySummary, SalesActivity, SalesOrders, ProductDetails, PurchaseOrders, SellingVariants } from "./DashComponents";
import DrillDownComponent from './Drilldown';

class AdminDashboard extends React.Component {
    constructor() {
        super();

        this.state = {
            renderDrilldown: { renderState: false, renderComponent: '', renderData: {} },
        }

        this.renderedComponents = 0;
    }

    initiateDrillDown = (drilldownData, drilldownComponent) => {
        this.setState({
            renderDrilldown: {
                renderState: true,
                renderComponent: drilldownComponent,
                renderData: drilldownData
            }
        })
    }

    render() {
        const { renderDrilldown } = this.state;

        return (
            <section className="studio-container">
                {!renderDrilldown.renderState ?
                    <div>
                        <Row>
                            <Col className="border-right pl-0">
                                <SalesActivity />
                            </Col>
                            <Col xl={4} className="pr-0 pt-2">
                                <InventorySummary />
                            </Col>
                        </Row>
                        <Row>
                            <Col xl={6} md={12}>
                                <ProductDetails initiateDrilldown={(drilldownData, drilldownComponent) => this.initiateDrillDown(drilldownData, drilldownComponent)} />
                            </Col>
                            <Col xl={6} md={12}>
                                <SellingVariants />
                            </Col>
                            <Col xl={6} md={12}>
                                <PurchaseOrders initiateDrilldown={(drilldownData, drilldownComponent) => this.initiateDrillDown(drilldownData, drilldownComponent)} />
                            </Col>
                            <Col xl={6} md={12}>
                                <SalesOrders initiateDrilldown={(drilldownData, drilldownComponent) => this.initiateDrillDown(drilldownData, drilldownComponent)} />
                            </Col>
                        </Row>
                    </div>
                    :
                    <div>
                        <button className="pl-4 pt-2 content-border-none dashboard-button" onClick={() => this.setState({ renderDrilldown: { renderState: false } })}><i className="fas fa-arrow-alt-circle-left"></i> Go Back</button>
                        <DrillDownComponent data={renderDrilldown.renderData} component={renderDrilldown.renderComponent} />
                    </div>
                }
            </section >
        );
    }
}

const mapStateToProps = state => {
    return {
        layoutType: state.layoutType
    }
}

export default connect(mapStateToProps)(AdminDashboard);