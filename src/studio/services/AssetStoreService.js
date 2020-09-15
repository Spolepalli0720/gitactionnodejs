import ServiceConstants from './ServiceConstants';
import { requestHandler } from './RequestHandler';

export const assetStoreService = {
    getTemplates, getTemplate
};

function getTemplates(category) {
    let requestParams = '';
    if (category) {
        requestParams = `?category=${category}`
    }
    return requestHandler.fetch(`${ServiceConstants.HOST_STORE}/api/templates${requestParams}`)
}

function getTemplate(templateId) {
    return requestHandler.fetch(`${ServiceConstants.HOST_STORE}/api/templates/${templateId}`)
}
