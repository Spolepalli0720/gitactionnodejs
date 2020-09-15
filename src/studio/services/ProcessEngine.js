import ServiceConstants from './ServiceConstants';
import { requestHandler } from './RequestHandler';
import { userService } from './UserService';

export const processEngine = {
    getDeploymentSummary, getDeploymentStatus, getDeploymentMetrics, getDeploymentDetails, startDeploymentInstance, getDeploymentInstance,
    getDeploymentTasks, getPayload,
    getEngineSummary, getTaskSummary, taskFilter, getHumanTaskSummary, getHumanTasks, getHumanTask, getFormVariables,
    claimHumanTask, assignHumanTask, submitHumanTask,
    startWorkflowInstance, submitWorkflowInstance
};

const ENGINE_NAME = 'default';

function getDeploymentSummary(solutionId) {
    return requestHandler.fetchPagination(`${ServiceConstants.HOST_STUDIO_ENGINE}/api/process-deploy-metrics/${solutionId}`);
}

function getDeploymentStatus(solutionId, deploymentId) {
    return requestHandler.fetch(`${ServiceConstants.HOST_STUDIO_ENGINE}/api/process-deploy-metrics/${solutionId}/${deploymentId}`);
}

function getDeploymentMetrics(solutionId, deploymentId) {
    return requestHandler.fetch(`${ServiceConstants.HOST_STUDIO_ENGINE}/api/task-metrics/${solutionId}/${deploymentId}/task-details`);
}

function getDeploymentDetails(solutionId, deploymentId, deploymentStatus) {
    let requestParams = '';
    if (deploymentStatus) {
        requestParams = `?status=${deploymentStatus}`
    }
    return requestHandler.fetchPagination(`${ServiceConstants.HOST_STUDIO_ENGINE}/api/process-deploy-metrics/${solutionId}/${deploymentId}/instance-details${requestParams}`);
}

function startDeploymentInstance(solutionId, instanceId, payload) {

    return requestHandler.submit(`${ServiceConstants.HOST_STUDIO_ENGINE}/api/process-instance/solution/${solutionId}/process/${instanceId}/run`, payload);
}

function getDeploymentInstance(instanceId) {
    let requestParams = '';
    if (instanceId) {
        requestParams = `?instanceId=${instanceId}`
    }
    return requestHandler.fetch(`${ServiceConstants.HOST_STUDIO_ENGINE}/api/process-instance-metrics${requestParams}`);
}

function getDeploymentTasks(solutionId, processId) {
    if (processId) {
        return requestHandler.fetch(`${ServiceConstants.HOST_STUDIO_ENGINE}/api/task/deployment/${processId}`);
    } else if (solutionId) {
        let requestParams = `?solutionId=${solutionId}`
        return requestHandler.fetch(`${ServiceConstants.HOST_STUDIO_ENGINE}/api/task${requestParams}`);
    } else {
        return requestHandler.fetch(`${ServiceConstants.HOST_STUDIO_ENGINE}/api/task`);
    }
}

function getPayload(url) {
    return requestHandler.fetch(url);
}

function getEngineSummary(filterId) {
    let engineSummary = [
        { count: 0, name: 'Workflow Definitions', url: 'process-definition/count?latestVersion=true' },
        { count: 0, name: 'Decision Rules', url: 'decision-definition/count?latestVersion=true' },
        { count: 0, name: 'Cases', url: 'case-definition/count?latestVersion=true' },
        { count: 0, name: 'Deployments', url: 'deployment/count' },
        { count: 0, name: 'Assigned to Users', url: 'task/count?unfinished=true&assigned=true' },
        { count: 0, name: 'Assigned to Groups', url: 'task/count?unfinished=true&unassigned=true&withCandidateGroups=true' },
        { count: 0, name: 'Unassigned', url: 'task/count?unfinished=true&unassigned=true&withoutCandidateGroups=true' },
        { count: 0, name: 'Open Tasks', url: 'task/count' }
    ];

    var promiseArray = [];
    engineSummary.forEach(function (sumaryInfo) {
        promiseArray.push(fetchSummary(sumaryInfo));
    });

    const statsPromise = requestHandler.fetch(`${ServiceConstants.HOST_PROCESS_ENGINE}/engine/${ENGINE_NAME}/process-definition/statistics?incidents=true&failedJobs=true`,
        { authType: 'ProcessEngine' }).then(response => {
            let instances = 0;
            let failedJobs = 0;
            let incidents = 0;
            response.forEach(function (statsInfo) {
                instances += statsInfo.instances;
                failedJobs += statsInfo.failedJobs;
                statsInfo.incidents.forEach(function (incidentInfo) {
                    incidents += incidentInfo.incidentCount;
                });
            });
            engineSummary.unshift({ count: failedJobs, name: 'Failed Jobs' });
            engineSummary.unshift({ count: incidents, name: 'Open Incidents' });
            engineSummary.unshift({ count: instances, name: 'Workflow Instances' });
        }).catch(error => {
            console.warn('Process Definitions Statistics :: ', error.message);
        });
    promiseArray.push(statsPromise);

    return Promise.all(promiseArray).then(() => {
        return engineSummary;
    }).catch(error => {
        console.warn('processEngine.getEngineSummary:', error.message);
    });
}

function getTaskSummary(filterId) {
    let taskSummary = [
        { count: 0, name: 'Assigned to Users', url: 'task/count?unfinished=true&assigned=true' },
        { count: 0, name: 'Assigned to Groups', url: 'task/count?unfinished=true&unassigned=true&withCandidateGroups=true' },
        { count: 0, name: 'Unassigned', url: 'task/count?unfinished=true&unassigned=true&withoutCandidateGroups=true' },
        { count: 0, name: 'Open Tasks', url: 'task/count' }
    ];

    var promiseArray = [];
    taskSummary.forEach(function (sumaryInfo) {
        promiseArray.push(fetchSummary(sumaryInfo));
    });

    return Promise.all(promiseArray).then(() => {
        return taskSummary;
    }).catch(error => {
        console.warn('processEngine.getTaskSummary:', error.message);
    });
}

function fetchSummary(sumaryInfo) {
    return requestHandler.fetch(`${ServiceConstants.HOST_PROCESS_ENGINE}/engine/${ENGINE_NAME}/${sumaryInfo.url}`,
        { authType: 'ProcessEngine' }).then(response => {
            sumaryInfo.count = response.count
        }).catch(error => {
            console.warn(sumaryInfo.name, ' :: ', error.message);
        });
}

function taskFilter(filterId) {
    let filterURL = `filter?resourceType=Task&itemCount=true`;
    if (filterId) {
        filterURL = `filter/${filterId}/list`
    }
    return requestHandler.fetch(`${ServiceConstants.HOST_PROCESS_ENGINE}/engine/${ENGINE_NAME}/${filterURL}`,
        { authType: 'ProcessEngine' });
}

function getHumanTaskSummary() {
    return requestHandler.fetch(`${ServiceConstants.HOST_PROCESS_ENGINE}/engine/${ENGINE_NAME}/filter?resourceType=Task&itemCount=true`,
        { authType: 'ProcessEngine' });
}

function getHumanTasks() {
    return requestHandler.fetch(`${ServiceConstants.HOST_PROCESS_ENGINE}/engine/${ENGINE_NAME}/task?active=true`,
        { authType: 'ProcessEngine' });
}

function getHumanTask(taskId) {
    return requestHandler.fetch(`${ServiceConstants.HOST_PROCESS_ENGINE}/engine/${ENGINE_NAME}/task/${taskId}`,
        { authType: 'ProcessEngine' });
}

function getFormVariables(taskId) {
    // return requestHandler.fetch(`${ServiceConstants.HOST_PROCESS_ENGINE}/engine/${ENGINE_NAME}/task/${taskId}/form-variables`,
    //     { authType: 'ProcessEngine' });
    return requestHandler.fetch(`${ServiceConstants.HOST_STUDIO_ENGINE}/api/task/${taskId}/message`).then(response => {
        Object.keys(response.variables).forEach(formKey => {
            response.variables[formKey] = { type: typeof response.variables[formKey], value: response.variables[formKey] }
        })
        return response.variables;
    })
}

function claimHumanTask(taskId) {
    // let payload = { userId: userService.getLoginName().split('@')[0] };
    // return requestHandler.submit(`${ServiceConstants.HOST_PROCESS_ENGINE}/engine/${ENGINE_NAME}/task/${taskId}/claim`, payload,
    //     { authType: 'ProcessEngine' });
    let payload = { assignee: userService.getLoginName().split('@')[0] }
    return requestHandler.update(`${ServiceConstants.HOST_STUDIO_ENGINE}/api/task/${taskId}/action/ASSIGN`, payload);
}

function assignHumanTask(taskId, reviewer) {
    let payload = {
        variables: {
            reviewer: {
                value: reviewer,
                type: "String"
            }
        }
    };
    return submitHumanTask(taskId, payload);
}

function submitHumanTask(taskId, payload) {
    // return requestHandler.submit(`${ServiceConstants.HOST_PROCESS_ENGINE}/engine/${ENGINE_NAME}/task/${taskId}/submit-form`, payload,
    //     { authType: 'ProcessEngine' });
    return requestHandler.update(`${ServiceConstants.HOST_STUDIO_ENGINE}/api/task/complete/${taskId}`, payload);
}

function startWorkflowInstance(solutionId, processId, payload) {
    return startDeploymentInstance(solutionId, processId, payload);
    //return requestHandler.submit(`${ServiceConstants.HOST_PROCESS_ENGINE}/engine/${ENGINE_NAME}/process-definition/key/${processId}/start`,
    //  payload, { authType: 'ProcessEngine' });
}

function submitWorkflowInstance(solutionId, processId, payload) {
    return requestHandler.submit(`${ServiceConstants.HOST_PROCESS_ENGINE}/engine/${ENGINE_NAME}/process-definition/${processId}/submit-form`,
        payload, { authType: 'ProcessEngine' });
}
