import ServiceConstants from './ServiceConstants';
import { requestHandler } from './RequestHandler';

export const connectorService = {
    getTemplates, getConnectors, getConnector, createConnector, updateConnector, verifyConnector, deleteConnector
};

function getTemplates() {
    return requestHandler.fetch(`${ServiceConstants.HOST_STORE}/api/templates?category=Connector`)
}

function getConnectors(solutionId) {
    return requestHandler.fetchPagination(`${ServiceConstants.HOST_STORE}/api/solution/${solutionId}/connectors`)
}

function getConnector(solutionId, connectorId) {
    return requestHandler.fetch(`${ServiceConstants.HOST_STORE}/api/solution/${solutionId}/connectors/${connectorId}`)
}

function createConnector(solutionId, connector) {
    return requestHandler.submit(`${ServiceConstants.HOST_STORE}/api/solution/${solutionId}/connectors`, connector)
}

function updateConnector(solutionId, connector) {
    return requestHandler.update(`${ServiceConstants.HOST_STORE}/api/solution/${solutionId}/connectors/${connector.id}`, connector)
}

function verifyConnector(solutionId, connectorId) {
    return requestHandler.update(`${ServiceConstants.HOST_STORE}/api/solution/${solutionId}/connectors/${connectorId}/verify`)
}

function deleteConnector(solutionId, connectorId) {
    return requestHandler.remove(`${ServiceConstants.HOST_STORE}/api/solution/${solutionId}/connectors/${connectorId}`)
}
