import ServiceConstants from './ServiceConstants';
import { requestHandler } from './RequestHandler';

export const roleService = {
    getResources, getRoles, createRole, getRole, getRoleHistory, updateRole, activateRole, deactivateRole, deleteRole
};

function getResources() {
    return requestHandler.fetch(`${ServiceConstants.HOST_AUTHORIZATION}/api/resources`);
}

function getRoles() {
    return requestHandler.fetchPagination(`${ServiceConstants.HOST_AUTHORIZATION}/api/roles`, 25);
}

function createRole(role) {
    return requestHandler.submit(`${ServiceConstants.HOST_AUTHORIZATION}/api/roles`, role);
}

function getRole(roleId) {
    return requestHandler.fetch(`${ServiceConstants.HOST_AUTHORIZATION}/api/roles/${roleId}`);
}

function getRoleHistory(roleId) {
    return requestHandler.fetch(`${ServiceConstants.HOST_AUTHORIZATION}/api/audit/roles/${roleId}`);
}

function updateRole(role) {
    return requestHandler.update(`${ServiceConstants.HOST_AUTHORIZATION}/api/roles/${role.id}`, role);
}

function activateRole(roleId) {
    return requestHandler.update(`${ServiceConstants.HOST_AUTHORIZATION}/api/roles/${roleId}/activate`, {});
}

function deactivateRole(roleId) {
    return requestHandler.update(`${ServiceConstants.HOST_AUTHORIZATION}/api/roles/${roleId}/deactivate`, {});
}

function deleteRole(roleId) {
    return requestHandler.remove(`${ServiceConstants.HOST_AUTHORIZATION}/api/roles/${roleId}`);
}
