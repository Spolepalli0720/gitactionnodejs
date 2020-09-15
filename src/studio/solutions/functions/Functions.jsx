import React, { Component } from "react";
import { Row, Col } from 'reactstrap';
import FunctionList from './FunctionList/FunctionList';

export default class Functions extends Component {

    render() {
        return (
            <section className="studio-container">
                <Row xs="1" md="1">
                    <Col className="cards-container p-0">
                        <FunctionList />
                    </Col>
                </Row>
            </section>
        );
    }
}
