import ServiceConstants from './ServiceConstants';
import { requestHandler } from './RequestHandler';

export const applicationService = {
    getApplications, createApplication, getApplication, getApplicationHistory, updateApplication, publishApplication, deleteApplication,
    getForms, createForm, getForm, getFormHistory, updateForm, activateForm, deactivateForm, publishForm, deleteForm,
};

function getApplications() {
    return requestHandler.fetch(`${ServiceConstants.HOST_SOLUTION}/api/applications`).then(respApplications => {
        respApplications.forEach(function (respApplication) {
            if (respApplication.forms) {
                respApplication.forms.forEach(function (respForm) {
                    respForm.content = JSON.parse(respForm.content);
                });
            }
        });
        return respApplications;
    });
}

function createApplication(application) {
    if (application.forms) {
        application.forms.forEach(function (taskForm) {
            taskForm.content = JSON.stringify(taskForm.content);
        });
    }

    return requestHandler.submit(`${ServiceConstants.HOST_SOLUTION}/api/applications`, application).then(respApplication => {
        if (respApplication && respApplication.forms) {
            respApplication.forms.forEach(function (respForm) {
                respForm.content = JSON.parse(respForm.content);
            });
        }
        return respApplication;
    });
}

function getApplication(applicationId) {
    return requestHandler.fetch(`${ServiceConstants.HOST_SOLUTION}/api/applications/${applicationId}`).then(respApplication => {
        if (respApplication && respApplication.forms) {
            respApplication.forms.forEach(function (respForm) {
                respForm.content = JSON.parse(respForm.content);
            });
        }
        return respApplication;
    });
}

function getApplicationHistory(applicationId) {
    return requestHandler.fetch(`${ServiceConstants.HOST_SOLUTION}/api/audit/applications/${applicationId}`);
}

function updateApplication(application) {
    if (application.forms) {
        application.forms.forEach(function (taskForm) {
            taskForm.content = JSON.stringify(taskForm.content);
        });
    }

    return requestHandler.update(`${ServiceConstants.HOST_SOLUTION}/api/applications`, application).then(respApplication => {
        if (respApplication && respApplication.forms) {
            respApplication.forms.forEach(function (respForm) {
                respForm.content = JSON.parse(respForm.content);
            });
        }
        return respApplication;
    });
}

function publishApplication(application) {

}

function deleteApplication(applicationId) {
    return requestHandler.remove(`${ServiceConstants.HOST_SOLUTION}/api/applications/${applicationId}`);
}

function getForms(solutionId, applicationId) {
    let requestParams = '';
    if (solutionId && applicationId) {
        requestParams = `?solutionId=${solutionId}&applicationId=${applicationId}`
    } else if (solutionId) {
        requestParams = `?solutionId=${solutionId}`
    } else if (applicationId) {
        requestParams = `?applicationId=${applicationId}`
    }

    return requestHandler.fetch(`${ServiceConstants.HOST_SOLUTION}/api/forms${requestParams}`).then(respForms => {
        respForms.forEach(function (respForm) {
            respForm.content = JSON.parse(respForm.content);
        });
        return respForms;
    });
}

function createForm(solutionId, applicationId, name, description, type) {
    let formContent = {};
    if ('form' === type) {
        formContent.type = "form";
        formContent.display = "form";
        formContent.components = [
            {
                label: "Submit", key: "submit", type: "button", customClass: "text-center",
                input: true, tableView: false, showValidations: false, disableOnInvalid: true
            }
        ];
    } else if ('wizard' === type) {
        formContent.type = "form";
        formContent.display = "wizard";
        formContent.components = [
            {
                title: "Page 1", label: "Page 1", key: "page1", type: "panel",
                input: false, tableView: false, components: []
            }
        ];
    } else if ('dashboard' === type) {
        formContent.type = "form";
        formContent.display = "form";
        formContent.components = [
            {
                label: "Submit", key: "submit", type: "button", customClass: "hidden",
                input: true, tableView: false, showValidations: false, disableOnInvalid: true,
            }
        ];
    }

    let taskForm = {
        name: name,
        description: description,
        type: type,
        solutionId: solutionId,
        applicationId: applicationId === 'studio' ? solutionId : applicationId,
        version: '1.0',
        status: 'DRAFT',
        content: JSON.stringify(formContent)
    };

    return requestHandler.submit(`${ServiceConstants.HOST_SOLUTION}/api/forms`, taskForm).then(respForm => {
        if (respForm) {
            respForm.content = JSON.parse(respForm.content);
        }
        return respForm;
    });
}

function getForm(formId) {
    return requestHandler.fetch(`${ServiceConstants.HOST_SOLUTION}/api/forms/${formId}`).then(respForm => {
        if (respForm) {
            respForm.content = JSON.parse(respForm.content);
        }
        return respForm;
    });
}

function getFormHistory(formId) {
    return requestHandler.fetch(`${ServiceConstants.HOST_SOLUTION}/api/audit/forms/${formId}`);
}

function updateForm(taskForm) {
    taskForm.content = JSON.stringify(taskForm.content);

    return requestHandler.update(`${ServiceConstants.HOST_SOLUTION}/api/forms`, taskForm).then(respForm => {
        if (respForm) {
            respForm.content = JSON.parse(respForm.content);
        }
        return respForm;
    });
}

function activateForm(formId) {
    return requestHandler.update(`${ServiceConstants.HOST_SOLUTION}/api/forms/${formId}/activate`, {}).then(respForm => {
        if (respForm) {
            respForm.content = JSON.parse(respForm.content);
        }
        return respForm;
    });
}

function deactivateForm(formId) {
    return requestHandler.update(`${ServiceConstants.HOST_SOLUTION}/api/forms/${formId}/deactivate`, {}).then(respForm => {
        if (respForm) {
            respForm.content = JSON.parse(respForm.content);
        }
        return respForm;
    });
}

function publishForm(taskForm) {
    taskForm.content = JSON.stringify(taskForm.content);

    return requestHandler.update(`${ServiceConstants.HOST_SOLUTION}/api/forms/${taskForm.id}/publish`, taskForm.content).then(respForm => {
        if (respForm) {
            respForm.content = JSON.parse(respForm.content);
        }
        return respForm;
    });
}

function deleteForm(formId) {
    return requestHandler.remove(`${ServiceConstants.HOST_SOLUTION}/api/forms/${formId}`);
}
