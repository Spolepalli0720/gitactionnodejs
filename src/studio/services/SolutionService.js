import ServiceConstants from './ServiceConstants';
import { requestHandler } from './RequestHandler';

export const solutionService = {
    getSolutions, createSolution, getSolution, getSolutionHistory, updateSolution, activateSolution, deactivateSolution, shareSolution, deleteSolution
};

function getSolutions() {
    // return requestHandler.fetch(`${ServiceConstants.HOST_FOUNDATION}/api/solutions`);
    return requestHandler.fetchPagination(`${ServiceConstants.HOST_FOUNDATION}/api/solutions`);
}

function createSolution(solution) {
    return requestHandler.submit(`${ServiceConstants.HOST_FOUNDATION}/api/solutions`, solution);
}

function getSolution(solutionId) {
    return requestHandler.fetch(`${ServiceConstants.HOST_FOUNDATION}/api/solutions/${solutionId}`);
}

function getSolutionHistory(solutionId) {
    return requestHandler.fetch(`${ServiceConstants.HOST_FOUNDATION}/api/audit/solutions/${solutionId}`);
}

function updateSolution(solution) {
    return requestHandler.update(`${ServiceConstants.HOST_FOUNDATION}/api/solutions/${solution.id}`, solution);
}

function shareSolution(solutionId, users) {
    return requestHandler.update(`${ServiceConstants.HOST_FOUNDATION}/api/solutions/${solutionId}/share`, users);
}

function activateSolution(solutionId) {
    return requestHandler.update(`${ServiceConstants.HOST_FOUNDATION}/api/solutions/${solutionId}/activate`, {});
}

function deactivateSolution(solutionId) {
    return requestHandler.update(`${ServiceConstants.HOST_FOUNDATION}/api/solutions/${solutionId}/deactivate`, {});
}

function deleteSolution(solutionId) {
    return requestHandler.remove(`${ServiceConstants.HOST_FOUNDATION}/api/solutions/${solutionId}`);
}
