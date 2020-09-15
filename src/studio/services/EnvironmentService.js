import ServiceConstants from './ServiceConstants';
import { requestHandler } from './RequestHandler';

export const environmentService = {
    getEnvironments, getEnvironment, createEnvironment, deleteEnvironment,
    getRegions, getInstanceTypes, getVolumeTypes, getVpcSubnets
}

const environmentFormURL = "http://cloud-deployer-api.enterprise.digitaldots.ai/api/providers";

// -----------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------

function getEnvironments() {
    return requestHandler.fetchPagination(`${ServiceConstants.HOST_FOUNDATION}/api/environments`);
}

function createEnvironment(environment) {
    return requestHandler.submit(`${ServiceConstants.HOST_FOUNDATION}/api/environments`, environment);
}

function getEnvironment(environmentId) {
    return requestHandler.fetch(`${ServiceConstants.HOST_FOUNDATION}/api/environments/${environmentId}`);
}

function deleteEnvironment(environmentId) {
    return requestHandler.remove(`${ServiceConstants.HOST_FOUNDATION}/api/environments/${environmentId}`);
}

// -----------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------

function getRegions(cloudProvider) {
    return requestHandler.fetch(`${environmentFormURL}/${cloudProvider}/regions`)
}

function getInstanceTypes(cloudProvider, region) {
    return requestHandler.fetch(`${environmentFormURL}/${cloudProvider}/instance-types?region=${region}`)
}

function getVolumeTypes(cloudProvider) {
    return requestHandler.fetch(`${environmentFormURL}/${cloudProvider}/storage-types`)
}

function getVpcSubnets(cloudProvider, region) {
    return requestHandler.fetch(`${environmentFormURL}/${cloudProvider}/vpcs?region=${region}`)
}