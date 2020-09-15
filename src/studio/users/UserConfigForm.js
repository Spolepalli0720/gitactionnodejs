module.exports.DATA_INPUT_FORM = {
    "type": "form",
    "display": "form",
    "components": [
        {
            label: "Columns",
            key: "columns",
            type: "columns",
            input: false,
            columns: [
                {
                    size: "md",
                    width: 9,
                    components: [
                        {
                            label: 'Login Name',
                            key: 'username',
                            type: 'email',
                            placeholder: 'name@digitaldots.io',
                            input: true,
                            disabled: false,
                            clearOnHide: false,
                            customConditional: "show = data.configMode !== 'userProfile';",
                            validate: {
                                required: true
                            },
                            logic: [
                                {
                                    name: "Disable Login Name",
                                    trigger: {
                                        type: "javascript",
                                        javascript: "result = data.configMode !== undefined;"
                                    },
                                    actions: [
                                        {
                                            name: "Set Property as Disabled",
                                            type: "property",
                                            property: {
                                                label: "Disabled",
                                                value: "disabled",
                                                type: "boolean"
                                            },
                                            state: true
                                        }
                                    ]
                                }
                            ]
                        }            
                    ]
                },
                {
                    size: "md",
                    width: 1,
                    components: [
                        {
                            type: 'htmlelement',
                            tag: 'p',
                            content: 'Verified',
                            className: 'text-center col-form-label pb-1',
                            input: false,
                            customConditional: "show = data.configMode !== 'userProfile';",
                        },
                        {
                            label: '',
                            key: 'verified',
                            type: 'checkbox',
                            inputType: 'checkbox',
                            defaultValue: false,
                            input: true,
                            disabled: true,
                            customClass: 'text-center',
                            clearOnHide: false,
                            customConditional: "show = data.configMode !== 'userProfile';",
                        }            
                    ]
                },
                {
                    size: "md",
                    width: 1,
                    components: [
                        {
                            type: 'htmlelement',
                            tag: 'p',
                            content: 'Locked',
                            className: 'text-center col-form-label pb-1',
                            input: false,
                            customConditional: "show = data.configMode !== 'userProfile';",
                        },
                        {
                            label: '',
                            key: 'locked',
                            type: 'checkbox',
                            inputType: 'checkbox',
                            defaultValue: false,
                            input: true,
                            disabled: true,
                            customClass: 'text-center',
                            clearOnHide: false,
                            customConditional: "show = data.configMode !== 'userProfile';",
                        }            
                    ]
                },
                {
                    size: "md",
                    width: 1,
                    components: [
                        {
                            type: 'htmlelement',
                            tag: 'p',
                            content: 'Active',
                            className: 'text-center col-form-label pb-1',
                            input: false,
                            customConditional: "show = data.configMode !== 'userProfile';",
                        },
                        {
                            label: '',
                            key: 'active',
                            type: 'checkbox',
                            inputType: 'checkbox',
                            defaultValue: false,
                            input: true,
                            disabled: true,
                            customClass: 'text-center',
                            clearOnHide: false,
                            customConditional: "show = data.configMode !== 'userProfile';",
                        }            
                    ]
                },
                {
                    size: "md",
                    width: 12,
                    components: [
                        {
                            label: 'Roles',
                            key: 'roles',
                            type: 'select',
                            input: true,
                            multiple: true,
                            description: 'Multi value Selection',
                            unique: true,
                            clearOnHide: false,
                            customConditional: "show = data.configMode !== 'userProfile';",
                            data: {
                                values: [
                                    {
                                        label: 'Revoke Access',
                                        value: 'Pending Access'
                                    },
                                    {
                                        label: 'Business User',
                                        value: 'Business User'
                                    },
                                    {
                                        label: 'Leadership',
                                        value: 'Leadership'
                                    },
                                    {
                                        label: 'Technical Support',
                                        value: 'Technical Support'
                                    },
                                    {
                                        label: 'Devops Engineer',
                                        value: 'Devops Engineer'
                                    },
                                    {
                                        label: 'Solution Designer',
                                        value: 'Solution Designer'
                                    },
                                    {
                                        label: 'Enterprise Admin',
                                        value: 'Enterprise Admin'
                                    }
                                ]
                            },
                            dataSrc: 'values',
                            template: '<span>{{ item.label }}</span>',
                            selectThreshold: 0.3,
                            validate: {
                                required: true,
                                multiple: true,
                                unique: true
                            },
                            indexeddb: {
                                filter: {}
                            }
                        },                
                    ]
                },
                {
                    size: "md",
                    width: 6,
                    components: [
                        {
                            label: 'First Name',
                            key: 'firstName',
                            type: 'textfield',
                            placeholder: 'First Name',
                            input: true,
                            validate: {
                                required: true
                            }
                        },                
                    ]
                },
                {
                    size: "md",
                    width: 6,
                    components: [
                        {
                            label: 'Last Name',
                            key: 'lastName',
                            type: 'textfield',
                            placeholder: 'Last Name',
                            input: true,
                            validate: {
                                required: true
                            }
                        }               
                    ]
                },
                {
                    size: "md",
                    width: 6,
                    components: [
                        {
                            label: 'Gender',
                            key: 'gender',
                            type: 'select',
                            placeholder: 'Select Gender',
                            searchEnabled: false,
                            input: true,
                            data: {
                                values: [
                                    {
                                        label: 'Male',
                                        value: 'male'
                                    },
                                    {
                                        label: 'Female',
                                        value: 'female'
                                    }
                                ]
                            },
                            dataSrc: 'values',
                            template: '<span>{{ item.label }}</span>',
                        }               
                    ]
                },
                {
                    size: "md",
                    width: 6,
                    components: [
                        {
                            label: 'Date of Birth',
                            key: "dateOfBirth",
                            type: "datetime",
                            input: true,
                            tableView: false,
                            enableMinDateInput: false,
                            enableMaxDateInput: false,
                            datePicker: {
                                disableWeekends: false,
                                disableWeekdays: false
                            },
                            defaultValue: undefined,
                            defaultDate: undefined,
                            widget: {
                                type: "calendar",
                                displayInTimezone: "viewer",
                                language: "en",
                                useLocaleSettings: false,
                                allowInput: true,
                                mode: "single",
                                enableTime: true,
                                noCalendar: false,
                                format: "yyyy-MM-dd hh:mm a",
                                hourIncrement: 1,
                                minuteIncrement: 1,
                                time_24hr: false,
                                minDate: null,
                                maxDate: null,
                                disableWeekends: false,
                                disableWeekdays: false,
                            },
                            suffix: "<i ref=\"icon\" class=\"fa fa-calendar\" style=\"\"></i>",
                        }               
                    ]
                },
                {
                    size: "md",
                    width: 6,
                    components: [
                        {
                            label: 'Phone Number',
                            key: 'phoneNo',
                            type: 'phoneNumber',
                            input: true
                        }               
                    ]
                },
                {
                    size: "md",
                    width: 6,
                    components: [
                        {
                            label: 'Skype Id',
                            key: 'skypeId',
                            type: 'textfield',
                            input: true
                        }               
                    ]
                },
                {
                    size: "md",
                    width: 12,
                    components: [
                        {
                            label: 'Address',
                            key: 'address',
                            type: 'textarea',
                            input: true,
                            customClass: 'mb-3'
                        }               
                    ]
                }
            ]
        },
        {
            label: "Submit",
            key: "submit",
            type: "button",
            customConditional: "show = data.configMode !== 'verifyUser';",
            customClass: "text-center",
            input: true,
            tableView: false,
            showValidations: false,
            disableOnInvalid: true,
        }
    ]
}