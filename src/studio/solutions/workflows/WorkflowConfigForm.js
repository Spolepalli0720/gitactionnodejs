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