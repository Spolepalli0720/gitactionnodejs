import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Tabs, Tab } from 'react-bootstrap';
import { forEach } from 'min-dash';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { domify, query as domQuery, clear as domClear } from 'min-dom';

import StudioModeler from './StudioModeler';
import StudioImages from './StudioImages';
import StudioConfig from './StudioConfig';
import TreeView from 'deni-react-treeview';
import RuleEditor from "./RuleEditor";
import Tooltip from '../utils/Tooltip';
import Infotip from '../utils/Infotip';

import { notify, notifySuccess, notifyError } from '../utils/Notifications';
import { confirmAction, generateUUID, badgeStyle } from '../utils/StudioUtils';
import { actionButton, ACTION_BUTTON, inputField } from '../utils/StudioUtils';
import { ruleService } from "../services/RuleService";
import { userService, USER_ACTIONS } from "../services/UserService";

import "./RuleModeler.scss"

var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
    elementHelper = require('bpmn-js-properties-panel/lib/helper/ElementHelper'),
    find = require('lodash/find');

const BASIC_TYPES = ["string", "integer", "number", "long", "double", "date", "time", "timestamp", "boolean"];

class RuleModeler extends Component {

    constructor(props) {
        super(props);
        this.state = {
            customTypes: [
                {
                    id: "a440ce69-0ddb-488d-b0db-834f85c6e04a", text: "Employee", children: [
                        { id: "a440ce69-0ddb-488d-b0db-834f85c6e04a-1", text: "name", dataType: 'string', isLeaf: true },
                        { id: "a440ce69-0ddb-488d-b0db-834f85c6e04a-2", text: "age", dataType: 'number', isLeaf: true }
                    ]
                },
                {
                    id: "b440ce69-0ddb-488d-b0db-834f85c6e04a", text: "Department", children: [
                        { id: "b440ce69-0ddb-488d-b0db-834f85c6e04a-1", text: "name", dataType: 'string', isLeaf: true },
                        { id: "b440ce69-0ddb-488d-b0db-834f85c6e04a-2", text: "description", dataType: 'string', isLeaf: true }
                    ]
                },
                { id: "c440ce69-0ddb-488d-b0db-834f85c6e04a", text: "Group", children: [] }
            ],
            selectedItem: undefined, selectedType: undefined,
            showPalette: true, showProperties: true, showModal: false, modalEvent: '', scriptFormat: '', scriptContent: ''
        };

        if (!window.HTMLElement.prototype.scrollIntoViewIfNeeded) {
            window.HTMLElement.prototype.scrollIntoViewIfNeeded = function () { };
        }
    }

    zoomlevel = 1.0;
    modeler = null;

    componentDidMount = () => {
        window.scrollTo(0, 0);
        const parent = this;
        let propsRuleId;
        if (this.props.rule) {
            propsRuleId = this.props.rule.id;
        } else {
            const { ruleId } = this.props.match.params;
            propsRuleId = ruleId;
        }

        this.hideShowPalette();
        this.hideShowProperties();

        this.modeler = new StudioModeler({
            studioType: 'RULEFLOW',
            paletteContainer: '#rulePalette',
            paletteItems: StudioConfig.RULEFLOW_TASKS,
            canvasContainer: '#ruleCanvas',
            launchRuleEditor: this.launchRuleEditor.bind(this),
            toggleProperties: this.hideShowProperties.bind(this)
        });

        this.modeler.on('selection.changed', function (e) {
            if (e.newSelection && e.newSelection.length > 0) {
                parent.setState({ selectedNode: e.newSelection[0] });
            } else {
                parent.setState({ selectedNode: undefined });
            }
        });

        ruleService.getRule(propsRuleId).then(response => {
            this.setState({ rule: response })
            if (document.getElementById('ruleDescription')) {
                document.getElementById('ruleDescription').innerHTML = response.description;
            }
            this.openDiagram(response);
        }).catch(error => {
            console.error('ruleService.getRule:', error);
            notifyError('Unable to retrieve rule', error.message);
        });

        this.renderPalleteEntries();
        this.enableEventListeners();
    }

    enableEventListeners() {
        document.addEventListener('scriptEditor', (e) => {
            this.setState({
                showModal: true,
                modalEvent: 'scriptEditor',
                eventSource: e.detail.eventSource,
                scriptFormat: e.detail.scriptFormat,
                scriptContent: e.detail.scriptContent
            })
        }, false);
        document.addEventListener('createForm', (e) => {
            this.setState({
                showModal: true,
                modalEvent: 'createForm',
                eventSource: e.detail.eventSource,
                formConfig: undefined
            })
        }, false);
        document.addEventListener('createRule', (e) => {
            this.setState({
                showModal: true,
                modalEvent: 'createRule',
                eventSource: e.detail.eventSource,
                ruleConfig: undefined
            })
        }, false);
    }

    openDiagram = (rule) => {
        this.modeler.importXML(rule.content).then(response => {
            if (response.warnings && response.warnings.length > 0) {
                console.log('RuleModeler :: importXML  with.Warnings', rule.name, response.warnings);
            }
            this.updateRuleId();
            try {
                this.zoomFit();
            } catch (error) {
                console.error('RuleModeler :: importXML :: zoom.Error :: ', error);
            }
        }).catch(error => {
            notifyError('RuleModeler :: importXML', rule.name, error.message);
        });
    }

    importRule = (files) => {
        const { rule } = this.state;
        const parent = this;
        const reader = new FileReader();
        reader.readAsText(files[0], 'UTF-8');
        reader.onloadend = () => {
            rule.content = reader.result.replace(/camunda:/g, 'custom:');
            parent.openDiagram(rule);
        };
    }

    saveRule = () => {
        this.updateRuleId();
        const { rule, customTypes } = this.state;
        this.modeler.saveXML({ format: false }).then(xmlResponse => {
            rule.content = xmlResponse.xml;
            rule.customTypes = customTypes;
            ruleService.updateRule(rule).then(response => {
                notifySuccess('Save Rule', 'Rule has been successfully saved');
                this.setState({ rule: response });
            }).catch(error => {
                console.error('ruleService.updateRule:', error);
                notifyError('Unable to save rule', error.message);
            });
        }).catch(error => {
            console.error('RuleModeler :: saveXML', error);
            notifyError('Unable to save rule', error.message);
        });
    }

    updateRuleId = () => {
        const { rule } = this.state;
        try {
            let uniqueId = rule.decisionId ? rule.decisionId.slice(1) : userService.generateUUID()
            rule.decisionId = "r" + uniqueId;
            this.modeler._definitions.id = "d" + uniqueId
            let bpmnProcess = this.modeler._definitions.rootElements.filter(rootElement => rootElement.$type === 'bpmn:Process')[0];
            bpmnProcess.id = rule.decisionId
        } catch (error) {
            console.error('Unable to update decisionId', error);
            notifyError('Unable to update decisionId', error.message);
        }
    }

    publishRule = () => {
        const { rule } = this.state;
        confirmAction('Publish Rule').then(userInput => {
            // let actionComment = userInput.value;
            if (!userInput.dismiss) {
                this.modeler.saveXML({ format: false }).then(xmlResponse => {
                    rule.content = xmlResponse.xml;
                    ruleService.publishRule(rule).then(response => {
                        notifySuccess('Publish Rule', 'Rule has been successfully published');
                        this.setState({ rule: response });
                    }).catch(error => {
                        console.error('ruleService.publishRule:', error);
                        notifyError('Unable to publish rule', error.message);
                    });
                }).catch(error => {
                    console.error('RuleModeler :: saveXML', error);
                    notifyError('Unable to publish rule', error.message);
                });
            }
        });
    }

    downloadRule = () => {
        const { ruleId } = this.props.match.params;
        this.modeler.saveXML({ format: true }).then(xmlResponse => {
            var encodedData = encodeURIComponent(xmlResponse.xml);
            const newAnchorTag = document.createElement('a');
            const filename = ruleId + ".xml";
            newAnchorTag.setAttribute('href', 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData);
            newAnchorTag.setAttribute('download', filename);
            newAnchorTag.dataset.downloadurl = ['application/bpmn20-xml', newAnchorTag.download, newAnchorTag.href].join(':');
            notify('Export Rule', 'Rule details published for download');
            newAnchorTag.click();
        }).catch(error => {
            console.error('RuleModeler :: saveXML', error);
            notifyError('Unable to export rule', error.message);
        });
    }

    launchRuleEditor() {
        this.setState({ showModal: true, modalEvent: 'launchEditor' })
    }

    renderPalleteEntries = () => {
        var paletteContainer = domQuery('#rulePalette', this._container);
        var entriesContainer = domQuery('.djs-palette-entries', paletteContainer);

        var accordion = domify('<div class="accordion" id="paletteAccordion"></div>');
        forEach(entriesContainer.childNodes, function (group, id) {
            var dataGroup = group.getAttribute("data-group");
            if (dataGroup) {
                dataGroup = dataGroup.replace(" ", "-");
                var groupId = dataGroup.toLowerCase();
                var groupName = dataGroup

                if (['decisions', 'inputs'].indexOf(groupId) >= 0) {
                    var cardBody = domQuery('#card-' + groupId + '-body', accordion);
                    if (cardBody) {
                        forEach(group.childNodes, function (groupItem) {
                            cardBody.appendChild(groupItem.cloneNode(true));
                        });
                    } else {
                        var card = domify('<div class="card"></div>');
                        var cardHeader = domify('<div id="card-' + groupId + '-head" class="card-header"></div>');
                        var cardButton = domify('<button class="btn btn-block text-left" data-toggle="collapse" data-target="#card-' + groupId + '-body" aria-expanded="false" aria-controls="card-' + groupId + '-body">' + groupName.replace('-', ' ') + '</button>');
                        cardButton.style = "width: calc(100% - 1px); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;";
                        cardHeader.appendChild(cardButton);
                        card.appendChild(cardHeader);
                        cardBody = domify('<div id="card-' + groupId + '-body" class="card-body collapse" aria-labelledby="card-' + groupId + '-head" data-parent="#paletteAccordion"></div>');
                        forEach(group.childNodes, function (groupItem) {
                            cardBody.appendChild(groupItem.cloneNode(true));
                        });
                        card.appendChild(cardBody);
                        accordion.appendChild(card);
                    }
                }
            }
        });
        domClear(entriesContainer);
        entriesContainer.appendChild(accordion);
    }

    hideShowPalette = () => {
        const { showPalette } = this.state;
        if (!showPalette) {
            document.getElementById("rulePaletteContainer").style.display = "block";
        } else {
            document.getElementById("rulePaletteContainer").style.display = "none";
        }
        this.setState({ showPalette: !showPalette })
    }

    hideShowProperties = () => {
        const { showProperties } = this.state;
        if (!showProperties) {
            document.getElementById("rulePropertiesContainer").style.display = "block";
        } else {
            document.getElementById("rulePropertiesContainer").style.display = "none";
        }
        this.setState({ showProperties: !showProperties })
    }

    zoomIn() {
        this.zoomlevel += 0.1;
        this.modeler.get('canvas').zoom(this.zoomlevel);
    }

    zoomOut() {
        if (this.zoomlevel > 0.5) {
            this.zoomlevel -= 0.1;
            this.modeler.get('canvas').zoom(this.zoomlevel);
        }
    }

    zoomFit() {
        this.zoomlevel = 1.0;
        this.modeler.get('canvas').zoom('fit-viewport');
        this.modeler.get('canvas').zoom(this.zoomlevel);
    }

    handleNodePropsChange = (name, value) => {
        const { selectedNode } = this.state;

        if ('documentation' === name) {
            if (selectedNode) {
                this.updateNodeProperty(name, value);
            } else {
                //TODO
            }
        } else if (selectedNode) {
            this.updateNodeProperty(name, name === 'isArray' ? value.toString() : value);
        }
    }

    updateNodeProperty(name, value) {
        const { selectedNode } = this.state;
        const businessObject = getBusinessObject(selectedNode);
        const bpmnFactory = this.modeler.get('bpmnFactory');

        var extensionElements = businessObject.get('extensionElements');
        var properties;
        if (!extensionElements) {
            extensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, businessObject, bpmnFactory);
            properties = elementHelper.createElement('custom:Properties', { values: [] }, extensionElements, bpmnFactory);
            extensionElements.values.push(properties);
            properties.values.push(elementHelper.createElement('custom:Property', { name: "dataType", value: '' }, properties, bpmnFactory));
            properties.values.push(elementHelper.createElement('custom:Property', { name: "isArray", value: 'false' }, properties, bpmnFactory));
            businessObject.set('extensionElements', extensionElements);
        } else {
            properties = this.getExtensionElementProperties(extensionElements);
            if (!properties) {
                properties = elementHelper.createElement('custom:Properties', { values: [] }, extensionElements, bpmnFactory);
                extensionElements.values.push(properties);
                properties.values.push(elementHelper.createElement('custom:Property', { name: "dataType", value: '' }, properties, bpmnFactory));
                properties.values.push(elementHelper.createElement('custom:Property', { name: "isArray", value: 'false' }, properties, bpmnFactory));
            }
        }

        if ('name' === name) {
            selectedNode.businessObject.set([name], value);
        } else {
            let filteredProperies = properties.values.filter(property => property.name === name);
            if (filteredProperies.length > 0) {
                filteredProperies[0].value = value.toString();
            } else {
                properties.values.push(elementHelper.createElement('custom:Property', { name: name, value: value }, properties, bpmnFactory));
            }
        }
        this.setState({ selectedNode: selectedNode });
        this.modeler.get('eventBus').fire('element.changed', { element: selectedNode });
    }

    getExtensionElementProperties(extensionElements) {
        return find(extensionElements.values, function (elem) {
            return is(elem, 'custom:Properties');
        });
    }

    cancelEditor = () => {
        this.setState({ showModal: false, modalEvent: '' })
    }

    saveEditorContent = (editorContent) => {
        if (this.getSelectedNodeProperty('$type') === 'bpmn:BusinessRuleTask') {
            this.updateNodeProperty('ruleTable', JSON.stringify(editorContent));
        } else if (this.getSelectedNodeProperty('$type') === 'bpmn:ScriptTask') {
            this.updateNodeProperty('expressionRule', editorContent);
        }
        this.setState({ showModal: false, modalEvent: '' })
    }

    getSelectedNodeProperty(propName) {
        const { selectedNode } = this.state;
        const businessObject = getBusinessObject(selectedNode)

        let propValue = '';
        if (!selectedNode && 'documentation' === propName) {
            // if (selectedNode) {
            //     propValue = selectedNode.documentation;
            // } else if (this.modeler && this.modeler._definitions) {
            //     propValue = this.modeler._definitions.rootElements.filter(rootElement => rootElement.$type === 'bpmn:Process')[0].documentation;
            // }
            propValue = '';
        } else if ('$type' === propName) {
            propValue = businessObject.$type;
        } else if ('name' === propName) {
            propValue = businessObject.get(propName) || '';
        } else {
            var extensionElements = businessObject.get('extensionElements');
            if (extensionElements) {
                var properties = this.getExtensionElementProperties(extensionElements);
                if (properties) {
                    let filteredProperies = properties.values.filter(property => property.name === propName);
                    if (filteredProperies.length > 0) {
                        propValue = filteredProperies[0].value;
                    }
                }
            }
        }

        if (propName === 'isArray') {
            return propValue === 'true'
        } else {
            return propValue;
        }
    }

    onRenderCustomTypeItem = (customTypeItem, treeView) => {
        let itemLabel = customTypeItem.text + ((customTypeItem.dataType === undefined || customTypeItem.dataType === '') ? '' : (' : ' + customTypeItem.dataType));
        return (
            <div className="rule-custom-type-item">
                <span className="rule-custom-type-item-text" onClick={this.onSelectCustomTypeItem.bind(this, customTypeItem)}>{itemLabel}</span>
                {!customTypeItem.isLeaf && (customTypeItem.expanded || customTypeItem.children.length === 0) &&
                    <span className="rule-custom-type-item-action add" title="Add" onClick={this.onAddCustomTypeItem.bind(this, customTypeItem)}><i className="fas fa-plus-circle fa-lg" /></span>
                }
                <span className="rule-custom-type-item-action trash" title="Delete" onClick={this.onDeleteCustomTypeItem.bind(this, customTypeItem)}><i className="fas fa-trash-alt fa-lg" /></span>
            </div>
        )
    }

    onAddCustomTypeItem = (customTypeItem) => {
        const treeViewAPI = this.refs.treeView.api;
        if (customTypeItem) {
            const leafItem = treeViewAPI.addItem('attribute_' + (customTypeItem.children.length + 1), true, customTypeItem);
            leafItem.id = generateUUID();
            delete leafItem.children;
            treeViewAPI.selectItem(leafItem);
        } else {
            const rootItem = treeViewAPI.getRootItem();
            const customType = treeViewAPI.addItem('DataType' + (rootItem.children.length + 1), false, rootItem);
            customType.id = generateUUID();
            treeViewAPI.selectItem(customType);
        }
    }

    onDeleteCustomTypeItem = (customTypeItem) => {
        const treeViewAPI = this.refs.treeView.api;
        let deletedItemParent = treeViewAPI.getParentNode(customTypeItem);
        treeViewAPI.removeItem(customTypeItem.id);
        if (deletedItemParent.root) {
            this.setState({ selectedType: undefined, selectedItem: undefined });
        } else {
            treeViewAPI.selectItem(deletedItemParent);
        }
    }

    onExpandedCustomTypeItem = (customTypeItem) => {
        this.refs.treeView.api.selectItem(customTypeItem);
    }

    onSelectCustomTypeItem = (customTypeItem) => {
        let selectedItemParent = this.refs.treeView.api.getParentNode(customTypeItem);
        this.setState({
            selectedType: customTypeItem.isLeaf ? selectedItemParent : customTypeItem,
            selectedItem: customTypeItem.isLeaf ? customTypeItem : undefined
        });
    }

    onChangeCustomTypeItem = (name, value) => {
        const treeViewAPI = this.refs.treeView.api;
        let selectedNameError = undefined;
        let customTypeItem = treeViewAPI.getSelectedItem();
        let selectedItemParent = treeViewAPI.getParentNode(customTypeItem);
        customTypeItem[name] = value;

        if (name === 'text') {
            if (value === '') {
                selectedNameError = 'Name is required'
            } else if (value.includes(' ')) {
                selectedNameError = 'Space is not allowed'
            } else if (BASIC_TYPES.indexOf(value.toLowerCase()) >= 0) {
                selectedNameError = 'Reserved name'
            } else if (selectedItemParent.children.filter(arrayItem => arrayItem.text === value).length > 1) {
                selectedNameError = 'Duplicate name'
            }
        }

        treeViewAPI.selectItem(customTypeItem);
        this.setState({
            selectedType: customTypeItem.isLeaf ? selectedItemParent : customTypeItem,
            selectedItem: customTypeItem.isLeaf ? customTypeItem : undefined,
            selectedNameError: selectedNameError
        });
    }

    onSelectTabsComponent = (eventKey) => {
        const treeViewAPI = this.refs.treeView.api;
        const rootItem = treeViewAPI.getRootItem();
        const customTypes = rootItem.children.sort((a, b) => a.text.localeCompare(b.text));
        this.setState({ customTypes: customTypes });
    }

    render = () => {
        const { rule, showPalette, showProperties, selectedNode, selectedItem, selectedType } = this.state;
        const { modalEvent } = this.state;
        const toggleShowModal = () => this.setState({ showModal: false, modalEvent: '' });
        let canvasStyle = "p-0";

        if (showPalette && showProperties) {
            if (this.props.rule) {
                canvasStyle = 'col-md-8 ' + canvasStyle;
            } else {
                canvasStyle = 'col-md-9 ' + canvasStyle;
            }

        } else if (!showPalette & showProperties) {
            if (this.props.rule) {
                canvasStyle = 'col-md-9 ' + canvasStyle;
            } else {
                canvasStyle = 'col-md-10 ' + canvasStyle;
            }
        } else if (showPalette & !showProperties) {
            canvasStyle = 'col-md-11 ' + canvasStyle;
        } else {
            canvasStyle = 'col-md-12 ' + canvasStyle;
        }

        return (
            <section className="studio-container">
                <Row xs="1" md="1">
                    <Col className="text-left">
                        <div className="content-float-right mt-2">
                            {actionButton('Zoom IN', this.zoomIn.bind(this), 'canvas-action-zoom-in')}
                            {actionButton('Zoom OUT', this.zoomOut.bind(this), 'canvas-action-zoom-out')}
                            {actionButton('Zoom zoomFit', this.zoomFit.bind(this), 'canvas-action-zoom-fit')}
                            {userService.hasPermission(this.props.studioRouter, USER_ACTIONS.EDIT) &&
                                <React.Fragment>
                                    <Tooltip title="Import Rule">
                                        <label className="canvas-action-import" htmlFor="file-import-dialog" />
                                    </Tooltip>
                                    <input id="file-import-dialog" type="file" accept=".bpmn, .xml" style={{ display: 'none' }}
                                        onChange={(e) => { this.importRule(e.target.files) }} />
                                </React.Fragment>
                            }
                            {userService.hasPermission(this.props.studioRouter, USER_ACTIONS.EXPORT) &&
                                actionButton('Download Rule', this.downloadRule.bind(this), 'canvas-action-download')
                            }
                            {userService.hasPermission(this.props.studioRouter, USER_ACTIONS.EDIT) &&
                                actionButton('Save Rule', this.saveRule.bind(this), 'canvas-action-save')
                            }
                            {userService.hasPermission(this.props.studioRouter, USER_ACTIONS.PUBLISH) &&
                                actionButton('Publish Rule', this.publishRule.bind(this), 'canvas-action-publish')
                            }
                        </div>
                        <h4 className="studio-secondary mr-0">{rule ? rule.name : 'Loading....'}
                            {rule &&
                                <span className='ml-3 small'>
                                    <label className="badge badge-light m-0 p-0">{rule.version ? 'v' + rule.version : ''}</label>
                                    <label className={"ml-1 badge " + badgeStyle(rule.status || '') + " m-0 pt-1 pb-1"}>{rule.status || ''}</label>
                                    {rule.status && rule.status !== 'DRAFT' &&
                                        <Infotip title='Change makes status "DRAFT" and increment the "VERSION".'>
                                            <span className='ml-1 align-top feather icon-alert-circle text-dark' />
                                        </Infotip>
                                    }
                                </span>
                            }
                        </h4>
                    </Col>
                </Row>
                <Row xs="1" md="1">
                    <Col id="ruleContainer">
                        <Row>
                            <Col id="rulePaletteContainer" className="col-md-1 p-0">
                                <div id="rulePalette"></div>
                            </Col>
                            <Col className={canvasStyle}>
                                <div id="ruleCanvas">
                                    {showPalette ?
                                        <button type="button" title="Hide Palette" className="bpp-palette-toggle" onClick={() => { this.hideShowPalette() }} >
                                            Hide Palette <img width="15" height="15" alt="Hide Palette" src={StudioImages.ARROW_TB} />
                                        </button>
                                        :
                                        <button type="button" title="Show Palette" className="bpp-palette-toggle" onClick={() => { this.hideShowPalette() }} >
                                            Show Palette <img width="15" height="15" alt="Show Palette" src={StudioImages.ARROW_TB} />
                                        </button>
                                    }

                                    {showProperties ?
                                        <button type="button" title="Hide Properties" className="bpp-properties-toggle" onClick={() => { this.hideShowProperties() }} >
                                            Hide Properties <img width="15" height="15" alt="Hide Properties" src={StudioImages.ARROW_TB} />
                                        </button>
                                        :
                                        <button type="button" title="Show Properties" className="bpp-properties-toggle" onClick={() => { this.hideShowProperties() }} >
                                            Show Properties <img width="15" height="15" alt="Show Properties" src={StudioImages.ARROW_TB} />
                                        </button>
                                    }
                                </div>
                            </Col>
                            <Col id="rulePropertiesContainer" className={(this.props.rule ? 'col-md-3' : 'col-md-2') + " p-0"}>
                                <div id="ruleProperties">
                                    <Tabs defaultActiveKey={'ruleProps'} className="px-2" onSelect={this.onSelectTabsComponent.bind(this)}>
                                        <Tab eventKey={'ruleProps'} title={'Properties'}>
                                            {!selectedNode &&
                                                <div>
                                                    <Row xs="1" md="1" className="pt-3">
                                                        <Col>
                                                            {inputField('textarea', 'documentation', 'Documentation',
                                                                this.getSelectedNodeProperty('documentation'), this.handleNodePropsChange.bind(this),
                                                                { input: 'component-stretched' })
                                                            }
                                                        </Col>
                                                    </Row>
                                                </div>
                                            }
                                            {selectedNode &&
                                                <div>
                                                    <Row xs="1" md="1" className="pt-3">
                                                        <Col>
                                                            {inputField('text', 'name', 'Name',
                                                                this.getSelectedNodeProperty('name'), this.handleNodePropsChange.bind(this),
                                                                { required: true })
                                                            }
                                                        </Col>
                                                        <Col>
                                                            <div className="form-group studio">
                                                                <label className="text-capitalize mb-1 field-required">
                                                                    {this.getSelectedNodeProperty('$type') === 'bpmn:Task' ? 'DataType' : 'Output DataType'}
                                                                </label>
                                                                <select name="dataType" value={this.getSelectedNodeProperty('dataType') || ''}
                                                                    onChange={(e) => this.handleNodePropsChange('dataType', e.target.value)}>
                                                                    <option value="">Select DataType</option>
                                                                    {BASIC_TYPES.map((dataTypeItem) =>
                                                                        <option key={dataTypeItem} value={dataTypeItem}>{dataTypeItem.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</option>
                                                                    )}
                                                                    {this.getSelectedNodeProperty('$type') === 'bpmn:Task' &&
                                                                        <optgroup label="Custom Types">
                                                                            {this.refs.treeView?.api.getRootItem().children.map((treeItem, treeItemIndex) =>
                                                                                treeItem.children.length > 0 &&
                                                                                <option key={treeItemIndex} value={treeItem.text || ''}>{treeItem.text || 'Unnamed'}</option>
                                                                            )}
                                                                        </optgroup>
                                                                    }
                                                                </select>
                                                            </div>
                                                        </Col>
                                                        {this.getSelectedNodeProperty('$type') === 'bpmn:Task' &&
                                                            <Col className='pt-0'>
                                                                {inputField('checkbox', 'isArray', 'Array',
                                                                    this.getSelectedNodeProperty('isArray') || false, this.handleNodePropsChange.bind(this),
                                                                    { label: 'w-auto' })
                                                                }
                                                            </Col>
                                                        }
                                                        <Col>
                                                            {inputField('textarea', 'documentation', 'Documentation',
                                                                this.getSelectedNodeProperty('documentation'), this.handleNodePropsChange.bind(this),
                                                                { input: 'component-stretched' })
                                                            }
                                                        </Col>
                                                    </Row>
                                                </div>
                                            }
                                        </Tab>
                                        <Tab eventKey={'ruleModel'} title={'Data Types'}>
                                            <Row xs="1" md="1">
                                                <Col className="pb-1">
                                                    {actionButton('Create', this.onAddCustomTypeItem.bind(this, undefined),
                                                        'content-float-right', 'feather icon-plus', true, false, ACTION_BUTTON.PRIMARY)
                                                    }
                                                </Col>
                                                <Col className="pt-1">
                                                    <TreeView className="rule-custom-type" ref="treeView"
                                                        items={this.state.customTypes}
                                                        showRoot={false}
                                                        showIcon={false}
                                                        selectRow={true}
                                                        showCheckbox={false}
                                                        onExpanded={this.onExpandedCustomTypeItem.bind(this)}
                                                        onSelectItem={this.onSelectCustomTypeItem.bind(this)}
                                                        onRenderItem={this.onRenderCustomTypeItem.bind(this)}
                                                    />
                                                </Col>
                                                {(selectedItem || selectedType) &&
                                                    <Row xs="1" md="1" className="pt-1">
                                                        <Col>
                                                            {inputField('text', 'text', 'Name',
                                                                selectedItem ? selectedItem.text : selectedType ? selectedType.text : '',
                                                                this.onChangeCustomTypeItem.bind(this),
                                                                { required: true, autoFocus: true })
                                                            }
                                                            {this.state.selectedNameError &&
                                                                <label className="text-danger">{this.state.selectedNameError}</label>
                                                            }
                                                        </Col>
                                                        {selectedItem &&
                                                            <Col>
                                                                <div className="form-group studio">
                                                                    <label className="text-capitalize mb-1 field-required">DataType</label>
                                                                    <select name="dataType" value={selectedItem.dataType || ''}
                                                                        onChange={(e) => this.onChangeCustomTypeItem('dataType', e.target.value)}>
                                                                        <option value="">Select DataType</option>
                                                                        {BASIC_TYPES.map((dataTypeItem) =>
                                                                            <option key={dataTypeItem} value={dataTypeItem}>
                                                                                {dataTypeItem.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                                                            </option>
                                                                        )}
                                                                        <optgroup label="Custom Types">
                                                                            {this.refs.treeView?.api.getRootItem().children.map((treeItem, treeItemIndex) =>
                                                                                treeItem.children.length > 0 && treeItem.text !== selectedType.text &&
                                                                                <option key={treeItemIndex} value={treeItem.text || ''}>{treeItem.text || 'Unnamed'}</option>
                                                                            )}
                                                                        </optgroup>
                                                                    </select>
                                                                </div>
                                                            </Col>
                                                        }
                                                        {selectedItem &&
                                                            <Col className='pt-0'>
                                                                {inputField('checkbox', 'isArray', 'Array',
                                                                    selectedItem.isArray || false, this.onChangeCustomTypeItem.bind(this),
                                                                    { label: 'w-auto' })
                                                                }
                                                            </Col>
                                                        }
                                                    </Row>
                                                }
                                            </Row>
                                        </Tab>
                                    </Tabs>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    {!this.props.rule &&
                        <Col className='pb-0'>
                            <p id='ruleDescription' className="content-description-short text-justify mb-0"></p>
                        </Col>
                    }
                </Row>
                {modalEvent === 'launchEditor' &&
                    <Modal centered size={'xl'} isOpen={this.state.showModal && modalEvent === 'launchEditor'}>
                        <ModalHeader className="p-3" toggle={toggleShowModal}>{selectedNode ? (selectedNode.businessObject.get('name') || selectedNode.businessObject.get('id')) : 'Rule'}</ModalHeader>
                        <ModalBody className="pt-0 pb-0 pl-2 pr-2">
                            <RuleEditor
                                selectedNode={selectedNode}
                                customTypes={this.state.customTypes}
                                onSave={this.saveEditorContent.bind(this)}
                                onCancel={this.cancelEditor.bind(this)}
                            />
                        </ModalBody>
                    </Modal>
                }
            </section>
        )
    }
}

export default RuleModeler;
