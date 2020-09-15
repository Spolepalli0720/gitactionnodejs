import React from 'react';
import { Card, CardBody, CardFooter, Row, Col } from 'reactstrap';
import StudioNavigator from './StudioNavigator';
import StudioViewer from './StudioViewer';
import Infotip from '../utils/Infotip';

import { ruleService } from "../services/RuleService";
import { userService, USER_ACTIONS } from "../services/UserService";
import { generateUUID, actionButton, badgeStyle } from "../utils/StudioUtils";

export default class RuleViewer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            rule: props.rule ? props.rule : { id: '0', solutionId: '0', name: 'Loading....' },
            containerId: props.rule ? props.rule.id :
                props.match && props.match.params && props.match.params.ruleId ? props.match.params.ruleId : generateUUID()
        };

        this.zoomlevel = 1.0;
        this.viewer = undefined
    }

    componentDidMount() {
        const { containerId, rule } = this.state;
        let ruleId = this.props.match && this.props.match.params ? this.props.match.params.ruleId : undefined;

        const ModelerComponent = ruleId ? StudioNavigator : StudioViewer;
        this.viewer = new ModelerComponent({
            studioType: 'RULEFLOW',
            canvasContainer: document.getElementById(containerId),
        });

        if (ruleId) {
            ruleService.getRule(ruleId).then(response => {
                this.setState({ rule: response })
                this.openDiagram(response);
            });
        } else if (rule) {
            this.openDiagram(rule);
        }
    }

    openDiagram(rule) {
        this.viewer.importXML(rule.content).then(response => {
            if (response.warnings && response.warnings.length > 0) {
                console.log('RuleViewer :: importXML with.Warnings', rule.name, response.warnings);
            }
            try {
                this.zoomFit();
            } catch (error) {
                console.error('RuleViewer :: importXML :: zoom.Error :: ', rule.name, error);
            }
        }).catch(error => {
            console.error('RuleViewer :: importXML', rule.name, error);
        });
    }

    zoomIn() {
        this.zoomlevel += 0.1;
        this.viewer.get('canvas').zoom(this.zoomlevel);
    }

    zoomOut() {
        if (this.zoomlevel > 0.5) {
            this.zoomlevel -= 0.1;
            this.viewer.get('canvas').zoom(this.zoomlevel);
        }
    }

    zoomFit() {
        this.zoomlevel = 1.0;
        this.viewer.get('canvas').zoom('fit-viewport');
    }

    loadRuleEditor(ruleId) {
        const { solutionId } = this.props.match.params;
        this.props.history.push(`/solutions/${solutionId}/rules/${ruleId}/editor`);
    }

    render() {
        const { containerId, rule } = this.state;
        let ruleId = this.props.match && this.props.match.params ? this.props.match.params.ruleId : undefined;

        return (
            <section>
                {!ruleId ?
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
                                        actionButton('Define Rule', this.loadRuleEditor.bind(this, ruleId), 'canvas-action-edit')
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
                            <Col className="cards-container">
                                <Card className="studio-card mb-0">
                                    <CardBody id={containerId} className="text-center pt-0 pl-2 pr-2 studio-container-full-view" />
                                    <CardFooter className="p-2">
                                        <p className="content-description-short text-justify mb-0">{rule.description || ''}</p>
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
