var is = require('bpmn-js/lib/util/ModelUtil').is,
    getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;

var tasklist = require('./implementation/Tasklist');

module.exports = function (group, element, bpmnFactory, translate) {
    var businessObject = getBusinessObject(element);
    //Pending Verification for the fix related to Unexpected mix of '||' and '&&'
    if ((is(element, 'custom:Process') || is(element, 'bpmn:Participant')) && businessObject.get('processRef')) {
        group.entries = group.entries.concat(tasklist(element, bpmnFactory, {
            getBusinessObject: function (element) {
                var bo = getBusinessObject(element);

                if (!is(bo, 'bpmn:Participant')) {
                    return bo;
                }

                return bo.get('processRef');
            }
        }, translate));

    }
};
