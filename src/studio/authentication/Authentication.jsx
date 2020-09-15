import React from 'react';
import { Row, Col } from 'reactstrap';
import { Tabs, Tab } from 'react-bootstrap';

import Secrets from './Secrets';
import Certificates from './Certificates';
import ApiKeys from './ApiKeys';
import Tokens from './Tokens';

export default class Authentication extends React.Component {

    render() {

        return (
            <section className="studio-container">
                <Row xs="1" md="1">
                    <Col>
                        <h3>
                            Authentication
                        </h3>
                    </Col>
                </Row>
                <Row xs="1" md="1">
                    <Col>
                        <Tabs defaultActiveKey={'secrets'} className={'px-2'}>
                            <Tab eventKey={'secrets'} title={'Secrets'}>
                                <Secrets />
                            </Tab>
                            <Tab eventKey={'certificates'} title={'Certificates'}>
                                <Certificates />
                            </Tab>
                            <Tab eventKey={'apiKeys'} title={'API Keys'}>
                                <ApiKeys />
                            </Tab>
                            <Tab eventKey={'tokens'} title={'Tokens'}>
                                <Tokens />
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>
            </section>
        )
    }
}
