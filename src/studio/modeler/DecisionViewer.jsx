import React from 'react';
import { Card, CardBody, CardFooter, Row, Col } from 'reactstrap';

import DmnViewer from 'dmn-js/lib/Viewer';
import Infotip from '../utils/Infotip';

import { ruleService } from "../services/RuleService";
import { userService, USER_ACTIONS } from "../services/UserService";
import { generateUUID, actionButton, badgeStyle } from "../utils/StudioUtils";

export default class DecisionViewer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            decision: props.decision ? props.decision : { id: '0', solutionId: '0', name: 'Loading....' },
            containerId: props.decision ? props.decision.id :
                props.match && props.match.params && props.match.params.decisionId ? props.match.params.decisionId : generateUUID()
        };

        this.zoomlevel = 1.0;
        this.viewer = undefined
    }

    componentDidMount() {
        const parent = this;
        const { containerId, decision } = this.state;
        let decisionId = this.props.match && this.props.match.params ? this.props.match.params.decisionId : undefined;

        this.viewer = new DmnViewer({
            container: document.getElementById(containerId)
        });

        this.viewer.on('import.done', (event) => {
            const { error, warnings } = event;

            if (warnings && warnings.length > 0) {
                console.log('DecisionViewer :: import.done :: with.Warnings :: ', warnings);
            }

            if (error) {
                console.error('DecisionViewer :: import.done :: with.Error :: ', decision, error);
            }

            try {
                parent.zoomFit();
            } catch (error) {
                console.error('DecisionViewer :: import.done :: zoom.Error :: ', decision, error);
            }
        });

        if (decisionId) {
            ruleService.getRule(decisionId).then(resp => {
                this.setState({ decision: resp })
                this.openDiagram(resp.content);
            });
        } else if (decision) {
            this.openDiagram(decision.content);
        }
    }

    openDiagram(decisionContent) {
        this.viewer.importXML(decisionContent, (error) => {
            if (error) {
                return console.error('DecisionViewer :: import.fail :: ', decisionContent, error);
            }
        });
    }

    zoomIn() {
        try {
            if (this.viewer.getActiveViewer().get('canvas')) {
                this.zoomlevel += 0.1;
                this.viewer.getActiveViewer().get('canvas').zoom(this.zoomlevel);
            }
        } catch (error) {
            console.warn('Zoom is not allowed');
        }
    }

    zoomOut() {
        try {
            if (this.viewer.getActiveViewer().get('canvas')) {
                if (this.zoomlevel > 0.5) {
                    this.zoomlevel -= 0.1;
                    this.viewer.getActiveViewer().get('canvas').zoom(this.zoomlevel);
                }
            }
        } catch (error) {
            console.warn('Zoom is not allowed');
        }
    }

    zoomFit() {
        try {
            if (this.viewer.getActiveViewer().get('canvas')) {
                this.zoomlevel = 1.0;
                this.viewer.getActiveViewer().get('canvas').zoom('fit-viewport');
            }
        } catch (error) {
            console.warn('Zoom is not allowed');
        }
    }

    loadDecisionEditor(decisionId) {
        const { solutionId } = this.props.match.params;
        this.props.history.push(`/solutions/${solutionId}/rules/${decisionId}/editor`);
    }

    render() {
        const { containerId, decision } = this.state;
        let decisionId = this.props.match && this.props.match.params ? this.props.match.params.decisionId : undefined;

        return (
            <section>
                {!decisionId ?
                    <div id={containerId} className="text-center" />
                    :
                    <section className="studio-container">
                        <Row xs="1" md="1">
                            <Col className="text-left">
                                <div className="content-float-right mt-2">
                                    {actionButton('Zoom IN', this.zoomIn.bind(this), 'canvas-action-zoom-in')}
                                    {actionButton('Zoom OUT', this.zoomOut.bind(this), 'canvas-action-zoom-out')}
                                    {actionButton('Zoom zoomFit', this.zoomFit.bind(this), 'canvas-action-zoom-fit')}
                                    {userService.hasPermission(this.props.studioRouter, USER_ACTIONS.EDIT) &&
                                        actionButton('Define Rule', this.loadDecisionEditor.bind(this, decisionId), 'canvas-action-edit')
                                    }
                                </div>
                                <h4 className="studio-secondary mt-0 mr-0">{decision ? decision.name : 'Loading....'}
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
                            <Col className="cards-container">
                                <Card className="studio-card mb-0">
                                    <CardBody id={containerId} className="text-center pt-0 pl-2 pr-2 studio-container-full-view" />
                                    <CardFooter className="p-2">
                                        <p className="content-description-short text-justify mb-0">{decision.description || ''}</p>
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Row>
                    </section>
                }
            </section>
        );
    }
}
