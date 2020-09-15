import ServiceConstants from './ServiceConstants';
import { requestHandler } from './RequestHandler';

export const datasetService = {
    getDatasets,getDataset,
};

function getDatasets(solutionId){
    return requestHandler.fetchPagination(`${ServiceConstants.HOST_SOLUTION}/api/solutions/${solutionId}/datasets`)
}
function getDataset(datasetId,solutionId){
    return requestHandler.fetchPagination(`${ServiceConstants.HOST_SOLUTION}/api/solutions/${solutionId}/datasets/${datasetId}`)
}