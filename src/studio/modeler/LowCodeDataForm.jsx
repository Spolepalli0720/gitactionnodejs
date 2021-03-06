import React, { Component } from "react";
import { Formio } from 'react-formio';

import { userService } from '../services/UserService';
import { notifyWarning, notifyError } from '../utils/Notifications';

export default class LowCodeDataForm extends Component {

    componentDidMount() {
        const parent = this;

        const { formDesign, formDesignSource, formData,
            readOnly, renderMode, breadcrumbSettings, buttonSettings,
            onPrevPage, onNextPage, onChange, onSubmit, submitUrl } = this.props;

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

        if (breadcrumbSettings) {
            renderOptions.breadcrumbSettings = breadcrumbSettings
        } else {
            renderOptions.breadcrumbSettings = { clickable: false }
        }

        if (buttonSettings) {
            renderOptions.buttonSettings = buttonSettings;
        } else if (formDesign && 'dashboard' === formDesign.type) {
            renderOptions.buttonSettings = { showCancel: false, showPrevious: false, showNext: false, showSubmit: false };
        } else {
            renderOptions.buttonSettings = { showCancel: false, showPrevious: true, showNext: true, showSubmit: true };
        }

        Formio.setUser({ _id: userService.getUserId() });
        // Formio.icons = 'fontawesome';
        Formio.createForm(this.element, formDesignSource || formDesign, renderOptions).then(form => {
            parent.renderer = form;

            if (formData) {
                form.submission = { data: formData };
            }

            form.on('render', function () {
                var navButtonElements = document.getElementsByClassName("btn-wizard-nav-submit");
                if (navButtonElements.length > 0) {
                    if ('Submit Form' === navButtonElements[0].innerHTML) {
                        navButtonElements[0].innerHTML = 'Submit';
                    }
                }
            });

            form.on('change', function (event) {
                if (event.changed) {
                    if (onChange) {
                        // Example: Check for (event.changed.component.key === 'customerNumber' && event.changed.value)
                        let response = onChange(event.changed);
                        if (response instanceof Promise) {
                            response.then(function (response) {
                                parent.applyChangeResponse(form, event, response);
                            }).catch(error => {
                                notifyError('Change Event', error.message);
                            });
                        } else {
                            parent.applyChangeResponse(form, event, response);
                        }
                    }
                    else {
                        // console.log('on.change:', event);
                        parent.applyChangeResponse(form, event, undefined);
                    }
                }
            });

            form.on('prevPage', function (event) {
                if (onPrevPage) {
                    let response = onPrevPage(event.page);
                    if (response instanceof Promise) {
                        response.then(function (response) {
                            parent.applyPageResponse(form, event, response);
                        }).catch(error => {
                            notifyError('Previous Page', error.message);
                        });
                    } else {
                        parent.applyPageResponse(form, event, response);
                    }
                }
                else {
                    // console.log('on.prevPage:', event);
                    parent.applyPageResponse(form, event, undefined);
                }
            });

            form.on('nextPage', function (event) {
                if (onNextPage) {
                    let response = onNextPage(event.page);
                    if (response instanceof Promise) {
                        response.then(function (response) {
                            parent.applyPageResponse(form, event, response);
                        }).catch(error => {
                            notifyError('Next Page', error.message);
                        });
                    } else {
                        parent.applyPageResponse(form, event, response);
                    }
                }
                else {
                    // console.log('on.nextPage:', event);
                    parent.applyPageResponse(form, event, undefined);
                }
            });

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
                        // console.log('on.submit:', event);
                        parent.applySubmitResponse(form, event, undefined);
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
