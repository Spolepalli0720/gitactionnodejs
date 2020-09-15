module.exports.DATA_INPUT_FORM = {
    "name": "",
    "description": "",
    "cloudProvider": "",
    "region": "",
    "config": {
        "gpu": {
            "title": "GPU",
            "id": "config_gpu",
            "name": "gpu.config_gpu",
            "type": "switch",
            "placeholder": null,
            "value": false,
        },
        "nodeGroup": {
            "template": "CUSTOM",
            "groups": [],
        },
        "network": [
            {
                "title": "Private Networking",
                "id": "network_grp_prvt_network",
                "type": "switch",
                "placeholder": null,
                "value": false,
            },
            {
                "title": "VPC ID",
                "id": "network_grp_vpc_id",
                "type": "select",
                "multiSelect": false,
                "placeholder": null,
                "value": "",
                "options": [
                    {
                        "label": "Select a VPC ID",
                        "value": ""
                    }
                ]
            },
            {
                "title": "Subnets",
                "id": "network_grp_subnets",
                "type": "select",
                "multiSelect": true,
                "placeholder": null,
                "value": [],
                "options": []
            },
        ],
        "security": [
            {
                "title": "IAM Role",
                "id": "sec_grp_role",
                "type": "text",
                "placeholder": null,
                "value": "",
            },
            {
                "title": "Add Ons",
                "id": "sec_grp_add_ons",
                "type": "select",
                "multiSelect": true,
                "placeholder": null,
                "value": [],
                "options": [
                    {
                        "label": "External DNS",
                        "value": "EXTERNAL_DNS"
                    },
                    {
                        "label": "ALB Ingress",
                        "value": "ALB_INGRESS"
                    },
                    {
                        "label": "Auto Scaler",
                        "value": "AUTO_SCALER"
                    },
                    {
                        "label": "Cloud Watch",
                        "value": "CLOUD_WATCH"
                    },
                ]
            },
        ],
        "logging": [
            {
                "title": "Enable",
                "id": "logs_enable",
                "type": "switch",
                "placeholder": null,
                "value": false,
            },
            {
                "title": "Enable Types",
                "id": "logs_enable_types",
                "type": "select",
                "multiSelect": true,
                "placeholder": null,
                "value": [],
                "options": [
                    {
                        "label": "Test",
                        "value": "TEST",
                    },
                ]
            },
        ],
    },
    "tags": [
        {
            "id": 1,
            "key": {
                "title": "Key",
                "id": "tags_key_1",
                "type": "text",
                "placeholder": null,
                "value": "",
            },
            "value": {
                "title": "Value",
                "id": "tags_value_1",
                "type": "text",
                "placeholder": null,
                "value": "",
            },
        },
    ],
};

module.exports.NODE_GROUP_TEMPLATES = [
    {
        "label": "Small",
        "id": "template_small",
        "description": "Create a small node group",
        "value": false,
        "nodeGroups": [
            {
                "id": 1,
                "groupType": {
                    "title": "Group Type",
                    "name": "group_type",
                    "type": "select",
                    "multiSelect": false,
                    "placeholder": null,
                    "value": "FIXED",
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
                    "value": "t1.micro",
                    "options": [],
                },
                "nodeVolumeSize": {
                    "title": "Node Volume Size",
                    "name": "node_vol_size",
                    "type": "number",
                    "id": "node_volume_size",
                    "placeholder": null,
                    "value": 1,
                },
                "nodeVolumeType": {
                    "title": "Node Volume Type",
                    "name": "node_vol_type",
                    "type": "select",
                    "id": "node_volume_type",
                    "multiSelect": false,
                    "placeholder": null,
                    "value": "gp2",
                    "options": [],
                },
            }
        ]
    },
    {
        "label": "Medium",
        "id": "template_medium",
        "description": "Create a medium node group",
        "value": false,
        "nodeGroups": [
            {
                "id": 2,
                "groupType": {
                    "title": "Group Type",
                    "name": "group_type",
                    "type": "select",
                    "multiSelect": false,
                    "placeholder": null,
                    "value": "FIXED",
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
                    "value": "r6g.medium",
                    "options": [],
                },
                "nodeVolumeSize": {
                    "title": "Node Volume Size",
                    "name": "node_vol_size",
                    "type": "number",
                    "id": "node_volume_size",
                    "placeholder": null,
                    "value": 4,
                },
                "nodeVolumeType": {
                    "title": "Node Volume Type",
                    "name": "node_vol_type",
                    "type": "select",
                    "id": "node_volume_type",
                    "multiSelect": false,
                    "placeholder": null,
                    "value": "scl",
                    "options": [],
                },
            }
        ]
    },
    {
        "label": "Large",
        "id": "template_large",
        "description": "Create a large node group",
        "value": false,
        "nodeGroups": [
            {
                "id": 3,
                "groupType": {
                    "title": "Group Type",
                    "name": "group_type",
                    "type": "select",
                    "multiSelect": false,
                    "placeholder": null,
                    "value": "FIXED",
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
                    "value": "d2.2xlarge",
                    "options": [],
                },
                "nodeVolumeSize": {
                    "title": "Node Volume Size",
                    "name": "node_vol_size",
                    "type": "number",
                    "id": "node_volume_size",
                    "placeholder": null,
                    "value": 8,
                },
                "nodeVolumeType": {
                    "title": "Node Volume Type",
                    "name": "node_vol_type",
                    "type": "select",
                    "id": "node_volume_type",
                    "multiSelect": false,
                    "placeholder": null,
                    "value": "io1",
                    "options": [],
                },
            }
        ]
    },
    {
        "label": "Custom",
        "id": "template_custom",
        "description": "Create a custom node group",
        "value": true,
        "nodeGroups": []
    },
];

module.exports.NODE_GROUP_ITEMS = {
    "FIXED": {
        "NodesNumber": {
            "title": "No. of Nodes",
            "id": "fixed_nodes",
            "name": "nodeGroupItem.fixed.fixed_nodes",
            "type": "number",
            "placeholder": null,
            "value": 0,
        },
    },
    "SCALING": {
        "MaxNodes": {
            "title": "Maximum Nodes",
            "id": "scaling_max_nodes",
            "name": "nodeGroupItem.scaling.scaling_max_nodes",
            "type": "number",
            "placeholder": null,
            "value": 0,
        },
        "MinNodes": {
            "title": "Minimum Nodes",
            "id": "scaling_min_nodes",
            "name": "nodeGroupItem.scaling.scaling_min_nodes",
            "type": "number",
            "placeholder": null,
            "value": 0,
        },
    },
    "SPOT": {
        "MaxPrice": {
            "title": "Maximum Price",
            "id": "spot_max_price",
            "name": "nodeGroupItem.spot.spot_max_price",
            "type": "number",
            "placeholder": null,
            "value": 0,
        },
        "BaseCapacity": {
            "title": "Base Capacity",
            "id": "spot_base_capacity",
            "name": "nodeGroupItem.spot.spot_base_capacity",
            "type": "number",
            "placeholder": null,
            "value": 0,
        },
        "Threshold": {
            "title": "Threshold",
            "id": "spot_threshold",
            "name": "nodeGroupItem.spot.spot_threshold",
            "type": "number",
            "placeholder": null,
            "value": 0,
        },
        "Pools": {
            "title": "Pools",
            "id": "spot_pools",
            "name": "nodeGroupItem.spot.spot_pools",
            "type": "number",
            "placeholder": null,
            "value": 0,
        },
    },
};