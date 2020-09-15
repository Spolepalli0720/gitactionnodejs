var is = require('bpmn-js/lib/util/ModelUtil').is;

var assign = require('lodash/assign');

var entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory'),
    cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper');

module.exports = function (element, bpmnFactory, options, translate) {

    var getBusinessObject = options.getBusinessObject,
        hideResultVariable = options.hideResultVariable,
        id = options.id || 'resultVariable';


    var resultVariableEntry = entryFactory.textField({
        id: id,
        label: translate('Result Variable'),
        modelProperty: 'resultVariable',

        get: function (element, node) {
            var bo = getBusinessObject(element);
            return { resultVariable: bo.get('custom:resultVariable') };
        },

        set: function (element, values, node) {
            var bo = getBusinessObject(element);

            var resultVariable = values.resultVariable || undefined;

            var props = {
                'custom:resultVariable': resultVariable
            };

            if (is(bo, 'custom:DmnCapable') && !resultVariable) {
                props = assign({ 'custom:mapDecisionResult': 'resultList' }, props);
            }

            return cmdHelper.updateBusinessObject(element, bo, props);
        },

        hidden: function (element, node) {
            if (typeof hideResultVariable === 'function') {
                return hideResultVariable.apply(resultVariableEntry, arguments);
            }
        }

    });

    return [resultVariableEntry];

};
