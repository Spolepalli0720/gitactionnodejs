import { assign, forEach } from 'min-dash';
import { domify } from 'min-dom';
import { getImage as getWorkflowImage } from '../StudioImageMap'

var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
    elementHelper = require('bpmn-js-properties-panel/lib/helper/ElementHelper');

export default class CustomPalette {

    constructor(config, bpmnFactory, create, elementFactory, palette, translate) {
        this.studioConfig = config;
        this.bpmnFactory = bpmnFactory;
        this.create = create;
        this.elementFactory = elementFactory;
        this.translate = translate;

        //Customization to Separate Palette from the Diagram
        var studioPalette =  document.querySelector(config.paletteContainer);
        if(!studioPalette) {
            studioPalette = domify('<div />');
            studioPalette.style.display = 'none';
        }
        var paletteContainer = palette._canvas._container;
        palette._canvas._container = studioPalette;
        palette._init();
        palette._canvas._container = paletteContainer;
        
        palette.registerProvider(this);
    }

}

CustomPalette.$inject = [ 'config', 'bpmnFactory', 'create', 'elementFactory', 'palette', 'translate' ];

CustomPalette.prototype.getPaletteEntries = function(element) {
    const { studioConfig, bpmnFactory, create, elementFactory, translate } = this;
    // console.log('CustomPalette.studioConfig:', studioConfig);
    var actions = { };
    //Default Groups: tools, event, gateway, activity, data-object, data-store, collaboration, artifact
    // Example:
    // 'create.subprocess-expanded': createAction('bpmn:SubProcess', 'activity', 'bpmn-icon-subprocess-expanded', 'Create expanded SubProcess',{ isExpanded: true })
    // 'create.user-task': createAction('bpmn:Task', 'activity', 'bpmn-icon-task')
  
    function createAction(type, group, className, title, options) {

        function createListener(event) {
            //const shape = elementFactory.createShape(assign({ type: type, paletteGroup: group }, options));
            var shape;
            if (options && options.eventType ) {
                shape = elementFactory.createShape(assign({ type: type, eventDefinitionType: options.eventType, paletteGroup: group }, options));
            } else {
                shape = elementFactory.createShape(assign({ type: type, paletteGroup: group }, options));
            }

            if(options && 'false' === options.eventCancel && shape.businessObject) {
                shape.businessObject.set('cancelActivity', false);
            }

            if (shape.businessObject && options && options.userType) {
                shape.businessObject.set('userType', options.userType);
            } else if (shape.businessObject && options && options.dataType) {
                shape.businessObject.set('dataType', options.dataType);
            } else if (shape.businessObject && options && (options.taskType || options.storeType)) {
                if (options.taskType) {
                    shape.businessObject.set('taskType', options.taskType);
                } else if (options.storeType) {
                    shape.businessObject.set('storeType', options.storeType);
                }
                const businessObject = getBusinessObject(shape);
                var extensionElements = businessObject.get('extensionElements');
                var connector;
                var connectorId = options.connectorId || options.taskType || options.storeType;

                if (!extensionElements) {
                    extensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, businessObject, bpmnFactory);
                    connector = elementHelper.createElement('custom:Connector', { 
                        connectorId: connectorId,
                        connectorType: options.taskType || options.storeType,
                        connectorGroup: group
                    }, extensionElements, bpmnFactory);
                    extensionElements.values.push(connector);
                    businessObject.set('extensionElements', extensionElements);
                 }  else {
                   connector = elementHelper.createElement('custom:Connector', { 
                       connectorId: connectorId, 
                       connectorType: options.taskType || options.storeType,
                       connectorGroup: group
                    }, extensionElements, bpmnFactory);
                   extensionElements.values.push(connector);
                   businessObject.set('extensionElements', extensionElements);
                 }
            }

            if (options && options.isExpanded && shape.businessObject && shape.businessObject.di) {
                shape.businessObject.di.isExpanded = options.isExpanded;
            }
            create.start(event, shape);
        }
  
        var shortType = type.replace(/^[^:]*:/g, '')
  
        var action = {
            group: group,
            title: translate(title) || translate('Create ' + shortType)
        };
      
        if (options && options.imageUrl ) {
            assign(action, {'imageUrl': options.imageUrl})
        } else if (options && options.userType ) {
            assign(action, {'imageUrl': getWorkflowImage(options.userType) })
        } else if (options && options.dataType ) {
            assign(action, {'imageUrl': getWorkflowImage(options.dataType) })
        } else if (options && options.storeType ) {
            assign(action, {'imageUrl': getWorkflowImage(options.storeType) })
        } else if (options && options.taskType ) {
            assign(action, {'imageUrl': getWorkflowImage(options.taskType) })
        } else {
            assign(action, {'className': className})
        }
  
        if (options && options.action ) {
            assign(action, {'action': options.action});
        } else {
            assign(action, {'action': {'dragstart': createListener, 'click': createListener}});
        }
  
        return action;
    }
  
    // Custom Tasks  :  StudioConfig.WORKFLOW_TASKS
    forEach(studioConfig.paletteItems, function(taskInfo, taskIndex) {
        let taskPrefix = 'bpmn:';
        let taskSuffix = ['DataStore', 'DataObject'].indexOf(taskInfo.type) >= 0 ? 'Reference' : '';
        let taskType = taskPrefix + taskInfo.type + taskSuffix;
        let taskTitle = 'Create ' + taskInfo.name + (taskInfo.type === 'UserTask' ? ' Task' : ' Reference');
        let taskGroup = taskInfo.group.replace(" ", "-");
        let taskOptions = { };
        if(taskInfo.image.endsWith(".png") || taskInfo.image.endsWith(".jpg") || taskInfo.image.endsWith(".jpeg") || taskInfo.image.endsWith(".svg")) {
            taskOptions.imageUrl = taskInfo.image;
        } else if("UserTask" === taskInfo.type) {
            taskOptions.userType = taskInfo.image;
        } else if("DataObject" === taskInfo.type) {
            taskOptions.dataType = taskInfo.image;
        } else if("DataStore" === taskInfo.type) {
            taskOptions.storeType = taskInfo.image;
        } else if("ServiceTask" === taskInfo.type) {
            taskOptions.taskType = taskInfo.image;
        }

        if(taskInfo.implType) {
            taskOptions.connectorId = taskInfo.implType;
        }

        assign(actions, {
            ['custom.task-'+taskIndex]: createAction(taskType, taskGroup, '', taskTitle, taskOptions )
        });
    });

    if(studioConfig.studioType === 'WORKFLOW') {
        // Addititional Built-IN Activities
        assign(actions, {
            'separator-start-event': { group: 'event', separator: true},
            'create.start-event-message': createAction('bpmn:StartEvent', 'event', 'bpmn-icon-start-event-message', 'Create Message Start Event', {eventType: 'bpmn:MessageEventDefinition'}),
            'create.start-event-timer': createAction('bpmn:StartEvent', 'event', 'bpmn-icon-start-event-timer', 'Create Timer Start Event', {eventType: 'bpmn:TimerEventDefinition'}),
            'create.start-event-condition': createAction('bpmn:StartEvent', 'event', 'bpmn-icon-start-event-condition', 'Create Conditional Start Event', {eventType: 'bpmn:ConditionalEventDefinition'}),
            'create.start-event-signal': createAction('bpmn:StartEvent', 'event', 'bpmn-icon-start-event-signal', 'Create Signal Start Event', {eventType: 'bpmn:SignalEventDefinition'}),

            'separator-intermediate-event': { group: 'event', separator: true},
            'create.intermediate-event-catch-message': createAction('bpmn:IntermediateCatchEvent', 'event', 'bpmn-icon-intermediate-event-catch-message', 'Create Message Intermediate Catch Event', {eventType: 'bpmn:MessageEventDefinition'}),
            'create.intermediate-event-throw-message': createAction('bpmn:IntermediateThrowEvent', 'event', 'bpmn-icon-intermediate-event-throw-message', 'Create Message Intermediate Throw Event', {eventType: 'bpmn:MessageEventDefinition'}),
            'create.intermediate-event-catch-timer': createAction('bpmn:IntermediateCatchEvent', 'event', 'bpmn-icon-intermediate-event-catch-timer', 'Create Timer Intermediate Catch Event', {eventType: 'bpmn:TimerEventDefinition'}),
            'create.intermediate-event-throw-escalation': createAction('bpmn:IntermediateThrowEvent', 'event', 'bpmn-icon-intermediate-event-throw-escalation', 'Create Escalation Intermediate Throw Event', {eventType: 'bpmn:EscalationEventDefinition'}),
            'create.intermediate-event-catch-condition': createAction('bpmn:IntermediateCatchEvent', 'event', 'bpmn-icon-intermediate-event-catch-condition', 'Create Conditional Intermediate Catch Event', {eventType: 'bpmn:ConditionalEventDefinition'}),
            'create.intermediate-event-catch-link': createAction('bpmn:IntermediateCatchEvent', 'event', 'bpmn-icon-intermediate-event-catch-link', 'Create Link Intermediate Catch Event', {eventType: 'bpmn:LinkEventDefinition'}),
            'create.intermediate-event-throw-link': createAction('bpmn:IntermediateThrowEvent', 'event', 'bpmn-icon-intermediate-event-throw-link', 'Create Link Intermediate Throw Event', {eventType: 'bpmn:LinkEventDefinition'}),
            'create.intermediate-event-throw-compensation': createAction('bpmn:IntermediateThrowEvent', 'event', 'bpmn-icon-intermediate-event-throw-compensation', 'Create Compensation Intermediate Throw Event', {eventType: 'bpmn:CompensateEventDefinition'}),
            'create.intermediate-event-catch-signal': createAction('bpmn:IntermediateCatchEvent', 'event', 'bpmn-icon-intermediate-event-catch-signal', 'Create Signal Intermediate Catch Event', {eventType: 'bpmn:SignalEventDefinition'}),
            'create.intermediate-event-throw-signal': createAction('bpmn:IntermediateThrowEvent', 'event', 'bpmn-icon-intermediate-event-throw-signal', 'Create Signal Intermediate Throw Event', {eventType: 'bpmn:SignalEventDefinition'}),

            'separator-boundary-event': { group: 'event', separator: true},
            'attach.boundary-event-catch-message': createAction('bpmn:BoundaryEvent', 'event', 'bpmn-icon-intermediate-event-catch-message', 'Attach Message Boundary Event', {eventType: 'bpmn:MessageEventDefinition'}),
            'attach.boundary-event-catch-timer': createAction('bpmn:BoundaryEvent', 'event', 'bpmn-icon-intermediate-event-catch-timer', 'Attach Timer Boundary Event', {eventType: 'bpmn:TimerEventDefinition'}),
            'attach.boundary-event-catch-escalation': createAction('bpmn:BoundaryEvent', 'event', 'bpmn-icon-intermediate-event-catch-escalation', 'Attach Escalation Boundary Event', {eventType: 'bpmn:EscalationEventDefinition'}),
            'attach.boundary-event-catch-condition': createAction('bpmn:BoundaryEvent', 'event', 'bpmn-icon-intermediate-event-catch-condition', 'Attach Conditional Boundary Event', {eventType: 'bpmn:ConditionalEventDefinition'}),
            'attach.boundary-event-error': createAction('bpmn:BoundaryEvent', 'event', 'bpmn-icon-intermediate-event-catch-error', 'Attach Error Boundary Event', {eventType: 'bpmn:ErrorEventDefinition'}),
            'attach.boundary-event-cancel': createAction('bpmn:BoundaryEvent', 'event', 'bpmn-icon-intermediate-event-catch-cancel', 'Attach Cancel Boundary Event', {eventType: 'bpmn:CancelEventDefinition'}),
            'attach.boundary-event-catch-signal': createAction('bpmn:BoundaryEvent', 'event', 'bpmn-icon-intermediate-event-catch-signal', 'Attach Signal Boundary Event', {eventType: 'bpmn:SignalEventDefinition'}),
            'attach.boundary-event-catch-compensation': createAction('bpmn:BoundaryEvent', 'event', 'bpmn-icon-intermediate-event-catch-compensation', 'Attach Compensation Boundary Event', {eventType: 'bpmn:CompensateEventDefinition'}),
            'attach.boundary-event-catch-non-interrupting-message': createAction('bpmn:BoundaryEvent', 'event', 'bpmn-icon-intermediate-event-catch-non-interrupting-message', 'Attach Message Boundary Event (non-interrupting)', {eventType: 'bpmn:MessageEventDefinition', eventCancel: 'false'}),
            'attach.boundary-event-catch-non-interrupting-timer': createAction('bpmn:BoundaryEvent', 'event', 'bpmn-icon-intermediate-event-catch-non-interrupting-timer', 'Attach Timer Boundary Event (non-interrupting)', {eventType: 'bpmn:TimerEventDefinition', eventCancel: 'false'}),
            'attach.boundary-event-catch-non-interrupting-escalation': createAction('bpmn:BoundaryEvent', 'event', 'bpmn-icon-intermediate-event-catch-non-interrupting-escalation', 'Attach Escalation Boundary Event (non-interrupting)', {eventType: 'bpmn:EscalationEventDefinition', eventCancel: 'false'}),
            'attach.boundary-event-catch-non-interrupting-condition': createAction('bpmn:BoundaryEvent', 'event', 'bpmn-icon-intermediate-event-catch-non-interrupting-condition', 'Attach Conditional Boundary Event (non-interrupting)', {eventType: 'bpmn:ConditionalEventDefinition', eventCancel: 'false'}),
            'attach.boundary-event-catch-non-interrupting-signal': createAction('bpmn:BoundaryEvent', 'event', 'bpmn-icon-intermediate-event-catch-non-interrupting-signal', 'Attach Signal Boundary Event (non-interrupting)', {eventType: 'bpmn:SignalEventDefinition', eventCancel: 'false'}),

            'separator-end-event': { group: 'event', separator: true},
            'create.end-event-message': createAction('bpmn:EndEvent', 'event', 'bpmn-icon-end-event-message', 'Create Message End Event', {eventType: 'bpmn:MessageEventDefinition'}),
            'create.end-event-escalation': createAction('bpmn:EndEvent', 'event', 'bpmn-icon-end-event-escalation', 'Create Escalation End Event', {eventType: 'bpmn:EscalationEventDefinition'}),
            'create.end-event-error': createAction('bpmn:EndEvent', 'event', 'bpmn-icon-end-event-error', 'Create Error End Event', {eventType: 'bpmn:ErrorEventDefinition'}),
            'create.end-event-compensation': createAction('bpmn:EndEvent', 'event', 'bpmn-icon-end-event-compensation', 'Create Compensation End Event', {eventType: 'bpmn:CompensateEventDefinition'}),
            'create.end-event-signal': createAction('bpmn:EndEvent', 'event', 'bpmn-icon-end-event-signal', 'Create Signal End Event', {eventType: 'bpmn:SignalEventDefinition'}),
            'create.end-event-terminate': createAction('bpmn:EndEvent', 'event', 'bpmn-icon-end-event-terminate', 'Create Terminate End Event', {eventType: 'bpmn:TerminateEventDefinition'}),

            'create.exclusive-gateway': createAction('bpmn:ExclusiveGateway', 'gateway', 'bpmn-icon-gateway-xor', 'Create Exclusive Gateway'),
            'create.parallel-gateway': createAction('bpmn:ParallelGateway', 'gateway', 'bpmn-icon-gateway-parallel', 'Create Parallel Gateway'),
            'create.inclusive-gateway': createAction('bpmn:InclusiveGateway', 'gateway', 'bpmn-icon-gateway-or', 'Create Inclusive Gateway'),
            'create.complex-gateway': createAction('bpmn:ComplexGateway', 'gateway', 'bpmn-icon-gateway-complex', 'Create Complex Gateway'),
            'create.eventbased-gateway': createAction('bpmn:EventBasedGateway', 'gateway', 'bpmn-icon-gateway-eventbased', 'Create Event based Gateway'),

            'create.send-task': createAction('bpmn:SendTask', 'activity', 'bpmn-icon-send-task', 'Create Send Task'),
            'create.receive-task': createAction('bpmn:ReceiveTask', 'activity', 'bpmn-icon-receive-task', 'Create Receive Task'),
            'create.user-task': createAction('bpmn:UserTask', 'activity', 'bpmn-icon-user-task', 'Create User Task'),
            'create.manual-task': createAction('bpmn:ManualTask', 'activity', 'bpmn-icon-manual-task', 'Create Manual Task'),
            'create.business-rule-task': createAction('bpmn:BusinessRuleTask', 'activity', 'bpmn-icon-business-rule-task', 'Create Business Rule Task'),
            'create.service-task': createAction('bpmn:ServiceTask', 'activity', 'bpmn-icon-service-task', 'Create Service Task'),
            'create.script-task': createAction('bpmn:ScriptTask', 'activity', 'bpmn-icon-script-task', 'Create Script Task'),
            'create.call-activity-task': createAction('bpmn:CallActivity', 'activity', 'bpmn-icon-call-activity', 'Create Call Activity Task'),
        });
    } else if(studioConfig.studioType === 'RULEFLOW') {
        assign(actions, {
            'create.task': createAction( 'bpmn:Task', 'inputs', 'bpmn-icon-task', 'Create Task'),
            'create.business-rule-task': createAction('bpmn:BusinessRuleTask', 'decisions', 'bpmn-icon-business-rule-task', 'Create Business Rule Task'),
            'create.script-task': createAction('bpmn:ScriptTask', 'decisions', 'bpmn-icon-script-task', 'Create Script Task'),
        });
    }
  
    return actions;
}