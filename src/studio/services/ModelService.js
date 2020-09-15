import ServiceConstants from './ServiceConstants';
import { requestHandler } from './RequestHandler';

export const modelService = {
    getModels,getModel,
};

function getModels(solutionId){
    return requestHandler.fetchPagination(`${ServiceConstants.HOST_SOLUTION}/api/solutions/${solutionId}/models`)
}
function getModel(modelId,solutionId){
    return requestHandler.fetchPagination(`${ServiceConstants.HOST_SOLUTION}/api/solutions/${solutionId}/models/${modelId}`)
}