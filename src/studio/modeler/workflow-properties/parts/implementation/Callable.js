var cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper'),
    entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory'),
    elementHelper = require('bpmn-js-properties-panel/lib/helper/ElementHelper'),
    extensionElementsHelper = require('bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper');

var StudioConfig = require("../../../StudioConfig");

var resultVariable = require('./ResultVariable');

var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;
var is = require('bpmn-js/lib/util/ModelUtil').is;

var forEach = require('lodash/forEach');

var attributeInfo = {
    bpmn: {
        element: 'calledElement',
        binding: 'custom:calledElementBinding',
        version: 'custom:calledElementVersion',
        versionTag: 'custom:calledElementVersionTag',
        tenantId: 'custom:calledElementTenantId'
    },

    cmmn: {
        element: 'custom:caseRef',
        binding: 'custom:caseBinding',
        version: 'custom:caseVersion',
        tenantId: 'custom:caseTenantId'
    },

    dmn: {
        element: 'custom:decisionRef',
        binding: 'custom:decisionRefBinding',
        version: 'custom:decisionRefVersion',
        versionTag: 'custom:decisionRefVersionTag',
        tenantId: 'custom:decisionRefTenantId'
    }
};

var mapDecisionResultOptions = [
    {
        name: 'singleEntry (TypedValue)',
        value: 'singleEntry'
    },
    {
        name: 'singleResult (Map<String, Object>)',
        value: 'singleResult'
    },
    {
        name: 'collectEntries (List<Object>)',
        value: 'collectEntries'
    },
    {
        name: 'resultList (List<Map<String, Object>>)',
        value: 'resultList'
    }
];

var delegateVariableMappingOptions = [
    {
        name: 'variableMappingClass',
        value: 'variableMappingClass'
    },
    {
        name: 'variableMappingDelegateExpression',
        value: 'variableMappingDelegateExpression'
    }
];

function getCustomInWithBusinessKey(element) {
    var customIn = [],
        bo = getBusinessObject(element);

    var customInParams = extensionElementsHelper.getExtensionElements(bo, 'custom:In');
    if (customInParams) {
        forEach(customInParams, function (param) {
            if (param.businessKey !== undefined) {
                customIn.push(param);
            }
        });
    }
    return customIn;
}

function setBusinessKey(element, text, bpmnFactory) {
    var commands = [];

    var customInWithBusinessKey = getCustomInWithBusinessKey(element);

    if (customInWithBusinessKey.length) {
        commands.push(cmdHelper.updateBusinessObject(element, customInWithBusinessKey[0], {
            businessKey: text
        }));
    } else {
        var bo = getBusinessObject(element),
            extensionElements = bo.extensionElements;

        if (!extensionElements) {
            extensionElements = elementHelper.createElement('bpmn:ExtensionElements', { values: [] }, bo, bpmnFactory);
            commands.push(cmdHelper.updateProperties(element, { extensionElements: extensionElements }));
        }

        var customIn = elementHelper.createElement(
            'custom:In',
            { 'businessKey': text },
            extensionElements,
            bpmnFactory
        );

        commands.push(cmdHelper.addAndRemoveElementsFromList(
            element,
            extensionElements,
            'values',
            'extensionElements',
            [customIn], []
        ));
    }

    return commands;
}

function deleteBusinessKey(element) {
    var customInExtensions = getCustomInWithBusinessKey(element);
    var commands = [];
    forEach(customInExtensions, function (elem) {
        commands.push(extensionElementsHelper.removeEntry(getBusinessObject(element), element, elem));
    });
    return commands;
}

function isSupportedCallableType(type) {
    return ['bpmn', 'cmmn', 'dmn'].indexOf(type) !== -1;
}

module.exports = function (element, bpmnFactory, options, translate) {

    var bindingOptions = [
        {
            name: translate('latest'),
            value: 'latest'
        },
        {
            name: translate('deployment'),
            value: 'deployment'
        },
        {
            name: translate('version'),
            value: 'version'
        },
        {
            name: translate('versionTag'),
            value: 'versionTag'
        }
    ];

    var getCallableType = options.getCallableType;

    var entries = [];

    function getAttribute(element, prop) {
        var type = getCallableType(element);
        return (attributeInfo[type] || {})[prop];
    }

    function getCallActivityBindingValue(element) {
        var type = getCallableType(element);
        var bo = getBusinessObject(element);
        var attr = (attributeInfo[type] || {}).binding;
        return bo.get(attr);
    }

    function getDelegateVariableMappingType(element) {
        var bo = getBusinessObject(element);

        var boVariableMappingClass = bo.get('custom:variableMappingClass'),
            boVariableMappingDelegateExpression = bo.get('custom:variableMappingDelegateExpression');

        var delegateVariableMappingType = '';
        if (typeof boVariableMappingClass !== 'undefined') {
            delegateVariableMappingType = 'variableMappingClass';
        } else

            if (typeof boVariableMappingDelegateExpression !== 'undefined') {
                delegateVariableMappingType = 'variableMappingDelegateExpression';
            }

        return delegateVariableMappingType;
    }

    function triggerCreateRule(element, entryNode, inputNode, inputName) {
        document.dispatchEvent(new CustomEvent('createRule', { detail: { eventSource: element } }));
    }

    if ('bpmn' === getCallableType(element)) {
        var calledElement = entryFactory.selectBox({
            id: 'callable-element-ref',
            label: translate('Callable Process'),
            modelProperty: 'calledElement',
            selectOptions: function (element) {
                var options = [{ name: '', value: '' }]
                let currentValue = getBusinessObject(element).get('calledElement');
                if (currentValue) {
                    let matchingTasks = StudioConfig.CALLABLE_TASKS.filter(calledElementRef => calledElementRef.processId === currentValue);
                    if (matchingTasks.length === 0) {
                        options.push({ name: translate(currentValue), value: currentValue })
                    }
                }
                forEach(StudioConfig.CALLABLE_TASKS, function (callable) {
                    options.push({ name: translate(callable.name), value: callable.processId });
                });
                return options;
            },
            get: function (element, node) {
                return { calledElement: getBusinessObject(element).get('calledElement') || '' }
            },
            set: function (element, values, node) {
                var props = { calledElement: values.calledElement || '' };
                return cmdHelper.updateProperties(element, props);
            },
            validate: function (element, values, node) {
                var elementRef = values.calledElement;
                var type = getCallableType(element);
                return isSupportedCallableType(type) && !elementRef ? { calledElement: translate('Must provide a value') } : {};
            },
            hidden: function (element, node) {
                return !isSupportedCallableType(getCallableType(element));
            }
        });
        entries.push(calledElement);
    } else if ('dmn' === getCallableType(element)) {
        var decisionRef = entryFactory.selectBox({
            id: 'callable-element-ref',
            label: translate('Callable Rule'),
            modelProperty: 'decisionRef',
            selectOptions: function (element) {
                var options = [{ name: '', value: '' }]
                let currentValue = getBusinessObject(element).get('decisionRef');
                if (currentValue) {
                    let matchingRules = StudioConfig.CALLABLE_RULES.filter(decisionRef => decisionRef.decisionId === currentValue);
                    if (matchingRules.length === 0) {
                        options.push({ name: translate(currentValue), value: currentValue })
                    }
                }
                forEach(StudioConfig.CALLABLE_RULES, function (callable) {
                    options.push({ name: translate(callable.name), value: callable.decisionId });
                });
                return options;
            },
            get: function (element, node) {
                return { decisionRef: getBusinessObject(element).get('decisionRef') || '' }
            },
            set: function (element, values, node) {
                var props = { decisionRef: values.decisionRef || '' };
                return cmdHelper.updateProperties(element, props);
            },
            validate: function (element, values, node) {
                var elementRef = values.decisionRef;
                var type = getCallableType(element);
                return isSupportedCallableType(type) && !elementRef ? { decisionRef: translate('Must provide a value') } : {};
            },
            hidden: function (element, node) {
                return !isSupportedCallableType(getCallableType(element));
            }
        });
        let customHtml = '<label for="camunda-callable-element-ref" data-show="isHidden">Callable Rule</label>' +
            '<button for="camunda-callable-element-ref" title="Create Rule" data-show="isHidden" data-action="triggerCreateRule"' +
            ' style="width: 27px !important; position: relative; float: right; background-color: transparent; border-color: transparent; padding: 0; text-align: right;"' +
            '><i class="feather icon-plus-circle fa-lg"></i></button>' +
            '<select id="camunda-callable-element-ref-select" name="decisionRef" data-show="isHidden" data-value></select>';
        decisionRef.html = customHtml;
        decisionRef.triggerCreateRule = triggerCreateRule;
        entries.push(decisionRef);
    } else if ('cmmn' === getCallableType(element)) {
        entries.push(entryFactory.selectBox({
            id: 'callable-element-ref',
            label: translate('Callable Case'),
            modelProperty: 'caseRef',
            selectOptions: function (element) {
                var options = [{ name: '', value: '' }]
                let currentValue = getBusinessObject(element).get('caseRef');
                if (currentValue) {
                    let matchingCases = StudioConfig.CALLABLE_CASES.filter(caseRef => caseRef.caseId === currentValue);
                    if (matchingCases.length === 0) {
                        options.push({ name: translate(currentValue), value: currentValue })
                    }
                }
                forEach(StudioConfig.CALLABLE_CASES, function (callable) {
                    options.push({ name: translate(callable.name), value: callable.caseId });
                });
                return options;
            },
            get: function (element, node) {
                return { caseRef: getBusinessObject(element).get('caseRef') || '' }
            },
            set: function (element, values, node) {
                var props = { caseRef: values.caseRef || '' };
                return cmdHelper.updateProperties(element, props);
            },
            validate: function (element, values, node) {
                var elementRef = values.caseRef;
                var type = getCallableType(element);
                return isSupportedCallableType(type) && !elementRef ? { caseRef: translate('Must provide a value') } : {};
            },
            hidden: function (element, node) {
                return !isSupportedCallableType(getCallableType(element));
            }
        }));
    }

    entries.push(entryFactory.selectBox({
        id: 'callable-binding',
        label: translate('Binding'),
        selectOptions: function (element) {
            var type = getCallableType(element);
            var options;

            if (type === 'cmmn') {
                options = bindingOptions.filter(function (bindingOption) {
                    return bindingOption.value !== 'versionTag';
                });
            } else {
                options = bindingOptions;
            }
            return options;
        },
        modelProperty: 'callableBinding',

        get: function (element, node) {
            var callableBinding;

            var attr = getAttribute(element, 'binding');
            if (attr) {
                var bo = getBusinessObject(element);
                callableBinding = bo.get(attr) || 'latest';
            }

            return {
                callableBinding: callableBinding
            };
        },

        set: function (element, values, node) {
            var binding = values.callableBinding;
            var attr = getAttribute(element, 'binding'),
                attrVer = getAttribute(element, 'version'),
                attrVerTag = getAttribute(element, 'versionTag');

            var props = {};
            props[attr] = binding;

            // set version and versionTag values always to undefined to delete the existing value
            props[attrVer] = undefined;
            props[attrVerTag] = undefined;

            return cmdHelper.updateProperties(element, props);
        },

        hidden: function (element, node) {
            return !isSupportedCallableType(getCallableType(element));
        }

    }));

    entries.push(entryFactory.textField({
        id: 'callable-version',
        label: translate('Version'),
        modelProperty: 'callableVersion',

        get: function (element, node) {
            var callableVersion;

            var attr = getAttribute(element, 'version');
            if (attr) {
                var bo = getBusinessObject(element);
                callableVersion = bo.get(attr);
            }

            return {
                callableVersion: callableVersion
            };
        },

        set: function (element, values, node) {
            var version = values.callableVersion;
            var attr = getAttribute(element, 'version');

            var props = {};
            props[attr] = version || undefined;

            return cmdHelper.updateProperties(element, props);
        },

        validate: function (element, values, node) {
            var version = values.callableVersion;

            var type = getCallableType(element);
            return (
                isSupportedCallableType(type) &&
                getCallActivityBindingValue(element) === 'version' && (
                    !version ? { callableVersion: translate('Must provide a value') } : {}
                )
            );
        },

        hidden: function (element, node) {
            var type = getCallableType(element);
            return !isSupportedCallableType(type) || getCallActivityBindingValue(element) !== 'version';
        }

    }));

    entries.push(entryFactory.textField({
        id: 'callable-version-tag',
        label: translate('Version Tag'),
        modelProperty: 'versionTag',

        get: function (element, node) {
            var versionTag;

            var attr = getAttribute(element, 'versionTag');

            if (attr) {
                var bo = getBusinessObject(element);

                versionTag = bo.get(attr);
            }

            return {
                versionTag: versionTag
            };
        },

        set: function (element, values, node) {
            var versionTag = values.versionTag;

            var attr = getAttribute(element, 'versionTag');

            var props = {};

            props[attr] = versionTag || undefined;

            return cmdHelper.updateProperties(element, props);
        },

        validate: function (element, values, node) {
            var versionTag = values.versionTag;

            var type = getCallableType(element);

            return (
                isSupportedCallableType(type) &&
                getCallActivityBindingValue(element) === 'versionTag' && (
                    !versionTag ? { versionTag: translate('Must provide a value') } : {}
                )
            );
        },

        hidden: function (element, node) {
            var type = getCallableType(element);

            return !isSupportedCallableType(type) || getCallActivityBindingValue(element) !== 'versionTag';
        }

    }));

    entries.push(entryFactory.textField({
        id: 'tenant-id',
        label: translate('Tenant Id'),
        modelProperty: 'tenantId',

        get: function (element, node) {
            var tenantId;

            var attr = getAttribute(element, 'tenantId');
            if (attr) {
                var bo = getBusinessObject(element);
                tenantId = bo.get(attr);
            }

            return {
                tenantId: tenantId
            };
        },

        set: function (element, values, node) {
            var tenantId = values.tenantId;
            var attr = getAttribute(element, 'tenantId');

            var props = {};
            props[attr] = tenantId || undefined;

            return cmdHelper.updateProperties(element, props);
        },

        hidden: function (element, node) {
            var type = getCallableType(element);
            return !isSupportedCallableType(type);
        }

    }));

    if (is(getBusinessObject(element), 'bpmn:CallActivity')) {
        entries.push(entryFactory.checkbox({
            id: 'callable-business-key',
            label: translate('Business Key'),
            modelProperty: 'callableBusinessKey',

            get: function (element, node) {
                var customIn = getCustomInWithBusinessKey(element);

                return {
                    callableBusinessKey: !!(customIn && customIn.length > 0)
                };
            },

            set: function (element, values, node) {
                if (values.callableBusinessKey) {
                    return setBusinessKey(element, '#{execution.processBusinessKey}', bpmnFactory);
                } else {
                    return deleteBusinessKey(element);
                }
            }
        }));
    }

    entries.push(entryFactory.textField({
        id: 'business-key-expression',
        label: translate('Business Key Expression'),
        modelProperty: 'businessKey',

        get: function (element, node) {
            var customInWithBusinessKey = getCustomInWithBusinessKey(element);

            return {
                businessKey: (
                    customInWithBusinessKey.length ?
                        customInWithBusinessKey[0].get('custom:businessKey') :
                        undefined
                )
            };
        },

        set: function (element, values, node) {
            var businessKey = values.businessKey;

            return setBusinessKey(element, businessKey, bpmnFactory);
        },

        validate: function (element, values, node) {
            var businessKey = values.businessKey;

            return businessKey === '' ? { businessKey: translate('Must provide a value') } : {};
        },

        hidden: function (element, node) {
            return !getCustomInWithBusinessKey(element).length;
        }

    }));

    entries = entries.concat(resultVariable(element, bpmnFactory, {
        id: 'dmn-resultVariable',
        getBusinessObject: getBusinessObject,
        getImplementationType: getCallableType,
        hideResultVariable: function (element, node) {
            return getCallableType(element) !== 'dmn';
        }
    }, translate));

    entries.push(entryFactory.selectBox({
        id: 'dmn-map-decision-result',
        label: translate('Map Decision Result'),
        selectOptions: mapDecisionResultOptions,
        modelProperty: 'mapDecisionResult',

        get: function (element, node) {
            var bo = getBusinessObject(element);
            return {
                mapDecisionResult: bo.get('custom:mapDecisionResult') || 'resultList'
            };
        },

        set: function (element, values, node) {
            return cmdHelper.updateProperties(element, {
                'custom:mapDecisionResult': values.mapDecisionResult || 'resultList'
            });
        },

        hidden: function (element, node) {
            var bo = getBusinessObject(element);
            var resultVariable = bo.get('custom:resultVariable');
            return !(getCallableType(element) === 'dmn' && typeof resultVariable !== 'undefined');
        }

    }));


    entries.push(entryFactory.selectBox({
        id: 'delegateVariableMappingType',
        label: translate('Delegate Variable Mapping'),
        selectOptions: delegateVariableMappingOptions,
        emptyParameter: true,
        modelProperty: 'delegateVariableMappingType',

        get: function (element, node) {
            return {
                delegateVariableMappingType: getDelegateVariableMappingType(element)
            };
        },

        set: function (element, values, node) {
            var delegateVariableMappingType = values.delegateVariableMappingType;

            var props = {
                'custom:variableMappingClass': undefined,
                'custom:variableMappingDelegateExpression': undefined
            };

            if (delegateVariableMappingType === 'variableMappingClass') {
                props['custom:variableMappingClass'] = '';
            }
            else if (delegateVariableMappingType === 'variableMappingDelegateExpression') {
                props['custom:variableMappingDelegateExpression'] = '';
            }

            return cmdHelper.updateProperties(element, props);
        },

        hidden: function (element, node) {
            return (getCallableType(element) !== 'bpmn');
        }

    }));

    entries.push(entryFactory.textField({
        id: 'delegateVariableMapping',
        dataValueLabel: 'delegateVariableMappingLabel',
        modelProperty: 'delegateVariableMapping',

        get: function (element, node) {
            var bo = getBusinessObject(element);

            var label = '';
            var delegateVariableMapping = undefined;
            var type = getDelegateVariableMappingType(element);

            if (type === 'variableMappingClass') {
                label = translate('Class');
                delegateVariableMapping = bo.get('custom:variableMappingClass');
            }
            else if (type === 'variableMappingDelegateExpression') {
                label = translate('Delegate Expression');
                delegateVariableMapping = bo.get('custom:variableMappingDelegateExpression');
            }

            return {
                delegateVariableMapping: delegateVariableMapping,
                delegateVariableMappingLabel: label
            };
        },

        set: function (element, values, node) {
            var delegateVariableMapping = values.delegateVariableMapping;

            var attr = 'custom:' + getDelegateVariableMappingType(element);

            var props = {};
            props[attr] = delegateVariableMapping || undefined;

            return cmdHelper.updateProperties(element, props);
        },

        validate: function (element, values, node) {
            var delegateVariableMapping = values.delegateVariableMapping;
            return (
                getCallableType(element) === 'bpmn' && (
                    !delegateVariableMapping ? { delegateVariableMapping: translate('Must provide a value') } : {}
                )
            );
        },

        hidden: function (element, node) {
            return !(getCallableType(element) === 'bpmn' && getDelegateVariableMappingType(element) !== '');
        }

    }));

    return entries;
};
