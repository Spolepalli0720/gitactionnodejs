import React from 'react';

import { Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import { inputField as createInputField, confirmDelete } from "../utils/StudioUtils";
import StudioTable from "../utils/StudioTable";
import { notifySuccess } from '../utils/Notifications';

import './Secrets.scss';

export default class Certificates extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            loading: false,
            authAction: '',

            certificateTabData: [
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
                    "placeholder": "Certificate Name",
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
                    "name": "authmethod",
                    "type": "select",
                    "description": "",
                    "mandatory": false,
                    "default": "Use CA Certificate",
                    "value": "Use CA Certificate",
                    "values": ["Select Authentication Method", "Use CA Certificate", "Self-signed Certificate"],
                    "id": "authmethod",
                    "label": "Authentication Method"
                },
                {
                    "name": "invalidhost",
                    "type": "select",
                    "description": "",
                    "mandatory": false,
                    "default": "Not Allowed",
                    "value": "Not Allowed",
                    "values": ["Select Invalid Host", "Not Allowed", "Allowed"],
                    "id": "invalidhost",
                    "label": "Invalid Hostnames",
                },
                {
                    "name": "CAcertificate",
                    "type": "file",
                    "description": "",
                    "mandatory": false,
                    "value": "",
                    "id": "CAcertificate",
                    "label": "CA Certificate",
                },
                {
                    "name": "crl",
                    "type": "file",
                    "description": "",
                    "mandatory": false,
                    "value": "",
                    "id": "crl",
                    "label": "CRL (Revocation List)",
                },
                {
                    "name": "usePEMkey",
                    "type": "checkbox",
                    "description": "",
                    "mandatory": false,
                    "value": false,
                    "id": "usePEMkey",
                    "label": "Use PEM Cert./Key",
                },
                {
                    "name": "advancedoption",
                    "type": "checkbox",
                    "description": "",
                    "mandatory": false,
                    "value": true,
                    "id": "advancedoption",
                    "label": "Advanced Options",
                },
                {
                    "name": "sslprotocol",
                    "type": "checkbox",
                    "description": "",
                    "mandatory": false,
                    "value": true,
                    "id": "sslprotocol",
                    "label": "Use SSL protocol",
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

    triggerCreateCertificate = () => {
        let inputField = this.state.inputField.filter((field) => { field.value = ''; field.disabled = false; return field });
        this.setState({ showModal: true, authAction: 'createCertificate', inputField: inputField })
    }

    onChangeInput = (id, value) => {
        const { inputField } = this.state
        let certificateProperty = inputField.filter(filterItem => filterItem.id === id)[0];
        if (id === 'CAcertificate' || id === 'crl') {
            let filetype = value[0].name.split('.')[1];
            if (filetype === "ca" || filetype === "cer" || filetype === "cert" || filetype === "jks" || filetype === "pem" || filetype === "p12" || filetype === "pfx") {
                certificateProperty.value = value[0].name
            }
        } else {
            certificateProperty.value = value;
        }
        this.setState({ inputField: inputField, })

    }

    saveCertificate = (inputdata) => {
        const { certificateTabData, authAction } = this.state;
        if (authAction === 'createCertificate') {
            let array = { "id": Math.random(), "createdBy": "system", "modifiedBy": "system", "createdAt": null, "modifiedAt": null, }
            inputdata.map((inputItem) => {
                if (inputItem.type === 'file') {
                    return array[inputItem.name] = inputItem.value;
                } else {
                    return array[inputItem.name] = inputItem.value;
                }
            })
            certificateTabData[0].tableData.push(array);
            notifySuccess('add certificate', 'New Certificate created ');
            this.setState({ certificateTabData: certificateTabData, showModal: false })
        }
        if (authAction === 'updateCertificate') {
            inputdata.map((inputItem) => {
                let filterData = certificateTabData[0].tableData.filter(filterItem => inputItem.formid === filterItem.id)[0];
                let key = inputItem.id;
                if (filterData.hasOwnProperty(key)) {
                    filterData[key] = inputItem.value
                }
                return inputItem
            })
            this.setState({ certificateTabData: certificateTabData, showModal: false })
        }
    }

    triggerEditCerificate = (editObject) => {
        const { inputField } = this.state;
        inputField.map((inputItem) => {
            let key = inputItem.id;
            inputItem.formid = editObject.id;
            if (editObject.hasOwnProperty(key)) {
                if (inputItem.type === 'file') {
                    inputItem.value = editObject[key];
                } else {
                    inputItem.value = editObject[key];
                }
            }
            return inputItem;
        })
        this.setState({ inputField: inputField, showModal: true, authAction: 'updateCertificate' })
    }

    triggerDeleteCerificate = (deleteObject) => {
        let { certificateTabData } = this.state;
        const parent = this;
        confirmDelete().then(function (userInput) {
            if (!userInput.dismiss) {
                let data = certificateTabData[0].tableData.filter(tabData => tabData.id === deleteObject.id)[0];
                data.status = "ARCHIVED";
                parent.setState({ certificateTabData: certificateTabData })
            }
        }).catch((error) => {
            // console.error('dataStoreService.deleteDataStore:', error);
            // notifyError('Unable to delete DataStore', error.message);
        });
    }

    render() {
        const { showModal, inputField, certificateTabData, loading, authAction } = this.state;
        const toggleModal = () => this.setState({ showModal: false });
        certificateTabData[0].tableHeader = [
            { label: 'Authenication Method', key: 'authmethod', },
            { label: 'SSL Protocol', key: 'sslprotocol' },
            { label: 'CA Certificate', key: 'CAcertificate', },
            { label: 'CRL', key: 'crl', },
            { label: 'Use PEM Cert', key: 'usePEMkey', },
            { label: 'Expires At', key: 'expiresAt', dataFormat: 'relativeTimestamp' },
            { label: 'Modified At', key: 'ModifiedAt', dataFormat: 'relativeTimestamp' },
            { label: 'Active', key: 'active' },
            { label: 'Advanced Options', key: 'advancedoption' },
            { label: 'Invalid Host Name ', key: 'invalidhost' },

        ];
        certificateTabData[0].defaultSort = { sortIndex: 2, sortOrder: 1 }
        certificateTabData[0].createAction = this.triggerCreateCertificate.bind(this);
        certificateTabData[0].createLabel = "Create";
        certificateTabData[0].tableActions = [
            {
                btnTitle: 'Edit', btnClass: 'btn-success', iconClass: 'feather icon-edit',
                btnAction: this.triggerEditCerificate.bind(this)
            },
            {
                btnTitle: 'Delete', btnClass: 'btn-danger', iconClass: 'feather icon-trash-2',
                btnAction: this.triggerDeleteCerificate.bind(this)
            },
        ]
        return (
            <section className="studio-container p-0">
                {!loading &&
                    certificateTabData.map((tabItem, tabKey) => {
                        return <StudioTable key={tabKey} tableName={tabItem.name} hideTableName={true}
                            tableHeader={tabItem.tableHeader}
                            tableData={tabItem.tableData.filter(tabData => tabData.status !== 'ARCHIVED')}
                            tableActions={tabItem.tableActions}
                            createAction={tabItem.createAction}
                            createLabel={tabItem.createLabel}
                            defaultSort={tabItem.defaultSort} />
                    })}
                <Modal centered size={'lg'} isOpen={showModal && (authAction === 'createCertificate' || authAction === 'updateCertificate')}>
                    <ModalHeader toggle={toggleModal} className="p-3">{authAction === 'createCertificate' ? 'Create Certificate' : 'Update Certificate'}</ModalHeader>
                    <ModalBody className='pt-0 pb-3 pr-3 pl-3'>
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
                                        input: propItem.type === 'checkbox' ? 'mt-2' : propItem.type === 'file' ? 'fileinput' : 'component-stretched',
                                        required: propItem.mandatory,
                                        accept: '.ca, .cer, .cert, .p12, .pem, .pfx, .jks',
                                        placeholder: propItem.placeholder,
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
                                    onClick={() => this.saveCertificate(inputField)}>Save</button>
                            </Col>
                        </Row>
                    </ModalFooter>
                </Modal>
            </section>
        )
    }
}