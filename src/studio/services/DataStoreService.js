import ServiceConstants from './ServiceConstants';
import { requestHandler } from './RequestHandler';

export const dataStoreService = {
    getTemplates, getDataStores, getDataStore, createDataStore, updateDataStore, verifyDataStore, deleteDataStore
};

function getTemplates() {
    return requestHandler.fetch(`${ServiceConstants.HOST_STORE}/api/templates?category=DataStore`)
}

function getDataStores(solutionId) {
    return requestHandler.fetchPagination(`${ServiceConstants.HOST_STORE}/api/solution/${solutionId}/datastores`)
}

function getDataStore(solutionId, storeId) {
    return requestHandler.fetch(`${ServiceConstants.HOST_STORE}/api/solution/${solutionId}/datastores/${storeId}`)
}

function createDataStore(solutionId, dataStore) {
    return requestHandler.submit(`${ServiceConstants.HOST_STORE}/api/solution/${solutionId}/datastores`, dataStore)
}

function updateDataStore(solutionId, dataStore) {
    return requestHandler.update(`${ServiceConstants.HOST_STORE}/api/solution/${solutionId}/datastores/${dataStore.id}`, dataStore)
}

function verifyDataStore(solutionId, storeId) {
    return requestHandler.update(`${ServiceConstants.HOST_STORE}/api/solution/${solutionId}/datastores/${storeId}/verify`)
}

function deleteDataStore(solutionId, storeId) {
    return requestHandler.remove(`${ServiceConstants.HOST_STORE}/api/solution/${solutionId}/datastores/${storeId}`)
}
