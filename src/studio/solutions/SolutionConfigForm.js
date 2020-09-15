module.exports.DATA_INPUT_FORM = {
    "properties": {},
    "design": {
        "layout": {
            "DEFINE": [
                {
                    "key": "name",
                    "type": "text",
                    "required": true,
                    "label": "Name",
                    "id": "sol_name",
                    "readOnly": null,
                    "disabled": false,
                    "depends": null,
                    "value": "",
                },
                {
                    "key": "description",
                    "type": "textarea",
                    "required": true,
                    "label": "Description",
                    "id": "sol_desc",
                    "readOnly": null,
                    "disabled": false,
                    "depends": null,
                    "value": "",
                    "rows": "6",
                },
                {
                    "key": "tags",
                    "type": "tags",
                    "required": false,
                    "label": "Tags",
                    "id": "sol_tags",
                    "readOnly": null,
                    "disabled": false,
                    "depends": null,
                    "value": [],
                },
            ],
            "CONFIGURE": [
                {
                    "key": "solutionTemplate",
                    "type": "select",
                    "required": true,
                    "label": "Template Type",
                    "id": "sol_template",
                    "value": "DEFAULT",
                    "readOnly": null,
                    "disabled": null,
                    "depends": null,
                    "options": [
                        {
                            "label": "Default",
                            "value": "DEFAULT"
                        }
                    ]
                },
                {
                    "key": "workflow",
                    "label": "Workflow",
                    "id": "sol_workflow",
                    "type": "group",
                    "value": null,
                    "readOnly": null,
                    "disabled": null,
                    "depends": null,
                    "children": [
                        {
                            "label": "Async Support",
                            "key": "asyncSupport",
                            "id": "sol_async",
                            "type": "checkbox",
                            "required": false,
                            "value": false,
                            "readOnly": null,
                            "disabled": null,
                            "depends": null,
                        },
                        {
                            "label": "Auditing",
                            "key": "auditing",
                            "id": "sol_audit",
                            "type": "checkbox",
                            "required": false,
                            "value": false,
                            "readOnly": null,
                            "disabled": null,
                            "depends": null,
                        },
                        {
                            "label": "Authorization",
                            "key": "authorization",
                            "id": "sol_authorize",
                            "type": "checkbox",
                            "required": false,
                            "value": false,
                            "readOnly": null,
                            "disabled": null,
                            "depends": null,
                        },
                        {
                            "label": "Max Flows",
                            "key": "maxFlows",
                            "id": "sol_flows",
                            "type": "number",
                            "required": true,
                            "value": 0,
                            "readOnly": null,
                            "disabled": null,
                            "depends": null,
                        },
                    ],
                },
                {
                    "label": "Storage",
                    "key": "storage",
                    "id": "sol_storage",
                    "type": "group",
                    "value": null,
                    "readOnly": null,
                    "disabled": null,
                    "depends": null,
                    "children": [
                        {
                            "label": "Persistent",
                            "key": "persistent",
                            "id": "sol_persistence",
                            "type": "checkbox",
                            "required": false,
                            "value": false,
                            "readOnly": null,
                            "disabled": null,
                            "depends": null,
                        },
                        {
                            "label": "",
                            "key": "type",
                            "id": "sol_type",
                            "type": "select",
                            "required": false,
                            "value": "",
                            "readOnly": null,
                            "disabled": null,
                            "depends": "persistent",
                            "options": [
                                {
                                    "label": "Select Storage Type",
                                    "value": ""
                                },
                                {
                                    "label": "MongoDB",
                                    "value": "MongoDB"
                                },
                                {
                                    "label": "PostgreSQL",
                                    "value": "PostgreSQL"
                                },
                            ]
                        },
                    ]
                },
            ],
            "DEPLOY": [
                {
                    "label": "Cloud Deployment",
                    "key": "cloudDeployment",
                    "id": "sol_cld_deploy",
                    "type": "checkbox",
                    "required": false,
                    "value": false,
                    "readOnly": null,
                    "disabled": null,
                    "depends": null,
                },
                {
                    "label": "Cloud Provider",
                    "key": "cloudProvider",
                    "id": "sol_cld_provider",
                    "type": "select",
                    "required": false,
                    "value": "",
                    "readOnly": null,
                    "disabled": null,
                    "depends": "cloudDeployment",
                    "options": [
                        {
                            "label": "Select Cloud Provider",
                            "value": ""
                        },
                        {
                            "label": "AWS",
                            "value": "AWS"
                        },
                        {
                            "label": "Azure",
                            "value": "Azure"
                        },
                        {
                            "label": "Google",
                            "value": "Google"
                        }
                    ]
                },
                {
                    "label": "Deployment Model",
                    "key": "deploymentModel",
                    "id": "sol_dpl_model",
                    "type": "select",
                    "required": false,
                    "value": "",
                    "readOnly": null,
                    "disabled": null,
                    "depends": "cloudDeployment",
                    "options": [
                        {
                            "label": "Select Deployment Model",
                            "value": ""
                        },
                        {
                            "label": "Lean",
                            "value": "LEAN"
                        },
                        {
                            "label": "Limited",
                            "value": "LIMITED"
                        },
                        {
                            "label": "Auto Scale",
                            "value": "AUTO_SCALE"
                        }
                    ]
                },
                {
                    "label": "Deployment Environment",
                    "key": "deploymentEnvironment",
                    "id": "sol_dpl_environment",
                    "type": "select",
                    "required": false,
                    "value": "",
                    "readOnly": null,
                    "disabled": null,
                    "depends": null,
                    "options": [
                        {
                            "label": "Select Deploment Environment",
                            "value": ""
                        },
                        {
                            "label": "Development",
                            "value": "DEV"
                        },
                        {
                            "label": "Quality Assurance",
                            "value": "QA"
                        },
                        {
                            "label": "User Acceptance",
                            "value": "UAT"
                        },
                        {
                            "label": "Sandbox",
                            "value": "SANDBOX"
                        }
                    ]
                },
                {
                    "label": "Storage",
                    "key": "deploymentStorage",
                    "id": "sol_dpl_storage",
                    "type": "select",
                    "required": false,
                    "value": "SHARED",
                    "readOnly": null,
                    "disabled": null,
                    "depends": null,
                    "options": [
                        {
                            "label": "Shared",
                            "value": "SHARED"
                        }
                    ]
                },
            ],
        }
    }
};

module.exports.DATA_OPTIONS = {
    "NEW": {
        "label": "New Solution",
        "description": "Create a new solution",
        "hasTabs": false,
        "getContentFromData": false,
        "innerContent": {
            "INTEGRATION": {
                "title": "Integration",
                "description": "Any to any solutions using any to any integrations driving the business process.",
                "type": "INTEGRATION",
                "solutionConfig": {
                    "cloudDeployment": false,
                    "cloudProvider": "",
                    "deploymentEnvironment": "",
                    "deploymentModel": "",
                    "deploymentStorage": "SHARED",
                    "description": "",
                    "name": "",
                    "solutionTemplate": "DEFAULT",
                    "storage": {
                        "persistent": false,
                        "type": "",
                    },
                    "tags": [],
                    "type": "INTEGRATION",
                    "workflow": {
                        "asyncSupport": false,
                        "auditing": false,
                        "authorization": false,
                        "maxFlows": 0,
                    }
                }
            },
            "AIPOWERED": {
                "title": "AI Powered",
                "description": "Model Catalogue & Deployment, Monitoring & Governance.",
                "type": "AIPOWERED",
                "solutionConfig": {
                    "cloudDeployment": false,
                    "cloudProvider": "",
                    "deploymentEnvironment": "",
                    "deploymentModel": "",
                    "deploymentStorage": "SHARED",
                    "description": "",
                    "name": "",
                    "solutionTemplate": "DEFAULT",
                    "storage": {
                        "persistent": false,
                        "type": "",
                    },
                    "tags": [],
                    "type": "AIPOWERED",
                    "workflow": {
                        "asyncSupport": false,
                        "auditing": false,
                        "authorization": false,
                        "maxFlows": 0,
                    }
                }
            },
            "FUSION": {
                "title": "Cognitive Fusion",
                "description": "Scalable Data Pipeline, Artificial Intelligence.",
                "type": "FUSION",
                "solutionConfig": {
                    "cloudDeployment": false,
                    "cloudProvider": "",
                    "deploymentEnvironment": "",
                    "deploymentModel": "",
                    "deploymentStorage": "SHARED",
                    "description": "",
                    "name": "",
                    "solutionTemplate": "DEFAULT",
                    "storage": {
                        "persistent": false,
                        "type": "",
                    },
                    "tags": [],
                    "type": "FUSION",
                    "workflow": {
                        "asyncSupport": false,
                        "auditing": false,
                        "authorization": false,
                        "maxFlows": 0,
                    }
                }
            },
            "FABRIC": {
                "title": "Sensor Fabric",
                "description": "Edge Orchestration and Automation.",
                "type": "FABRIC",
                "solutionConfig": {
                    "cloudDeployment": false,
                    "cloudProvider": "",
                    "deploymentEnvironment": "",
                    "deploymentModel": "",
                    "deploymentStorage": "SHARED",
                    "description": "",
                    "name": "",
                    "solutionTemplate": "DEFAULT",
                    "storage": {
                        "persistent": false,
                        "type": "",
                    },
                    "tags": [],
                    "type": "FABRIC",
                    "workflow": {
                        "asyncSupport": false,
                        "auditing": false,
                        "authorization": false,
                        "maxFlows": 0,
                    }
                }
            },
        },
    },
    "FROM_TEMPLATE": {
        "label": "From Blueprints",
        "description": "Create solution from a template",
        "hasTabs": true,
        "getContentFromData": false,
        "innerContent": {
            "RETAIL": [
                {
                    "title": "Omni Channel Orchestration",
                    "description": "Track your shipment in real-time across air, water and land with location and condition monitoring.",
                    "type": "RETAIL",
                    "solutionConfig": {
                        "cloudDeployment": false,
                        "cloudProvider": "",
                        "deploymentEnvironment": "",
                        "deploymentModel": "",
                        "deploymentStorage": "SHARED",
                        "description": "Solution created form a template",
                        "name": "",
                        "solutionTemplate": "DEFAULT",
                        "storage": {
                            "persistent": false,
                            "type": "",
                        },
                        "tags": [
                            { name: "Template" },
                            { name: "Solution" }
                        ],
                        "type": "INTEGRATION",
                        "workflow": {
                            "asyncSupport": false,
                            "auditing": true,
                            "authorization": false,
                            "maxFlows": 0,
                        }
                    }
                },
                {
                    "title": "Dynamic Pricing",
                    "description": "Track your shipment in real-time across air, water and land with location and condition monitoring.",
                    "type": "RETAIL",
                    "solutionConfig": {
                        "cloudDeployment": false,
                        "cloudProvider": "",
                        "deploymentEnvironment": "",
                        "deploymentModel": "",
                        "deploymentStorage": "SHARED",
                        "description": "Solution created form a template",
                        "name": "",
                        "solutionTemplate": "DEFAULT",
                        "storage": {
                            "persistent": false,
                            "type": "",
                        },
                        "tags": [
                            { name: "Template" },
                            { name: "Solution" }
                        ],
                        "type": "AIPOWERED",
                        "workflow": {
                            "asyncSupport": false,
                            "auditing": true,
                            "authorization": false,
                            "maxFlows": 0,
                        }
                    }
                },
                {
                    "title": "Order Management",
                    "description": "Track your shipment in real-time across air, water and land with location and condition monitoring.",
                    "type": "RETAIL",
                    "solutionConfig": {
                        "cloudDeployment": false,
                        "cloudProvider": "",
                        "deploymentEnvironment": "",
                        "deploymentModel": "",
                        "deploymentStorage": "SHARED",
                        "description": "Solution created form a template",
                        "name": "",
                        "solutionTemplate": "DEFAULT",
                        "storage": {
                            "persistent": false,
                            "type": "",
                        },
                        "tags": [
                            { name: "Template" },
                            { name: "Solution" }
                        ],
                        "type": "INTEGRATION",
                        "workflow": {
                            "asyncSupport": false,
                            "auditing": true,
                            "authorization": false,
                            "maxFlows": 0,
                        }
                    }
                },
                {
                    "title": "Visual Commerce",
                    "description": "Track your shipment in real-time across air, water and land with location and condition monitoring.",
                    "type": "RETAIL",
                    "solutionConfig": {
                        "cloudDeployment": false,
                        "cloudProvider": "",
                        "deploymentEnvironment": "",
                        "deploymentModel": "",
                        "deploymentStorage": "SHARED",
                        "description": "Solution created form a template",
                        "name": "",
                        "solutionTemplate": "DEFAULT",
                        "storage": {
                            "persistent": false,
                            "type": "",
                        },
                        "tags": [
                            { name: "Template" },
                            { name: "Solution" }
                        ],
                        "type": "AIPOWERED",
                        "workflow": {
                            "asyncSupport": false,
                            "auditing": true,
                            "authorization": false,
                            "maxFlows": 0,
                        }
                    }
                },
            ],
            "BANKING": [
                {
                    "title": "Banking 1",
                    "description": "Track your shipment in real-time across air, water and land with location and condition monitoring.",
                    "type": "BANKING",
                    "solutionConfig": {
                        "cloudDeployment": false,
                        "cloudProvider": "",
                        "deploymentEnvironment": "",
                        "deploymentModel": "",
                        "deploymentStorage": "SHARED",
                        "description": "Solution created form a template",
                        "name": "",
                        "solutionTemplate": "DEFAULT",
                        "storage": {
                            "persistent": false,
                            "type": "",
                        },
                        "tags": [
                            { name: "Template" },
                            { name: "Solution" }
                        ],
                        "type": "FUSION",
                        "workflow": {
                            "asyncSupport": false,
                            "auditing": true,
                            "authorization": false,
                            "maxFlows": 0,
                        }
                    }
                },
                {
                    "title": "Banking 2",
                    "description": "Track your shipment in real-time across air, water and land with location and condition monitoring.",
                    "type": "BANKING",
                    "solutionConfig": {
                        "cloudDeployment": false,
                        "cloudProvider": "",
                        "deploymentEnvironment": "",
                        "deploymentModel": "",
                        "deploymentStorage": "SHARED",
                        "description": "Solution created form a template",
                        "name": "",
                        "solutionTemplate": "DEFAULT",
                        "storage": {
                            "persistent": false,
                            "type": "",
                        },
                        "tags": [
                            { name: "Template" },
                            { name: "Solution" }
                        ],
                        "type": "FUSION",
                        "workflow": {
                            "asyncSupport": false,
                            "auditing": true,
                            "authorization": false,
                            "maxFlows": 0,
                        }
                    }
                },
            ],
            "ENERGY": [
                {
                    "title": "Energy 1",
                    "description": "Track your shipment in real-time across air, water and land with location and condition monitoring.",
                    "type": "ENERGY",
                    "solutionConfig": {
                        "cloudDeployment": false,
                        "cloudProvider": "",
                        "deploymentEnvironment": "",
                        "deploymentModel": "",
                        "deploymentStorage": "SHARED",
                        "description": "Solution created form a template",
                        "name": "",
                        "solutionTemplate": "DEFAULT",
                        "storage": {
                            "persistent": false,
                            "type": "",
                        },
                        "tags": [
                            { name: "Template" },
                            { name: "Solution" }
                        ],
                        "type": "FUSION",
                        "workflow": {
                            "asyncSupport": false,
                            "auditing": true,
                            "authorization": false,
                            "maxFlows": 0,
                        }
                    }
                },
                {
                    "title": "Energy 2",
                    "description": "Track your shipment in real-time across air, water and land with location and condition monitoring.",
                    "type": "ENERGY",
                    "solutionConfig": {
                        "cloudDeployment": false,
                        "cloudProvider": "",
                        "deploymentEnvironment": "",
                        "deploymentModel": "",
                        "deploymentStorage": "SHARED",
                        "description": "Solution created form a template",
                        "name": "",
                        "solutionTemplate": "DEFAULT",
                        "storage": {
                            "persistent": false,
                            "type": "",
                        },
                        "tags": [
                            { name: "Template" },
                            { name: "Solution" }
                        ],
                        "type": "FUSION",
                        "workflow": {
                            "asyncSupport": false,
                            "auditing": true,
                            "authorization": false,
                            "maxFlows": 0,
                        }
                    }
                },
                {
                    "title": "Energy 3",
                    "description": "Track your shipment in real-time across air, water and land with location and condition monitoring.",
                    "type": "ENERGY",
                    "solutionConfig": {
                        "cloudDeployment": false,
                        "cloudProvider": "",
                        "deploymentEnvironment": "",
                        "deploymentModel": "",
                        "deploymentStorage": "SHARED",
                        "description": "Solution created form a template",
                        "name": "",
                        "solutionTemplate": "DEFAULT",
                        "storage": {
                            "persistent": false,
                            "type": "",
                        },
                        "tags": [
                            { name: "Template" },
                            { name: "Solution" }
                        ],
                        "type": "FUSION",
                        "workflow": {
                            "asyncSupport": false,
                            "auditing": true,
                            "authorization": false,
                            "maxFlows": 0,
                        }
                    }
                },
            ],
            "HEALTH_CARE": [
                {
                    "title": "Provider Solutions",
                    "description": "Track your shipment in real-time across air, water and land with location and condition monitoring.",
                    "type": "HEALTH_CARE",
                    "solutionConfig": {
                        "cloudDeployment": false,
                        "cloudProvider": "",
                        "deploymentEnvironment": "",
                        "deploymentModel": "",
                        "deploymentStorage": "SHARED",
                        "description": "Solution created form a template",
                        "name": "",
                        "solutionTemplate": "DEFAULT",
                        "storage": {
                            "persistent": false,
                            "type": "",
                        },
                        "tags": [
                            { name: "Template" },
                            { name: "Solution" }
                        ],
                        "type": "FUSION",
                        "workflow": {
                            "asyncSupport": false,
                            "auditing": true,
                            "authorization": false,
                            "maxFlows": 0,
                        }
                    }
                },
                {
                    "title": "Claims Management",
                    "description": "Track your shipment in real-time across air, water and land with location and condition monitoring.",
                    "type": "HEALTH_CARE",
                    "solutionConfig": {
                        "cloudDeployment": false,
                        "cloudProvider": "",
                        "deploymentEnvironment": "",
                        "deploymentModel": "",
                        "deploymentStorage": "SHARED",
                        "description": "Solution created form a template",
                        "name": "",
                        "solutionTemplate": "DEFAULT",
                        "storage": {
                            "persistent": false,
                            "type": "",
                        },
                        "tags": [
                            { name: "Template" },
                            { name: "Solution" }
                        ],
                        "type": "FABRIC",
                        "workflow": {
                            "asyncSupport": false,
                            "auditing": true,
                            "authorization": false,
                            "maxFlows": 0,
                        }
                    }
                },
            ],
        },
    },
    "EXISTING_SOLS": {
        "label": "From Existing Solutions",
        "description": "Create solution from existing solutions",
        "hasTabs": true,
        "getContentFromData": true,
        "innerContent": {
            "INTEGRATION": [],
            "AIPOWERED": [],
            "FUSION": [],
            "FABRIC": [],
        },
    },
    "IMPORT": {
        "label": "Import Solution",
        "description": "Import solution",
        "hasTabs": false,
        "getContentFromData": false,
        "innerContent": null,
    },
};