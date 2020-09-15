module.exports.APPLICATION_CONFIG = {
    "type": "form",
    "display": "form",
    "components": [
        {
            "label": "Name",
            "key": "name",
            "type": "textfield",
            "input": true,
            "tableView": true,
            "spellcheck": true,
            "calculateServer": false,
            "validate": {
                "required": true,
                "maxLength": 60
            },
        },
        {
            "label": "Description",
            "key": "description",
            "type": "textarea",
            "input": true,
            "tableView": true,
            "spellcheck": true,
            "calculateServer": false,
            "validate": {
                "required": true,
                "maxLength": 300
            },
        },
        {
            "label": "Tags",
            "key": "tags",
            "type": "tags",
            "input": true,
            "tableView": false,
            "calculateServer": false,
        },
        {
            "label": "Submit",
            "key": "submit",
            "type": "button",
            "customClass": "text-center",
            "input": true,
            "tableView": false,
            "showValidations": false,
            "disableOnInvalid": true,
        }
    ]
}

module.exports.FORM_CONFIG = {
    "type": "form",
    "display": "form",
    "components": [
        {
            "label": "Name",
            "key": "name",
            "type": "textfield",
            "input": true,
            "tableView": true,
            "spellcheck": true,
            "calculateServer": false,
            "validate": {
                "required": true,
                "maxLength": 60
            },
        },
        {
            "label": "Description",
            "key": "description",
            "type": "textarea",
            "input": true,
            "tableView": true,
            "spellcheck": true,
            "calculateServer": false,
            "validate": {
                "required": true,
                "maxLength": 300
            },
        },
        {
            "label": "Type",
            "key": "type",
            "type": "select",
            "widget": "choicesjs",
            "placeholder": "Select Form Type",
            "input": true,
            "tableView": true,
            "searchEnabled": false,
            "selectThreshold": 0.3,
            "calculateServer": false,
            "validate": {
                "required": true
            },
            "data": {
                "values": [
                    {
                        "label": "Form",
                        "value": "form"
                    },
                    {
                        "label": "Wizard",
                        "value": "wizard"
                    },
                    {
                        "label": "Dashboard",
                        "value": "dashboard"
                    }
                ]
            },
            "indexeddb": {
                "filter": {
                }
            }
        },
        {
            "label": "Submit",
            "key": "submit",
            "type": "button",
            "customClass": "text-center",
            "input": true,
            "tableView": false,
            "showValidations": false,
            "disableOnInvalid": true,
        }
    ]
}

module.exports.FORM_EDIT_CONFIG = {
    "type": "form",
    "display": "form",
    "components": [
        {
            "label": "Name",
            "key": "name",
            "type": "textfield",
            "input": true,
            "tableView": true,
            "spellcheck": true,
            "calculateServer": false,
            "validate": {
                "required": true,
                "maxLength": 60
            },
        },
        {
            "label": "Description",
            "key": "description",
            "type": "textarea",
            "input": true,
            "tableView": true,
            "spellcheck": true,
            "calculateServer": false,
            "validate": {
                "required": true,
                "maxLength": 300
            },
        },
        {
            "label": "Type",
            "key": "type",
            "type": "select",
            "widget": "choicesjs",
            "placeholder": "Select Form Type",
            "input": true,
            "tableView": true,
            "disabled": true,
            "searchEnabled": false,
            "selectThreshold": 0.3,
            "calculateServer": false,
            "validate": {
                "required": true
            },
            "data": {
                "values": [
                    {
                        "label": "Form",
                        "value": "form"
                    },
                    {
                        "label": "Wizard",
                        "value": "wizard"
                    },
                    {
                        "label": "Dashboard",
                        "value": "dashboard"
                    }
                ]
            },
            "indexeddb": {
                "filter": {
                }
            }
        },
        {
            "label": "Submit",
            "key": "submit",
            "type": "button",
            "customClass": "text-center",
            "input": true,
            "tableView": false,
            "showValidations": false,
            "disableOnInvalid": true,
        }
    ]
}
