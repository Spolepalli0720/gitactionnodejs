var StudioConfig = require('../../StudioConfig');

var implementationTypeHelper = require('./helper/ImplementationTypeHelper'),
    inputOutputHelper = require('./helper/InputOutputHelper'),
    elementHelper = require('bpmn-js-properties-panel/lib/helper/ElementHelper'),
    entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory'),
    cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper'),
    each = require('lodash/forEach');


const REGEX_API_PARAM = /[^{]+(?=})/g

function getImplementationType(element) {
    return implementationTypeHelper.getImplementationType(element);
}

function isConnector(element) {
    return getImplementationType(element) === 'connector';
}

// function getBusinessObject(element) {
//   return implementationTypeHelper.getServiceTaskLikeBusinessObject(element);
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

    const connectorConfig = StudioConfig.SERVICE_CONNECTOR[element.businessObject.get('taskType')] || {};

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

    const RESERVED_PARAMS = [
        'SELECTED_VERSION', 'EMAIL_CONFIG', 'AMQP_CONFIG', 'KAFKA_CONFIG'
    ];

    var connectorId = entryFactory.selectBox({
        id: 'connectorId',
        label: translate('Connector'),
        modelProperty: 'connectorId',
        selectOptions: function (element, inputNode) {
            var selectOptions = [{ name: '', value: '' }];
            if (element.businessObject.get('taskType')) {
                selectOptions.push({ name: translate(getConnector(element).get('connectorId') || ''), value: getConnector(element).get('connectorId') || '' });
            } else {
                var connectOptions = ["HTTP", "REST", "SOAP"];
                each(connectOptions, function (option) {
                    selectOptions.push({ name: translate(option), value: option });
                });
            }
            return selectOptions;
        },
        get: function (element, node) {
            var value = getConnector(element).get('connectorId');
            return { connectorId: value };
        },
        set: function (element, values, node) {
            return cmdHelper.updateBusinessObject(element, getConnector(element), {
                connectorId: values.connectorId || undefined, path: undefined, version: undefined, method: undefined
            });
        },
        validate: function (element, values, node) {
            return isConnector(element) && !values.connectorId ? { connectorId: translate('Must select a value') } : {};
        },
        hidden: function (element, node) {
            if (element.businessObject.get('taskType')) {
                return true;
            } else {
                return !isConnector(element);
            }
        },
        disabled: function (element, node) {
            if (element.businessObject.get('taskType')) {
                return true;
            } else {
                return false;
            }
        }
    });
    group.entries.push(connectorId);

    if (element.businessObject.get('taskType')) {
        var connectorType = entryFactory.selectBox({
            id: 'connectorType',
            label: translate('Connector'),
            modelProperty: 'connectorType',
            selectOptions: function (element, inputNode) {
                var selectOptions = [{ name: '', value: '' }];
                selectOptions.push({ name: translate(getConnector(element).get('connectorType') || ''), value: getConnector(element).get('connectorType') || '' });
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
                if (element.businessObject.get('taskType')) {
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
                    StudioConfig.CONNECTOR_CONFIG.filter(config => config.group?.toLowerCase() === getConnector(element).get('connectorGroup').toLowerCase() &&
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

        // if (connectorConfig.regions) {
        //     var serviceRegion = entryFactory.selectBox({
        //         id: 'serviceRegion',
        //         label: translate('Region'),
        //         modelProperty: 'region',
        //         selectOptions: function (element, inputNode) {
        //             var selectOptions = [{ name: '', value: '' }];
        //             each(connectorConfig.regions, function (option) {
        //                 selectOptions.push({ name: translate(option.name), value: option.value });
        //             });
        //             return selectOptions;
        //         },
        //         get: function (element, node) {
        //             var value = getConnector(element).get('region');
        //             return { region: value || '' };
        //         },
        //         set: function (element, values, node) {
        //             return cmdHelper.updateBusinessObject(element, getConnector(element), {
        //                 region: values.region || undefined
        //             });
        //         },
        //         validate: function (element, values, node) {
        //             return isConnector(element) && !values.region ? { region: translate('Must select a value') } : {};
        //         },
        //         hidden: function (element, node) {
        //             return !isConnector(element);
        //         }
        //     });
        //     group.entries.push(serviceRegion);
        // }

        if (connectorConfig.tags) {
            var serviceTag = entryFactory.selectBox({
                id: 'serviceTag',
                label: translate(connectorConfig.label_tag || 'Group'),
                modelProperty: 'tag',
                selectOptions: function (element, inputNode) {
                    var selectOptions = [{ name: '', value: '' }];
                    each(connectorConfig.tags, function (option) {
                        selectOptions.push({ name: translate(option.name), value: option.value });
                    });
                    return selectOptions;
                },
                get: function (element, node) {
                    var value = getConnector(element).get('tag');
                    return { tag: value || '' };
                },
                set: function (element, values, node) {
                    var commands = [];
                    clearInputParameters(element, commands, 'path');
                    clearInputParameters(element, commands, 'method');
                    commands.push(cmdHelper.updateBusinessObject(element, getConnector(element), {
                        tag: values.tag || undefined, path: undefined, version: undefined, method: undefined
                    }));
                    return commands;
                },
                validate: function (element, values, node) {
                    return isConnector(element) && !values.tag ? { tag: translate('Must select a value') } : {};
                },
                hidden: function (element, node) {
                    return !isConnector(element);
                }
            });
            group.entries.push(serviceTag);
        }

        if (connectorConfig.tags || connectorConfig.paths) {
            var servicePath = entryFactory.selectBox({
                id: 'servicePath',
                label: translate(connectorConfig.label_path || 'URL'),
                modelProperty: 'path',
                selectOptions: function (element, inputNode) {
                    var selectOptions = [{ name: '', value: '' }];
                    var paths;
                    if (connectorConfig.tags) {
                        var selectedTag = getConnector(element).get('tag');
                        if (selectedTag) {
                            paths = connectorConfig.tags.filter(tag => tag.value === selectedTag)[0].paths;
                        }
                    } else if (connectorConfig.paths) {
                        paths = connectorConfig.paths;
                    }
                    each(paths, function (option) {
                        selectOptions.push({ name: translate(option.name), value: option.value });
                    });
                    return selectOptions;
                },
                get: function (element, node) {
                    var value = getConnector(element).get('path');
                    return { path: value || '' };
                },
                set: function (element, values, node) {
                    var commands = [];
                    clearInputParameters(element, commands, 'path');
                    clearInputParameters(element, commands, 'method');
                    let defaultVersion = undefined;
                    let defaultMethod = undefined;
                    if (values.path) {
                        var versions = getConfiguredVersions(element, values.path);
                        if (versions && versions.length > 0) {
                            defaultVersion = versions[0].value || versions[0];
                        }
                        var methods = getConfiguredOperations(element, values.path);
                        if (methods && methods.length === 1) {
                            defaultMethod = methods[0].value || methods[0];
                        }
                    }

                    commands.push(cmdHelper.updateBusinessObject(element, getConnector(element), {
                        path: values.path || undefined, version: defaultVersion, method: defaultMethod
                    }));
                    createInputParameters(element, commands, values.path);
                    createInputParameters(element, commands, defaultMethod);
                    return commands;
                },
                validate: function (element, values, node) {
                    return isConnector(element) && !values.path ? { path: translate('Must select a value') } : {};
                },
                hidden: function (element, node) {
                    return !isConnector(element);
                }
            });
            group.entries.push(servicePath);
        } else if (connectorConfig.path && !getConnector(element).get('path')) {
            getConnector(element).set('path', connectorConfig.path.value);
            createInputParameters(element, undefined, connectorConfig.path.value)
            var methods = getConfiguredOperations(element, connectorConfig.path.value);
            if (methods && methods.length === 1) {
                let defaultMethod = methods[0].value || methods[0];
                getConnector(element).set('method', defaultMethod);
                createInputParameters(element, undefined, defaultMethod)
            }
        }

        var serviceVersion = entryFactory.selectBox({
            id: 'serviceVersion',
            label: translate('Version'),
            modelProperty: 'version',
            selectOptions: function (element, inputNode) {
                var selectOptions = [{ name: '', value: '' }];
                var versions = getConfiguredVersions(element);
                each(versions, function (option) {
                    if (option.value) {
                        selectOptions.push({ name: translate(option.name || option.value), value: option.value });
                    } else {
                        selectOptions.push({ name: translate(option), value: option });
                    }
                });
                return selectOptions;
            },
            get: function (element, node) {
                var value = getConnector(element).get('version');
                return { version: value || '' };
            },
            set: function (element, values, node) {
                return cmdHelper.updateBusinessObject(element, getConnector(element), {
                    version: values.version || undefined
                });
            },
            validate: function (element, values, node) {
                return isConnector(element) && getConfiguredVersions(element) &&
                    (getConnector(element).get('path') && getConnector(element).get('path').indexOf('{SELECTED_VERSION}') >= 0) &&
                    !values.version ? { version: translate('Must select a value') } : {};
            },
            hidden: function (element, node) {
                return !isConnector(element) || !getConfiguredVersions(element) || !getConnector(element).get('path') || (getConnector(element).get('path') && getConnector(element).get('path').indexOf('{SELECTED_VERSION}') < 0);
            }
        });
        group.entries.push(serviceVersion);

        var serviceMethod = entryFactory.selectBox({
            id: 'serviceMethod',
            label: translate(connectorConfig.label_method || 'Operation'),
            modelProperty: 'method',
            selectOptions: function (element, inputNode) {
                var selectOptions = [{ name: '', value: '' }];
                var methods = getConfiguredOperations(element);
                each(methods, function (option) {
                    if (option.value) {
                        selectOptions.push({ name: translate(option.name || option.value), value: option.value });
                    } else {
                        selectOptions.push({ name: translate(option), value: option });
                    }
                });
                return selectOptions;
            },
            get: function (element, node) {
                var value = getConnector(element).get('method');
                return { method: value || '' };
            },
            set: function (element, values, node) {
                var commands = [];
                clearInputParameters(element, commands, 'method');
                commands.push(cmdHelper.updateBusinessObject(element, getConnector(element), { method: values.method || undefined }));
                createInputParameters(element, commands, values.method);
                return commands;
            },
            validate: function (element, values, node) {
                return isConnector(element) && getConfiguredOperations(element) && !values.method ? { method: translate('Must select a value') } : {};
            },
            hidden: function (element, node) {
                return !isConnector(element) || !getConfiguredOperations(element);
            }
        });
        group.entries.push(serviceMethod);

    } else {
        var apiTextPath = entryFactory.textField({
            id: 'apiTextPath',
            label: translate('Endpoint'),
            modelProperty: 'path',
            get: function (element, node) {
                var value = getConnector(element).get('path');
                return { path: value };
            },
            set: function (element, values, node) {
                var commands = [];
                commands.push(cmdHelper.updateBusinessObject(element, getConnector(element), {
                    path: values.path || undefined
                }));
                return commands;
            },
            validate: function (element, values, node) {
                return isConnector(element) && !values.path ? { path: translate('Must provide a value') } : {};
            },
            hidden: function (element, node) {
                return !isConnector(element);
            },
            disabled: function (element, node) {
                return false;
            }
        });
        group.entries.push(apiTextPath);

        var apiTextVersion = entryFactory.textField({
            id: 'apiTextVersion',
            label: translate('Version'),
            modelProperty: 'version',
            get: function (element, node) {
                var value = getConnector(element).get('version');
                return { version: value };
            },
            set: function (element, values, node) {
                return cmdHelper.updateBusinessObject(element, getConnector(element), {
                    version: values.version || undefined
                });
            },
            validate: function (element, values, node) {
                return isConnector(element) &&
                    (getConnector(element).get('path') && getConnector(element).get('path').indexOf('{SELECTED_VERSION}') >= 0) &&
                    !values.version ? { version: translate('Must provide a value') } : {};
            },
            hidden: function (element, node) {
                return !isConnector(element) || !getConnector(element).get('path') || (getConnector(element).get('path') && getConnector(element).get('path').indexOf('{SELECTED_VERSION}') < 0);
            },
            disabled: function (element, node) {
                return false;
            }
        });
        group.entries.push(apiTextVersion);

        var apiTextMethod = entryFactory.selectBox({
            id: 'apiTextMethod',
            label: translate('Operation'),
            modelProperty: 'method',
            selectOptions: function (element, inputNode) {
                var selectOptions = [{ name: '', value: '' }];
                var methodOptions = ["GET", "POST", "PUT", "DELETE", "PATCH"];
                if ('SOAP' === getConnector(element).get('connectorId')) {
                    methodOptions = ["POST"];
                }
                each(methodOptions, function (option) {
                    if (option.value) {
                        selectOptions.push({ name: translate(option.name || option.value), value: option.value });
                    } else {
                        selectOptions.push({ name: translate(option), value: option });
                    }
                });
                return selectOptions;
            },
            get: function (element, node) {
                var value = getConnector(element).get('method');
                return { method: value || '' };
            },
            set: function (element, values, node) {
                return cmdHelper.updateBusinessObject(element, getConnector(element), {
                    method: values.method || undefined
                });
            },
            validate: function (element, values, node) {
                return isConnector(element) && !values.method ? { method: translate('Must select a value') } : {};
            },
            hidden: function (element, node) {
                return !isConnector(element);
            }
        });
        group.entries.push(apiTextMethod);
    }

    function clearInputParameters(element, commands, property) {
        let value = getConnector(element).get(property);
        if (value) {
            let params = value.match(REGEX_API_PARAM) || [];
            if ('path' === property || 'method' === property) {
                params.push('payload');
            }
            each(params, function (param) {
                let inParamArray;
                if (param.indexOf(':') >= 0) {
                    inParamArray = getInputParameters(element).filter(inputPram => inputPram.name === param.split(":")[0]);
                } else {
                    inParamArray = getInputParameters(element).filter(inputPram => inputPram.name === param);
                }

                commands.push(cmdHelper.removeElementsFromList(element, getInputOutput(element), 'inputParameters', null, inParamArray));
            });
        }
    }

    function createInputParameters(element, commands, value) {
        if (value) {
            let params = value.match(REGEX_API_PARAM) || [];
            if (['POST', 'PUT', 'PATCH'].indexOf(value) >= 0) {
                params.push('payload:payload')
            }
            each(params, function (param) {
                let paramName;
                let paramType;
                if (param.indexOf(':') >= 0) {
                    paramName = param.split(":")[0];
                    paramType = param.split(":")[1];
                } else {
                    paramName = param;
                }
                if (RESERVED_PARAMS.indexOf(paramName) < 0) {
                    var inputParam = createParameter('custom:InputParameter', getInputOutput(element), bpmnFactory, { name: paramName, editable: false });
                    if (paramType && !paramType.startsWith('xsd.')) {
                        var inputType = createParameter('custom:Script', inputParam, bpmnFactory, { scriptFormat: 'freemarker', value: '${S(' + paramType + ')}' });
                        inputParam.set('definition', inputType);
                    }
                    if (commands) {
                        commands.push(cmdHelper.addElementsTolist(element, getInputOutput(element), 'inputParameters', [inputParam]));
                    } else {
                        getInputParameters(element).push(inputParam);
                    }
                }
            });
        }
    }

    function getConfiguredVersions(element, modifiedPath) {
        var selectedPath;
        var selectedPathRef;
        var versions;
        if (connectorConfig.tags) {
            var selectedTag = getConnector(element).get('tag');
            if (selectedTag) {
                var selectedTagRef = connectorConfig.tags.filter(tag => tag.value === selectedTag)[0];
                selectedPath = modifiedPath || getConnector(element).get('path');
                if (selectedPath) {
                    selectedPathRef = selectedTagRef.paths.filter(path => path.value === selectedPath)[0];

                    if (selectedPathRef.versions) {
                        versions = selectedPathRef.versions;
                    } else if (selectedTagRef.versions) {
                        versions = selectedTagRef.versions;
                    } else if (connectorConfig.versions) {
                        versions = connectorConfig.versions;
                    }
                }
            }
        } else if (connectorConfig.paths) {
            selectedPath = getConnector(element).get('path');
            if (selectedPath) {
                selectedPathRef = connectorConfig.paths.filter(path => path.value === selectedPath)[0];
                if (selectedPathRef.versions) {
                    versions = selectedPathRef.versions;
                } else if (connectorConfig.versions) {
                    versions = connectorConfig.versions;
                }
            }
        } else if (connectorConfig.path) {
            if (connectorConfig.path.versions) {
                versions = connectorConfig.path.versions
            } else if (connectorConfig.versions) {
                versions = connectorConfig.versions;
            }
        }
        return versions;
    }

    function getConfiguredOperations(element, modifiedPath) {
        var selectedPath;
        var methods;
        if (connectorConfig.tags) {
            var selectedTag = getConnector(element).get('tag');
            if (selectedTag) {
                var paths = connectorConfig.tags.filter(tag => tag.value === selectedTag)[0].paths;
                selectedPath = modifiedPath || getConnector(element).get('path');
                if (selectedPath) {
                    methods = paths.filter(path => path.value === selectedPath)[0].methods;
                }
            }
        } else if (connectorConfig.paths) {
            selectedPath = modifiedPath || getConnector(element).get('path');
            if (selectedPath) {
                methods = connectorConfig.paths.filter(path => path.value === selectedPath)[0].methods;
            }
        } else if (connectorConfig.path) {
            methods = connectorConfig.path.methods;
        }
        return methods;
    }

};
