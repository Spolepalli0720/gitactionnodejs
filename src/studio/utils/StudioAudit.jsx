import React, { Component } from "react";
import { Row, Col } from 'reactstrap';
import Timestamp from "react-timestamp";

export default class StudioAudit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showAll: false
        }
    }

    render() {
        const { showAll } = this.state;
        let data = this.props.data || [];
        if (!showAll) {
            data = data.slice(0, 5);
        }

        return (
            <section className="studio-container p-0">
                <Row xs="1" md="1">
                    <Col className="p-0">
                        <div className="mb-0">
                            {(this.props.data || []).length > 5 &&
                                <Row>
                                    <Col className='text-right pb-0 pr-1'>
                                        Show all<input type='checkbox' className='ml-2'
                                            onChange={(e) => this.setState({ showAll: e.target.checked })} />
                                    </Col>
                                </Row>
                            }
                            {data.map((auditItem, auditIndex) =>
                                <Row key={auditIndex} className='mt-2'>
                                    <Col sm='auto'><i className="mt-1 fas fa-envelope-open fa-3x studio-primary"></i></Col>
                                    <Col className='pt-0'>
                                        <h5>{auditItem.title}</h5>
                                        <label className="mt-1 mb-1 mr-2 text-muted">
                                            <i className="far fa-clock mr-1"></i>
                                            <Timestamp relative date={auditItem.commitDateInstant} />
                                        </label>
                                        <label className='mt-1 mb-1 ml-1 text-muted'>
                                            <i className="far fa-user mr-1"></i>{auditItem.author}
                                        </label>
                                        <p className='mb-1'>{auditItem.summary}<span className='ml-3 p-0 studio-primary'>View Details</span></p>
                                    </Col>
                                </Row>
                            )}
                        </div>
                    </Col>
                </Row>
            </section>
        )
    }
}