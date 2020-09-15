import React from 'react';
import { Row, Col } from 'reactstrap';
import { Tabs, Tab } from 'react-bootstrap';

import Stores from './Stores';
import Users from './Users';
import Certificates from './Certificates';
import Query from './Query';

export default class DataStores extends React.Component {

    render() {

        return (
            <section className="studio-container">
                <Row xs="1" md="1">
                    <Col><h3>Data Stores</h3></Col>
                </Row>
                <Row xs="1" md="1">
                    <Col>
                        <Tabs defaultActiveKey={'dataStore'} className={'px-2'}>
                            <Tab eventKey={'dataStore'} title={<span><i className="fa fa-database mr-2" aria-hidden="true"></i>Data Stores</span>}>
                                <Stores />
                            </Tab>
                            <Tab eventKey={'users'} title={<span><i className="fa fa-user mr-2" aria-hidden="true"></i>Users</span>}>
                                <Users />
                            </Tab>
                            <Tab eventKey={'certificate'} title={<span ><i className="fa fa-certificate mr-2" aria-hidden="true"></i>Certificate</span>}>
                                <Certificates />
                            </Tab>
                            <Tab eventKey={'query'} title={<span><i className="fa fa-plug mr-2" aria-hidden="true"></i>Query</span>}>
                                <Query />
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>
            </section>
        )
    }
}
