import React from "react";
import { Row, Col, Tabs, Tab } from 'react-bootstrap';

import SalesDashboard from "./sales/SalesDashboard";
import AdminDashboard from "./inventory/AdminDashboard";

export default class Dashboard extends React.Component {
    render() {
        return (
            <div>
                <Row>
                    <Col className="text-left mt-0 pb-0">
                        <h4 className="pt-0 mt-1 studio-primary">Dashboard</h4>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Tabs defaultActiveKey={'sales'} className={'px-2'}>
                            <Tab eventKey={'sales'} title={<span><i className="fas fa-chart-line mr-2" aria-hidden="true"></i>Sales</span>}>
                                <SalesDashboard />
                            </Tab>
                            <Tab eventKey={'inventory'} title={<span ><i className="fas fa-warehouse mr-2" aria-hidden="true"></i>Inventory</span>}>
                                <AdminDashboard />
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>
            </div>
        )
    }
}