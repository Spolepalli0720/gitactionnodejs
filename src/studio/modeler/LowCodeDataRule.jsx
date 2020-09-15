import React, { Component } from "react";
import { Formio } from 'react-formio';

import { userService } from '../services/UserService';
import { notifyWarning, notifyError } from '../utils/Notifications';

import LowCodeConfig from "./LowCodeConfig";

export default class LowCodeDataView extends Component {

    componentDidMount() {
        const { formDesign, formDesignSource, formData,
            readOnly, renderMode, onSubmit, submitUrl } = this.props;
        const parent = this;

        const renderOptions = { highlightErrors: false, noAlerts: true, submitOnEnter: false };

        if (readOnly !== undefined) {
            renderOptions.readOnly = readOnly;
        } else {
            renderOptions.readOnly = false;
        }

        if (renderMode) {
            renderOptions.renderMode = renderMode;
        } else {
            // renderMode: 'form' / 'html' / 'flat'
            renderOptions.renderMode = 'form';
        }

        Formio.setUser({ _id: userService.getUserId() });
        // Formio.icons = 'fontawesome';
        Formio.createForm(this.element, formDesignSource || formDesign || LowCodeConfig.RULES_FORM_DESIGN, renderOptions).then(form => {
            parent.renderer = form;

            if (formData) {
                form.submission = { data: formData };
            }


            if (submitUrl) {
                form.url = submitUrl;
                form.nosubmit = false;
            } else {
                // Prevent the submission from going to the form.io server.
                form.nosubmit = true;
                form.on('submit', function (event) {
                    if (onSubmit) {
                        let response = onSubmit(event.data)
                        if (response instanceof Promise) {
                            response.then(function (response) {
                                parent.applySubmitResponse(form, event, response);
                            }).catch(error => {
                                notifyError('Form Submission', error.message);
                            });
                        } else {
                            parent.applySubmitResponse(form, event, response);
                        }
                    }
                    else {
                        console.log('on.submit:', event);
                        parent.applySubmitResponse(form, event, event.data);
                    }
                });
            }

        });


    }

    componentWillUnmount() {
        if (this.renderer !== undefined) {
            this.renderer.destroy(true);
        }
    }

    applyChangeResponse = (form, event, response) => {
        if (response) {
            var submission = { data: event.data };
            Object.keys(response).forEach(function (dataKey) {
                if (submission.data[dataKey]) {
                    submission.data[dataKey] = response[dataKey];
                } else {
                    notifyWarning('Change Response', 'Undefined dataKey:' + dataKey);
                }
            });
            form.submission = submission;
        }
    }

    applyPageResponse = (form, event, response) => {
        if (response) {
            var submission = { data: event.submission.data };
            Object.keys(response).forEach(function (dataKey) {
                if (submission.data[dataKey]) {
                    submission.data[dataKey] = response[dataKey];
                } else {
                    notifyWarning('Change Response', 'Undefined dataKey:' + dataKey);
                }
            });
            form.submission = submission;
        }
    }

    applySubmitResponse = (form, event, response) => {
        if (response) {
            try {
                form.emit('submitDone', event)
            } catch (error) {
                console.warn('Failed to emit submitDone event', event);
            }
        }
        // else {
        //     try {
        //         form.emit('submitError', event)
        //     } catch (error) {
        //         console.warn('Failed to emit submitError event', event);
        //     }
        // }
    }

    render() {
        return (
            <section className="studio-container">
                <div ref={element => this.element = element} />
            </section>
        );
    }

}

