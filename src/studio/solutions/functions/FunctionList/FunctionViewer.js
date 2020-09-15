import React, { Component } from "react";
import ServiceConstants from "../../../services/ServiceConstants";
import { Row, Col } from "reactstrap";

class FunctionViewer extends Component {
    render() {
        const functions = this.props.functions;
        return (
            <div>
                <div className="text-center">
                    <div>
                        <Row>
                            <Col className="text-left">
                                <button className="back-button" onClick={() => this.props.renderFunctionList()}><i className="fas fa-arrow-alt-circle-left"></i> Go Back</button>
                            </Col>
                            <Col>
                                <h1> {functions} </h1>
                            </Col>
                            <Col></Col>
                        </Row>
                    </div>
                    <iframe title='Functions' style={{ height: `calc(100vh - 60px)`, width: "100%", border: "none" }} src={ServiceConstants.HOST_CODE_EDITOR} />
                </div>
            </div >
        );
    }
}

export default FunctionViewer;