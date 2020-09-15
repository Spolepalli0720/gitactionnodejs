import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import { forEach } from 'min-dash';
import { domify, query as domQuery, clear as domClear } from 'min-dom';

import DmnModeler from 'dmn-js/lib/Modeler';
import Tooltip from '../utils/Tooltip';
import Infotip from '../utils/Infotip';

import { notify, notifySuccess, notifyError } from '../utils/Notifications';
import { confirmAction, actionButton, badgeStyle } from '../utils/StudioUtils';
import { ruleService } from "../services/RuleService";
import { userService, USER_ACTIONS } from "../services/UserService";

export default class DecisionModeler extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showPalette: false, showProperties: false, showModal: false, modalEvent: '', scriptFormat: '', scriptContent: ''
        };
    }

    zoomlevel = 1.0;
    modeler = null;

    componentDidMount = () => {
        const parent = this;
        window.scrollTo(0, 0);
        let propsDecisionId;
        if (this.props.decision) {
            propsDecisionId = this.props.decision.id;
        } else {
            const { decisionId } = this.props.match.params;
            propsDecisionId = decisionId;
        }

        this.modeler = new DmnModeler({
            container: '#decisionCanvas',
            keyboard: {
                bindTo: window.document
            }
        });

        this.modeler.on('import.done', (event) => {
            const { error, warnings } = event;

            if (warnings && warnings.length > 0) {
                console.warn('DecisionModeler :: import.done :: with.Warnings :: ', warnings);
                // notifyWarning('Load Decision', 'Decision loaded with Warnings');
            }

            if (error) {
                console.error('DecisionModeler :: import.done :: with.Error :: ', error);
                notifyError('Load Rule', error.message);
            } else {
                this.updateDecisionId();
            }

            try {
                parent.renderPalleteEntries();
                parent.zoomFit();
            } catch (error) {
                console.error('DecisionModeler :: import.done :: zoom.Error :: ', error);
            }
        });

        ruleService.getRule(propsDecisionId).then(resp => {
            this.setState({ decision: resp })
            if (!this.props.decision && document.getElementById('decisionDescription')) {
                document.getElementById('decisionDescription').innerHTML = resp.description;
            }
            this.openDiagram(resp.content);
        }).catch(error => {
            console.error('ruleService.getRule:', error);
            notifyError('Unable to retrieve rule', error.message);
        });

    }

    openDiagram = (xml) => {
        this.modeler.importXML(xml, (error) => {
            if (error) {
                return console.error('fail import xml', error.message);
            }

            var canvas = this.modeler.getActiveViewer().get('canvas');
            canvas.zoom('fit-viewport');
        });
    }

    importDecision = (file) => {
        const reader = new FileReader();
        reader.readAsText(file[0]);
        reader.onloadend = () => {
            this.openDiagram(reader.result);
        };
    }

    saveDecision = () => {
        const parent = this;
        this.updateDecisionId();
        const { decision } = this.state;
        this.modeler.saveXML({ format: false }, function (err, xml) {
            if (err) {
                return console.error('could not save Rule', err);
            }
            decision.content = xml;
            ruleService.updateRule(decision).then(resp => {
                notifySuccess('Save Rule', 'Rule has been successfully saved');
                parent.setState({ decision: resp });
            }).catch(error => {
                console.error('ruleService.updateRule:', error);
                notifyError('Unable to save rule', error.message);
            });
        });
    }

    updateDecisionId = () => {
        const { decision } = this.state;
        try {
            let uniqueId = decision.decisionId ? decision.decisionId.slice(1) : userService.generateUUID()
            decision.decisionId = "r" + uniqueId;
            this.modeler._definitions.id = "d" + uniqueId
            let dmnDecision = this.modeler._definitions.drgElement.filter(element => element.$type === 'dmn:Decision')[0];
            dmnDecision.id = decision.decisionId
        } catch (error) {
            console.error('Unable to update decisionId', error);
            notifyError('Unable to update decisionId', error.message);
        }
    }

    publishDecision = () => {
        const parent = this;
        const { decision } = this.state;
        confirmAction('Publish Rule').then(function (userInput) {
            // let actionComment = userInput.value;
            if (!userInput.dismiss) {
                parent.modeler.saveXML({ format: false }, function (err, xml) {
                    if (err) {
                        return console.error('could not save BPMN 2.0 diagram', err);
                    }
                    decision.content = xml;
                    ruleService.publishRule(decision).then(resp => {
                        notifySuccess('Publish Rule', 'Rule has been successfully published');
                        parent.setState({ decision: resp });
                    }).catch(error => {
                        console.error('ruleService.publishRule:', error);
                        notifyError('Unable to publish rule', error.message);
                    });
                });
            }
        });
    }

    downloadDecision = () => {
        let propsDecisionId;
        if (this.props.decision) {
            propsDecisionId = this.props.decision.id;
        } else {
            const { decisionId } = this.props.match.params;
            propsDecisionId = decisionId;
        }

        this.modeler.saveXML({ format: true }, function (err, xml) {
            if (err) {
                console.error('DecisionModeler.exportRule:', err);
                notifyError('Unable to export rule', err.message);
            } else {
                var encodedData = encodeURIComponent(xml);
                const newAnchorTag = document.createElement('a');
                const filename = propsDecisionId + ".xml";
                newAnchorTag.setAttribute('href', 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData);
                newAnchorTag.setAttribute('download', filename);
                newAnchorTag.dataset.downloadurl = ['application/bpmn20-xml', newAnchorTag.download, newAnchorTag.href].join(':');
                notify('Export Rule', 'Rule details published for download');
                newAnchorTag.click();
            }
        });
    }

    renderPalleteEntries = () => {
        try {
            var entriesContainer = domQuery('.djs-palette-entries', this._container);
            var accordion = domQuery('#paletteAccordion', entriesContainer)
            if (!accordion) {
                accordion = domify('<div class="accordion" id="paletteAccordion"></div>');
                forEach(entriesContainer.childNodes, function (group, id) {
                    var dataGroup = group.getAttribute("data-group").replace(" ", "-");
                    var groupId = dataGroup.toLowerCase();
                    var groupName = dataGroup

                    if ('drd' === groupId) {
                        groupName = 'rule';
                    }

                    var cardBody = domQuery('#card-' + groupId + '-body', accordion);
                    if (cardBody) {
                        forEach(group.childNodes, function (groupItem, itemId) {
                            if ('tools' === groupName) {
                                if ("separator" !== groupItem.getAttribute("class")) {
                                    cardBody.appendChild(groupItem.cloneNode(true));
                                }
                            } else {
                                cardBody.appendChild(groupItem.cloneNode(true));
                            }
                        });
                    } else {
                        var card = domify('<div class="card"></div>');
                        if (["tools"].indexOf(dataGroup) >= 0) {
                            card.style.display = 'none';
                        }
                        var cardHeader = domify('<div id="card-' + groupId + '-head" class="card-header"></div>');
                        var cardButton = domify('<button class="btn btn-block text-left" data-toggle="collapse" data-target="#card-' + groupId + '-body" aria-expanded="false" aria-controls="card-' + groupId + '-body">' + groupName.replace('-', ' ') + '</button>');
                        cardButton.style = "width: calc(100% - 1px); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;";
                        cardHeader.appendChild(cardButton);
                        card.appendChild(cardHeader);
                        cardBody = domify('<div id="card-' + groupId + '-body" class="card-body collapse show" aria-labelledby="card-' + groupId + '-head" data-parent="#paletteAccordion"></div>');
                        forEach(group.childNodes, function (groupItem, itemId) {
                            if ('tools' === groupName) {
                                if ("separator" !== groupItem.getAttribute("class")) {
                                    cardBody.appendChild(groupItem.cloneNode(true));
                                }
                            } else {
                                cardBody.appendChild(groupItem.cloneNode(true));
                            }
                        });
                        card.appendChild(cardBody);
                        accordion.appendChild(card);
                    }
                });
                domClear(entriesContainer);
                entriesContainer.appendChild(accordion);
            }
        } catch (error) {
            console.warn('renderPalleteEntries', error.message);
        }
    }

    zoomIn() {
        try {
            if (this.modeler.getActiveViewer().get('canvas')) {
                this.zoomlevel += 0.1;
                this.modeler.getActiveViewer().get('canvas').zoom(this.zoomlevel);
            }
        } catch (error) {
            console.warn('Zoom is not allowed');
        }
    }

    zoomOut() {
        try {
            if (this.modeler.getActiveViewer().get('canvas')) {
                if (this.zoomlevel > 0.5) {
                    this.zoomlevel -= 0.1;
                    this.modeler.getActiveViewer().get('canvas').zoom(this.zoomlevel);
                }
            }
        } catch (error) {
            console.warn('Zoom is not allowed');
        }
    }

    zoomFit() {
        try {
            if (this.modeler.getActiveViewer().get('canvas')) {
                this.zoomlevel = 1.0;
                this.modeler.getActiveViewer().get('canvas').zoom('fit-viewport');
            }
        } catch (error) {
            console.warn('Zoom is not allowed');
        }
    }

    render = () => {
        const { decision } = this.state;

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
                                    <input id="file-import-dialog" type="file" accept=".dmn, .xml" style={{ display: 'none' }}
                                        onChange={(e) => { this.importDecision(e.target.files) }} />
                                </React.Fragment>
                            }
                            {userService.hasPermission(this.props.studioRouter, USER_ACTIONS.EXPORT) &&
                                actionButton('Download Rule', this.downloadDecision.bind(this), 'canvas-action-download')
                            }
                            {userService.hasPermission(this.props.studioRouter, USER_ACTIONS.EDIT) &&
                                actionButton('Save Rule', this.saveDecision.bind(this), 'canvas-action-save')
                            }
                            {userService.hasPermission(this.props.studioRouter, USER_ACTIONS.PUBLISH) &&
                                actionButton('Publish Rule', this.publishDecision.bind(this), 'canvas-action-publish')
                            }
                        </div>
                        <h4 className="studio-secondary mr-0">{decision ? decision.name : 'Loading....'}
                            {decision &&
                                <span className='ml-3 small'>
                                    <label className="badge badge-light m-0 p-0">{decision.version ? 'v' + decision.version : ''}</label>
                                    <label className={"ml-1 badge " + badgeStyle(decision.status || '') + " m-0 pt-1 pb-1"}>{decision.status || ''}</label>
                                    {decision.status && decision.status !== 'DRAFT' &&
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
                    <Col id="decisionContainer">
                        <div id="decisionCanvas" />
                    </Col>
                    {!this.props.decision &&
                        <Col className='pb-0'>
                            <p id='decisionDescription' className="content-description-short text-justify mb-0"></p>
                        </Col>
                    }
                </Row>
            </section>
        )
    }
}
