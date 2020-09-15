import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
    cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper'),
    scriptImplementation = require('./implementation/Script'),
    dataStoreImplementation = require('./implementation/DataStore'),
    candidateStarter = require('./implementation/CandidateStarter'),
    historyTimeToLive = require('./implementation/HistoryTimeToLive'),
    flattenDeep = require('lodash/flattenDeep'),
    assign = require('lodash/assign'),
    implementationTypeHelper = require('./helper/ImplementationTypeHelper'),
    callableImplementation = require('./implementation/Callable');

export default function (group, element, bpmnFactory, translate) {
    if (element.businessObject.get('taskType')) {
        const elementType = 'custom:' + element.businessObject.get('taskType');
        iterateProperties(group, elementType, bpmnFactory, translate);
    } else if ((is(element, 'custom:Process') || is(element, 'bpmn:Participant')) && getBusinessObject(element).get('processRef')) {
        //Pending Verification for the fix related to Unexpected mix of '||' and '&&'
        processProperties(group, element, bpmnFactory, translate);
    } else if (is(element, 'bpmn:ScriptTask')) {
        scriptProperties(group, element, bpmnFactory, translate);
    } else if (implementationTypeHelper.isDmnCapable(element)) {
        if(getBusinessObject(element).get("decisionRef") !== undefined) {
            group.entries = group.entries.concat(callableImplementation(element, bpmnFactory, {
                getCallableType: getImplementationType
            }, translate));    
        }
    } else if (is(element, 'bpmn:CallActivity')) {
        callableProperties(group, element, bpmnFactory, translate);
    } else if (is(element, 'bpmn:DataStoreReference')) {
        if (is(element, 'bpmn:DataStoreReference')) {
            group.entries = group.entries.concat(dataStoreImplementation(element, bpmnFactory, translate));
        }
    } else if (/^bpmn:/.test(element.type)) {
        if (!isAny(element, ['bpmn:Process'])) {
            const elementType = 'custom:' + element.type.split(':')[1];
            iterateProperties(group, elementType, bpmnFactory, translate);
        }
    } else {
        iterateProperties(group, element.type, bpmnFactory, translate);
    }
    function processProperties(group, element, bpmnFactory, translate) {
        //Candidate Starter Configurations
        group.entries = group.entries.concat(candidateStarter(element, bpmnFactory, {
            getBusinessObject: function (element) {
                var bo = getBusinessObject(element);
                if (!is(bo, 'bpmn:Participant')) {
                    return bo;
                }
                return bo.get('processRef');
            }
        }, translate));

        //History Time To Live
        group.entries = group.entries.concat(historyTimeToLive(element, bpmnFactory, {
            getBusinessObject: function (element) {
                var bo = getBusinessObject(element);
                if (!is(bo, 'bpmn:Participant')) {
                    return bo;
                }
                return bo.get('processRef');
            }
        }, translate));

    }
    function iterateProperties(group, elementType, bpmnFactory, translate) {
        const typeSplit = elementType.split(':')
        var moddleObject;
        try {
            moddleObject = bpmnFactory._model.registry.packageMap[typeSplit[0]].types.find(moddleObject => moddleObject.name === typeSplit[1]);
        } catch (error) {
            console.warn('Unable to find packageMap for elementType:', elementType);
        }
        if (moddleObject && moddleObject.properties) {
            moddleObject.properties.forEach((moddleProperty, propIndex) => {
                if (moddleProperty.type && moddleProperty.type === 'String' && moddleProperty.isAttr && moddleProperty.isAttr === true) {
                    group.entries.push(entryFactory.textField({
                        id: element.id + '_moddle_' + propIndex,
                        description: translate(moddleProperty.desc || ''),
                        label: translate(moddleProperty.label || moddleProperty.ns.localName.charAt(0).toUpperCase() + moddleProperty.ns.localName.slice(1)),
                        modelProperty: moddleProperty.ns.localName
                    }));
                } else if (moddleProperty.type && moddleProperty.type === 'Boolean' && moddleProperty.isAttr && moddleProperty.isAttr === true) {
                    group.entries.push(entryFactory.checkbox({
                        id: element.id + '_moddle_' + propIndex,
                        description: translate(moddleProperty.desc || ''),
                        label: translate(moddleProperty.label || moddleProperty.ns.localName.charAt(0).toUpperCase() + moddleProperty.ns.localName.slice(1)),
                        modelProperty: moddleProperty.ns.localName
                    }));
                } else if (moddleProperty.type && moddleProperty.type === 'custom:Choose' && moddleProperty.isAttr && moddleProperty.isAttr === true) {
                    group.entries.push(entryFactory.selectBox({
                        id: moddleProperty.ns.localName + '_' + propIndex,
                        description: translate(moddleProperty.desc || ''),
                        label: translate(moddleProperty.label || moddleProperty.ns.localName.charAt(0).toUpperCase() + moddleProperty.ns.localName.slice(1)),
                        selectOptions: moddleProperty.selectOptions,
                        modelProperty: moddleProperty.ns.localName
                    }));
                } else {
                    console.warn('ModdelProperties :: Ignoring Property at index:', propIndex, ', for:', elementType, ', property:', moddleProperty);
                }
            });
        }
    }
    function scriptProperties(group, element, bpmnFactory, translate) {
        var bo = getBusinessObject(element);
        if (!bo) {
            return;
        }
        var script = scriptImplementation('scriptFormat', 'script', false, translate);
        group.entries.push({
            id: 'script-implementation',
            label: translate('Script'),
            html: script.template,
            get: function (element) {
                return script.get(element, bo);
            },
            set: function (element, values, containerElement) {
                var properties = script.set(element, values, containerElement);
                return cmdHelper.updateProperties(element, properties);
            },
            validate: function (element, values) {
                return script.validate(element, values);
            },
            script: script,
            cssClasses: ['bpp-textfield']
        });

        group.entries.push(entryFactory.textField({
            id: 'scriptResultVariable',
            label: translate('Result Variable'),
            modelProperty: 'scriptResultVariable',
            get: function (element, propertyName) {
                var boResultVariable = bo.get('custom:resultVariable');
                return { scriptResultVariable: boResultVariable };
            },
            set: function (element, values, containerElement) {
                return cmdHelper.updateProperties(element, {
                    'custom:resultVariable': values.scriptResultVariable.length
                        ? values.scriptResultVariable
                        : undefined
                });
            }
        }));
    }
    function callableProperties(group, element, bpmnFactory, translate) {
        var DEFAULT_PROPS = {
            calledElement: undefined,
            'custom:calledElementBinding': 'latest',
            'custom:calledElementVersion': undefined,
            'custom:calledElementTenantId': undefined,
            'custom:variableMappingClass': undefined,
            'custom:variableMappingDelegateExpression': undefined,
            'custom:caseRef': undefined,
            'custom:caseBinding': 'latest',
            'custom:caseVersion': undefined,
            'custom:caseTenantId': undefined
        };

        group.entries.push(entryFactory.selectBox({
            id: 'callActivity',
            label: translate('Callable Type'),
            emptyParameter: true,
            selectOptions: [
                { name: translate('Business Process'), value: 'bpmn' },
                { name: translate('Case Management'), value: 'cmmn' }
            ],
            modelProperty: 'callActivityType',

            get: function (element, node) {
                return {
                    callActivityType: getCallableType(element)
                };
            },

            set: function (element, values, node) {
                var type = values.callActivityType;
                var props = assign({}, DEFAULT_PROPS);
                if (type === 'bpmn') {
                    props.calledElement = '';
                } else if (type === 'cmmn') {
                    props['custom:caseRef'] = '';
                }
                return cmdHelper.updateProperties(element, props);
            }
        }));

        group.entries.push(callableImplementation(element, bpmnFactory, {
            getCallableType: getCallableType
        }, translate));

        group.entries = flattenDeep(group.entries);

    }
    function getCallableType(element) {
        var bo = getBusinessObject(element);
        var boCalledElement = bo.get('calledElement'),
            boCaseRef = bo.get('custom:caseRef');
        var callActivityType = '';
        if (typeof boCalledElement !== 'undefined') {
            callActivityType = 'bpmn';
        } else if (typeof boCaseRef !== 'undefined') {
            callActivityType = 'cmmn';
        }
        return callActivityType;
    }
    function getImplementationType(element) {
        return implementationTypeHelper.getImplementationType(element);
    }
    
}