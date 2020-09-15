import React, { Component } from "react";

// TABULATOR
import 'react-tabulator/lib/styles.css';
import 'react-tabulator/lib/css/tabulator.min.css';
import { ReactTabulator } from 'react-tabulator';
import "react-tabulator/lib/css/bootstrap/tabulator_bootstrap.min.css";

// ACE EDITOR
import AceEditor from "react-ace";
import 'ace-builds/webpack-resolver.js';

const CONDITIONS = {
    'string': {
        'equal': 'Equal',
        'notEqual': 'Not Equal',
        'contains': 'Contains',
        'doesNotContain': 'Does not Contain',
        'expression': 'Expression',
        'startsWith': 'Starts With',
        'endsWith': 'Ends With',
        'empty': 'Empty',
        'notEmpty': 'Not Empty'
    },
    'integer': {
        'equal': 'Equal',
        'notEqual': 'Not Equal',
        'lessThan': 'Less Than',
        'lessThanInclusive': 'Less than Inclusive',
        'greaterThan': 'Greater Than',
        'greaterThanInclusive': 'Greater than Inclusive',
        'expression': 'Expression',
    },
    'number': {
        'equal': 'Equal',
        'notEqual': 'Not Equal',
        'lessThan': 'Less Than',
        'lessThanInclusive': 'Less than Inclusive',
        'greaterThan': 'Greater Than',
        'greaterThanInclusive': 'Greater than Inclusive',
        'expression': 'Expression',
    },
    'long': {
        'equal': 'Equal',
        'notEqual': 'Not Equal',
        'lessThan': 'Less Than',
        'lessThanInclusive': 'Less than Inclusive',
        'greaterThan': 'Greater Than',
        'greaterThanInclusive': 'Greater than Inclusive',
        'expression': 'Expression',
    },
    'double': {
        'equal': 'Equal',
        'notEqual': 'Not Equal',
        'lessThan': 'Less Than',
        'lessThanInclusive': 'Less than Inclusive',
        'greaterThan': 'Greater Than',
        'greaterThanInclusive': 'Greater than Inclusive',
        'expression': 'Expression',
    },
    'date': {
        'equal': 'Equal',
        'notEqual': 'Not Equal',
        'lessThan': 'Less Than',
        'lessThanInclusive': 'Less than Inclusive',
        'greaterThan': 'Greater Than',
        'greaterThanInclusive': 'Greater than Inclusive',
        'expression': 'Expression',
    },
    'time': {
        'equal': 'Equal',
        'notEqual': 'Not Equal',
        'lessThan': 'Less Than',
        'lessThanInclusive': 'Less than Inclusive',
        'greaterThan': 'Greater Than',
        'greaterThanInclusive': 'Greater than Inclusive',
        'expression': 'Expression',
    },
    'timestamp': {
        'equal': 'Equal',
        'notEqual': 'Not Equal',
        'lessThan': 'Less Than',
        'lessThanInclusive': 'Less than Inclusive',
        'greaterThan': 'Greater Than',
        'greaterThanInclusive': 'Greater than Inclusive',
        'expression': 'Expression',
    },
    'boolean': {
        'equal': 'Equal',
        'notEqual': 'Not Equal',
    }
}

const BASIC_TYPES = ["string", "integer", "number", "long", "double", "date", "time", "timestamp", "boolean"];

export default class RuleflowEditor extends Component {
    constructor(props) {
        super(props);
        this.modifiedDecisions = [];
        this.modifiedExpression = '';
        this.state = {
            loading: true,
            columns: [],
            decisionTable: [],
            isValid: false,
            invalidMessage: 'Input Definitions are not linked',
        }
    }

    componentDidMount = () => {
        const { selectedNode } = this.props;
        const parent = this;

        let invalidMessage = undefined;
        let inputColumns = [];
        let inputExpressions = [];
        let outputColumns = [];
        let outputExpressions = [];

        if (selectedNode.incoming.length === 0) {
            invalidMessage = 'Input Definitions are not linked';
        } else {
            invalidMessage = this.buildNodeOutputColumns(outputColumns, outputExpressions);
            let buildInputError = this.buildNodeInputColumns(inputColumns, inputExpressions);
            if (!invalidMessage && buildInputError) {
                invalidMessage = buildInputError;
            }
        }

        let columns = [{ title: "Input", columns: inputColumns }, { title: "Output", columns: outputColumns }];
        let decisionTable = [];
        let expressionRule = '';
        if (parent.getNodeProperty(selectedNode, '$type') === 'bpmn:BusinessRuleTask') {
            decisionTable = JSON.parse(parent.getNodeProperty(selectedNode, 'decisionTable') || '[]');
            if (decisionTable.length === 0) {
                let rowData = {};
                for (const element of columns) {
                    for (const ele of element.columns) {
                        rowData[ele.field] = '';
                    }
                }
                decisionTable.push(rowData);
            }
        } else if (parent.getNodeProperty(selectedNode, '$type') === 'bpmn:ScriptTask') {
            expressionRule = parent.getNodeProperty(selectedNode, 'expressionRule') || '';
            if (!expressionRule && inputExpressions.length > 0 && outputExpressions.length > 0) {
                expressionRule = 'if';
                inputExpressions.forEach(function (arrayItem, arrayIndex) {
                    expressionRule = expressionRule + '\n  ' + (arrayIndex === 0 ? '' : 'and ') + arrayItem;
                });
                expressionRule = expressionRule + '\nthen';
                outputExpressions.forEach(function (arrayItem, arrayIndex) {
                    expressionRule = expressionRule + '\n  set ' + arrayItem + ((arrayIndex + 1) < outputExpressions.length ? ',' : ';');
                });
            }
        }
        this.modifiedDecisions = decisionTable;
        this.modifiedExpression = expressionRule;
        this.setState({
            loading: false,
            columns: columns, decisionTable: decisionTable, expressionRule: expressionRule,
            invalidMessage: invalidMessage,
            isValid: invalidMessage ? false : true,
        });
    }

    buildNodeOutputColumns(outputColumns, outputExpressions) {
        const { selectedNode, customTypes } = this.props;
        const parent = this;
        let invalidMessage = undefined;
        let dataType = parent.getNodeProperty(selectedNode, 'dataType');
        let customTypeFilter = customTypes.filter(customTypeItem => customTypeItem.text === dataType);
        if (dataType === '' || dataType === undefined) {
            invalidMessage = 'Invalid dataType for ' + parent.getNodeProperty(selectedNode, 'name');
        } else if (BASIC_TYPES.indexOf(dataType) >= 0) {
            let dataTypeName = parent.getNodeProperty(selectedNode, 'name');
            if (parent.getNodeProperty(selectedNode, '$type') === 'bpmn:BusinessRuleTask') {
                parent.buildOutputColumn(dataTypeName, dataType, outputColumns);
            } else if (parent.getNodeProperty(selectedNode, '$type') === 'bpmn:ScriptTask') {
                let outputTypeExpression = parent.getOutputExpression(dataType);
                outputExpressions.push(`${outputTypeExpression} to the '${dataTypeName}'`);
            }
        } else if (customTypeFilter.length > 0) {
            let processedTypes = [customTypeFilter[0].text];
            let buildOuputError = parent.buildCustomTypeOutput(customTypeFilter[0], outputColumns, outputExpressions, processedTypes);
            if (!invalidMessage && buildOuputError) {
                invalidMessage = buildOuputError;
            }
        }
        return invalidMessage;
    }

    buildNodeInputColumns(inputColumns, inputExpressions) {
        const { selectedNode, customTypes } = this.props;
        const parent = this;
        let invalidMessage = undefined;
        selectedNode.incoming.forEach(function (inputNode) {
            //Build Input Columns
            let dataType = parent.getNodeProperty(inputNode, 'dataType');
            let customTypeFilter = customTypes.filter(customTypeItem => customTypeItem.text === dataType);
            if (dataType === '' || dataType === undefined) {
                invalidMessage = 'Invalid dataType for ' + parent.getNodeProperty(inputNode, 'name');
            } else if (BASIC_TYPES.indexOf(dataType) >= 0) {
                let dataTypeName = parent.getNodeProperty(inputNode, 'name');
                if (parent.getNodeProperty(selectedNode, '$type') === 'bpmn:BusinessRuleTask') {
                    parent.buildInputColumn(dataTypeName, dataType, inputColumns);
                } else if (parent.getNodeProperty(selectedNode, '$type') === 'bpmn:ScriptTask') {
                    let inputTypeExpression = parent.getInputExpression(dataType);
                    inputExpressions.push(`the '${dataTypeName}' ${inputTypeExpression}`);
                }
            } else if (customTypeFilter.length > 0) {
                let processedTypes = [customTypeFilter[0].text]
                let buildInputError = parent.buildCustomTypeInput(customTypeFilter[0], inputColumns, inputExpressions, processedTypes)
                if (!invalidMessage && buildInputError) {
                    invalidMessage = buildInputError;
                }
            }
        });
        return invalidMessage;
    }

    getNodeProperty(element, propName) {
        const businessObject = element.businessObject;
        let propValue = '';
        let filteredElements = undefined;
        if ('$type' === propName) {
            propValue = businessObject.$type;
        } else if (businessObject.sourceRef && propName === 'name') {
            if (businessObject.sourceRef instanceof Array) {
                if (businessObject.sourceRef.length > 0) {
                    propValue = businessObject.sourceRef[0].name || businessObject.sourceRef[0].id;
                }
            } else {
                propValue = businessObject.sourceRef.name || businessObject.sourceRef.id;
            }
        } else if (propName === 'name') {
            propValue = businessObject.get('name') || businessObject.get('id');
        } else if (businessObject.sourceRef) {
            if (businessObject.sourceRef instanceof Array) {
                if (businessObject.sourceRef.length > 0 && businessObject.sourceRef[0].extensionElements) {
                    filteredElements = businessObject.sourceRef[0].extensionElements.values.filter(arrayItem => arrayItem.$type === 'custom:Properties');
                }
            } else if (businessObject.sourceRef.extensionElements) {
                filteredElements = businessObject.sourceRef.extensionElements.values.filter(arrayItem => arrayItem.$type === 'custom:Properties');
            }
            if (filteredElements && filteredElements.length > 0) {
                let filteredProperies = filteredElements[0].values.filter(property => property.name === propName);
                if (filteredProperies.length > 0) {
                    propValue = filteredProperies[0].value;
                }
            }
        } else if (businessObject.extensionElements) {
            filteredElements = businessObject.extensionElements.values.filter(arrayItem => arrayItem.$type === 'custom:Properties');
            if (filteredElements.length > 0) {
                let filteredProperies = filteredElements[0].values.filter(property => property.name === propName);
                if (filteredProperies.length > 0) {
                    propValue = filteredProperies[0].value;
                }
            }
        }

        if (propName === 'isArray') {
            return propValue === 'true'
        } else {
            return propValue;
        }
    }

    buildCustomTypeOutput(customType, outputColumns, outputExpressions, processedTypes) {
        const { selectedNode, customTypes } = this.props;
        const parent = this;
        let invalidMessage = undefined;

        customType.children.forEach(function (arrayItem) {
            if (arrayItem.text === '' || arrayItem.text === undefined || arrayItem.dataType === '' || arrayItem.dataType === undefined) {
                invalidMessage = 'Invalid dataType for ' + arrayItem.text + ' of ' + customType.text;
            } else {
                let customTypeFilter = customTypes.filter(customTypeItem => customTypeItem.text === arrayItem.dataType);
                if (customTypeFilter.length > 0) {
                    if (processedTypes.indexOf(customTypeFilter[0].text) < 0) {
                        processedTypes.push(customTypeFilter[0].text);
                        let buildOuputError = parent.buildCustomTypeOutput(customTypeFilter[0], outputColumns, outputExpressions, processedTypes);
                        if (!invalidMessage && buildOuputError) {
                            invalidMessage = buildOuputError;
                        }
                    }
                } else {
                    if (parent.getNodeProperty(selectedNode, '$type') === 'bpmn:BusinessRuleTask') {
                        parent.buildOutputColumn(customType.text + '.' + arrayItem.text, arrayItem.dataType, outputColumns);
                    } else {
                        let outputTypeExpression = parent.getOutputExpression(arrayItem.dataType);
                        outputExpressions.push(`${outputTypeExpression} to the '${arrayItem.text}' of '${customType.text}'`);
                    }
                }
            }
        })
        return invalidMessage;
    }

    buildCustomTypeInput(customType, inputColumns, inputExpressions, processedTypes) {
        const { selectedNode, customTypes } = this.props;
        const parent = this;
        let invalidMessage = undefined;

        customType.children.forEach(function (arrayItem) {
            if (arrayItem.text === '' || arrayItem.text === undefined || arrayItem.dataType === '' || arrayItem.dataType === undefined) {
                invalidMessage = 'Invalid dataType for ' + arrayItem.text + ' of ' + customType.text;
            } else {
                let customTypeFilter = customTypes.filter(customTypeItem => customTypeItem.text === arrayItem.dataType);
                if (customTypeFilter.length > 0) {
                    if (processedTypes.indexOf(customTypeFilter[0].text) < 0) {
                        processedTypes.push(customTypeFilter[0].text);
                        let buildInputError = parent.buildCustomTypeInput(customTypeFilter[0], inputColumns, inputExpressions, processedTypes)
                        if (!invalidMessage && buildInputError) {
                            invalidMessage = buildInputError;
                        }
                    }
                } else {
                    if (parent.getNodeProperty(selectedNode, '$type') === 'bpmn:BusinessRuleTask') {
                        parent.buildInputColumn(customType.text + '.' + arrayItem.text, arrayItem.dataType, inputColumns);
                    } else {
                        let inputTypeExpression = parent.getInputExpression(arrayItem.dataType);
                        inputExpressions.push(`the '${arrayItem.text}' of '${customType.text}' ${inputTypeExpression}`);
                    }
                }
            }
        })
        return invalidMessage;
    }

    buildOutputColumn(dataTitle, dataType, columnsContainer) {
        //editors:  input ( input element ),
        //          textarea ( resizable text area element ), 
        //          number ( input element with type of number ),
        //          range ( input element with type of number ),
        //          select ( select ),
        //          autocomplete ( autocomplete ),
        //          star ( start rating ),
        //          progress ( draggable progress bar ),
        //          tickCross (checkbox), 
        //          DateEditor (date, time, timestamp)
        const editorConfig = this.getDecisionEditorConfig(dataType);
        columnsContainer.push({
            title: dataTitle + ' (value)',
            field: dataTitle.replace(' ', '_').toLowerCase(),
            editor: editorConfig.editor,
            hozAlign: editorConfig.hozAlign,
            headerSort: false,
            // headerMenu: headerMenu, 
            // rowContext: rowMenu
        });
    }

    buildInputColumn(dataTitle, dataType, columnsContainer) {
        columnsContainer.push({
            title: dataTitle + ' (condition)',
            field: dataTitle.replace(' ', '_').toLowerCase() + "_condition",
            editor: "select",
            editorParams: { values: CONDITIONS[dataType] },
            hozAlign: "center",
            headerSort: false,
            // headerMenu: headerMenu, 
        });
        const editorConfig = this.getDecisionEditorConfig(dataType);
        columnsContainer.push({
            title: dataTitle + ' (value)',
            field: dataTitle.replace(' ', '_').toLowerCase() + "_value",
            editor: editorConfig.editor,
            hozAlign: editorConfig.hozAlign,
            headerSort: false,
            // headerMenu: headerMenu, 
            // rowContext: rowMenu
        });
    }

    getOutputExpression(dataType) {
        if (["integer", "number", "long", "double"].indexOf(dataType) >= 0) {
            return "<" + dataType + ">";
        } else if (["date", "time", "timestamp"].indexOf(dataType) >= 0) {
            return "'<" + dataType + ">'";
        } else if (["boolean"].indexOf(dataType) >= 0) {
            return "<" + dataType + ">";
        } else {
            return "'<" + dataType + ">'";
        }
    }

    getInputExpression(dataType) {
        if (["integer", "number", "long", "double"].indexOf(dataType) >= 0) {
            return "is at least <min> and less than <max>";
        } else if (["date", "time", "timestamp"].indexOf(dataType) >= 0) {
            return "is on or after '<date>' and before '<date>'";
        } else if (["boolean"].indexOf(dataType) >= 0) {
            return "is <boolean>";
        } else {
            return "is '<" + dataType + ">'";
        }
    }

    getDecisionEditorConfig(dataType) {
        if (["integer", "number", "long", "double"].indexOf(dataType) >= 0) {
            return { editor: 'number', hozAlign: 'right' };
        } else if (["date", "time", "timestamp"].indexOf(dataType) >= 0) {
            // return { editor: 'DateEditor', hozAlign: 'left' };
            return { editor: 'input', hozAlign: 'left' };
        } else if (["boolean"].indexOf(dataType) >= 0) {
            return { editor: 'tickCross', hozAlign: 'center' };
        } else {
            return { editor: 'input', hozAlign: 'left' };
        }
    }

    render() {
        const { loading, isValid, invalidMessage, columns, decisionTable, expressionRule } = this.state;
        const { selectedNode } = this.props;
        const parent = this;

        return (
            <section className="studio-container">
                {!loading && !isValid &&
                    <div className="text-center p-3 m-3">{invalidMessage}</div>
                }

                {!loading && isValid && parent.getNodeProperty(selectedNode, '$type') === 'bpmn:BusinessRuleTask' &&
                    <ReactTabulator
                        dataEdited={function (data) {
                            parent.modifiedDecisions = data;
                        }}
                        columns={columns}
                        data={decisionTable}
                        options={{ tabEndNewRow: true, responsiveLayout: true }}
                    />
                }

                {!loading && isValid && parent.getNodeProperty(selectedNode, '$type') === 'bpmn:ScriptTask' &&
                    <AceEditor
                        mode={'javascript'}
                        theme="monokai"
                        name="ExpressionEditor"
                        onChange={(newValue) => {
                            parent.modifiedExpression = newValue;
                        }}
                        fontSize={14}
                        showPrintMargin={false}
                        showGutter={false}
                        highlightActiveLine={true}
                        value={expressionRule || ''}
                        width={'100%'}
                        setOptions={{
                            showLineNumbers: true,
                            tabSize: 4,
                        }}
                        id="ExpressionEditorWindow"
                    />
                }

                <div className="pull-right mt-3 mb-3">
                    <button className="btn btn-danger" onClick={() => { this.props.onCancel(this.props.selectedNode.id) }}>Cancel</button>
                    {isValid && parent.getNodeProperty(selectedNode, '$type') === 'bpmn:BusinessRuleTask' &&
                        <button className="btn btn-primary ml-2" onClick={() => { this.props.onSave(parent.modifiedDecisions) }}>Save</button>
                    }
                    {isValid && parent.getNodeProperty(selectedNode, '$type') === 'bpmn:ScriptTask' &&
                        <button className="btn btn-primary ml-2" onClick={() => { this.props.onSave(parent.modifiedExpression) }}>Save</button>
                    }
                </div>
            </section >
        )
    }
}

