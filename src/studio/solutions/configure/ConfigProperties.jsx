import React from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';

import { inputField, actionButton, ACTION_BUTTON } from '../../utils/StudioUtils';

export default class ConfigProperties extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            modified: false,
            catalogConfig: JSON.parse(JSON.stringify(props.data)),
        }
    }

    resetChanges() {
        this.setState({ modified: false, catalogConfig: JSON.parse(JSON.stringify(this.props.data)) });
    }

    saveChanges() {
        const { catalogConfig } = this.state;
        this.props.onSave(catalogConfig)
    }

    onChangeInput(propName, propValue) {
        const { catalogConfig } = this.state;
        let propPath = propName.split('.');
        if (propPath.length === 1) {
            catalogConfig[propName] = propValue;
        } else {
            let configProperty = catalogConfig.properties;
            configProperty[propPath[1]] = propValue;
        }
        this.setState({ modified: true, catalogConfig: catalogConfig });
    }

    render() {
        const { catalogConfig } = this.state;

        return (
            <div>
                <Row xs="1" md="1">
                    <Col className='text-left pb-0'>
                        {actionButton('Cancel', this.props.onCancel, 'mt-1 ml-1 mr-2 content-float-right', 'feather icon-x-circle fa-2x')}
                        <h5 className='mt-1 ml-2'>{catalogConfig.template + ' Configurations'}</h5>
                    </Col>
                </Row>
                <Row xs="1" md="1">
                    <Col className='pb-0 pt-0 pb-2'>
                        <Row>
                            <Col className='pb-0'>
                                {inputField('text', 'title', 'Title', catalogConfig.title,
                                    this.onChangeInput.bind(this), { label: '', input: '', required: true }
                                )}
                            </Col>
                            <Col className='pb-0'>
                                {inputField('text', 'description', 'Description', catalogConfig.description,
                                    this.onChangeInput.bind(this), { label: '', input: '' }
                                )}
                            </Col>
                            <Col sm='auto' className='pb-0'>
                                {inputField('switch', 'active', 'Active', catalogConfig.active,
                                    this.onChangeInput.bind(this), { label: '', input: 'mt-2 pt-1' }
                                )}
                            </Col>
                        </Row>
                    </Col>
                    {Object.keys(catalogConfig.design.layout).map((property, propertyIndex) =>
                        <Col key={propertyIndex} className='pt-0'>
                            <Row xs="1" md="1">
                                <Col className='text-capitalize font-weight-bolder'>{property}</Col>
                            </Row>
                            <Row xs="1" md="1">
                                <Col>
                                    <Card className='mb-0'>
                                        <CardBody className='p-1'>
                                            <Row xs="1" md="3">
                                                {catalogConfig.design.layout[property].map((propItem, propIndex) =>
                                                    (propItem.depends ? catalogConfig.properties[propItem.depends] : true) &&
                                                    <Col key={propIndex}>
                                                        {inputField(propItem.type,
                                                            'properties.' + propItem.key, propItem.label, catalogConfig.properties[propItem.key],
                                                            this.onChangeInput.bind(this), {
                                                            label: '',
                                                            input: propItem.type === 'switch' ? 'mt-2' : '',
                                                            min: propItem.min, max: propItem.max, step: propItem.step,
                                                            size: propItem.size, maxLength: propItem.maxLength,
                                                            rows: propItem.rows, cols: propItem.cols,
                                                            disabled: propItem.disabled, readOnly: propItem.readOnly, required: propItem.required,
                                                            accept: propItem.accept, pattern: propItem.pattern,
                                                            switchTextOn: propItem.switchTextOn, switchTextOff: propItem.switchTextOff,
                                                            placeholder: propItem.placeholder, autoFocus: propItem.autoFocus
                                                        }, propItem.options
                                                        )}
                                                    </Col>
                                                )}
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    )}
                </Row>
                <Row xs="1" md="1">
                    <Col className='text-right'>
                        {actionButton('Reset', this.resetChanges.bind(this), 'ml-2', '', true, !this.state.modified, ACTION_BUTTON.WARNING)}

                        {actionButton('Save', this.saveChanges.bind(this), 'ml-2', '', true, !this.state.modified, ACTION_BUTTON.PRIMARY)}
                    </Col>
                </Row>
            </div>
        )
    }
}