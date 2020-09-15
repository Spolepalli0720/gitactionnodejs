import ServiceConstants from './ServiceConstants';
import { requestHandler } from './RequestHandler';
import { userService } from "./UserService";

export const workflowService = {
    getWorkflows, createWorkflow, getWorkflow, getWorkflowHistory, updateWorkflow, activateWorkflow, deactivateWorkflow, publishWorkflow, deployWorkflow, deleteWorkflow,
};

function getWorkflows(solutionId) {
    let requestParams = '';
    if (solutionId) {
        requestParams = `?solutionId=${solutionId}`
    }

    return requestHandler.fetch(`${ServiceConstants.HOST_SOLUTION}/api/workflows${requestParams}`);
}

function createWorkflow(solutionId, name, description, tags) {
    let uniqueId = userService.generateUUID();

    var wfContent = '<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" targetNamespace="http://bpmn.io/schema/bpmn" id="{DEFINITION_ID}" exporter="DigitalDots Studio" exporterVersion="6.5.1"><bpmn:process id="{PROCESS_ID}" isExecutable="true"><bpmn:startEvent id="StartEvent_1"/></bpmn:process><bpmndi:BPMNDiagram id="BPMNDiagram_1"><bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="{PROCESS_ID}"><bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1"><dc:Bounds height="36.0" width="36.0" x="173.0" y="102.0"/></bpmndi:BPMNShape></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>';
    wfContent = wfContent.replace(/{DEFINITION_ID}/g, "d" + uniqueId);
    wfContent = wfContent.replace(/{PROCESS_ID}/g, "p" + uniqueId);

    let workflow = {
        name: name,
        alias: name,
        description: description,
        tags: tags,
        type: 'PROCESS',
        status: 'DRAFT',
        version: '1.0',
        solutionId: solutionId,
        processId: "p" + uniqueId,
        deleted: false,
        content: wfContent
    };

    return requestHandler.submit(`${ServiceConstants.HOST_SOLUTION}/api/workflows`, workflow);
}

function getWorkflow(workflowId) {
    return requestHandler.fetch(`${ServiceConstants.HOST_SOLUTION}/api/workflows/${workflowId}`);
}

function getWorkflowHistory(workflowId) {
    return requestHandler.fetch(`${ServiceConstants.HOST_SOLUTION}/api/audit/workflows/${workflowId}`);
}

function updateWorkflow(workflow) {
    return requestHandler.update(`${ServiceConstants.HOST_SOLUTION}/api/workflows`, workflow);
}

function activateWorkflow(workflowId) {
    return requestHandler.update(`${ServiceConstants.HOST_SOLUTION}/api/workflows/${workflowId}/activate`, {});
}

function deactivateWorkflow(workflowId) {
    return requestHandler.update(`${ServiceConstants.HOST_SOLUTION}/api/workflows/${workflowId}/deactivate`, {});
}

function publishWorkflow(workflow) {
    return requestHandler.update(`${ServiceConstants.HOST_SOLUTION}/api/workflows/${workflow.id}/publish`, workflow.content);
}

function deployWorkflow(workflowId, solutionId, environment, version, name) {
    const deploymentInfo = { "workflowId": workflowId, "solutionId": solutionId, "environment": environment, "version": version, "name": name };

    return requestHandler.submit(`${ServiceConstants.HOST_PROCESS_ENGINE}/engine/api/deployments`, deploymentInfo);
}

function deleteWorkflow(workflowId) {
    return requestHandler.remove(`${ServiceConstants.HOST_SOLUTION}/api/workflows/${workflowId}`);
}
