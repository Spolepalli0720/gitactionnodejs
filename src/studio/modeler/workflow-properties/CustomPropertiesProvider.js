import inherits from 'inherits';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import PropertiesActivator from 'bpmn-js-properties-panel/lib/PropertiesActivator';

// bpmn properties
import documentationProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/DocumentationProps';
import eventProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/EventProps';
import executableProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/ExecutableProps';
// import idProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/IdProps';
import linkProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/LinkProps';
import nameProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/NameProps';
// import processProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/ProcessProps';
import processProps from './parts/ProcessProps';
// custom properties
//import elementProps from './parts/ElementProperties';

// moddle properties
import moddleProps from './parts/ModdleProperties';

// Input/Output
import inputOutput from './parts/InputOutputProps';
import inputOutputParameter from './parts/InputOutputParameterProps';

var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
    eventDefinitionHelper = require('bpmn-js-properties-panel/lib/helper/EventDefinitionHelper'),
    asyncCapableHelper = require('./parts/helper/AsyncCapableHelper'),
    implementationTypeHelper = require('./parts/helper/ImplementationTypeHelper');

var versionTag = require('./parts/VersionTagProps'),
    externalTaskConfiguration = require('./parts/ExternalTaskConfigurationProps'),
    multiInstanceProps = require('./parts/MultiInstanceLoopProps'),
    asynchronousContinuationProps = require('./parts/AsynchronousContinuationProps'),
    jobConfiguration = require('./parts/JobConfigurationProps'),
    tasklist = require('./parts/TasklistProps');

var errorProps = require('./parts/ErrorEventProps'),
    conditionalProps = require('./parts/ConditionalProps'),
    startEventInitiator = require('./parts/StartEventInitiator');

var formProps = require('./parts/FormProps'),
    serviceTaskDelegateProps = require('./parts/ServiceTaskDelegateProps'),
    propertiesProps = require('./parts/PropertiesProps'),
    variableMapping = require('./parts/VariableMappingProps'),
    listenerProps = require('./parts/ListenerProps'),
    listenerDetails = require('./parts/ListenerDetailProps'),
    listenerFields = require('./parts/ListenerFieldInjectionProps');

// Connector
var connectorServiceTaskProps = require('./parts/ConnectorServiceTaskProps'),
    connectorDataStoreProps = require('./parts/ConnectorDataStoreProps'),
    connectorInputOutput = require('./parts/ConnectorInputOutputProps'),
    connectorInputOutputParameter = require('./parts/ConnectorInputOutputParameterProps'),
    elementHelper = require('bpmn-js-properties-panel/lib/helper/ElementHelper');

var isExternalTaskPriorityEnabled = function (element) {
    var businessObject = getBusinessObject(element);

    // show only if element is a process, a participant ...
    //Pending Verification for the fix related to Unexpected mix of '||' and '&&'
    if ((is(element, 'bpmn:Process') || is(element, 'bpmn:Participant')) && businessObject.get('processRef')) {
        return true;
    }

    var externalBo = implementationTypeHelper.getServiceTaskLikeBusinessObject(element),
        isExternalTask = implementationTypeHelper.getImplementationType(externalBo) === 'external';

    // ... or an external task with selected external implementation type
    return !!implementationTypeHelper.isExternalCapable(externalBo) && isExternalTask;
};

var isJobConfigEnabled = function (element) {
    var businessObject = getBusinessObject(element);
    //Pending Verification for the fix related to Unexpected mix of '||' and '&&'
    if ((is(element, 'bpmn:Process') || is(element, 'bpmn:Participant')) && businessObject.get('processRef')) {
        return true;
    }

    // async behavior
    var bo = getBusinessObject(element);
    if (asyncCapableHelper.isAsyncBefore(bo) || asyncCapableHelper.isAsyncAfter(bo)) {
        return true;
    }

    // timer definition
    if (is(element, 'bpmn:Event')) {
        return !!eventDefinitionHelper.getTimerEventDefinition(element);
    }

    return false;
};

// The general tab contains all bpmn relevant properties.
// The properties are organized in groups.
function createGeneralTabGroups(element, bpmnFactory, canvas, elementRegistry, translate) {
    //refer to target element for external labels
    element = element.labelTarget || element;

    var generalGroup = {
        id: 'general',
        label: translate('General'),
        entries: []
    };

    // idProps(generalGroup, element, translate);
    nameProps(generalGroup, element, bpmnFactory, canvas, translate);
    processProps(generalGroup, element, translate);
    versionTag(generalGroup, element, translate);
    executableProps(generalGroup, element, translate);
    //PENDING :: elementTemplateChooserProps(generalGroup, element, elementTemplates, translate);
    //PENDING :: var customFieldsGroups = elementTemplateCustomProps(element, elementTemplates, bpmnFactory, translate);

    var detailsGroup = {
        id: 'details',
        label: translate('Details'),
        entries: []
    };
    //elementProps(detailsGroup, element, bpmnFactory, translate);
    serviceTaskDelegateProps(detailsGroup, element, bpmnFactory, translate);
    //INCLUDED IN Properties: userTaskProps(detailsGroup, element, translate);
    //INCLUDED IN Properties: scriptProps(detailsGroup, element, bpmnFactory, translate);
    linkProps(detailsGroup, element, translate);
    //INCLUDED IN Properties: callActivityProps(detailsGroup, element, bpmnFactory, translate);
    eventProps(detailsGroup, element, bpmnFactory, elementRegistry, translate);
    errorProps(detailsGroup, element, bpmnFactory, translate);
    conditionalProps(detailsGroup, element, bpmnFactory, translate);
    startEventInitiator(detailsGroup, element, translate); // this must be the last element of the details group!

    var externalTaskGroup = {
        id: 'externalTaskConfiguration',
        label: translate('External Task Configuration'),
        entries: [],
        enabled: isExternalTaskPriorityEnabled
    };
    externalTaskConfiguration(externalTaskGroup, element, bpmnFactory, translate);

    var multiInstanceGroup = {
        id: 'multiInstance',
        label: translate('Multi Instance'),
        entries: []
    };
    multiInstanceProps(multiInstanceGroup, element, bpmnFactory, translate);

    var asyncGroup = {
        id: 'async',
        label: translate('Asynchronous Continuations'),
        entries: []
    };
    asynchronousContinuationProps(asyncGroup, element, bpmnFactory, translate);

    var jobConfigurationGroup = {
        id: 'jobConfiguration',
        label: translate('Job Configuration'),
        entries: [],
        enabled: isJobConfigEnabled
    };
    jobConfiguration(jobConfigurationGroup, element, bpmnFactory, translate);

    var tasklistGroup = {
        id: 'tasklist',
        label: translate('Tasklist Configuration'),
        entries: []
    };
    tasklist(tasklistGroup, element, bpmnFactory, translate);


    var documentationGroup = {
        id: 'documentation',
        label: translate('Documentation'),
        entries: []
    };

    documentationProps(documentationGroup, element, bpmnFactory, translate);

    var groups = [];
    groups.push(generalGroup);
    // customFieldsGroups.forEach(function(group) {
    //   groups.push(group);
    // });
    groups.push(detailsGroup);
    groups.push(externalTaskGroup);
    groups.push(multiInstanceGroup);
    groups.push(asyncGroup);
    groups.push(jobConfigurationGroup);
    groups.push(tasklistGroup);
    groups.push(documentationGroup);

    return groups;

}

function createFormsTabGroups(element, bpmnFactory, elementRegistry, translate) {
    var formGroup = {
        id: 'forms',
        label: translate('Forms'),
        entries: []
    };
    formProps(formGroup, element, bpmnFactory, translate);

    return [
        formGroup
    ];
}

function createPropertiesTabGroups(element, bpmnFactory, canvas, elementRegistry, translate) {
    var propEntries = [];
    var options;

    if (is(element, 'bpmn:DataStoreReference') && (!('connector' === implementationTypeHelper.getImplementationType(element)))) {
        const businessObject = getBusinessObject(element);
        var extensionElements = businessObject.get('extensionElements');
        var connector;
        if (!extensionElements) {
            extensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, businessObject, bpmnFactory);
            connector = elementHelper.createElement('custom:Connector', { connectorId: '', connectorType: '' }, extensionElements, bpmnFactory);
            extensionElements.values.push(connector);
            businessObject.set('extensionElements', extensionElements);
        } else {
            connector = elementHelper.createElement('custom:Connector', { connectorId: '', connectorType: '' }, extensionElements, bpmnFactory);
            extensionElements.values.push(connector);
            businessObject.set('extensionElements', extensionElements);
        }
    }

    if ('connector' === implementationTypeHelper.getImplementationType(element)) {
        var connectorDetailsGroup = {
            id: 'connector-details',
            label: translate('Details'),
            entries: []
        };
        propEntries.push(connectorDetailsGroup);
        if (is(element, 'bpmn:DataStoreReference') || element.businessObject.get('storeType')) {
            connectorDataStoreProps(connectorDetailsGroup, element, bpmnFactory, translate);
        } else {
            connectorServiceTaskProps(connectorDetailsGroup, element, bpmnFactory, translate);
        }

        var connectorInputOutputGroup = {
            id: 'connector-input-output',
            label: translate('Input/Output'),
            entries: []
        };
        propEntries.push(connectorInputOutputGroup);
        options = connectorInputOutput(connectorInputOutputGroup, element, bpmnFactory, translate);

        var connectorInputOutputParameterGroup = {
            id: 'connector-input-output-parameter',
            entries: [],
            enabled: function (element, node) {
                return options.getSelectedParameter(element, node);
            },
            label: function (element, node) {
                var param = options.getSelectedParameter(element, node);
                return getInputOutputParameterLabel(param, translate);
            }
        };
        propEntries.push(connectorInputOutputParameterGroup);
        connectorInputOutputParameter(connectorInputOutputParameterGroup, element, bpmnFactory, options, translate);
    } else {
        var moddleProperties = {
            id: 'properties',
            label: translate('Properties'),
            entries: []
        };
        propEntries.push(moddleProperties);
        moddleProps(moddleProperties, element, bpmnFactory, translate);

        var variableProperties = {
            id: 'variables',
            label: translate('Variables'),
            entries: []
        };
        propEntries.push(variableProperties);
        variableMapping(variableProperties, element, bpmnFactory, translate);

        var inputOutputProperties = {
            id: 'input-output',
            label: translate('Input/Output'),
            entries: []
        };
        propEntries.push(inputOutputProperties);
        options = inputOutput(inputOutputProperties, element, bpmnFactory, translate);

        var inputOutputParameterProperties = {
            id: 'input-output-parameter',
            entries: [],
            enabled: function (element, node) {
                return options.getSelectedParameter(element, node);
            },
            label: function (element, node) {
                var param = options.getSelectedParameter(element, node);
                return getInputOutputParameterLabel(param, translate);
            }
        };
        propEntries.push(inputOutputParameterProperties);
        inputOutputParameter(inputOutputParameterProperties, element, bpmnFactory, options, translate);
    }
    return propEntries;
}

function getInputOutputParameterLabel(param, translate) {
    if (is(param, 'custom:InputParameter')) {
        return translate('Input Parameter');
    }

    if (is(param, 'custom:OutputParameter')) {
        return translate('Output Parameter');
    }

    return '';
};

var getListenerLabel = function (param, translate) {
    if (is(param, 'custom:ExecutionListener')) {
        return translate('Execution Listener');
    }

    if (is(param, 'custom:TaskListener')) {
        return translate('Task Listener');
    }

    return '';
};

function createListenersTabGroups(element, bpmnFactory, elementRegistry, translate) {

    var listenersGroup = {
        id: 'listeners',
        label: translate('Listeners'),
        entries: []
    };

    var options = listenerProps(listenersGroup, element, bpmnFactory, translate);

    var listenerDetailsGroup = {
        id: 'listener-details',
        entries: [],
        enabled: function (element, node) {
            return options.getSelectedListener(element, node);
        },
        label: function (element, node) {
            var param = options.getSelectedListener(element, node);
            return getListenerLabel(param, translate);
        }
    };

    listenerDetails(listenerDetailsGroup, element, bpmnFactory, options, translate);

    var listenerFieldsGroup = {
        id: 'listener-fields',
        label: translate('Field Injection'),
        entries: [],
        enabled: function (element, node) {
            return options.getSelectedListener(element, node);
        }
    };

    listenerFields(listenerFieldsGroup, element, bpmnFactory, options, translate);

    return [
        listenersGroup,
        listenerDetailsGroup,
        listenerFieldsGroup
    ];
}

function createExtensionElementsGroups(element, bpmnFactory, elementRegistry, translate) {

    var propertiesGroup = {
        id: 'extensionElements-properties',
        label: translate('Properties'),
        entries: []
    };
    propertiesProps(propertiesGroup, element, bpmnFactory, translate);

    return [
        propertiesGroup
    ];
}

export default function CustomPropertiesProvider(eventBus, bpmnFactory, canvas, elementRegistry, translate) {
    PropertiesActivator.call(this, eventBus);

    this.getTabs = function (element) {
        var generalTab = {
            id: 'generalTab',
            label: translate('General'),
            groups: createGeneralTabGroups(element, bpmnFactory, canvas, elementRegistry, translate)
        };

        var formsTab = {
            id: 'forms',
            label: translate('Forms'),
            groups: createFormsTabGroups(element, bpmnFactory, elementRegistry, translate)
        };

        var propertiesTab = {
            id: 'propertiesTab',
            label: translate('Properties'),
            groups: createPropertiesTabGroups(element, bpmnFactory, canvas, elementRegistry, translate)
        };

        var listenersTab = {
            id: 'listeners',
            label: translate('Listeners'),
            groups: createListenersTabGroups(element, bpmnFactory, elementRegistry, translate),
            enabled: function (element) {
                return !eventDefinitionHelper.getLinkEventDefinition(element)
                    || (!is(element, 'bpmn:IntermediateThrowEvent')
                        && eventDefinitionHelper.getLinkEventDefinition(element));
            }
        };

        var extensionsTab = {
            id: 'extensionElements',
            label: translate('Extensions'),
            groups: createExtensionElementsGroups(element, bpmnFactory, elementRegistry, translate)
        };

        return [
            generalTab,
            formsTab,
            propertiesTab,
            listenersTab,
            extensionsTab
        ];
    };
}

inherits(CustomPropertiesProvider, PropertiesActivator);

CustomPropertiesProvider.$inject = [
    'eventBus',
    'bpmnFactory',
    'canvas',
    'elementRegistry',
    'translate'
];
