
var studioUtils = require("../../../../utils/StudioUtils");

var domQuery = require('min-dom').query,
    escapeHTML = require('bpmn-js-properties-panel/lib/Utils').escapeHTML,
    utils = require('bpmn-js-properties-panel/lib/Utils');

function getScriptType(node) {
    return utils.selectedType('select[name=scriptType]', node.parentElement);
}


module.exports = function (scriptLanguagePropName, scriptValuePropName, isFormatRequired, translate) {
    const uniqueId = studioUtils.generateUUID();
    return {
        template:
            '<div class="bpp-row bpp-textfield">' +
            '<label for="'+uniqueId+'-cam-script-format">' + escapeHTML(translate('Script Format')) + '</label>' +
            '<div class="bpp-field-wrapper">' +
            '<input id="'+uniqueId+'-cam-script-format" type="text" name="scriptFormat" />' +
            '<button class="clear" data-action="script.clearScriptFormat" data-show="script.canClearScriptFormat">' +
            '<span>X</span>' +
            '</button>' +
            '</div>' +
            '</div>' +

            '<div class="bpp-row">' +
            '<label for="'+uniqueId+'-cam-script-type">' + escapeHTML(translate('Script Type')) + '</label>' +
            '<div class="bpp-field-wrapper">' +
            '<select id="'+uniqueId+'-cam-script-type" name="scriptType" data-value>' +
            '<option value="script" selected>' + escapeHTML(translate('Inline Script')) + '</option>' +
            '<option value="scriptResource">' + escapeHTML(translate('External Resource')) + '</option>' +
            '</select>' +
            '</div>' +
            '</div>' +

            '<div class="bpp-row bpp-textfield">' +
            '<label for="'+uniqueId+'-cam-script-resource-val" data-show="script.isScriptResource">' + escapeHTML(translate('Resource')) + '</label>' +
            '<div class="bpp-field-wrapper" data-show="script.isScriptResource">' +
            '<input id="'+uniqueId+'-cam-script-resource-val" type="text" name="scriptResourceValue" />' +
            '<button class="clear" data-action="script.clearScriptResource" data-show="script.canClearScriptResource">' +
            '<span>X</span>' +
            '</button>' +
            '</div>' +
            '</div>' +

            '<div class="bpp-row">' +
            '<label for="'+uniqueId+'-cam-script-val" data-show="script.isScript">' + escapeHTML(translate('Script')) + '</label>' +
            '<button for="'+uniqueId+'-cam-script-val" data-action="script.editScriptValue" data-show="script.isScript"' + 
            ' style="width: 27px !important; position: relative; float: right; background-color: transparent; border-color: transparent; padding: 0; text-align: right;"' +
            '><i class="feather icon-edit"></i></button>' +
            '<div class="bpp-field-wrapper" data-show="script.isScript">' +
            '<textarea id="'+uniqueId+'-cam-script-val" type="text" name="scriptValue"></textarea>' +
            '</div>' +
            '</div>',

        get: function (element, bo) {
            var values = {};

            // read values from xml:
            var boScriptResource = bo.get('custom:resource'),
                boScript = bo.get(scriptValuePropName),
                boScriptFormat = bo.get(scriptLanguagePropName);

            if (typeof boScriptResource !== 'undefined') {
                values.scriptResourceValue = boScriptResource;
                values.scriptType = 'scriptResource';
            } else {
                values.scriptValue = boScript;
                values.scriptType = 'script';
            }

            values.scriptFormat = boScriptFormat;

            return values;
        },

        set: function (element, values, containerElement) {
            var scriptFormat = values.scriptFormat,
                scriptType = values.scriptType,
                scriptResourceValue = values.scriptResourceValue,
                scriptValue = values.scriptValue;

            // init update
            var update = {
                'custom:resource': undefined
            };
            update[scriptValuePropName] = undefined;
            update[scriptLanguagePropName] = undefined;

            if (isFormatRequired) {
                // always set language
                update[scriptLanguagePropName] = scriptFormat || '';
            } else
                // set language only when scriptFormat has a value
                if (scriptFormat !== '') {
                    update[scriptLanguagePropName] = scriptFormat;
                }

            // set either inline script or resource
            if ('scriptResource' === scriptType) {
                update['custom:resource'] = scriptResourceValue || '';
            } else {
                update[scriptValuePropName] = scriptValue || '';
            }

            return update;
        },

        validate: function (element, values) {
            var validationResult = {};

            if (values.scriptType === 'script' && !values.scriptValue) {
                validationResult.scriptValue = translate('Must provide a value');
            }

            if (values.scriptType === 'scriptResource' && !values.scriptResourceValue) {
                validationResult.scriptResourceValue = translate('Must provide a value');
            }

            if (isFormatRequired && (!values.scriptFormat || values.scriptFormat.length === 0)) {
                validationResult.scriptFormat = translate('Must provide a value');
            }

            return validationResult;
        },

        clearScriptFormat: function (element, inputNode, btnNode, scopeNode) {
            domQuery('input[name=scriptFormat]', scopeNode).value = '';

            return true;
        },

        canClearScriptFormat: function (element, inputNode, btnNode, scopeNode) {
            var input = domQuery('input[name=scriptFormat]', scopeNode);

            return input.value !== '';
        },

        clearScriptResource: function (element, inputNode, btnNode, scopeNode) {
            domQuery('input[name=scriptResourceValue]', scopeNode).value = '';

            return true;
        },

        canClearScriptResource: function (element, inputNode, btnNode, scopeNode) {
            var input = domQuery('input[name=scriptResourceValue]', scopeNode);

            return input.value !== '';
        },

        editScriptValue: function (element, inputNode, btnNode, scopeNode) {
            var input = domQuery('textarea[name=scriptValue]', scopeNode);
            var scriptFormat = domQuery('input[name=scriptFormat]', scopeNode);
            const scriptEditor = new CustomEvent('scriptEditor', { detail: { eventSource: element, scriptFormat: scriptFormat.value || '', scriptContent: input.value || '' } } );
            document.dispatchEvent(scriptEditor);
            document.addEventListener('codeDispatch', (e) => {
                input.value = e.detail.scriptContent || '';
                // getBusinessObject(element).set('scriptValue', input.value);
                input.focus();
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }, false);
            //input.value = 'Assigned Value';
            return true;
        },

        clearScript: function (element, inputNode, btnNode, scopeNode) {
            domQuery('textarea[name=scriptValue]', scopeNode).value = '';

            return true;
        },

        canClearScript: function (element, inputNode, btnNode, scopeNode) {
            var input = domQuery('textarea[name=scriptValue]', scopeNode);

            return input.value !== '';
        },

        isScriptResource: function (element, inputNode, btnNode, scopeNode) {
            var scriptType = getScriptType(scopeNode);
            return scriptType === 'scriptResource';
        },

        isScript: function (element, inputNode, btnNode, scopeNode) {
            var scriptType = getScriptType(scopeNode);
            return scriptType === 'script';
        },

    };

};
