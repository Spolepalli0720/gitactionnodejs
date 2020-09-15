import React, { Component } from 'react';
import { Row, Col, Card, CardBody, CardTitle, CardFooter } from 'reactstrap';
import { withRouter } from 'react-router-dom';

class Cards extends Component {
    render() {
        return (
            <div>
                <Card className="home_card">
                    <CardTitle className="text-center mt-3 mb-0">
                        <h4 style={{ color: "#0E90FF" }}>{this.props.title}</h4>
                    </CardTitle>
                    <CardBody className="text-center pt-0">
                        <Row>
                            <Col xl='12'>
                                <img src={this.props.image} alt="alternate text" />
                            </Col>
                            <Col xl='12'>
                                <p style={{ fontSize: '15px', height: '15px' }}>{this.props.content}</p>
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter>
                        {this.props.showLink ?
                            <Row className="mt-1">
                                <Col className="text-left">
                                    <a href={this.props.history.location.pathname} style={{ color: 'grey' }}>Know more &gt;&gt;</a>
                                </Col>
                                <Col className="text-right">
                                    <a href={this.props.history.location.pathname} style={{ color: 'grey' }}>Explore</a>
                                </Col>
                            </Row>
                            :
                            <Col></Col>
                        }
                    </CardFooter>
                </Card>
            </div>
        );
    }
}

export default withRouter(Cards);