var is = require('bpmn-js/lib/util/ModelUtil').is,
    getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;

var jobPriority = require('./implementation/JobPriority'),
    jobRetryTimeCycle = require('./implementation/JobRetryTimeCycle');

module.exports = function (group, element, bpmnFactory, translate) {
    var businessObject = getBusinessObject(element);

    //Pending Verification for the fix related to Unexpected mix of '||' and '&&'
    if ((is(element, 'custom:JobPriorized') || is(element, 'bpmn:Participant')) && businessObject.get('processRef')) {
        group.entries = group.entries.concat(jobPriority(element, bpmnFactory, {
            getBusinessObject: function (element) {
                var bo = getBusinessObject(element);

                if (!is(bo, 'bpmn:Participant')) {
                    return bo;
                }

                return bo.get('processRef');
            }
        }, translate));
    }

    if (is(element, 'custom:AsyncCapable')) {
        group.entries = group.entries.concat(jobRetryTimeCycle(element, bpmnFactory, {
            getBusinessObject: getBusinessObject
        }, translate));
    }

};
