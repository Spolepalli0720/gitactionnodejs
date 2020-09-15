import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

//import { is } from 'bpmn-js/lib/util/ModelUtil';
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';


export default function (group, element, bpmnFactory, translate) {
    if (/^bpmn:/.test(element.type)) {
        if (!isAny(element, ['bpmn:Process', 'bpmn:Participant', 'bpmn:UserTask', 'bpmn:ScriptTask', 'bpmn:ServiceTask', 'bpmn:CallActivity'])) {
            iterateAttributes(group, element, element.type, bpmnFactory, translate);
        }
    } else {
        iterateAttributes(group, element, element.type, bpmnFactory, translate);
    }
    function iterateAttributes(group, element, elementType, bpmnFactory, translate) {
        const typeSplit = elementType.split(':')
        const moddleObject = bpmnFactory._model.registry.packageMap[typeSplit[0]].types.find(moddleObject => moddleObject.name === typeSplit[1]);
        if (moddleObject.properties) {
            moddleObject.properties.forEach((moddleProperty, propIndex) => {
                if (moddleProperty.type && moddleProperty.type === 'String' && moddleProperty.isAttr && moddleProperty.isAttr === true) {
                    if ('implementation' === moddleProperty.ns.localName) {
                        if (!element.businessObject.get('taskType')) {
                            var DEFAULT_OPTIONS = [
                                { value: '', name: translate('Select Option') },
                                { value: 'class', name: translate('Java Class') },
                                { value: 'expression', name: translate('Expression') },
                                { value: 'delegateExpression', name: translate('Delegate Expression') }
                            ];
                            var DMN_OPTION = [
                                { value: 'dmn', name: translate('DMN') }
                            ];
                            var EXTERNAL_OPTION = [
                                { value: 'external', name: translate('External') }
                            ];
                            var CONNECTOR_OPTION = [
                                { value: 'connector', name: translate('Connector') }
                            ];
                            var SCRIPT_OPTION = [
                                { value: 'script', name: translate('Script') }
                            ];
                            var selectOptions = DEFAULT_OPTIONS.concat([]);
                            if (element.businessObject && element.businessObject.get('taskType')) {
                                selectOptions = selectOptions.concat(CONNECTOR_OPTION);
                            }
                            group.entries.push(entryFactory.selectBox({
                                id: moddleProperty.ns.localName + '_' + propIndex,
                                description: translate(moddleProperty.desc || ''),
                                label: translate(moddleProperty.ns.localName.charAt(0).toUpperCase() + moddleProperty.ns.localName.slice(1)) + '(EP)',
                                selectOptions: selectOptions,
                                modelProperty: moddleProperty.ns.localName
                            }));
                        }
                    } else {
                        group.entries.push(entryFactory.textField({
                            id: moddleProperty.ns.localName + '_' + propIndex,
                            description: translate(moddleProperty.desc || ''),
                            label: translate(moddleProperty.ns.localName.charAt(0).toUpperCase() + moddleProperty.ns.localName.slice(1)) + '(EP)',
                            modelProperty: moddleProperty.ns.localName
                        }));
                    }
                } else if (moddleProperty.type && moddleProperty.type === 'Boolean' && moddleProperty.isAttr && moddleProperty.isAttr === true) {
                    group.entries.push(entryFactory.checkbox({
                        id: moddleProperty.ns.localName + '_' + propIndex,
                        description: translate(moddleProperty.desc || ''),
                        label: translate(moddleProperty.ns.localName.charAt(0).toUpperCase() + moddleProperty.ns.localName.slice(1)) + '(EP)',
                        modelProperty: moddleProperty.ns.localName
                    }));
                } else {
                    console.warn('ElementProperties :: Ignoring Property at index:', propIndex, ', for:', elementType, ', property:', moddleProperty);
                }
            });
        }
    }
}