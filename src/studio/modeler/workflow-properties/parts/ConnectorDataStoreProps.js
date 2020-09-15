var StudioConfig = require('../../StudioConfig');

var ImplementationTypeHelper = require('./helper/ImplementationTypeHelper'),
    inputOutputHelper = require('./helper/InputOutputHelper'),
    elementHelper = require('bpmn-js-properties-panel/lib/helper/ElementHelper'),
    entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory'),
    cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper'),
    each = require('lodash/forEach');


const REGEX_API_PARAM = /[^{]+(?=})/g

function getImplementationType(element) {
    return ImplementationTypeHelper.getImplementationType(element);
}

function isConnector(element) {
    return getImplementationType(element) === 'connector';
}

// function getBusinessObject(element) {
//   return ImplementationTypeHelper.getServiceTaskLikeBusinessObject(element);
// }

function getConnector(element) {
    return inputOutputHelper.getConnector(element);
}

function getInputOutput(element) {
    return inputOutputHelper.getInputOutput(element, isConnector(element));
}

function getInputParameters(element) {
    return inputOutputHelper.getInputParameters(element, isConnector(element));
}

function getOutputParameters(element) {
    return inputOutputHelper.getOutputParameters(element, isConnector(element));
}

function createElement(type, parent, factory, properties) {
    return elementHelper.createElement(type, properties, parent, factory);
}

function createInputOutput(parent, bpmnFactory, properties) {
    return createElement('custom:InputOutput', parent, bpmnFactory, properties);
}

function createParameter(type, parent, bpmnFactory, properties) {
    return createElement(type, parent, bpmnFactory, properties);
}

module.exports = function (group, element, bpmnFactory, translate) {

    var connectorConfig = StudioConfig.DATABASE_CONNECTOR[element.businessObject.get('storeType')];

    var inputOutput = getInputOutput(element);
    if (!inputOutput) {
        inputOutput = createInputOutput(getConnector(element), bpmnFactory, { inputParameters: [], outputParameters: [] });
        getConnector(element).set('inputOutput', inputOutput);
        // eslint-disable-next-line
        var responseParam = createParameter('custom:OutputParameter', getInputOutput(element), bpmnFactory, { name: 'response', value: '${response}', editable: false });
        // eslint-disable-next-line
        // var responseType = createParameter('custom:Script', responseParam, bpmnFactory, { scriptFormat: 'freemarker', value: '${S(response)}' });
        // responseParam.set('definition', responseType)
        getOutputParameters(element).push(responseParam);
    }

    var connectorId = entryFactory.selectBox({
        id: 'connectorId',
        label: translate('Connector'),
        modelProperty: 'connectorId',
        selectOptions: function (element, inputNode) {
            var selectOptions = [{ name: '', value: '' }];
            if (element.businessObject.get('storeType')) {
                selectOptions.push({ name: translate(getConnector(element).get('connectorId') || ''), value: getConnector(element).get('connectorId') || '' });
            } else {
                each(Object.keys(StudioConfig.DATABASE_CONNECTOR), function (connectorKey) {
                    selectOptions.push({ name: translate(connectorKey), value: connectorKey });
                });
            }
            return selectOptions;
        },
        get: function (element, node) {
            var value = getConnector(element).get('connectorId');
            return { connectorId: value };
        },
        set: function (element, values, node) {
            var commands = [];
            connectorConfig = StudioConfig.DATABASE_CONNECTOR[values.connectorId];
            commands.push(cmdHelper.updateBusinessObject(element, getConnector(element), {
                connectorId: values.connectorId || undefined,
                connectorType: values.connectorId || undefined,
                path: values.connectorId ? connectorConfig.urlFormat : undefined,
                version: undefined,
                method: undefined,
            }));
            var inParamArray = getInputParameters(element);
            commands.push(cmdHelper.removeElementsFromList(element, getInputOutput(element), 'inputParameters', null, inParamArray));
            return commands;
        },
        validate: function (element, values, node) {
            return isConnector(element) && !values.connectorId ? { connectorId: translate('Must select a value') } : {};
        },
        hidden: function (element, node) {
            if (element.businessObject.get('storeType')) {
                return true;
            } else {
                return !isConnector(element);
            }
        },
        disabled: function (element, node) {
            if (element.businessObject.get('storeType')) {
                return true;
            } else {
                return false;
            }
        }
    });
    group.entries.push(connectorId);

    if (connectorConfig) {
        var connectorType = entryFactory.selectBox({
            id: 'connectorType',
            label: translate('Connector'),
            modelProperty: 'connectorType',
            selectOptions: function (element, inputNode) {
                var selectOptions = [{ name: '', value: '' }];
                each(Object.keys(StudioConfig.DATABASE_CONNECTOR), function (connectorKey) {
                    selectOptions.push({ name: translate(connectorKey), value: connectorKey });
                });
                return selectOptions;
            },
            get: function (element, node) {
                var value = getConnector(element).get('connectorType');
                return { connectorType: value || '' };
            },
            set: function (element, values, node) {
                return cmdHelper.updateBusinessObject(element, getConnector(element), {
                    connectorType: values.connectorType || undefined
                });
            },
            validate: function (element, values, node) {
                return isConnector(element) && !values.connectorType ? { connectorType: translate('Must select a value') } : {};
            },
            hidden: function (element, node) {
                return !isConnector(element);
            },
            disabled: function (element, node) {
                if (element.businessObject.get('storeType')) {
                    return true;
                } else {
                    return false;
                }
            }
        });
        group.entries.push(connectorType);

        var connectorProps = entryFactory.selectBox({
            id: 'connectorConfig',
            label: translate('Configuration'),
            modelProperty: 'connectorConfig',
            selectOptions: function (element, inputNode) {
                var selectOptions = [{ name: '', value: '' }].concat(
                    StudioConfig.CONNECTOR_CONFIG.filter(config => config.group === 'DataStores' &&
                        config.template === getConnector(element).get('connectorType'))
                        .map(config => ({ name: config.title + ' (v' + config.version + ')', value: config.id }))
                );
                return selectOptions;
            },
            get: function (element, node) {
                var value = getConnector(element).get('connectorConfig');
                return { connectorConfig: value || '' };
            },
            set: function (element, values, node) {
                return cmdHelper.updateBusinessObject(element, getConnector(element), {
                    connectorConfig: values.connectorConfig || undefined
                });
            },
            validate: function (element, values, node) {
                return isConnector(element) && !values.connectorConfig ? { connectorConfig: translate('Must select a value') } : {};
            },
            hidden: function (element, node) {
                return !isConnector(element);
            },
            disabled: function (element, node) {
                if (element.businessObject.get('storeType')) {
                    return false;
                } else {
                    return false;
                }
            }
        });
        group.entries.push(connectorProps);

        if (!getConnector(element).get('path')) {
            getConnector(element).set('path', connectorConfig.urlFormat);
        }
    }

    // var selectVersion = entryFactory.selectBox({
    //     id: 'version',
    //     label: translate('Version'),
    //     modelProperty: 'version',
    //     selectOptions: function (element, inputNode) {
    //         var selectOptions = [{ name: '', value: '' }];
    //         if (connectorConfig) {
    //             each(connectorConfig.versions, function (option) {
    //                 if (option.value) {
    //                     selectOptions.push({ name: translate(option.name || option.value), value: option.value });
    //                 } else {
    //                     selectOptions.push({ name: translate(option), value: option });
    //                 }
    //             });
    //         }
    //         return selectOptions;
    //     },
    //     get: function (element, node) {
    //         var value = getConnector(element).get('version');
    //         return { version: value || '' };
    //     },
    //     set: function (element, values, node) {
    //         return cmdHelper.updateBusinessObject(element, getConnector(element), {
    //             version: values.version || undefined
    //         });
    //     },
    //     validate: function (element, values, node) {
    //         return isConnector(element) && !values.version ? { version: translate('Must select a value') } : {};
    //     },
    //     hidden: function (element, node) {
    //         return !isConnector(element);
    //     }
    // });
    // group.entries.push(selectVersion);

    var selectMethod = entryFactory.selectBox({
        id: 'method',
        label: translate('Operation'),
        modelProperty: 'method',
        selectOptions: function (element, inputNode) {
            var selectOptions = [{ name: '', value: '' }];
            if (connectorConfig) {
                each(connectorConfig.methods, function (option) {
                    if (option.value) {
                        selectOptions.push({ name: translate(option.name || option.value), value: option.value });
                    } else {
                        selectOptions.push({ name: translate(option), value: option });
                    }
                });
            }
            return selectOptions;
        },
        get: function (element, node) {
            var value = getConnector(element).get('method');
            return { method: value || '' };
        },
        set: function (element, values, node) {
            var commands = [];
            commands.push(cmdHelper.updateBusinessObject(element, getConnector(element), { method: values.method || undefined, customQuery: false }));
            var inParamArray = getInputParameters(element);
            commands.push(cmdHelper.removeElementsFromList(element, getInputOutput(element), 'inputParameters', null, inParamArray));

            if (values.method) {
                var inputParam;
                var inputOptions = connectorConfig.urlFormat.match(REGEX_API_PARAM) || [];
                inputOptions = inputOptions.filter(option => !(option.startsWith('DB_') || option.startsWith('AUTH_')));

                if ("SELECT" === values.method) {
                    if (inputOptions.length === 0) {
                        inputOptions.push('table');
                    }
                    inputOptions.push('filter');
                    inputOptions.push('fields');
                } else if ("INSERT" === values.method) {
                    if (inputOptions.length === 0) {
                        inputOptions.push('table');
                    }
                    inputOptions.push('payload');
                } else if ('UPDATE' === values.method) {
                    if (inputOptions.length === 0) {
                        inputOptions.push('table');
                    }
                    inputOptions.push('filter');
                    inputOptions.push('payload');
                } else if ("DELETE" === values.method) {
                    if (inputOptions.length === 0) {
                        inputOptions.push('table');
                    }
                    inputOptions.push('filter');
                } else {
                    inputOptions.push('query');
                }
                each(inputOptions, function (param) {
                    inputParam = createParameter('custom:InputParameter', getInputOutput(element), bpmnFactory, { name: param, editable: false });

                    if (['filter', 'fields', 'payload', 'query'].indexOf(param) >= 0) {
                        var inputType = createParameter('custom:Script', inputParam, bpmnFactory, { scriptFormat: 'json', value: '' });
                        inputParam.set('definition', inputType);
                    }
                    commands.push(cmdHelper.addElementsTolist(element, getInputOutput(element), 'inputParameters', [inputParam]));
                });
            }
            return commands;
        },
        validate: function (element, values, node) {
            return isConnector(element) && !values.method ? { method: translate('Must select a value') } : {};
        },
        hidden: function (element, node) {
            return !isConnector(element);
        }
    });
    group.entries.push(selectMethod);

};
