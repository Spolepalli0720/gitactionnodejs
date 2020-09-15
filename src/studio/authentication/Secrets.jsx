import React from "react";

import { Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody } from "reactstrap";

import StudioTable from "../utils/StudioTable";
import { inputField as createInputField, generateUUID, confirmDelete, actionButton, ACTION_BUTTON } from "../utils/StudioUtils";
import { BasicSpinner } from "../utils/BasicSpinner";
import { notifySuccess, notifyError } from '../utils/Notifications';


import './Secrets.scss';

export default class Secrets extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,

            authAction: '',
            showModal: false,
            secretTabData: [
                { id: 0, name: 'Activity', tableData: [], tableHeader: undefined, tableActions: undefined, defaultSort: undefined },
            ],
            inputField: [
                {
                    "name": "active",
                    "type": "switch",
                    "description": "",
                    "mandatory": false,
                    "value": true,
                    "id": "ACTIVE",
                    "label": "Enable",
                    "disabled": false
                },
                {
                    "name": "name",
                    "id": "NAME",
                    "type": "text",
                    "description": "",
                    "mandatory": true,
                    "value": "",
                    "placeholder": "Secret Name",
                    "label": " Name",
                    "disabled": false,
                    "formid": ""
                },
                {
                    "name": "description",
                    "id": "DESC",
                    "type": "textarea",
                    "description": "",
                    "mandatory": true,
                    "value": "",
                    "placeholder": "Description",
                    "label": " Description",
                    "disabled": false
                },
                {
                    "name": "category",
                    "type": "select",
                    "description": "",
                    "value": "",
                    "default": "Database",
                    "values": ["Select Category", "Database", "Keyvalue", "aws-keys"],
                    "id": "CATEGORY",
                    "label": "Category",
                    "placeholder": "Category",
                    "disabled": false
                },
                {
                    "name": "content type",
                    "type": "text",
                    "description": "",
                    "mandatory": false,
                    "value": "",
                    "id": "CONTENT_TYPE",
                    "label": "content type (optional)",
                    "placeholder": " Secret Content Type",
                    "disabled": false,
                },
                {
                    "name": "expiration date",
                    "type": "checkbox",
                    "description": "",
                    "mandatory": false,
                    "value": false,
                    "id": "EXPIRATION_DATE",
                    "label": "Set expiration date ?",
                    "disabled": false
                },

                {
                    "name": "expiresAt",
                    "type": "date",
                    "description": "",
                    "mandatory": false,
                    "value": "",
                    "id": "EXPIRES_AT",
                    "dependsOn": "EXPIRATION_DATE",
                    "label": "Expiration Date",
                    "disabled": false
                },
            ],
            tags: [
                {
                    "id": 1,
                    "KEY": {
                        "size": 4,
                        "padding": "pr-1",
                        "name": "keyprop",
                        "type": "text",
                        "mandatory": false,
                        "value": "",
                        "id": "keyprop_1",
                        "placeholder": "key",
                    },
                    "VALUE": {
                        "size": 7,
                        "padding": "pl-1",
                        "name": "valueprop",
                        "type": "password",
                        "mandatory": false,
                        "value": "",
                        "id": "valueprop_1",
                        "placeholder": "value",
                    }
                },
            ]
        }
    }

    triggerCreateSecret = () => {
        let inputField = this.state.inputField.filter((field) => { field.value = ''; field.disabled = false; return field });
        this.setState({ showModal: true, authAction: 'createSecret', inputField: inputField })
    }

    onChangeInput = (id, val) => {
        const { inputField } = this.state
        let secretProperty = inputField.filter(propItem => propItem.id === id)[0];
        secretProperty.value = val;
        this.setState({ inputField: inputField })
    }

    saveSecret = (inputdata) => {
        const { secretTabData, authAction } = this.state;
        if (authAction === 'createSecret') {
            let array = { "id": Math.random(), "createdBy": "system", "modifiedBy": "system", "createdAt": null, "modifiedAt": null, "version": " V 1.2", }
            inputdata.map((inputItem) => {
                return array[inputItem.name] = inputItem.value;
            })
            secretTabData[0].tableData.push(array);
            notifySuccess('add secret', 'New Secret created ');
            this.setState({ secretTabData: secretTabData, showModal: false, loading: false });
        }
        if (authAction === 'updateSecret') {
            inputdata.map((inputItem) => {
                let filterData = secretTabData[0].tableData.filter(filterItem => inputItem.formid === filterItem.id)[0];
                let key = inputItem.id;
                if (filterData.hasOwnProperty(key)) {
                    filterData[key] = inputItem.value
                }
                return inputItem
            })
            this.setState({ secretTabData: secretTabData, showModal: false })
        }
    }

    triggerEditSecret = (editObject) => {
        const { inputField } = this.state;
        inputField.map((inputItem) => {
            let key = inputItem.id;
            inputItem.formid = editObject.id;
            if (editObject.hasOwnProperty(key)) {
                inputItem.value = editObject[key];
            }
            if (inputItem.id === 'name') {
                inputItem.disabled = true;
            }
            return inputItem;
        })
        this.setState({ inputField: inputField, showModal: true, authAction: 'updateSecret' })
    }

    triggerDeleteSecret = (deleteObject) => {
        let { secretTabData } = this.state;
        const parent = this;
        confirmDelete().then(function (userInput) {
            if (!userInput.dismiss) {
                let data = secretTabData[0].tableData.filter(tabData => tabData.id === deleteObject.id)[0];
                data.status = "ARCHIVED";
                parent.setState({ secretTabData: secretTabData })
            }
        }).catch((error) => {
            console.error('dataStoreService.deleteDataStore:', error);
            notifyError('Unable to delete DataStore', error.message);
        });
    }

    // ------------------------------------------------------------------------------------------------------------

    handleTags = (mode, arrayItem, name, value) => {
        let tags = this.state.tags;
        if (mode === "ADD") {
            let generatedId = generateUUID()
            let arrayItem = {
                "id": generatedId,
                "KEY": {
                    "size": 4,
                    "padding": "pr-1",
                    "name": "keyprop",
                    "type": "text",
                    "mandatory": false,
                    "value": "",
                    "id": "keyprop_" + generatedId,
                    "placeholder": "key"
                },
                "VALUE": {
                    "size": 7,
                    "padding": "pl-1",
                    "name": "valueprop",
                    "type": "password",
                    "mandatory": false,
                    "value": "",
                    "id": "valueprop_" + generatedId,
                    "placeholder": "value"
                }
            }
            tags.push(arrayItem);
        } else if (mode === "DELETE") {
            tags = this.state.tags.filter(item => item.id !== arrayItem.id)
        } else if (mode === "EDIT") {
            for (const key of tags) {
                if (key.id === arrayItem.id) {
                    for (const iterator of Object.keys(key)) {
                        if (key[iterator].id === name) {
                            key[iterator].value = value;
                        }
                    }
                }
            }
        }
        this.setState({ tags: tags })
    }

    render() {
        const { loading, showModal, authAction, secretTabData, inputField, tags } = this.state;
        const toggleModal = () => this.setState({ showModal: false, authAction: '' });
        secretTabData[0].tableHeader = [
            { label: 'Name', key: 'name', },
            { label: 'Version', key: 'version' },
            { label: 'Category', key: 'category', },
            { label: 'Expires At', key: 'expiresAt', dataFormat: 'relativeTimestamp' },
            { label: 'Modified At', key: 'ModifiedAt', dataFormat: 'relativeTimestamp' },
            { label: 'Active', key: 'active' },
        ];
        secretTabData[0].defaultSort = { sortIndex: 2, sortOrder: 1 }
        secretTabData[0].createAction = this.triggerCreateSecret.bind(this);
        secretTabData[0].createLabel = "Create";
        secretTabData[0].tableActions = [
            {
                btnTitle: 'Edit', btnClass: 'btn-success', iconClass: 'feather icon-edit',
                btnAction: this.triggerEditSecret.bind(this)
            },
            {
                btnTitle: 'Delete', btnClass: 'btn-danger', iconClass: 'feather icon-trash-2',
                btnAction: this.triggerDeleteSecret.bind(this)
            },
        ]

        return (
            <section className="studio-container p-0">
                {loading &&
                    <Card>
                        <CardBody>
                            <BasicSpinner />
                        </CardBody>
                    </Card>
                }
                {!loading &&
                    secretTabData.map((tabProp, tabKey) => {
                        return <StudioTable key={tabKey} tableName={tabProp.name} hideTableName={true}
                            tableHeader={tabProp.tableHeader}
                            tableData={tabProp.tableData.filter(tabData => tabData.status !== 'ARCHIVED')}
                            tableActions={tabProp.tableActions}
                            createAction={tabProp.createAction}
                            createLabel={tabProp.createLabel}
                            defaultSort={tabProp.defaultSort} />
                    })}
                <Modal centered size={'lg'} isOpen={showModal && (authAction === 'createSecret' || authAction === 'updateSecret')}>
                    <ModalHeader toggle={toggleModal} className="p-3">{authAction === 'createSecret' ? 'Create Secret' : 'Update Secret'}</ModalHeader>
                    <ModalBody className='pl-3 pr-3 pb-3 pt-0'>
                        <Row>
                            {inputField.map((propItem, propIndex) =>
                                <Col xs={12} md={(propItem.id === "NAME" || propItem.type === "textarea" || propItem.type === "switch") ? 12 : 6} className={propItem.type === "switch" ? "text-right" : ""} key={propIndex}>
                                    {((!!propItem.dependsOn === true &&
                                        !!inputField.filter(field => field.id === propItem.dependsOn)[0].value === true) || !!propItem.dependsOn === false) &&
                                        createInputField(propItem.type, propItem.id, propItem.label, propItem.value, this.onChangeInput.bind(this),
                                            {
                                                checkboxLabelBefore: true,
                                                input: propItem.type === 'checkbox' ? 'mt-2 ml-1 switch-input' : '',
                                                label: propItem.type === 'checkbox' ? 'mt-2 mr-1 switch-label' : '',
                                                required: propItem.mandatory,
                                                disabled: propItem.disabled,
                                                placeholder: propItem.placeholder,
                                                switchTextOn: 'YES', switchTextOff: 'NO',
                                            },
                                            propItem.values && propItem.values.map((arrayValue) => ({ label: arrayValue, value: arrayValue })), propItem.id
                                        )
                                    }
                                </Col>
                            )}
                        </Row>
                        {tags.length > 0 && <label className='text-capitalize p-0 m-0 mb-0 component-stretched'>Key Values</label>}
                        {tags.map((arrayItem, arrayIndex) =>
                            <Row key={arrayIndex}>
                                {Object.keys(arrayItem).map((propItem, propIndex) =>
                                    propItem !== "id" && <Col xs='5' sm={arrayItem[propItem].size} key={propIndex} className={arrayItem[propItem].padding}>
                                        {createInputField(arrayItem[propItem].type, arrayItem[propItem].id, '', arrayItem[propItem].value, this.handleTags.bind(this, "EDIT", arrayItem), { placeholder: arrayItem[propItem].placeholder })}
                                    </Col>
                                )}
                                <Col xs='1' sm='1'>
                                    {arrayIndex === tags.length - 1 ?
                                        <i className='fa fa-plus studio-primary pr-3 mt-2 float-right' onClick={this.handleTags.bind(this, "ADD", arrayItem)}></i>
                                        :
                                        <i className='fa fa-times text-danger pr-3 mt-2 float-right' onClick={this.handleTags.bind(this, "DELETE", arrayItem)}></i>
                                    }
                                </Col>
                            </Row>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Row xs="1" md="1">
                            <Col className='text-right'>
                                {actionButton("Save", () => this.saveSecret(inputField), "", "", true, false, ACTION_BUTTON.PRIMARY)}
                            </Col>
                        </Row>
                    </ModalFooter>
                </Modal>
            </section>
        )
    }
}