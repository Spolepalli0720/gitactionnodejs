import React from 'react';

import { Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import { inputField as createInputField, confirmDelete } from "../utils/StudioUtils";
import StudioTable from "../utils/StudioTable";
import { authenticationService } from '../services/AuthenticationService';

import './Secrets.scss';

export default class ApiKeys extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            loading: false,
            authAction: '',

            reginResponse: [],

            apiKeyTabData: [
                { id: 0, name: 'Activity', tableData: [], tableHeader: undefined, tableActions: undefined, defaultSort: undefined },
            ],
            inputField: [
                {
                    "name": "name",
                    "id": "name",
                    "type": "text",
                    "description": "",
                    "mandatory": true,
                    "value": "",
                    "placeholder": "API Key Name",
                    "label": " Name",
                    "disabled": false,
                },
                {
                    "name": "description",
                    "id": "description",
                    "type": "textarea",
                    "description": "",
                    "mandatory": true,
                    "value": "",
                    "placeholder": "Description",
                    "label": " Description",
                    "disabled": false
                },
                {
                    "name": "cloudProvider",
                    "type": "select",
                    "description": "",
                    "mandatory": false,
                    "default": "",
                    "value": "",
                    "values": ["Select Cloud Provider", "AWS", "Azure", "GCloud", "On-Premises"],
                    "id": "cloudProvider",
                    "label": "Cloud Provider"
                },
                {
                    "name": "credentialType",
                    "type": "select",
                    "description": "",
                    "mandatory": false,
                    "default": "",
                    "value": "",
                    "values": ["Select Credential Type", "Key", "Role", "Token "],
                    "id": "credentialType",
                    "label": "Credential Type",
                },
                {
                    "name": "accessKey ",
                    "type": "text",
                    "description": "",
                    "mandatory": true,
                    "value": "",
                    "id": "accessKey",
                    "label": "Access Key",
                    "placeholder": "Access Key"
                },
                {
                    "name": "secretKey ",
                    "type": "text",
                    "description": "",
                    "mandatory": true,
                    "value": "",
                    "id": "secretKey",
                    "label": "Secret Key",
                    "placeholder": "Secret Key"
                },
                {
                    "name": "region",
                    "type": "select",
                    "description": "",
                    "mandatory": false,
                    "value": "",
                    "values": ["select Region",],
                    "id": "region",
                    "label": "Region",
                    "placeholder": "Region"
                },
                {
                    "name": "maxRetries",
                    "type": "number",
                    "description": "",
                    "mandatory": false,
                    "value": "",
                    "id": "maxRetries",
                    "label": "Maximum Retries",
                    "placeholder": "Maximum Retries"
                },
                {
                    "name": "iamEndPoint",
                    "type": "text",
                    "description": "",
                    "mandatory": false,
                    "value": "",
                    "id": "iamEndPoint",
                    "label": "iam EndPoint",
                    "placeholder": "I am EndPoint"
                },
                {
                    "name": "stsEndPoint",
                    "type": "text",
                    "description": "",
                    "mandatory": false,
                    "value": "",
                    "id": "stsEndPoint",
                    "label": "sts EndPoint",
                    "placeholder": " EndPoint"
                },
                {
                    "name": "active",
                    "type": "switch",
                    "description": "",
                    "mandatory": false,
                    "value": true,
                    "id": "active",
                    "label": "Enable",
                    "disabled": false
                },

            ]
        }
    }

    triggerCreateApikey = () => {
        let inputField = this.state.inputField.filter((field) => { field.value = ''; field.disabled = false; return field });
        this.setState({ showModal: true, authAction: 'createApiKey', inputField: inputField })
    }

    onChangeInput = (id, value) => {
        const { inputField } = this.state
        let apiKeyProperty = inputField.filter(filterItem => filterItem.id === id)[0];
        apiKeyProperty.value = value;
        if (id === 'cloudProvider') {
            this.getRegions(apiKeyProperty, inputField)
        }
        this.setState({ inputField: inputField, })


    }

    saveApiKey = (inputdata) => {
        const { apiKeyTabData, authAction } = this.state;
        if (authAction === 'createApiKey') {
            let array = { "id": Math.random(), "createdBy": "system", "modifiedBy": "system", "createdAt": null, "modifiedAt": null, "version": "V 1.2" }
            inputdata.map((inputItem) => {
                return array[inputItem.name] = inputItem.value;
            })
            apiKeyTabData[0].tableData.push(array);
            this.setState({ apiKeyTabData: apiKeyTabData, showModal: false })
        } if (authAction === 'updateApiKey') {
            inputdata.map((inputItem) => {
                let filterData = apiKeyTabData[0].tableData.filter(filterItem => inputItem.formid === filterItem.id)[0];
                let key = inputItem.id;
                if (filterData.hasOwnProperty(key)) {
                    filterData[key] = inputItem.value
                }
                return inputItem
            })
            this.setState({ apiKeyTabData: apiKeyTabData, showModal: false })
        }
    }

    triggerEditApikey = (editObject) => {
        const { inputField } = this.state;
        inputField.map((eleItem) => {
            let key = eleItem.id;
            eleItem.formid = editObject.id;
            if (editObject.hasOwnProperty(key)) {
                eleItem.value = editObject[key];
            }
            return eleItem;
        })
        this.setState({ inputField: inputField, showModal: true, authAction: 'updateApiKey' })
    }

    triggerDeleteApikey = (deleteObject) => {
        let { apiKeyTabData } = this.state;
        const parent = this;
        confirmDelete().then(function (userInput) {
            if (!userInput.dismiss) {
                let data = apiKeyTabData[0].tableData.filter(tabData => tabData.id === deleteObject.id)[0];
                data.status = "ARCHIVED";
                parent.setState({ apiKeyTabData: apiKeyTabData })
            }
        }).catch((error) => {
            // console.error('dataStoreService.deleteDataStore:', error);
            // notifyError('Unable to delete DataStore', error.message);
        });
    }

    // ------------------------------------------------------------------------------------------------------------

    getRegions(cloudprovide, inputField) {
        authenticationService.getRegions(cloudprovide.value.toLowerCase()).then(response => {
            let regionProp = inputField.filter(filterItem => filterItem.id === 'region')[0];
            let zone = response.AvailabilityZones.map(zoneItem => zoneItem.GroupName).filter((filterItem, filterIndex, filterarray) => filterarray.indexOf(filterItem) === filterIndex);
            regionProp.values = zone;
            regionProp.values.unshift('Select Region')
            this.setState({ inputField: inputField })

        }).catch(error => {
            //console.error('authentication.getRegions:', error);
            // notifyError('Unable to retrieve Regions', error.message);
        })
    }

    render() {
        const { showModal, inputField, apiKeyTabData, loading, authAction } = this.state;
        const toggleModal = () => this.setState({ showModal: false });
        apiKeyTabData[0].tableHeader = [
            { label: 'Name', key: 'name', },
            { label: 'Cloud Provider', key: 'cloudProvider' },
            { label: "Credential Type", key: "credentialType" },
            { label: 'Version', key: 'version', },
            { label: 'Expires At', key: 'expiresAt', dataFormat: 'relativeTimestamp' },
            { label: 'Modified At', key: 'ModifiedAt', dataFormat: 'relativeTimestamp' },
            { label: 'Active', key: 'active' },

        ];
        apiKeyTabData[0].defaultSort = { sortIndex: 2, sortOrder: 1 }
        apiKeyTabData[0].createAction = this.triggerCreateApikey.bind(this);
        apiKeyTabData[0].createLabel = "Create";
        apiKeyTabData[0].tableActions = [
            {
                btnTitle: 'Edit', btnClass: 'btn-success', iconClass: 'feather icon-edit',
                btnAction: this.triggerEditApikey.bind(this)
            },
            {
                btnTitle: 'Delete', btnClass: 'btn-danger', iconClass: 'feather icon-trash-2',
                btnAction: this.triggerDeleteApikey.bind(this)
            },
        ]
        return (
            <section className="studio-container p-0">
                {!loading &&
                    apiKeyTabData.map((tabItem, tabKey) => {
                        return <StudioTable key={tabKey} tableName={tabItem.name} hideTableName={true}
                            tableHeader={tabItem.tableHeader}
                            tableData={tabItem.tableData.filter(tabData => tabData.status !== 'ARCHIVED')}
                            tableActions={tabItem.tableActions}
                            createAction={tabItem.createAction}
                            createLabel={tabItem.createLabel}
                            defaultSort={tabItem.defaultSort} />
                    })}
                <Modal centered size={'lg'} isOpen={showModal && (authAction === 'createApiKey' || authAction === 'updateApiKey')}>
                    <ModalHeader toggle={toggleModal} className="p-3">{authAction === 'createApiKey' ? 'Create API Key' : 'Update  API Key'}</ModalHeader>
                    <ModalBody className='pl-3 pr-3 pb-3 pt-0'>
                        <Row className='pl-3 pr-3 pb-0 pt-0' >
                            {inputField.map((propItem, propIndex) =>
                                <Col className='justify-content-end text-right' key={propIndex}>{propItem.type === 'switch' ?
                                    createInputField(propItem.type,
                                        propItem.id, propItem.label, propItem.value,
                                        this.onChangeInput.bind(this),
                                        {
                                            input: 'component-stretched',
                                            label: 'component-stretched',
                                            required: propItem.mandatory,
                                            switchTextOn: 'YES', switchTextOff: 'NO',
                                        })
                                    :
                                    ""
                                }
                                </Col>
                            )}
                        </Row>
                        <Row xs="1" md="2">
                            {inputField.map((propItem, propIndex) =>
                                <Col key={propIndex}>
                                    {propItem.type === 'switch' ? "" : createInputField(propItem.type,
                                        propItem.id, propItem.label, propItem.value,
                                        this.onChangeInput.bind(this), {
                                        label: '',
                                        checkboxLabelBefore: true,
                                        input: propItem.type === 'checkbox' ? 'mt-2' : 'component-stretched',
                                        required: propItem.mandatory,
                                        switchTextOn: 'YES', switchTextOff: 'NO',
                                        placeholder: propItem.placeholder
                                    }, propItem.values?.map((arrayValue) => ({ label: arrayValue, value: arrayValue }))
                                    )}
                                </Col>
                            )}
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Row xs="1" md="1">
                            <Col className='text-right'>
                                <button className='btn-sm btn-round btn-primary ml-2 br-5x pl-3 pr-3'
                                    onClick={() => this.saveApiKey(inputField)}>Save</button>
                            </Col>
                        </Row>
                    </ModalFooter>
                </Modal>
            </section>
        )
    }
}