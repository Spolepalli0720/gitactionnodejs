import ServiceConstants from './ServiceConstants';
import { requestHandler } from './RequestHandler';

export const triggerService = {
    getTriggerStatus,
    saveTriggerConfig,
    pauseJobs,
    resumeJobs,
    pauseTrigger,
    resumeTrigger,
    editTriggerConfig
}

function getTriggerStatus(type){
    return requestHandler.fetch(`${ServiceConstants.HOST_STUDIO_ENGINE}/api/scheduler/jobs/${type}`);
}

function saveTriggerConfig(triggerConfig){
    return requestHandler.submit(`${ServiceConstants.HOST_STUDIO_ENGINE}/api/scheduler/jobs`, triggerConfig);
}

function editTriggerConfig(type,triggerConfig){
    return requestHandler.update(`${ServiceConstants.HOST_STUDIO_ENGINE}/api/scheduler/jobs/${triggerConfig.id}/type/${type}`,triggerConfig);
}

function pauseJobs(id,type){
    return requestHandler.update(`${ServiceConstants.HOST_STUDIO_ENGINE}/api/scheduler/pause/jobs/${id}/type/${type}`);
}

function resumeJobs(id,type){
    return requestHandler.update(`${ServiceConstants.HOST_STUDIO_ENGINE}/api/scheduler/resume/jobs/${id}/type/${type}`);
}

function pauseTrigger(id,type){
    return requestHandler.update(`${ServiceConstants.HOST_STUDIO_ENGINE}/api/scheduler/pause/trigger/jobs/${id}/type/${type}`);
}

function resumeTrigger(id,type){
    return requestHandler.update(`${ServiceConstants.HOST_STUDIO_ENGINE}/api/scheduler/resume/trigger/jobs/${id}/type/${type}`);
}


    