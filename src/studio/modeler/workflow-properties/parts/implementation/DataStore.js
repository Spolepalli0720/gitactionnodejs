var StudioConfig = require('../../../StudioConfig');

var domQuery = require('min-dom').query,
    escapeHTML = require('bpmn-js-properties-panel/lib/Utils').escapeHTML;

var entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory');

var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
    cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper'),
    each = require('lodash/forEach');

module.exports = function (element, bpmnFactory, translate) {
    var dsEntries = [];

    var dsVendor = entryFactory.selectBox({
        id: 'dsProvider',
        label: translate('Provider'),
        modelProperty: 'dsProvider',
        selectOptions: function (element, inputNode) {
            var selectOptions = [{ name: '', value: '' }];
            each(Object.keys(StudioConfig.DATABASE_CONNECTOR), function (connectorKey) {
                selectOptions.push({ name: translate(connectorKey), value: connectorKey });
            });
            return selectOptions;
        },
        get: function (element, node) {
            return { dsProvider: getBusinessObject(element).get('dsProvider') || '' };
        },
        set: function (element, values, node) {
            var props = {
                dsProvider: values.dsProvider,
                dsConnect: undefined,
                dsVersion: undefined,
                dsCustomQuery: false,
                dsQuery: undefined,
                dsOperation: undefined,
                dsTable: undefined,
                dsClause: undefined
            };
            if(values.dsProvider) {
                props.dsConnect = StudioConfig.DATABASE_CONNECTOR[values.dsProvider].urlFormat;
            }
            return cmdHelper.updateBusinessObject(element, getBusinessObject(element), props);
        },
        hidden: function (element, node) {
            return false;
        }
    });
    dsEntries.push(dsVendor);

    var dsVersion = entryFactory.selectBox({
        id: 'dsVersion',
        label: translate('Version'),
        modelProperty: 'dsVersion',
        selectOptions: function (element, inputNode) {
            var selectOptions = [{ name: '', value: '' }];
            if (getBusinessObject(element).get('dsProvider')) {
                each(StudioConfig.DATABASE_CONNECTOR[getBusinessObject(element).get('dsProvider')].versions, function (option) {
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
            return { dsVersion: getBusinessObject(element).get('dsVersion') || '' };
        },
        set: function (element, values, node) {
            return cmdHelper.updateBusinessObject(element, getBusinessObject(element), { dsVersion: values.dsVersion });
        },
        hidden: function (element, node) {
            return false;
        }
    });
    dsEntries.push(dsVersion);

    var customQuery = entryFactory.checkbox({
        id: 'dsCustomQuery',
        label: translate('Custom Query'),
        modelProperty: 'dsCustomQuery',
        get: function (element, node) {
            return { dsCustomQuery: !!getBusinessObject(element).get('dsCustomQuery') };
        },
        set: function (element, values) {
            var props = { 'dsCustomQuery': !!values.dsCustomQuery }
            if (!(!!values.dsCustomQuery)) {
                props.dsQuery = undefined;
            }
            props.dsOperation = undefined;
            props.dsTable = undefined;
            props.dsClause = undefined;
        
            return cmdHelper.updateBusinessObject(element, getBusinessObject(element), props);
        },
        hidden: function (element) {
            return false;
        }
    });
    dsEntries.push(customQuery);

    var dsQuery = {
        id: 'dsQuery',
        html: '<div class="bpp-row">' +
            ' <label for="ds-query-val" data-show="isCustomQuery">' + escapeHTML(translate('Query')) + '</label>' +
            ' <button for="ds-query-val" data-show="isCustomQuery" data-action="editQuery" style="width: 27px !important; position: relative; float: right; background-color: transparent; border-color: transparent;"><img width=20px height=20px src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAABmJLR0QA/wD/AP+gvaeTAAACrklEQVR4nO2aPWsUURSGH0LEjy1SKWgiVgraKljFxiJa+AMiiqWtP0JbbVKbwkpCCkH8ao2gYNBCtBU7i4BZRG3MWswdnCy7O3PvmZ17Z/Z9YAlLzjn3nHfnzJy5MyCEEEIIIYQQQghRM0vABtAHBjPy6QObwOk6xNtJoKBYnx1g0SLghgv0BDhhCdQyFoGnZLU/tgTK2/Z4DUm1jZNktf+wBMkP5VmltP65hhLpLBLQiAQ0IgGNSEAj8xXt3gB7wPKMfS+l6hG4x/7L+ax9D0ZzoObA6SIBjUhAIxLQiAQ00jYBrwLXYifhQ0pjzALwh2yPsik6NcZcBg4CH2InUqRNAq64vy+jZuFJSi38lSyX8w2uaa5/GgL2gLfAlofPWZfHd8Z3zZaL2zNlt58kz4FrwEXgiIdP3r6vGL9L0nNx18JTq5+6j8BVF+8ncM7D74XzuzHB5gz/nyLeCk1wiKRaOLTAQ8Av4C9wrMQ29AcaRzICHgY+ulgPPX2vOL/3Fe3Xnf0n/E4To0hGQEtRD5zv3Yr2lh9rmCQEtLbVF+e/XGZYoK7zYXQBrYXkr1fsAgc8fes4H0YVsNhK64Exbjv/zUD/4qkjZD5Mcg70oZW3b0VitvA82ZtRA+BUwNqtb+Gc0EIuOb/PAWt25iKSEzLG3HM+9z3X6twYA2FFbTv7lTLDITo5SINfWx0lu3X7TSZ+VTp7K5dTtcCbzu65R+zObybk5C02aWv+kbO54xHXOnOOIkkBe8A74PWY/8+RbZwOyDZSqxJlQ3XqAQK44Nb81vC6o2jlnUh+1X0WNYuKpCxga2/fisRo4T7ZA/SFhtcdRWn9VV/xbZLrZA+OdmMnUgcxjsCUaOVFpFVIQCMS0IgENCIBjVQdY2b5SjwRHYFCCCGEEEIIIYQQTfIPrSqizbzgD5UAAAAASUVORK5CYII="></button>' +
            ' <div class="bpp-field-wrapper" data-show="isCustomQuery">' +
            '  <textarea id="ds-query-val" type="text" name="dsQuery"></textarea>' +
            ' </div>' +
            '</div>'
        ,
        get: function (element, node) {
            return { dsQuery: getBusinessObject(element).get('dsQuery') || '' };
        },
        set: function (element, values, node) {
            return cmdHelper.updateBusinessObject(element, getBusinessObject(element), { dsQuery: values.dsQuery });
        },
        isCustomQuery: function (element, inputNode, btnNode, scopeNode) {
            if (!!getBusinessObject(element).get('dsCustomQuery')) {
                return true;
            } else {
                return false;
            }
        },
        editQuery: function (element, inputNode, btnNode, scopeNode) {
            var input = domQuery('textarea[name=dsQuery]', scopeNode);
            const scriptEditor = new CustomEvent('scriptEditor', { detail: input.value ? input.value : "" });
            document.dispatchEvent(scriptEditor);
            document.addEventListener('codeDispatch', (e) => {
                input.value = e.detail ? e.detail : "";
                getBusinessObject(element).set('dsQuery', input.value);
            }, false);
            return true;
        },
    };
    dsEntries.push(dsQuery);

    var dsOperation = entryFactory.selectBox({
        id: 'dsOperation',
        label: translate('Operation'),
        modelProperty: 'dsOperation',
        selectOptions: function (element, inputNode) {
            var selectOptions = [{ name: '', value: '' }];
            if (getBusinessObject(element).get('dsProvider')) {
                each(StudioConfig.DATABASE_CONNECTOR[getBusinessObject(element).get('dsProvider')].methods, function (option) {
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
            return { dsOperation: getBusinessObject(element).get('dsOperation') || '' };
        },
        set: function (element, values, node) {
            return cmdHelper.updateBusinessObject(element, getBusinessObject(element), { 
                dsOperation: values.dsOperation,
                dsCustomQuery: values.dsOperation === 'CUSTOM' ? true : false,
                dsQuery: values.dsOperation === 'CUSTOM' ? '' : undefined
            });
        },
        hidden: function (element, node) {
            if (!!getBusinessObject(element).get('dsCustomQuery')) {
                return true;
            } else {
                return false;
            }
        }
    });
    dsEntries.push(dsOperation);

    var dsTable = entryFactory.textField({
        id: 'dsTable',
        label: translate('Table'),
        modelProperty: 'dsTable',
        get: function (element, node) {
            return { dsTable: getBusinessObject(element).get('dsTable') || '' };
        },
        set: function (element, values, node) {
            return cmdHelper.updateBusinessObject(element, getBusinessObject(element), { dsTable: values.dsTable });
        },
        hidden: function (element, node) {
            if (!!getBusinessObject(element).get('dsCustomQuery')) {
                return true;
            } else {
                return false;
            }
        }
    });
    dsEntries.push(dsTable);

    var dsClause = entryFactory.textField({
        id: 'dsClause',
        label: translate('WHERE clause'),
        modelProperty: 'dsClause',
        get: function (element, node) {
            return { dsClause: getBusinessObject(element).get('dsClause') || '' };
        },
        set: function (element, values, node) {
            return cmdHelper.updateBusinessObject(element, getBusinessObject(element), { dsClause: values.dsClause });
        },
        hidden: function (element, node) {
            if (!!getBusinessObject(element).get('dsCustomQuery')) {
                return true;
            } else {
                return false;
            }
        }
    });
    dsEntries.push(dsClause);

    return dsEntries;
};
