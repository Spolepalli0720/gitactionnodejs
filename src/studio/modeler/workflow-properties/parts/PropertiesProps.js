var properties = require('./implementation/Properties'),
    elementHelper = require('bpmn-js-properties-panel/lib/helper/ElementHelper'),
    cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper');

module.exports = function (group, element, bpmnFactory, translate) {

    var propertiesEntry = properties(element, bpmnFactory, {
        id: 'properties',
        modelProperties: ['name', 'value'],
        labels: [translate('Name'), translate('Value')],

        getParent: function (element, node, bo) {
            return bo.extensionElements;
        },

        createParent: function (element, bo) {
            var parent = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);
            var cmd = cmdHelper.updateBusinessObject(element, bo, { extensionElements: parent });
            return {
                cmd: cmd,
                parent: parent
            };
        }
    }, translate);

    if (propertiesEntry) {
        group.entries.push(propertiesEntry);
    }

};
