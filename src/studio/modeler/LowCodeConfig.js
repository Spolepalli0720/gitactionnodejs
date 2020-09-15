
module.exports.DATA_GRID_DESIGN = {
    type: "form",
    display: "form",
    components: [
        {
            label: 'Data Grid',
            key: 'grid',
            type: 'editgrid',
            input: true,
            modal: true,
            hideLabel: true,
            tableView: false,
            templates: {
                header: '' +
                    '  <div class="row">' +
                    '    {% util.eachComponent(components, function(component) { %}' +
                    '      <div class="col"><strong>{{ component.label.toUpperCase() }}</strong></div>' +
                    '    {% }) %}' +
                    '    {% if (!instance.options.readOnly && !instance.originalComponent.disabled) { %}' +
                    '        <div class="pull-right"><strong>ACTIONS</strong></div>' +
                    '    {% } %}' +
                    '  </div>',
                row: '' +
                    '  <div class="row">' +
                    '    {% util.eachComponent(components, function(component) { %}' +
                    '      <div class="col">' +
                    '        {{ getView(component, row[component.key]) }}' +
                    '      </div>' +
                    '    {% }) %}' +
                    '    {% if (!instance.options.readOnly && !instance.originalComponent.disabled) { %}' +
                    '      <div class="pull-right">' +
                    '          <button class="btn btn-icon mr-1 btn-outline-success btn-default editRow"><i class="feather icon-edit"></i></button>' +
                    '          {% if (!instance.hasRemoveButtons || instance.hasRemoveButtons()) { %}' +
                    '            <button class="btn btn-icon btn-outline-danger removeRow"><i class="feather icon-trash-2 text-danger"></i></button>' +
                    '          {% } %}' +
                    '      </div>' +
                    '    {% } %}' +
                    '  </div>',
                footer: ''
            },
            components: []
        }
    ]
};

module.exports.RULES_FORM_DESIGN = {
    label: 'Rule',
    key: 'rule',
    components: [
        {
            label: "Name",
            key: "name",
            type: "textfield",
            input: true,
            autofocus: true,
            validate: {
                required: true,
                maxLength: 60
            }
        },
        {
            label: "Description",
            key: "description",
            type: "textfield",
            input: true,
            validate: {
                required: true,
                maxLength: 300
            },
        },
        {
            label: "Validation Attributes",
            key: "facts",
            type: "tags",
            input: true,
            validate: {
                required: true
            },
            description: 'tags input field'
        },
        {
            label: 'Validation Scope',
            key: 'assert',
            type: 'select',
            widget: "choicesjs",
            searchEnabled: false,
            input: true,
            validate: {
                required: true
            },
            defaultValue: 'any',
            data: {
                values: [
                    {
                        value: 'all',
                        label: 'All Conditions',
                    },
                    {
                        value: 'any',
                        label: 'Any one of the Conditions',
                    }
                ],
            },
            dataSrc: 'values',
            template: '<span>{{ item.label }}</span>',
        },
        {
            label: 'Conditions',
            key: 'conditions',
            type: 'editgrid',
            input: true,
            openWhenEmpty: true,
            disableAddingRemovingRows: false,
            addAnother: 'Add Condition',
            saveRow: 'Save Condition',
            templates: {
                header: '<div class="row row-cols-1 row-cols-md-1">' +
                    '   <div class="col">' +
                    '       <strong>{{ value.length }} Conditions</strong>' +
                    '   </div>' +
                    '</div>',
                row: '<div class="row">' +
                    '   <div class="col col-9">' +
                    '       <div>{{ row.name }}</div>' +
                    '   </div>' +
                    '   <div class="col col-3">' +
                    '       <div class="btn-group pull-right">' +
                    '           <button class="btn btn-outline-success mr-1 btn-default editRow">Edit</button>' +
                    '           <button class="btn btn-outline-danger removeRow">Delete</button>' +
                    '       </div>' +
                    '   </div>' +
                    '</div>',
                footer: '',
            },
            components: [
                {
                    label: 'Condition Name',
                    key: 'name',
                    type: 'textfield',
                    input: true,
                    validate: {
                        required: true
                    },
                },
                {
                    label: 'Validation Scope',
                    key: 'assert',
                    type: 'select',
                    widget: "choicesjs",
                    searchEnabled: false,
                    input: true,
                    validate: {
                        required: true
                    },
                    defaultValue: 'all',
                    data: {
                        values: [
                            {
                                value: 'all',
                                label: 'All Rules',
                            },
                            {
                                value: 'any',
                                label: 'Any one of the Rules',
                            }
                        ],
                    },
                    dataSrc: 'values',
                    template: '<span>{{ item.label }}</span>',
                },
                {
                    label: 'Rules',
                    key: 'rules',
                    type: 'editgrid',
                    input: true,
                    openWhenEmpty: true,
                    disableAddingRemovingRows: false,
                    addAnother: 'Add Rule',
                    saveRow: 'Save Rule',
                    templates: {
                        header: '<div class="row row-cols-1 row-cols-md-1">' +
                            '   <div class="col">' +
                            '       <strong>{{ value.length }} Rules</strong>' +
                            '   </div>' +
                            '</div>',
                        row: '<div class="row">' +
                            '   <div class="col col-9">' +
                            '       <div>{{ row.name }} </div>' +
                            '   </div>' +
                            '   <div class="col col-3">' +
                            '       <div class="btn-group pull-right">' +
                            '           <button class="btn btn-outline-success mr-1 btn-default editRow">Edit</button>' +
                            '           <button class="btn btn-outline-danger removeRow">Delete</button>' +
                            '       </div>' +
                            '   </div>' +
                            '</div>',
                        footer: '',
                    },
                    components: [
                        {
                            label: 'Rule Name',
                            key: 'name',
                            type: 'textfield',
                            input: true,
                            validate: {
                                required: true
                            },
                        },
                        {
                            label: 'Type',
                            key: 'type',
                            type: 'select',
                            widget: "choicesjs",
                            searchEnabled: false,
                            input: true,
                            disabled: true,
                            defaultValue: 'simple',
                            data: {
                                values: [
                                    {
                                        value: 'simple',
                                        label: 'Simple',
                                    },
                                    {
                                        value: 'javascript',
                                        label: 'Javascript',
                                    },
                                    {
                                        value: 'json',
                                        label: 'JSON Logic',
                                    },
                                    {
                                        value: 'event',
                                        label: 'Event',
                                    },
                                ],
                            },
                            dataSrc: 'values',
                            template: '<span>{{ item.label }}</span>',
                        },
                        {
                            label: '',
                            key: 'simple',
                            type: 'container',
                            tableView: false,
                            customConditional({ row }) {
                                return row.type === 'simple';
                            },
                            components: [
                                {
                                    label: 'Attribute',
                                    key: 'fact',
                                    type: 'select',
                                    widget: "choicesjs",
                                    searchEnabled: true,
                                    input: true,
                                    validate: {
                                        required: true
                                    },
                                    data: {
                                        custom(context) {
                                            // return getContextComponents(context);
                                            return context.data.facts.split(',').map((fact) => { return { label: fact, value: fact } });
                                        },
                                    },
                                    dataSrc: 'custom',
                                    valueProperty: 'value'
                                },
                                {
                                    label: 'Operator',
                                    key: 'operator',
                                    type: 'select',
                                    widget: "choicesjs",
                                    searchEnabled: true,
                                    input: true,
                                    validate: {
                                        required: true
                                    },
                                    defaultValue: 'equal',
                                    data: {
                                        values: [
                                            {
                                                value: 'equal',
                                                label: 'Equal',
                                            },
                                            {
                                                value: 'notEqual',
                                                label: 'Not Equal',
                                            },
                                            {
                                                value: 'lessThan',
                                                label: 'Less Than',
                                            },
                                            {
                                                value: 'lessThanInclusive',
                                                label: 'Less than Inclusive',
                                            },
                                            {
                                                value: 'greaterThan',
                                                label: 'Greater Than',
                                            },
                                            {
                                                value: 'greaterThanInclusive',
                                                label: 'Greater than Inclusive',
                                            },
                                            {
                                                value: 'empty',
                                                label: 'Empty',
                                            },
                                            {
                                                value: 'notEmpty',
                                                label: 'Not Empty',
                                            },
                                            {
                                                value: 'contains',
                                                label: 'Contains',
                                            },
                                            {
                                                value: 'doesNotContain',
                                                label: 'Does not Contain',
                                            },
                                            {
                                                value: 'in',
                                                label: 'In',
                                            },
                                            {
                                                value: 'notIn',
                                                label: 'Not In',
                                            }
                                        ],
                                    },
                                    dataSrc: 'values',
                                    template: '<span>{{ item.label }}</span>',
                                },
                                {
                                    label: 'Value',
                                    key: 'value',
                                    type: 'textfield',
                                    input: true
                                },
                            ],
                        },
                        {
                            key: 'javascript',
                            type: 'textarea',
                            editor: 'ace',
                            rows: 5,
                            input: true,
                            customConditional({ row }) {
                                return row.type === 'javascript';
                            },
                        },
                        {
                            label: 'JSON Logic',
                            key: 'json',
                            type: 'textarea',
                            editor: 'ace',
                            as: 'json',
                            rows: 5,
                            input: true,
                            customConditional({ row }) {
                                return row.type === 'json';
                            },
                        },
                        {
                            label: 'Event Name',
                            key: 'event',
                            type: 'textfield',
                            description: 'The event that will trigger this logic. You can trigger events externally or via a button.',
                            customConditional({ row }) {
                                return row.type === 'event';
                            },
                        },
                    ],
                },
            ],
        },
        {
            label: 'Actions',
            key: 'actions',
            type: 'editgrid',
            input: true,
            openWhenEmpty: true,
            disableAddingRemovingRows: true,
            addAnother: 'Add Action',
            saveRow: 'Save Action',
            templates: {
                header: '<div class="row row-cols-1 row-cols-md-1">' +
                    '   <div class="col">' +
                    '       <strong>{{ value.length }} Actions</strong>' +
                    '   </div>' +
                    '</div>',
                row: '<div class="row">' +
                    '   <div class="col col-9">' +
                    '       <div>{{ row.name }} </div>' +
                    '   </div>' +
                    '   <div class="col col-3">' +
                    '       <div class="btn-group pull-right">' +
                    '           <button class="btn btn-outline-success mr-1 btn-default editRow">Edit</button>' +
                    '           <button class="btn btn-outline-danger removeRow">Delete</button>' +
                    '       </div>' +
                    '   </div>' +
                    '</div>',
                footer: '',
            },
            components: [
                {
                    title: 'Action',
                    key: 'actionPanel',
                    type: 'panel',
                    input: false,
                    components: [
                        {
                            label: 'Action Name',
                            key: 'name',
                            type: 'textfield',
                            input: true,
                            validate: {
                                required: true,
                            },
                        },
                        {
                            label: 'Type',
                            key: 'type',
                            type: 'select',
                            widget: "choicesjs",
                            searchEnabled: false,
                            input: true,
                            disabled: true,
                            defaultValue: 'value',
                            data: {
                                values: [
                                    {
                                        value: 'property',
                                        label: 'Property',
                                    },
                                    {
                                        value: 'value',
                                        label: 'Value',
                                    },
                                    {
                                        label: 'Merge Component Schema',
                                        value: 'mergeComponentSchema',
                                    },
                                ],
                            },
                            dataSrc: 'values',
                            template: '<span>{{ item.label }}</span>',
                        },
                        {
                            label: 'Component Property',
                            key: 'property',
                            type: 'select',
                            widget: "choicesjs",
                            searchEnabled: true,
                            input: true,
                            data: {
                                json: [
                                    {
                                        label: 'Hidden',
                                        value: 'hidden',
                                        type: 'boolean',
                                    },
                                    {
                                        label: 'Required',
                                        value: 'validate.required',
                                        type: 'boolean',
                                    },
                                    {
                                        label: 'Disabled',
                                        value: 'disabled',
                                        type: 'boolean',
                                    },
                                    {
                                        label: 'Label',
                                        value: 'label',
                                        type: 'string',
                                    },
                                    {
                                        label: 'Title',
                                        value: 'title',
                                        type: 'string',
                                    },
                                    {
                                        label: 'Prefix',
                                        value: 'prefix',
                                        type: 'string',
                                    },
                                    {
                                        label: 'Suffix',
                                        value: 'suffix',
                                        type: 'string',
                                    },
                                    {
                                        label: 'Tooltip',
                                        value: 'tooltip',
                                        type: 'string',
                                    },
                                    {
                                        label: 'Description',
                                        value: 'description',
                                        type: 'string',
                                    },
                                    {
                                        label: 'Placeholder',
                                        value: 'placeholder',
                                        type: 'string',
                                    },
                                    {
                                        label: 'Input Mask',
                                        value: 'inputMask',
                                        type: 'string',
                                    },
                                    {
                                        label: 'CSS Class',
                                        value: 'className',
                                        type: 'string',
                                    },
                                    {
                                        label: 'Container Custom Class',
                                        value: 'customClass',
                                        type: 'string',
                                    },
                                ],
                            },
                            dataSrc: 'json',
                            template: '<span>{{ item.label }}</span>',
                            customConditional({ row }) {
                                return row.type === 'property';
                            },
                        },
                        {
                            label: 'Set State',
                            key: 'state',
                            type: 'select',
                            widget: "choicesjs",
                            searchEnabled: false,
                            input: true,
                            data: {
                                values: [
                                    {
                                        label: 'True',
                                        value: 'true',
                                    },
                                    {
                                        label: 'False',
                                        value: 'false',
                                    },
                                ],
                            },
                            dataSrc: 'values',
                            template: '<span>{{ item.label }}</span>',
                            customConditional({ row }) {
                                return row.type === 'property' &&
                                    row.hasOwnProperty('property') &&
                                    row.property.type === 'boolean';
                            },
                        },
                        {
                            label: 'Text',
                            key: 'text',
                            type: 'textfield',
                            input: true,
                            description: 'Can use templating with {{ data.myfield }}. "data", "row", "component" and "result" variables are available.',
                            customConditional({ row }) {
                                return row.type === 'property' &&
                                    row.hasOwnProperty('property') &&
                                    row.property.type === 'string' &&
                                    !row.property.component;
                            },
                        },
                        {
                            label: 'Value (Javascript)',
                            key: 'value',
                            type: 'textarea',
                            input: true,
                            editor: 'ace',
                            rows: 5,
                            customConditional({ row }) {
                                return row.type === 'value';
                            },
                        },
                        {
                            label: 'Schema Defenition',
                            key: 'schemaDefinition',
                            type: 'textarea',
                            input: true,
                            editor: 'ace',
                            rows: 5,
                            placeholder: `schema = { label: 'Updated' };`,
                            description: '"row", "data", "component", and "result" variables are available. Return the schema.',
                            customConditional({ row }) {
                                return row.type === 'mergeComponentSchema';
                            },
                        },
                    ],
                },
            ],
        },
        {
            label: "Submit",
            key: "submit",
            type: "button",
            input: true,
            disableOnInvalid: true,
            customClass: "mt-2 text-center"
        }
    ]
}

module.exports.PENDING_DATA_GRID_DESIGN_TABLE = {
    type: "form",
    display: "form",
    components: [
        {
            label: 'Data Grid',
            key: 'grid',
            type: 'editgrid',
            input: true,
            modal: true,
            hideLabel: true,
            tableView: true,
            templates: {
                header: '<table id="lowcode-data-table" class="table-responsive table table-striped table-hover">' +
                    '  <thead class="thead-light">' +
                    '    <tr>' +
                    '      {% util.eachComponent(components, function(component) { %}' +
                    '        <th>{{ component.label.toUpperCase() }}</th>' +
                    '      {% }) %}' +
                    '      {% if (!instance.options.readOnly && !instance.originalComponent.disabled) { %}' +
                    '        <td class="table-action">ACTION</td>' +
                    '      {% } %}' +
                    '    </tr>' +
                    '  </thead>' +
                    '  <tbody>',
                row: '    <tr>' +
                    '      {% util.eachComponent(components, function(component) { %}' +
                    '        <td class="align-middle">' +
                    '          {{ getView(component, row[component.key]) }}' +
                    '        </td>' +
                    '      {% }) %}' +
                    '      {% if (!instance.options.readOnly && !instance.originalComponent.disabled) { %}' +
                    '        <td class="table-action">' +
                    '          <button class="btn btn-icon btn-outline-success editRow"><i class="feather icon-edit"></i></button>' +
                    '          {% if (!instance.hasRemoveButtons || instance.hasRemoveButtons()) { %}' +
                    '            <button class="btn btn-icon btn-outline-danger removeRow"><i class="feather icon-trash-2 text-danger"></i></button>' +
                    '          {% } %}' +
                    '        </td>' +
                    '      {% } %}' +
                    '    </tr>',
                footer: '  </tbody>' +
                    '</table>'
            },
            components: []
        }
    ]
};

