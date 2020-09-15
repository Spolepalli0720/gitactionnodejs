module.exports.DATA_INPUT_FORM = {
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
            "label": "Default",
            "key": "default",
            "type": "checkbox",
            "defaultValue": false,
            "input": true,
            "tableView": false,
            "calculateServer": false,
            "hideOnChildrenHidden": false
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