var ModelUtil = require('bpmn-js/lib/util/ModelUtil'),
    is = ModelUtil.is,
    getBusinessObject = ModelUtil.getBusinessObject;

var eventDefinitionHelper = require('bpmn-js-properties-panel/lib/helper/EventDefinitionHelper');
var extensionsElementHelper = require('bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper');

var ImplementationTypeHelper = {};

module.exports = ImplementationTypeHelper;

/**
 * Returns 'true' if the given element is 'custom:ServiceTaskLike'
 *
 * @param {djs.model.Base} element
 *
 * @return {boolean} a boolean value
 */
ImplementationTypeHelper.isServiceTaskLike = function (element) {
    return is(element, 'custom:ServiceTaskLike');
};

/**
 * Returns 'true' if the given element is 'custom:DataStoreLike'
 *
 * @param {djs.model.Base} element
 *
 * @return {boolean} a boolean value
 */
ImplementationTypeHelper.isDataStoreLike = function (element) {
    return is(element, 'custom:DataStoreLike');
};

/**
 * Returns 'true' if the given element is 'custom:DmnCapable'
 *
 * @param {djs.model.Base} element
 *
 * @return {boolean} a boolean value
 */
ImplementationTypeHelper.isDmnCapable = function (element) {
    return is(element, 'custom:DmnCapable');
};

/**
 * Returns 'true' if the given element is 'custom:ExternalCapable'
 *
 * @param {djs.model.Base} element
 *
 * @return {boolean} a boolean value
 */
ImplementationTypeHelper.isExternalCapable = function (element) {
    return is(element, 'custom:ExternalCapable');
};

/**
 * Returns 'true' if the given element is 'custom:TaskListener'
 *
 * @param {djs.model.Base} element
 *
 * @return {boolean} a boolean value
 */
ImplementationTypeHelper.isTaskListener = function (element) {
    return is(element, 'custom:TaskListener');
};

/**
 * Returns 'true' if the given element is 'custom:ExecutionListener'
 *
 * @param {djs.model.Base} element
 *
 * @return {boolean} a boolean value
 */
ImplementationTypeHelper.isExecutionListener = function (element) {
    return is(element, 'custom:ExecutionListener');
};

/**
 * Returns 'true' if the given element is 'custom:ExecutionListener' or
 * 'custom:TaskListener'
 *
 * @param {djs.model.Base} element
 *
 * @return {boolean} a boolean value
 */
ImplementationTypeHelper.isListener = function (element) {
    return this.isTaskListener(element) || this.isExecutionListener(element);
};

/**
 * Returns 'true' if the given element is 'bpmn:SequenceFlow'
 *
 * @param {djs.model.Base} element
 *
 * @return {boolean} a boolean value
 */
ImplementationTypeHelper.isSequenceFlow = function (element) {
    return is(element, 'bpmn:SequenceFlow');
};

/**
 * Get a 'custom:ServiceTaskLike' business object.
 *
 * If the given element is not a 'custom:ServiceTaskLike', then 'false'
 * is returned.
 *
 * @param {djs.model.Base} element
 *
 * @return {ModdleElement} the 'custom:ServiceTaskLike' business object
 */
ImplementationTypeHelper.getServiceTaskLikeBusinessObject = function (element) {

    if (is(element, 'bpmn:IntermediateThrowEvent') || is(element, 'bpmn:EndEvent')) {

        // change business object to 'messageEventDefinition' when
        // the element is a message intermediate throw event or message end event
        // because the dpie extensions (e.g. dpie:class) are in the message
        // event definition tag and not in the intermediate throw event or end event tag
        var messageEventDefinition = eventDefinitionHelper.getMessageEventDefinition(element);
        if (messageEventDefinition) {
            element = messageEventDefinition;
        }
    }

    return this.isServiceTaskLike(element) && getBusinessObject(element);

};

/**
 * Get a 'custom:DataStoreLike' business object.
 *
 * If the given element is not a 'custom:DataStoreLike', then 'false'
 * is returned.
 *
 * @param {djs.model.Base} element
 *
 * @return {ModdleElement} the 'custom:DataStoreLike' business object
 */
ImplementationTypeHelper.getDataStoreLikeBusinessObject = function (element) {

    return this.isDataStoreLike(element) && getBusinessObject(element);

};

/**
 * Returns the implementation type of the given element.
 *
 * Possible implementation types are:
 * - dmn
 * - connector
 * - external
 * - class
 * - expression
 * - delegateExpression
 * - script
 * - or undefined, when no matching implementation type is found
 *
 * @param  {djs.model.Base} element
 *
 * @return {String} the implementation type
 */
ImplementationTypeHelper.getImplementationType = function (element) {

    var bo = this.getServiceTaskLikeBusinessObject(element) || this.getDataStoreLikeBusinessObject(element);

    if (!bo) {
        if (this.isListener(element)) {
            bo = element;
        } else {
            return;
        }
    }

    if (this.isDmnCapable(bo)) {
        var decisionRef = bo.get('custom:decisionRef');
        if (typeof decisionRef !== 'undefined') {
            return 'dmn';
        }
    }

    if (this.isServiceTaskLike(bo) || this.isDataStoreLike(bo)) {
        var connectors = extensionsElementHelper.getExtensionElements(bo, 'custom:Connector');
        if (typeof connectors !== 'undefined') {
            return 'connector';
        }
    }

    if (this.isExternalCapable(bo)) {
        var type = bo.get('custom:type');
        if (type === 'external') {
            return 'external';
        }
    }

    var cls = bo.get('custom:class');
    if (typeof cls !== 'undefined') {
        return 'class';
    }

    var expression = bo.get('custom:expression');
    if (typeof expression !== 'undefined') {
        return 'expression';
    }

    var delegateExpression = bo.get('custom:delegateExpression');
    if (typeof delegateExpression !== 'undefined') {
        return 'delegateExpression';
    }

    if (this.isListener(bo)) {
        var script = bo.get('script');
        if (typeof script !== 'undefined') {
            return 'script';
        }
    }

};
