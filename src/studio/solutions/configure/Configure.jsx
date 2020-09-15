import React from 'react';
import { Row, Col } from 'reactstrap';
import { Tabs, Tab } from 'react-bootstrap';

import DataStores from './DataStores';
import Connectors from './Connectors';
import Scrapers from './Scrapers';

import Users from './Users';
import Certificates from './Certificates';
import Query from './Query';

export default class Configure extends React.Component {

    render() {
        const { solutionId } = this.props.match.params;
        const componentId = this.props.studioRouter.id;
        const componentName = this.props.studioRouter.name;
        let iconClass = '';
        if ('L2-Solutions-DataStores' === componentId) {
            iconClass = 'fa fa-database';
        } else if ('L2-Solutions-Connectors' === componentId) {
            iconClass = 'fa fa-link';
        } else if ('L2-Solutions-Scrapers' === componentId) {
            iconClass = 'fa fa-comments';
        }

        return (
            <section className="studio-container">
                <Row xs="1" md="1">
                    <Col><h3>{componentName}</h3></Col>
                </Row>
                <Row xs="1" md="1">
                    <Col>
                        <Tabs defaultActiveKey={'catalog'} className={'px-2'}>
                            <Tab eventKey={'catalog'} title={<span><i className={iconClass + " mr-2"}></i>{componentName}</span>}>
                                {'L2-Solutions-DataStores' === componentId && <DataStores solutionId={solutionId} />}
                                {'L2-Solutions-Connectors' === componentId && <Connectors solutionId={solutionId} />}
                                {'L2-Solutions-Scrapers' === componentId && <Scrapers solutionId={solutionId} />}
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
