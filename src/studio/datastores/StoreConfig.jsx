import React from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';

import { inputField, actionButton, ACTION_BUTTON } from '../utils/StudioUtils';
import { dataStoreService } from '../services/DataStoreService';
import { notifySuccess, notifyError } from '../utils/Notifications';

export default class StoreConfig extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            modified: false,
            storeConfig: JSON.parse(JSON.stringify(props.data)),
        }
    }

    resetChanges() {
        this.setState({ modified: false, storeConfig: JSON.parse(JSON.stringify(this.props.data)) });
    }

    testConnection() {
        const { storeConfig } = this.state;
        dataStoreService.verifyDataStore(storeConfig.id).then(response => {
            notifySuccess('Test DataStore', 'DataStore has been ' + response);
        }).catch(error => {
            console.error('dataStoreService.verifyDataStore:', error);
            notifyError('Unable to verify DataStore', error.message);
        });
    }

    saveChanges() {
        const { storeConfig } = this.state;
        this.props.onSave(storeConfig)
    }

    onChangeInput(propName, propValue) {
        const { storeConfig } = this.state;
        let propPath = propName.split('.');
        if (propPath.length === 1) {
            storeConfig[propName] = propValue;
        } else {
            let configProperty = storeConfig.properties[propPath[0]].filter(arrayItem => arrayItem.id === propPath[1])[0];
            configProperty.value = propValue;
        }
        this.setState({ modified: true, storeConfig: storeConfig });
    }

    render() {
        const { storeConfig } = this.state;

        return (
            <div>
                <Row xs="1" md="1">
                    <Col className='text-right pb-0'>
                        {actionButton('Cancel', this.props.onCancel, 'mt-1 ml-1 mr-2 content-float-right', 'feather icon-x-circle fa-2x')}
                    </Col>
                </Row>
                <Row xs="1" md="1">
                    <Col className='pb-0 pt-0'>
                        <Row xs="1" md="2">
                            <Col className='pb-0'>
                                {inputField('text', 'dataSource', 'Data Source', storeConfig.dataSource,
                                    this.onChangeInput.bind(this), { label: '', input: '', disabled: true })}
                            </Col>
                            <Col className='pb-0'>
                                {inputField('text', 'type', 'Type', storeConfig.type,
                                    this.onChangeInput.bind(this), { label: '', input: '', disabled: true })}
                            </Col>
                            <Col className='pb-0'>
                                {inputField('text', 'title', 'Title', storeConfig.title,
                                    this.onChangeInput.bind(this), { label: '', input: '' }
                                )}
                            </Col>
                            <Col className='pb-0'>
                                {inputField('switch', 'active', 'Active', storeConfig.active,
                                    this.onChangeInput.bind(this), { label: '', input: 'mt-2', switchTextOn: 'YES', switchTextOff: 'NO' }
                                )}
                            </Col>
                        </Row>
                    </Col>
                    {Object.keys(storeConfig.properties).map((property, propertyIndex) =>
                        <Col key={propertyIndex} className='pt-0'>
                            <Row xs="1" md="1">
                                <Col className='text-capitalize font-weight-bolder'>{property + ' Properties'}</Col>
                            </Row>
                            <Row xs="1" md="1">
                                <Col>
                                    <Card className='mb-0'>
                                        <CardBody className='p-1'>
                                            <Row xs="1" md="3">
                                                {storeConfig.properties[property].map((propItem, propIndex) =>
                                                    <Col key={propIndex}>
                                                        {inputField(propItem.type === 'checkbox' ? 'switch' : propItem.type,
                                                            property + '.' + propItem.id, propItem.label, propItem.value,
                                                            this.onChangeInput.bind(this), {
                                                            label: '',
                                                            checkboxLabelBefore: true,
                                                            input: propItem.type === 'checkbox' ? 'mt-2' : '',
                                                            required: propItem.mandatory,
                                                            switchTextOn: 'YES',
                                                            switchTextOff: 'NO'
                                                        }, propItem.values?.map((arrayValue) => ({ label: arrayValue, value: arrayValue }))
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