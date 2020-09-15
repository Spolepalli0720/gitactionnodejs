import React, { Component } from "react";
import { Row, Col, Card, CardBody, CardFooter, Modal, ModalBody, ModalHeader } from 'reactstrap';
import Timestamp from "react-timestamp";
// import { ProgressBar } from 'react-bootstrap';

import Tooltip from '../utils/Tooltip';
import StudioFilter from '../utils/StudioFilter';
import StudioTable from '../utils/StudioTable';
import { confirmDelete, actionButton, ACTION_BUTTON, generateUUID } from "../utils/StudioUtils";
import { notify, notifySuccess, notifyError } from "../utils/Notifications";
import { BasicSpinner } from "../utils/BasicSpinner";

import { environmentService } from "../services/EnvironmentService";
import environmentConfigForm from "./EnvironmentConfigForm";

import EnvironmentConfig from "./EnvironmentConfig";

import './Environments.scss';

const ENVIRONMENT_TYPE = {
    'INTEGRATION': { label: 'Integration', image: require('../../assets/studio/svg/blue-integration.svg') },
    'AIPOWERED': { label: 'AI Powered', image: require('../../assets/studio/svg/blue-ai-powered.svg') },
    'FUSION': { label: 'Cognitive Fusion', image: require('../../assets/studio/svg/blue-sensor-fabric.svg') },
    'FABRIC': { label: 'Fabric', image: require('../../assets/studio/svg/blue-cognitive-fusion.svg') }
};
const CLOUD_PROVIDER = {
    'AWS': { label: 'Amazon', image: require('../../assets/studio/svg/amazon-web-services.svg') },
    'Azure': { label: 'Azure', image: require('../../assets/studio/svg/azure.svg') },
    'AZURE': { label: 'Azure', image: require('../../assets/studio/svg/azure.svg') },
    'Google': { label: 'Google', image: require('../../assets/studio/svg/google.svg') },
    'GOOGLE': { label: 'Google', image: require('../../assets/studio/svg/google.svg') },
};

class Environments extends Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            loadingRegions: false,
            loadingVolumeTypes: false,
            renderLayout: 0,
            filteredData: [],
            environments: [],
            environmentConfig: JSON.parse(JSON.stringify(environmentConfigForm.DATA_INPUT_FORM)),

            renderForm: 0,
        };
    }

    componentDidMount() {
        const parent = this;
        environmentService.getEnvironments().then(response => {
            let environments = response.filter(environment => environment.status !== 'ARCHIVED').sort((a, b) => a.status.localeCompare(b.status));
            this.setState({ loading: false, environments: environments });
        }).catch(error => {
            parent.setState({ loading: false });
            console.error('environmentService.getEnvironments:', error);
            notifyError('Unable to retrieve Environments', error.message);
        });
    }

    onChangeFilter(filteredData) {
        this.setState({ filteredData: filteredData })
    }

    loadEnvironmentDashboard(environment) {
        this.props.history.push(`/environments/${environment.id}/dashboard`)
    }

    initiateCreateEnvironment() {
        this.setState({ showModal: true, mode: 'new', renderForm: 0 })
    }

    createEnvironment(cloud) {
        this.setState({
            environmentConfig: JSON.parse(JSON.stringify(environmentConfigForm.DATA_INPUT_FORM)),
            loadingRegions: true,
            loadingVolumeTypes: true,
            showModal: false,
            renderForm: 1,
            cloudProvider: cloud,
        })
        this.getRegions(cloud)
        this.getVolumeTypes(cloud)
    }

    editEnvironment(environment) {
        let environmentConfig = this.state.environmentConfig;

        this.setState({ loadingRegions: true, loadingVolumeTypes: true })

        let tags = Object.keys(environment.tags).map(tag => {
            let tagId = generateUUID();
            return {
                "id": tagId,
                "key": {
                    "id": "tags_key_" + tagId,
                    "placeholde": null,
                    "title": "Key",
                    "type": "text",
                    "value": tag,
                },
                "value": {
                    "id": "tags_value_" + tagId,
                    "placeholde": null,
                    "title": "Key",
                    "type": "text",
                    "value": environment.tags[tag],
                },
            }
        });

        environmentConfig.name = environment.name.trim() || "";
        environmentConfig.id = environment.id;
        environmentConfig.cloudProvider = environment.cloudProvider || "AWS";
        environmentConfig.description = environment.description.trim() || "";
        environmentConfig.config.nodeGroup.template = environment.template || "";
        environmentConfig.region = environment.region || "";
        environmentConfig.tags = tags || [];

        this.getRegions(environment.cloudProvider === "string" ? "Google" : environment.cloudProvider)
        this.getVolumeTypes(environment.cloudProvider)

        this.setState({
            cloudProvider: environment.cloudProvider,
            environmentConfig: environmentConfig,
            mode: 'edit',
            renderForm: 1,
        })
    }

    saveEnvironment(environment) {
        let tags = {};
        let groups = [];

        for (const tag of environment.tags)
            tags[tag.key.value] = tag.value.value

        for (const group of environment.config.nodeGroup.groups) {
            let tempGrp = {};
            for (const grp of Object.keys(group)) {
                if (grp !== "id") {
                    tempGrp[grp] = group[grp].value
                }
            }
            groups.push(tempGrp)
            tempGrp = {};
        }

        let environmentConfig = {
            "createdBy": "rahulyadav@digitaldots.ai",
            "modifiedBy": "rahulyadav@digitaldots.ai",
            "createdAt": 0,
            "modifiedAt": 0,
            "id": "string",
            "cloudProvider": environment.cloudProvider || "AWS",
            "status": "NEW",
            "name": environment.name.trim(),
            "description": environment.description.trim(),
            "config": {
                "gpu": environment.config.gpu.value || false,
                "logging": {
                    "enabled": environment.config.logging[0].value || 0,
                    "values": environment.config.logging[1].value || 0,
                },
                "network": {
                    "privateNetworking": environment.config.network[0].value || false,
                    "VpcId": environment.config.network[1].value || 0,
                    "subnets": environment.config.network[2].value || 0,
                },
                "nodeGroup": {
                    "template": environment.config.nodeGroup.template || "CUSTOM",
                    "groups": groups || [],
                },
                "security": {
                    "IamRole": environment.config.security[0].value || "",
                    "AddOns": environment.config.security[1].value || [],
                }
            },
            "template": environment.config.nodeGroup.template,
            "region": environment.region,
            "tags": tags,
            "version": "1.0",
            "disabled": true
        };

        if (this.state.mode === "new") {
            environmentService.createEnvironment(environmentConfig).then(response => {
                let environments = this.state.environments;
                environments.push(response)
                notifySuccess('Save Environment', 'Environment has been successfully saved');
                this.setState({ renderForm: 0, environments: environments })
            }).catch(error => {
                console.error('environmentService.saveEnvironment:', error);
                notifyError('Unable to Save Environment', error.message);
            })
        } else if (this.state.mode === "edit") {
            console.log("EDITED ENVIRONMENT", environmentConfig)
            this.setState({ renderForm: 0 })
        }
    }

    deleteEnvironment(environmentId) {
        const parent = this;
        const { environments } = this.state;
        confirmDelete().then(function (userInput) {
            if (!userInput.dismiss) {
                environmentService.deleteEnvironment(environmentId).then(response => {
                    notifySuccess('Delete Environment', 'Environment has been permanently removed');
                    // let environment = environments.filter(environment => environment.id === environmentId)[0];
                    // environment.status = "ARCHIVED";
                    let envs = environments.filter(environment => environment.id !== environmentId)
                    parent.setState({ environments: envs })
                }).catch(error => {
                    console.error('environmentService.deletEnvironment:', error);
                    notifyError('Unable to delete Environment', error.message);
                })
            }
        });
    }

    exportEnvironment(environmentId) {
        const { environments } = this.state;
        let environment = environments.filter(environment => environment.id === environmentId)[0];
        var encodedData = encodeURIComponent(JSON.stringify(environment));
        const newAnchorTag = document.createElement('a');
        const filename = environment.id + ".json";
        newAnchorTag.setAttribute('href', 'data:application/json;charset=UTF-8,' + encodedData);
        newAnchorTag.setAttribute('download', filename);
        newAnchorTag.dataset.downloadurl = ['application/json', newAnchorTag.download, newAnchorTag.href].join(':');
        notify('Export environment', 'environment details published for download');
        newAnchorTag.click();
    }

    getRegions(cloud) {
        let regions = [];
        environmentService.getRegions(cloud.toLowerCase()).then(response => {
            let zone= response.AvailabilityZones.map(zoneItem=>zoneItem.GroupName).filter((filterItem,filterIndex,filterarray)=>filterarray.indexOf(filterItem)===filterIndex);
            regions = [{
                label: "Select a region",
                value: "",
            }].concat(zone.map(zoneItem => {
                return {
                    label: zoneItem,
                    value: zoneItem,
                }
            }));
            this.setState({ regions: regions })
            this.setState({ loadingRegions: false })
        }).catch(error => {
            console.error('EnvironmentService.getRegions:', error);
            notifyError('Unable to retrieve Regions', error.message);
            this.setState({ loadingRegions: false })
        })
    }

    getVolumeTypes(cloud) {
        let volumeTypes = [];
        environmentService.getVolumeTypes(cloud.toLowerCase()).then(response => {
            volumeTypes = Object.entries(response).map(vol => {
                return {
                    label: vol[1],
                    value: vol[0],
                }
            })
            this.setState({ volumeTypes: volumeTypes })
            this.setState({ loadingVolumeTypes: false })
        }).catch(error => {
            console.error('EnvironmentService.getVolumeTypes:', error);
            notifyError('Unable to retrieve Volume Types', error.message);
            this.setState({ loadingVolumeTypes: false })
        })
    }

    getBadgeType(status) {
        if ("ACTIVE" === status) {
            return "badge-primary";
        } else if ("NEW" === status) {
            return "badge-secondary";
        } else if ("DRAFT" === status) {
            return "badge-secondary";
        } else if ("APPROVED" === status) {
            return "badge-success";
        } else if ("PENDING" === status) {
            return "badge-info";
        } else if ("DISABLED" === status) {
            return "badge-warning";
        } else if ("ARCHIVED" === status) {
            return "badge-danger";
        } else {
            return "badge-dark";
        }
    }

    render() {
        const { loading, loadingRegions, loadingVolumeTypes, renderLayout, environments, filteredData, showModal, renderForm, regions } = this.state;
        const toggle = () => this.setState({ showModal: false });

        const tableHeader = [
            { label: 'Name', key: 'name' },
            { label: 'Description', key: 'description' },
            { label: 'Tags', key: 'tags' },
            { label: 'Status', key: 'status' },
            { label: 'Version', key: 'version' }
        ];

        let searchKeys = ['name', 'id'];

        let filterKeys = [
            { label: 'Name', key: 'name' },
            { label: 'ID', key: 'id' },
        ];

        const cloudProvidersList = ["AWS", "Azure", "Google"];

        return (
            <section className="studio-container" >
                {loading &&
                    <Card>
                        <CardBody>
                            <BasicSpinner />
                        </CardBody>
                    </Card>
                }
                {!loading && renderForm === 0 && <>
                    <Row xs="1" md="1">
                        <Col className="text-left mt-0">
                            {actionButton('Create', this.initiateCreateEnvironment.bind(this),
                                'ml-1 content-float-right', 'feather icon-plus', true, false, ACTION_BUTTON.PRIMARY)}

                            <StudioFilter
                                searchKeys={searchKeys}
                                filterKeys={filterKeys}
                                data={environments}
                                onChangeFilter={this.onChangeFilter.bind(this)} />

                            {renderLayout === 0 &&
                                actionButton('List View', () => { this.setState({ renderLayout: 1 }) },
                                    'm-0 mt-1 content-float-right', 'feather icon-list')
                            }
                            {renderLayout === 1 &&
                                actionButton('Grid View', () => { this.setState({ renderLayout: 0 }) },
                                    'm-0 mt-1 content-float-right', 'feather icon-grid')
                            }
                            <h3 className="pt-1">{'Environments' +
                                (environments.length > 0 ?
                                    ` (${environments.length})` : '')}
                            </h3>
                        </Col>
                    </Row>
                    {renderLayout === 0 &&
                        <Row xs="1" md="3">
                            {filteredData.map((environment, environmentIndex) =>
                                <Col className="cards-container" key={environmentIndex + 1}>
                                    <Card className="studio-card mb-1">
                                        <CardBody className="p-0">
                                            <Row xs="1" md="1">
                                                <Col className="text-left pb-0">
                                                    <Tooltip title='Version'>
                                                        <label className="p-0 mt-0 mb-0 badge badge-light solution-info-badge content-float-right">v1.0</label>
                                                    </Tooltip>
                                                    <img height='16px' width='16px' src={ENVIRONMENT_TYPE["INTEGRATION"].image} alt={ENVIRONMENT_TYPE["INTEGRATION"].label} />
                                                    <span className='ml-1 mb-0'>{ENVIRONMENT_TYPE["INTEGRATION"].label}</span>
                                                    <span><i className="studio-primary feather icon-crosshair ml-2" /> <span>{"Template name"}</span></span>
                                                </Col>
                                            </Row>
                                            <Row xs="1" md="1">
                                                <Col className="text-left pt-0 pb-0">
                                                    {environment.status === 'ACTIVE' &&
                                                        <Tooltip title="Deactivate Environment">
                                                            <i className='p-0 mt-0 ml-1 feather icon-pause-circle fa-2x studio-secondary content-float-right btn' />
                                                        </Tooltip>
                                                    }
                                                    {environment.status === 'DISABLED' &&
                                                        <Tooltip title="Activate Environment">
                                                            <i className='p-0 mt-0 ml-1 feather icon-check-circle fa-2x studio-primary content-float-right btn' />
                                                        </Tooltip>
                                                    }
                                                    <h5 className="mt-0 mr-0 environment-name">{environment.name}</h5>
                                                </Col>
                                                <Col className="text-left pt-0 pb-0 badge-status-ellipsis">
                                                    <h5 className="mt-0 mr-0">
                                                        <span className="badge badge-light-secondary pl-0 mr-0"
                                                            title={'Created by ' + environment.createdBy}>
                                                            <label className={"mr-1 badge " + this.getBadgeType(environment.status || '') + " mb-0 pull-left"}>
                                                                {environment.status || ''}
                                                            </label>
                                                            <Timestamp relative date={environment.modifiedAt || environment.createdAt} /> by {environment.modifiedBy}
                                                        </span>
                                                    </h5>
                                                </Col>
                                                <Col className="text-center pt-0 pb-0">
                                                    {actionButton('Export', () => this.exportEnvironment(environment.id),
                                                        'mt-1 ml-1 mr-2', 'feather icon-download', true)}
                                                    {actionButton('Delete', () => this.deleteEnvironment(environment.id),
                                                        'mt-1 ml-1 mr-2', 'feather icon-trash-2', true)}
                                                    {actionButton('Configure', () => this.editEnvironment(environment),
                                                        'mt-1 ml-1 mr-2', 'feather icon-edit', true)}
                                                    {actionButton('History', () => { console.log("History") },
                                                        'mt-1 ml-1 mr-2', 'fa fa-history', true)}
                                                </Col>
                                            </Row>
                                            <Row xs="1" md="1" className='mb-1'>
                                                <Col>
                                                    <p className="content-description text-justify mb-0 pt-1 pb-1 pl-1 pr-3">{environment.description}</p>
                                                </Col>
                                                <Col className="text-left pt-0 pb-0">
                                                    <h5 className="mt-0">
                                                        {Object.keys(environment.tags).map((tag, tagIndex) =>
                                                            <span key={tagIndex} className="key-tag-item">{environment.tags[tag] || ''}</span>
                                                        )}
                                                    </h5>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                        <CardFooter className="p-0">
                                            <Row xs="1" md="3">
                                                <Col className="text-left">
                                                    <img className='mt-0' height='32px' width='32px' alt={CLOUD_PROVIDER[environment.cloudProvider].title} src={CLOUD_PROVIDER[environment.cloudProvider].image} />
                                                </Col>
                                                <Col className="text-center">
                                                    {actionButton('Environment Dashboard', () => this.loadEnvironmentDashboard(environment),
                                                        'mt-2 mb-2 ml-2 mr-1', 'fa fa-chart-bar')}
                                                    {actionButton('Environment Tasks', () => { console.log("Environment Tasks") },
                                                        'mt-2 mb-2 ml-2 mr-1', 'fa fa-tasks')}
                                                </Col>
                                                <Col className="text-right pt-1 pb-0">
                                                    <Tooltip title="Explore">
                                                        <button className='btn p-0 mt-2 mb-2 ml-1 mr-0'
                                                            onClick={() => { console.log("Explore") }} >
                                                            <span className='align-top'>Explore</span>
                                                            <i className='studio-primary feather icon-chevrons-right icon-explore-right' />
                                                        </button>
                                                    </Tooltip>
                                                </Col>
                                            </Row>
                                        </CardFooter>
                                    </Card>
                                </Col>
                            )}
                        </Row>
                    }
                    {renderLayout === 1 &&
                        <StudioTable customClass="p-0"
                            hideTableName={true}
                            hideTableSearch={true}
                            tableHeader={tableHeader}
                            tableData={filteredData}
                            // createAction={this.initiateCreateEnvironment.bind(this)}
                            // createLabel={'Create'}
                            defaultSort={{ sortIndex: 4, sortOrder: 0 }}
                            searchKeys={searchKeys}
                            filterKeys={filterKeys}
                        />
                    }
                </>
                }
                {renderForm === 1 &&
                    <div>
                        {loadingRegions && loadingVolumeTypes &&
                            <Card>
                                <CardBody>
                                    <BasicSpinner />
                                </CardBody>
                            </Card>
                        }
                        {!loadingRegions && !loadingVolumeTypes &&
                            <>
                                <Row>
                                    <Col>
                                        <h3 className="pt-1">
                                            {this.state.mode === 'new' && 'Add Environment'}
                                            {this.state.mode === 'edit' && 'Update Environment'}
                                        </h3>
                                    </Col>
                                    <Col>
                                        {actionButton('Cancel', () => this.setState({
                                            renderForm: 0,
                                            cloudProvider: "",
                                            regions: [],
                                            volumeTypes: [],
                                        }),
                                            'ml-1 mr-2 content-float-right fa-2x', 'feather icon-x-circle')}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col id="env-field" className="px-0">
                                        <EnvironmentConfig
                                            environmentConfig={this.state.environmentConfig}
                                            mode={this.state.mode}
                                            cloudProvider={this.state.cloudProvider}
                                            regions={regions}
                                            volumeTypes={this.state.volumeTypes}
                                            onSave={(environmentConfig) => this.saveEnvironment(environmentConfig)}
                                        />
                                    </Col>
                                </Row>
                            </>
                        }
                    </div>
                }
                <Modal centered size={'xl'} isOpen={showModal}>
                    <ModalHeader toggle={toggle} className="p-3">
                        {this.state.mode === 'new' && 'Select Provider'}
                        {this.state.mode === 'edit' && 'Update Environment'}
                    </ModalHeader>
                    <ModalBody>
                        <Row xs={3} md={3}>
                            {cloudProvidersList.map((cld, cldIndex) =>
                                <Col key={cldIndex}>
                                    <Card className="cloud-provider-card"
                                        onClick={() => this.createEnvironment(cld)}>
                                        <CardBody>
                                            <Row>
                                                <Col sm="auto" className="text-center">
                                                    <img height='32px' width='32px' alt={CLOUD_PROVIDER[cld].title} src={CLOUD_PROVIDER[cld].image} />
                                                </Col>
                                                <Col>
                                                    <h4>{cld}</h4>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                            )}
                        </Row>
                    </ModalBody>
                </Modal>
            </section >
        );
    }
}
export default Environments;
