'use strict';

var isFunction = require('min-dash').isFunction,
    isObject = require('min-dash').isObject,
    some = require('min-dash').some;

var WILDCARD = '*';

function CustomModdleExtension(eventBus) {

  var self = this;

  eventBus.on('moddleCopy.canCopyProperty', function(context) {
    var property = context.property,
        parent = context.parent;

    return self.canCopyProperty(property, parent);
  });
}

CustomModdleExtension.$inject = [ 'eventBus' ];

/**
 * Check wether to disallow copying property.
 */
CustomModdleExtension.prototype.canCopyProperty = function(property, parent) {

  // (1) check wether property is allowed in parent
  if (isObject(property) && !isAllowedInParent(property, parent)) {

    return false;
  }

  // (2) check more complex scenarios

  if (is(property, 'custom:InputOutput') && !this.canHostInputOutput(parent)) {
    return false;
  }

  if (isAny(property, [ 'custom:Connector', 'custom:Field' ]) && !this.canHostConnector(parent)) {
    return false;
  }

};

CustomModdleExtension.prototype.canHostInputOutput = function(parent) {

  // allowed in camunda:Connector
  var connector = getParent(parent, 'custom:Connector');

  if (connector) {
    return true;
  }

  // special rules inside bpmn:FlowNode
  var flowNode = getParent(parent, 'bpmn:FlowNode');

  if (!flowNode) {
    return false;
  }

  if (isAny(flowNode, [ 'bpmn:StartEvent', 'bpmn:Gateway', 'bpmn:BoundaryEvent' ])) {
    return false;
  }

  if (is(flowNode, 'bpmn:SubProcess') && flowNode.get('triggeredByEvent')) {
    return false;
  }

  return true;
};

CustomModdleExtension.prototype.canHostConnector = function(parent) {

  var serviceTaskLike = getParent(parent, 'custom:ServiceTaskLike');

  if (is(serviceTaskLike, 'bpmn:MessageEventDefinition')) {

    // only allow on throw and end events
    return (
      getParent(parent, 'bpmn:IntermediateThrowEvent') ||
      getParent(parent, 'bpmn:EndEvent')
    );
  }

  return true;
};

module.exports = CustomModdleExtension;

// helpers //////////

function is(element, type) {
  return element && isFunction(element.$instanceOf) && element.$instanceOf(type);
}

function isAny(element, types) {
  return some(types, function(t) {
    return is(element, t);
  });
}

function getParent(element, type) {
  if (!type) {
    return element.$parent;
  }

  if (is(element, type)) {
    return element;
  }

  if (!element.$parent) {
    return;
  }

  return getParent(element.$parent, type);
}

function isAllowedInParent(property, parent) {

  // (1) find property descriptor
  var descriptor = property.$type && property.$model.getTypeDescriptor(property.$type);

  var allowedIn = descriptor && descriptor.meta && descriptor.meta.allowedIn;

  if (!allowedIn || isWildcard(allowedIn)) {
    return true;
  }

  // (2) check wether property has parent of allowed type
  return some(allowedIn, function(type) {
    return getParent(parent, type);
  });
}

function isWildcard(allowedIn) {
  return allowedIn.indexOf(WILDCARD) !== -1;
}