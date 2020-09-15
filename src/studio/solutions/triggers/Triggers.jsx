import React from 'react';
import { Row, Col } from 'reactstrap';
import { Tabs, Tab } from 'react-bootstrap';
import Direct from './Direct';
import Sftp from './Sftp';
import Email from './Email';
import Scheduled from './Scheduled';


class Triggers extends React.Component {
    render() {
        return (
            <section className="studio-container">
                <Row xs="1" md="1">
                    <Col>
                        <h3 className="ml-2">Triggers</h3>
                    </Col>
                </Row>
                <Row xs="1" md="1">
                    <Col>
                        <Tabs defaultActiveKey="direct" className="px-2">
                            <Tab eventKey={'direct'} title={'Direct'}>
                                <Direct />
                            </Tab>
                            <Tab eventKey={'sftp'} title={'SFTP'}>
                                <Sftp />
                            </Tab>
                            <Tab eventKey={'email'} title={'Email'}>
                                <Email />
                            </Tab>
                            <Tab eventKey={'scheduled'} title={'Scheduled'}>
                                <Scheduled />
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>
            </section>
        )
    }
}

export default Triggers;