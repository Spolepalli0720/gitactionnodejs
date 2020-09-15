import ServiceConstants from './ServiceConstants';
import { requestHandler } from './RequestHandler';
import { userService } from "./UserService";

export const ruleService = {
    getRules, createRule, getRule, getRuleHistory, updateRule, activateRule, deactivateRule, publishRule, deployRule, deleteRule,
};

function getRules(solutionId) {
    let requestParams = '';
    if (solutionId) {
        requestParams = `?solutionId=${solutionId}`
    }

    return requestHandler.fetch(`${ServiceConstants.HOST_SOLUTION}/api/decisions${requestParams}`);
}

function createRule(solutionId, name, description, tags) {
    let uniqueId = userService.generateUUID();

    var dfContent = '<?xml version="1.0" encoding="UTF-8"?><definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" xmlns:dmndi="https://www.omg.org/spec/DMN/20191111/DMNDI/" id="{DEFINITION_ID}" name="{DEFINITION_ID}" namespace="http://camunda.org/schema/1.0/dmn" exporter="DigitalDots Studio" exporterVersion="4.0.0-dev.20200504"><decision id="{DECISION_ID}" /><dmndi:DMNDI><dmndi:DMNDiagram /></dmndi:DMNDI></definitions>';
    dfContent = dfContent.replace(/{DEFINITION_ID}/g, "d" + uniqueId);
    dfContent = dfContent.replace(/{DECISION_ID}/g, "r" + uniqueId);
    // var dfContent = '<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" targetNamespace="http://bpmn.io/schema/bpmn" id="{DEFINITION_ID}" exporter="DigitalDots Studio" exporterVersion="6.5.1"><bpmn:process id="{DECISION_ID}" isExecutable="false"></bpmn:process><bpmndi:BPMNDiagram id="BPMNDiagram_1"><bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="{DECISION_ID}"></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>';
    // dfContent = wfContent.replace(/{DEFINITION_ID}/g, "d" + uniqueId);
    // dfContent = wfContent.replace(/{DECISION_ID}/g, "r" + uniqueId);

    let decision = {
        name: name,
        alias: name,
        description: description,
        tags: tags,
        customTypes: [],
        type: 'DECISION',
        status: 'DRAFT',
        version: '1.0',
        solutionId: solutionId,
        decisionId: "r" + uniqueId,
        deleted: false,
        content: dfContent
    };

    return requestHandler.submit(`${ServiceConstants.HOST_SOLUTION}/api/decisions`, decision);
}

function getRule(decisionId) {
    return requestHandler.fetch(`${ServiceConstants.HOST_SOLUTION}/api/decisions/${decisionId}`);
}

function getRuleHistory(decisionId) {
    return requestHandler.fetch(`${ServiceConstants.HOST_SOLUTION}/api/audit/decisions/${decisionId}`);
}

function updateRule(decision) {
    return requestHandler.update(`${ServiceConstants.HOST_SOLUTION}/api/decisions`, decision);
}

function activateRule(decisionId) {
    return requestHandler.update(`${ServiceConstants.HOST_SOLUTION}/api/decisions/${decisionId}/activate`, {});
}

function deactivateRule(decisionId) {
    return requestHandler.update(`${ServiceConstants.HOST_SOLUTION}/api/decisions/${decisionId}/deactivate`, {});
}

function publishRule(decision) {
    return requestHandler.update(`${ServiceConstants.HOST_SOLUTION}/api/decisions/${decision.id}/publish`, decision.content);
}

function deployRule(decisionId, solutionId, environment, version, name) {
    const deploymentInfo = { "decisionId": decisionId, "solutionId": solutionId, "environment": environment, "version": version, "name": name };

    return requestHandler.submit(`${ServiceConstants.HOST_PROCESS_ENGINE}/engine/api/deployments`, deploymentInfo);
}

function deleteRule(decisionId) {
    return requestHandler.remove(`${ServiceConstants.HOST_SOLUTION}/api/decisions/${decisionId}`);
}

// function getLocalRules() {
//     return Promise.resolve(JSON.parse(JSON.stringify(rules)));
// }

// function createLocalRule(rule) {
//     rule.id = userService.generateUUID();
//     rule.status = "DRAFT";
//     rule.version = "1.0";
//     //TODO:  Remove createdBy and modifiedBy details when integrating with Backend
//     rule.createdBy = userService.getLoginName();
//     rule.createdAt = new Date().toISOString();
//     rule.modifiedBy = userService.getLoginName();
//     rule.modifiedAt = new Date().toISOString();

//     rules.push(rule);
//     return Promise.resolve(rule);
// }

// function updateLocalRule(rule) {
//     //TODO:  Remove modifiedBy details when integrating with Backend
//     rule.modifiedBy = userService.getLoginName();
//     rule.modifiedAt = new Date().toISOString();
//     let existingRule = rules.filter(existingRule => existingRule.id === rule.id)[0];
//     Object.keys(rule).forEach(function (ruleKey)  {
//         existingRule[ruleKey] = rule[ruleKey];
//     });
//     return Promise.resolve(rule);
// }

// const rules = [
//     {
//         "id": "a1l5a8t7e9e0f1i635120",
//         "solutionId": "5e8daf95a32f940004e813bf",
//         "name": "Detect player foul limits",
//         "description": "Check for foul count in a game",
//         "status": "DRAFT",
//         "version": "1.0",
//         "modifiedAt": "2020-04-08T11:06:19.314",
//         "facts": [
//             "gameDuration",
//             "personalFoulCount"
//         ],
//         "assert": "any",
//         "conditions": [
//             {
//                 "name": "Game is 40 minutes AND committed 5 Fouls",
//                 "assert": "all",
//                 "rules": [
//                     {
//                         "name": "Game duration",
//                         "type": "simple",
//                         "simple": {
//                             "fact": "gameDuration",
//                             "operator": "equal",
//                             "value": "40"
//                         }
//                     },
//                     {
//                         "name": "Foul count",
//                         "type": "simple",
//                         "simple": {
//                             "fact": "personalFoulCount",
//                             "operator": "greaterThanInclusive",
//                             "value": "5"
//                         }
//                     }
//                 ]
//             },
//             {
//                 "name": "Game is 48 minutes AND committed 6 Fouls",
//                 "assert": "all",
//                 "rules": [
//                     {
//                         "name": "Game duration",
//                         "type": "simple",
//                         "simple": {
//                             "fact": "gameDuration",
//                             "operator": "equal",
//                             "value": "48"
//                         }
//                     },
//                     {
//                         "name": "Foul count",
//                         "type": "simple",
//                         "simple": {
//                             "fact": "personalFoulCount",
//                             "operator": "greaterThanInclusive",
//                             "value": "6"
//                         }
//                     }
//                 ]
//             }
//         ],
//         "actions": [
//             {
//                 "name": "result",
//                 "type": "value",
//                 "value": "fouledOut"
//             }
//         ]
//     }
// ];
