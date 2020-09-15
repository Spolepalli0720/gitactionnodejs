import React, { Component } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';

import { generateUUID } from "../utils/StudioUtils";
import { inputField } from "../utils/StudioUtils";
import { actionButton, ACTION_BUTTON } from "../utils/StudioUtils";
import EnvironmentConfigData from "./EnvironmentConfigForm";

import { environmentService } from "../services/EnvironmentService";
import { notifyError } from "../utils/Notifications";
import { BasicSpinner } from '../utils/BasicSpinner';

const CLOUD_PROVIDER = {
    'AWS': { label: 'Amazon', image: require('../../assets/studio/svg/amazon-web-services.svg') },
    'Azure': { label: 'Azure', image: require('../../assets/studio/svg/azure.svg') },
    'AZURE': { label: 'Azure', image: require('../../assets/studio/svg/azure.svg') },
    'Google': { label: 'Google', image: require('../../assets/studio/svg/google.svg') },
    'GOOGLE': { label: 'Google', image: require('../../assets/studio/svg/google.svg') },
}

export default class EnvironmentConfig extends Component {
    state = {
        vpcLoading: false,
        instanceTypeLoading: false,
        nodeGroupTemplates: JSON.parse(JSON.stringify(EnvironmentConfigData.NODE_GROUP_TEMPLATES)),
        environmentConfig: JSON.parse(JSON.stringify(this.props.environmentConfig)),
        regions: this.props.regions,
    };

    componentDidMount() {
        let envConfig = this.state.environmentConfig;
        let groupTemplates = this.state.nodeGroupTemplates;

        if (this.props.mode === "edit")
            this.getFormData(envConfig.region)

        envConfig.cloudProvider = this.props.cloudProvider;

        for (const template of groupTemplates) {
            for (const ndgrp of template.nodeGroups) {
                let volOptions = ndgrp.nodeVolumeType.options;
                volOptions = this.props.volumeTypes || [];
                ndgrp.nodeVolumeType.options = volOptions;
                ndgrp.id = generateUUID();
            }
        }
        this.setState({
            nodeGroupTemplates: groupTemplates,
            envConfig: envConfig
        })
    }

    setNodeTypeOptions(nodeTypes) {
        let envConfig = this.state.environmentConfig;
        let groupTemplates = this.state.nodeGroupTemplates;

        const initializeNodeTypeOptions = (group) => {
            group.nodeTypes.options = [];
            group.nodeTypes.multiSelect = false;
            group.nodeTypes.value = "";
        }

        for (const template of groupTemplates) {
            for (const nodeGroup of template.nodeGroups) {
                if (envConfig.region === "") {
                    initializeNodeTypeOptions(nodeGroup)
                } else {
                    if (nodeGroup.groupType.value !== "") {
                        if (nodeGroup.nodeTypes.multiSelect === false) {
                            nodeGroup.nodeTypes.options = [{
                                label: "select node type",
                                value: ""
                            }].concat(nodeTypes || []);
                        } else {
                            nodeGroup.nodeTypes.options = nodeTypes || []
                        }
                    } else {
                        initializeNodeTypeOptions(nodeGroup)
                    }
                }
            }
        }

        this.setState({ nodeGroupTemplates: groupTemplates })
    }

    onNodeGroupAdd() {
        let envConfig = this.state.environmentConfig;

        let groupTemplates = this.state.nodeGroupTemplates;

        groupTemplates.filter(template => template.label.toUpperCase() === envConfig.config.nodeGroup.template)[0].nodeGroups.push({
            "id": generateUUID(),
            "groupType": {
                "title": "Group Type",
                "name": "group_type",
                "type": "select",
                "multiSelect": false,
                "placeholder": null,
                "value": "",
                "options": [
                    {
                        "label": "Select a template",
                        "value": ""
                    },
                    {
                        "label": "Fixed",
                        "value": "FIXED"
                    },
                    {
                        "label": "Scaling",
                        "value": "SCALING"
                    },
                    {
                        "label": "Spot",
                        "value": "SPOT"
                    },
                ]
            },
            "nodeTypes": {
                "title": "Node Types",
                "name": "node_type",
                "type": "select",
                "multiSelect": false,
                "placeholder": null,
                "value": "",
                "options": [],
            },
            "nodeVolumeSize": {
                "title": "Node Volume Size",
                "name": "node_vol_size",
                "type": "number",
                "id": "node_volume_size",
                "placeholder": null,
                "value": 0,
            },
            "nodeVolumeType": {
                "title": "Node Volume Type",
                "name": "node_vol_type",
                "type": "select",
                "id": "node_volume_type",
                "multiSelect": false,
                "placeholder": null,
                "value": "",
                "options": this.props.volumeTypes || [],
            },
        });

        let template = groupTemplates.filter(tmplt => tmplt.label.toUpperCase() === envConfig.config.nodeGroup.template)[0];
        envConfig.config.nodeGroup.groups = template.nodeGroups || [];

        this.setState({ nodeGroupTemplates: groupTemplates, environmentConfig: envConfig });
    }

    onNodeGroupDelete(id) {
        let envConfig = this.state.environmentConfig;
        let groupTemplates = this.state.nodeGroupTemplates;
        let group = groupTemplates.filter(groupTemplate => groupTemplate.label.toUpperCase() === envConfig.config.nodeGroup.template)[0];

        group.nodeGroups = group.nodeGroups.filter(nodeGroup => nodeGroup.id !== id);
        groupTemplates.filter(groupTemplate => groupTemplate.label.toUpperCase() === envConfig.config.nodeGroup.template)[0] = group;

        envConfig.config.nodeGroup.groups = envConfig.config.nodeGroup.groups.filter(group => group.id !== id);

        this.setState({
            environmentConfig: envConfig,
            nodeGroupTemplates: groupTemplates
        });
    }

    onChangeNodeGroup(id, name, val) {
        let envConfig = this.state.environmentConfig;
        let group = envConfig.config.nodeGroup.groups.filter(grp => grp.id === id)[0];

        group[name].value = val;

        if (name === "groupType") {
            let group = envConfig.config.nodeGroup.groups.filter(group => group.id === id)[0];
            if (group.groupType.value !== "") {
                switch (group.groupType.value) {
                    case "SPOT":
                        group.nodeTypes.multiSelect = true;
                        group.nodeTypes.value = [];
                        break;
                    default:
                        group.nodeTypes.multiSelect = false
                        group.nodeTypes.value = "";
                        break;
                }
            }
            this.setNodeTypeOptions(this.state.nodeTypes)
            for (const grp of Object.keys(group)) {
                if (grp !== "id" && grp !== "groupType" && grp !== "nodeTypes" && grp !== "nodeVolumeSize" && grp !== "nodeVolumeType") {
                    delete group[grp]
                }
            }
            Object.assign(group, JSON.parse(JSON.stringify(EnvironmentConfigData.NODE_GROUP_ITEMS[val])))
        }

        this.setState({ environmentConfig: envConfig })
    }

    onChangeNodeTemplate(template) {
        let envConfig = this.state.environmentConfig;
        envConfig.config.nodeGroup.template = template.label.toUpperCase();
        envConfig.config.nodeGroup.groups = this.state.nodeGroupTemplates.filter(groupTemplate => groupTemplate.id === template.id)[0].nodeGroups;
        this.setState({ environmentConfig: envConfig });
    }

    getInstanceTypes(region) {
        this.setState({ instanceTypeLoading: true })
        environmentService.getInstanceTypes(this.state.environmentConfig.cloudProvider.toLowerCase(), region).then(response => {
            let nodeTypes = response.InstanceTypes.map(type => {
                return {
                    label: `${type.InstanceType} - ${type.MemoryInfo.SizeInMiB / 1024} GiB, ${type.VCpuInfo.DefaultCores} Cores, ${type.VCpuInfo.DefaultVCpus} CPU`,
                    value: type.InstanceType,
                }
            })

            this.setNodeTypeOptions(nodeTypes)
            this.setState({ nodeTypes: nodeTypes, instanceTypeLoading: false })
        }).catch(error => {
            console.log("IT Error", error)
            notifyError('Unable to retrieve Instance Types', error.message);
            this.setState({ instanceTypeLoading: false })
        })
    }

    getVpcSubnets(region, mode, val) {
        let envConfig = this.state.environmentConfig;
        let VpcVal = envConfig.config.network.filter(net => net.id === "network_grp_vpc_id")[0];
        let subnets = envConfig.config.network.filter(net => net.id === "network_grp_subnets")[0];

        const initializeVPC = () => {
            VpcVal.value = "";
            VpcVal.options = [{
                label: "Select a VPC ID",
                value: "",
            }];
        }

        subnets.options = [];
        subnets.value = [];

        if (mode === "VPC") {
            if (region !== "") {
                this.setState({ vpcLoading: true })
                initializeVPC();
                environmentService.getVpcSubnets(this.state.environmentConfig.cloudProvider.toLowerCase(), region).then(response => {
                    VpcVal.options = VpcVal.options.concat(response.map(resp => {
                        return {
                            label: resp.VpcId,
                            value: resp.VpcId,
                        }
                    }))

                    envConfig.config.network.filter(net => net.id === "network_grp_vpc_id")[0].options = VpcVal.options;
                    this.setState({
                        environmentConfig: envConfig,
                        VpcResponse: response,
                        vpcLoading: false
                    })
                }).catch(error => {
                    console.log("VPC Error", error)
                    notifyError('Unable to retrieve VPC', error.message);
                    this.setState({ vpcLoading: false })
                })
            } else {
                initializeVPC()
            }
        } else if (mode === "SUBNETS" && val !== "") {
            let VPCSubnets = this.state.VpcResponse.filter(vpc => vpc.VpcId === val)[0].subnets;
            subnets.options = VPCSubnets.Subnets.map(subnet => {
                return {
                    label: subnet.SubnetId,
                    value: subnet.CidrBlock,
                }
            });

            this.setState({ environmentConfig: envConfig })
        }
    }

    getFormData(region) {
        this.getInstanceTypes(region);
        this.getVpcSubnets(region, "VPC", undefined);
    }

    onChangeInput(name, val) {
        const envConfig = this.state.environmentConfig;

        let path = name.split('.');

        if (path.length === 1) {
            envConfig[name] = val;
            if (name === "region")
                this.getFormData(val) // Send region as the argument
        } else if (path[0] === "tags") {
            let identifier = path[1].split("_");
            let tag = envConfig.tags.filter(tag => tag[identifier[1]].id === path[1])[0];
            tag[identifier[1]].value = val;
        } else {
            let configProperty;
            switch (path[0]) {
                case "gpu":
                    configProperty = envConfig.config.gpu;
                    break;
                case "network":
                    let confNetwork = envConfig.config.network;
                    configProperty = confNetwork.filter(arrayItem => arrayItem.id === path[1])[0];
                    if (path[1] === "network_grp_prvt_network" && val === false) {
                        confNetwork.filter(net => net.id === "network_grp_vpc_id")[0].value = "";
                        confNetwork.filter(net => net.id === "network_grp_subnets")[0].value = [];
                    }
                    if (path[1] === "network_grp_vpc_id") {
                        this.getVpcSubnets(envConfig.region, "SUBNETS", val)
                    }
                    break;
                default:
                    configProperty = envConfig.config[path[0]].filter(arrayItem => arrayItem.id === path[1])[0];
                    break;
            }
            configProperty.value = val;
        }
        this.setState({ environmentConfig: envConfig });
    }

    onTagAdd() {
        const envConfig = this.state.environmentConfig;
        let id = generateUUID();
        envConfig.tags.push({
            "id": id,
            "key": {
                "title": "Key",
                "id": "tags_key_" + id,
                "type": "text",
                "placeholder": null,
                "value": "",
            },
            "value": {
                "title": "Value",
                "id": "tags_value_" + id,
                "type": "text",
                "placeholder": null,
                "value": "",
            },
        })

        this.setState({ environmentConfig: envConfig })
    }

    onTagDelete(id) {
        let envConfig = this.state.environmentConfig;

        envConfig.tags = envConfig.tags.filter(tag => tag.id !== id)

        this.setState({ environmentConfig: envConfig })
    }

    onSubmitForm() {
        let envConfig = this.state.environmentConfig;
        this.setState({ submitted: true })
        if (envConfig.name !== "" && envConfig.description !== "" && envConfig.region !== "") {
            this.props.onSave(envConfig)
        }
        else {
            document.getElementById("env-field").scrollIntoView({ behavior: "smooth" });
        }
    }

    render() {
        const { environmentConfig, regions, vpcLoading, instanceTypeLoading, nodeGroupTemplates, submitted } = this.state;

        return (
            <div>
                <Row xs={1} md={1}>
                    <Col>
                        <Row xs={1} md={2} className="px-2">
                            <Col className="text-left px-0">
                                <h4 className="text-capitalize font-weight-bolder p-1">Environment</h4>
                            </Col>
                            <Col className="text-right px-0">
                                {environmentConfig.cloudProvider && environmentConfig.cloudProvider.length > 0 &&
                                    <>
                                        <img height='32px' width='32px' alt={CLOUD_PROVIDER[environmentConfig.cloudProvider].label} src={CLOUD_PROVIDER[environmentConfig.cloudProvider].image} />
                                        <label className="pl-2 font-weight-bold text-capitalize">{CLOUD_PROVIDER[environmentConfig.cloudProvider].label}</label>
                                    </>
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Card className="studio-card">
                                    <CardBody>
                                        <Row>
                                            <Col xs={12} md={6}>
                                                {inputField("select", "region", "Region", environmentConfig.region || "", this.onChangeInput.bind(this), { required: true }, regions, "env_region")}
                                                {submitted && environmentConfig.region === "" && <label className="text-danger">Region is required</label>}
                                            </Col>
                                            <Col xs={12} md={6}>
                                                {inputField("text", "name", "Name", environmentConfig.name, this.onChangeInput.bind(this), { required: true }, undefined, "env_name")}
                                                {submitted && environmentConfig.name === "" && <label className="text-danger">Name is required</label>}
                                            </Col>
                                            <Col xs={12}>
                                                {inputField("textarea", "description", "Description", environmentConfig.description, this.onChangeInput.bind(this), { input: 'component-stretched', required: true, textareaRows: 4 }, undefined, "env_desc")}
                                                {submitted && environmentConfig.description === "" && <label className="text-danger">Description is required</label>}
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Row xs={1} md={2} className="px-2">
                            <Col className="text-left px-0">
                                <h4 className="text-capitalize font-weight-bolder p-1">Configuration</h4>
                            </Col>
                            <Col className="text-right px-0">
                                {inputField(environmentConfig.config["gpu"].type, environmentConfig.config["gpu"].name, environmentConfig.config["gpu"].title, environmentConfig.config["gpu"].value, this.onChangeInput.bind(this), { label: 'switch-label', input: 'switch-input', switchHeight: 15, switchWidth: 15 }, undefined, environmentConfig.config["gpu"].id)}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Card className="studio-card">
                                    <CardBody>
                                        {Object.keys(environmentConfig.config).map((config, configIndex) =>
                                            config !== 'gpu' &&
                                            <div key={configIndex}>
                                                <Row xs={1}>
                                                    <Col>
                                                        <Row xs={2}>
                                                            <Col className="text-left">
                                                                <h5 className="text-capitalize font-weight-bolder p-1">{config}</h5>
                                                            </Col>
                                                            {config !== "nodeGroup" &&
                                                                <Col className="text-right">
                                                                    {environmentConfig.config[config].map((cfg, cfgIndex) =>
                                                                        <div key={cfgIndex}>
                                                                            {cfg.type === "switch" &&
                                                                                inputField("switch", config + "." + cfg.id, cfg.title, cfg.value, this.onChangeInput.bind(this), { label: 'switch-label', input: 'switch-input', switchHeight: 15, switchWidth: 15 }, undefined, cfg.id)}
                                                                        </div>
                                                                    )}
                                                                </Col>
                                                            }
                                                        </Row>
                                                    </Col>
                                                    <Col>
                                                        {config === "nodeGroup" && <>
                                                            <Row xs={1} md={4}>
                                                                {nodeGroupTemplates.map((tempObj, tempObjIndex) =>
                                                                    <Col key={tempObjIndex}>
                                                                        <Card className="studio-card">
                                                                            <CardBody>
                                                                                <Row className="text-center" xs={1}>
                                                                                    <Col>
                                                                                        <h4>{tempObj.label}</h4>
                                                                                    </Col>
                                                                                    <Col>
                                                                                        <p>{tempObj.description}</p>
                                                                                    </Col>
                                                                                    <Col>
                                                                                        {inputField("checkbox", tempObj.label, tempObj.label, tempObj.label.toUpperCase() === environmentConfig.config.nodeGroup.template, this.onChangeNodeTemplate.bind(this, tempObj), {}, undefined, tempObj.id)}
                                                                                    </Col>
                                                                                </Row>
                                                                            </CardBody>
                                                                        </Card>
                                                                    </Col>
                                                                )}
                                                            </Row>
                                                            {environmentConfig.config.nodeGroup.groups && environmentConfig.config.nodeGroup.groups.map((group, groupIndex) =>
                                                                <div className="node-group-container my-3 p-2" key={groupIndex}>
                                                                    <Row>
                                                                        <Col className="pt-0">
                                                                            {environmentConfig.config.nodeGroup.template === "CUSTOM" && <h5 className="pt-2">Group {groupIndex + 1}</h5>}
                                                                            {environmentConfig.config.nodeGroup.template !== "CUSTOM" && <h5 className="pt-2">{environmentConfig.config.nodeGroup.template} Scale Node Group</h5>}
                                                                        </Col>
                                                                        <Col className="pt-0">
                                                                            {environmentConfig.config.nodeGroup.template === "CUSTOM" && actionButton('Remove Group', () => this.onNodeGroupDelete(group.id),
                                                                                'ml-1 content-float-right fa-2x', 'feather icon-x-circle')}
                                                                        </Col>
                                                                    </Row>
                                                                    <Row xs={1} md={3}>
                                                                        {Object.keys(group).map((grp, grpIndex) =>
                                                                            grp !== "id" &&
                                                                            <Col key={grpIndex}>
                                                                                {inputField(group[grp].type, grp, group[grp].title, group[grp].value, this.onChangeNodeGroup.bind(this, group.id), { selectMultiple: group[grp].multiSelect, disabled: environmentConfig.config.nodeGroup.template !== "CUSTOM" }, group[grp].options || undefined, group[grp].id)}
                                                                            </Col>
                                                                        )}
                                                                        {instanceTypeLoading &&
                                                                            <Col className="pt-4">
                                                                                <BasicSpinner />
                                                                            </Col>
                                                                        }
                                                                    </Row>
                                                                </div>
                                                            )}
                                                            <Row xs={1}>
                                                                {environmentConfig.config.nodeGroup.template === "CUSTOM" && <Col className="text-right">
                                                                    {actionButton('Node Group', () => this.onNodeGroupAdd(),
                                                                        '', 'feather icon-plus', true, false, ACTION_BUTTON.PRIMARY)}
                                                                </Col>}
                                                            </Row>
                                                        </>
                                                        }
                                                        {config !== "nodeGroup" && <Row xs={1} md={3}>
                                                            {environmentConfig.config[config].map((configItem, configItemIndex) =>
                                                                configItem.type !== "switch" &&
                                                                <Col key={configItemIndex}>
                                                                    {inputField(configItem.type, config + "." + configItem.id, configItem.title, configItem.value, this.onChangeInput.bind(this),
                                                                        {
                                                                            disabled: config === "logging" ? configItem.id === "logs_enable_types" && environmentConfig.config.logging.filter(log => log.id === "logs_enable")[0].value === false : config === "network" ? (configItem.id === "network_grp_vpc_id" || configItem.id === "network_grp_subnets") && environmentConfig.config.network.filter(log => log.id === "network_grp_prvt_network")[0].value === false : false,
                                                                            selectMultiple: configItem.multiSelect || false,
                                                                        },
                                                                        configItem.options || undefined, configItem.id)}
                                                                </Col>
                                                            )}
                                                            <Col>
                                                                {vpcLoading && config === "network" &&
                                                                    <Row className="pt-4">
                                                                        <Col className="tag-add-button">
                                                                            <BasicSpinner />
                                                                        </Col>
                                                                    </Row>
                                                                }
                                                            </Col>
                                                        </Row>
                                                        }
                                                    </Col>
                                                </Row>
                                                {configIndex + 1 < Object.keys(environmentConfig.config).length && <hr />}
                                            </div>
                                        )}
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row xs={1} md={1}>
                    <Col>
                        <Row>
                            <h4 className="text-capitalize font-weight-bolder p-1">Tags</h4>
                        </Row>
                    </Col>
                    <Col>
                        <Card className="studio-card">
                            <CardBody>
                                <Row xs={1} md={1}>
                                    {environmentConfig.tags.map((tag, tagIndex) =>
                                        <Col key={tagIndex}>
                                            <Row>
                                                <Col>
                                                    {inputField(tag.key.type, "tags." + tag.key.id, tag.key.title, tag.key.value, this.onChangeInput.bind(this), { label: 'component-stretched', input: 'component-stretched' }, undefined, tag.key.id)}
                                                </Col>
                                                <Col>
                                                    {inputField(tag.value.type, "tags." + tag.value.id, tag.value.title, tag.value.value, this.onChangeInput.bind(this), { label: 'component-stretched', input: 'component-stretched' }, undefined, tag.value.id)}
                                                </Col>
                                                <Col xs="1" className={`${tagIndex + 1 === environmentConfig.tags.length ? "p-0 py-4" : "p-0 py-4"} tag-add-button`}>
                                                    {tagIndex + 1 < environmentConfig.tags.length &&
                                                        actionButton('Remove Tag', () => this.onTagDelete(tag.id),
                                                            'mt-2 fa-2x', 'feather icon-x-circle')
                                                    }
                                                    {tagIndex + 1 === environmentConfig.tags.length &&
                                                        actionButton('Add Tag', () => this.onTagAdd(),
                                                            'mt-2', 'fas fa-plus')
                                                    }
                                                </Col>
                                            </Row>
                                        </Col>
                                    )}
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row xs={1} md={1}>
                    <Col className="text-right">
                        {actionButton('Save Environment', this.onSubmitForm.bind(this),
                            '', '', true, false, ACTION_BUTTON.PRIMARY)}
                    </Col>
                </Row>
            </div>
        );
    }
}