import React, { Component } from 'react';
import { Row, Col } from "reactstrap";
// import ServiceConstants from "../../../services/ServiceConstants";

class ModelViewer extends Component {
    render() {
        const ModelName = this.props.ModelName;
        return (
            <div>
                <div className="text-center">
                    <div>
                        <Row>
                            <Col className="text-left">
                                <button className="back-button" onClick={() => this.props.renderModelList()}><i className="fas fa-arrow-alt-circle-left"></i> Go Back</button>
                            </Col>
                            <Col>
                                <h1> {ModelName} </h1>
                            </Col>
                            <Col></Col>
                        </Row>
                    </div>
                </div>
            </div>
        );
    }
}

export default ModelViewer;