import React, { Component } from "react";
import { Row, Col } from 'reactstrap';

class Reports extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectSolutions: {}
        };
    }

    componentDidMount() {
    }

    render() {
        return (
            <section className="studio-container">
                <Row xs="1" md="1">
                    <Col className="cards-container">
                        <h3> Reports content</h3>
                    </Col>
                </Row>
            </section>
        );
    }
}
export default Reports;
