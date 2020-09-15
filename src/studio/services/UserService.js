import jwtDecode from 'jwt-decode';

import ServiceConstants from './ServiceConstants';
import { requestHandler } from './RequestHandler';

import routes from '../../routes';

export const USER_ACTIONS = {
    VIEW: 'view',
    CREATE: 'create',
    EDIT: 'edit',
    DELETE: 'delete',
    EXPORT: 'export',
    MANAGE: 'manage',
    PUBLISH: 'publish',
    EXECUTE: 'execute',
    EXPLORE_SOLUTION_DASHBOARD: 'L2-Solutions-Dashboard',
    EXPLORE_SOLUTION_TASKS: 'L2-Solutions-UserTask',
    EXPLORE_SOLUTION_WORKFLOWS: 'L2-Solutions-Workflows',
    EXPLORE_SOLUTION_RULES: 'L2-Solutions-Rules',
    EXPLORE_WORKFLOW_VIEWER: 'L2-Solutions-Workflows-Viewer',
    EXPLORE_WORKFLOW_MODELER: 'L2-Solutions-Workflows-Modeler',
    EXPLORE_RULE_VIEWER: 'L2-Solutions-Rules-Viewer',
    EXPLORE_RULE_MODELER: 'L2-Solutions-Rules-Modeler',
    EXPLORE_FORM_VIEWER: 'L2-Solutions-Forms-Viewer',
    EXPLORE_FORM_MODELER: 'L2-Solutions-Forms-Modeler',
}

export const userService = {
    login, signup, registerUser, forgotPassword, changePassword, resetPassword,
    getUsers, createUser, getUser, getUserHistory, updateUser, verifyUser, activateUser, deactivateUser, deleteUser,
    getProfile, updateProfile, getAvatar, updateAvatar, getAvatarById,
    logout, forgetMe, getRememberedUser, isAuthenticated, getAuthorizationToken, generateUUID,
    getUserId, getLoginName, getDisplayName, getAccessRoutes, hasPermission
};

function login(username, password, remember) {
    return requestHandler.submit(`${ServiceConstants.HOST_AUTHENTICATION}/api/auth/login`,
        { username, password }, { authType: 'NONE' }).then(user => {
            _saveUser(user, username, password, remember);
            return user;
        });
}

function signup(username, password, firstName, lastName) {
    return requestHandler.submit(`${ServiceConstants.HOST_AUTHENTICATION}/api/users/register`,
        { username, password, firstName, lastName }, { authType: 'NONE' });
}

function registerUser(user) {
    return requestHandler.submit(`${ServiceConstants.HOST_AUTHENTICATION}/api/users/register`, user, { authType: 'NONE' });
}

function forgotPassword(username) {
    return requestHandler.update(`${ServiceConstants.HOST_AUTHENTICATION}/api/forgotpassword?email=${username}`, {}, { authType: 'NONE' });
}

function changePassword(password) {
    return requestHandler.update(`${ServiceConstants.HOST_AUTHENTICATION}/api/changepassword`, password);
}

function resetPassword(username) {
    return requestHandler.update(`${ServiceConstants.HOST_AUTHENTICATION}/api/resetpassword?email=${username}`, {});
}

function getUsers() {
    // return requestHandler.fetch(`${ServiceConstants.HOST_AUTHENTICATION}/api/users?pageIndex=0&size=500`);
    return requestHandler.fetchPagination(`${ServiceConstants.HOST_AUTHENTICATION}/api/users`, 50);
}

function createUser(user) {
    return requestHandler.submit(`${ServiceConstants.HOST_AUTHENTICATION}/api/users`, user);
}

function getUser(userId) {
    return requestHandler.fetch(`${ServiceConstants.HOST_AUTHENTICATION}/api/users/${userId}`);
}

function getUserHistory(userId) {
    return requestHandler.fetch(`${ServiceConstants.HOST_AUTHENTICATION}/api/audit/users/${userId}`);
}

function updateUser(user) {
    return requestHandler.update(`${ServiceConstants.HOST_AUTHENTICATION}/api/users/${user.id}`, user);
}

function verifyUser(userId) {
    return requestHandler.update(`${ServiceConstants.HOST_AUTHENTICATION}/api/users/${userId}/verify`, {});
}

function activateUser(userId) {
    return requestHandler.update(`${ServiceConstants.HOST_AUTHENTICATION}/api/users/${userId}/activate`, {});
}

function deactivateUser(userId) {
    return requestHandler.update(`${ServiceConstants.HOST_AUTHENTICATION}/api/users/${userId}/deactivate`, {});
}

function deleteUser(userId) {
    return requestHandler.remove(`${ServiceConstants.HOST_AUTHENTICATION}/api/users/${userId}`);
}

function getProfile() {
    return requestHandler.fetch(`${ServiceConstants.HOST_AUTHENTICATION}/api/users/profile`);
}

function updateProfile(profile) {
    return requestHandler.update(`${ServiceConstants.HOST_AUTHENTICATION}/api/users/profile`, profile);
}

function getAvatar(userId) {
    // return requestHandler.fetch(`${ServiceConstants.HOST_AUTHENTICATION}/api/users/${userId}/avatar`);
    return `${ServiceConstants.HOST_AUTHENTICATION}/api/users/${userId}/avatar`;
}

function updateAvatar(userId, title, avatar) {
    const payload = { title: title, image: avatar };
    return requestHandler.update(`${ServiceConstants.HOST_AUTHENTICATION}/api/users/${userId}/avatar`, payload,
        { contentType: 'multipart/form-data' });
}

function getAvatarById(avatarId) {
    return `${ServiceConstants.HOST_AUTHENTICATION}/api/avatar/${avatarId}`;
}

function logout() {
    _removeUser();
}

function forgetMe() {
    localStorage.removeItem('studioRemember');
}

function _getUserStore() {
    // return localStorage;
    return sessionStorage;
}

function _saveUser(user, username, password, remember) {
    if (user && user.token) {
        const decodedToken = jwtDecode(user.token);
        user.id = user.id || decodedToken.id;
        user.username = decodedToken.sub;
        user.firstName = decodedToken.firstName || '';
        user.lastName = decodedToken.lastName || '';
        user.forcePasswordChange = decodedToken.firstTimeLogin || false;
        user.tokenExpirationTime = decodedToken.exp;
        user.tokenIssuedAt = decodedToken.iat;
        user.roles = user.roles || decodedToken.roles || [];

        if (user.roles.length === 0) {
            user.roles.push({
                authority: "Pending Access", permissions: [
                    { resource: 'L1-SignOut' }
                ]
            });
        }

        user.roles.push({
            authority: "Self Service", permissions: [
                { resource: 'L1-Users-Profile' },
                { resource: 'L1-Users-Settings' },
                { resource: 'L1-Users-Password' },
            ]
        });

        const accessPermission = {};
        user.roles.forEach(function (role) {
            if (!role.permissions || role.permissions.length === 0) {
                role.permissions = [
                    { resource: 'L1-SignOut' }
                ]
            }

            role.permissions.forEach(function (permission) {
                if (!accessPermission[permission.resource]) {
                    accessPermission[permission.resource] = {}
                }
                if (permission.action && permission.allowed) {
                    accessPermission[permission.resource][permission.action] = permission.allowed;
                }
            });
        });
        user.accessPermission = accessPermission;

        user.authProcessEngine = window.btoa(username.split('@')[0] + ':' + password);
        user.authBasic = window.btoa(username + ':' + password);

        _getUserStore().setItem('studioUser', JSON.stringify(user));

        if (!!remember) {
            _rememberMe(user.authBasic);
        } else {
            forgetMe();
        }
    }
}

function _getUser() {
    return JSON.parse(_getUserStore().getItem('studioUser'));
}

function _removeUser() {
    _getUserStore().removeItem('studioUser');
}

function _rememberMe(authInfo) {
    localStorage.setItem('studioRemember', authInfo);
}

function getRememberedUser() {
    let studioRemember = localStorage.getItem('studioRemember');
    let username = undefined;
    let password = undefined;
    if (studioRemember) {
        let rememberInfo = window.atob(studioRemember).split(':');
        username = rememberInfo[0];
        password = rememberInfo[1];
    }
    return { username: username, password: password };
}

function isAuthenticated() {
    let user = _getUser();
    if (user === null) {
        return false;
    } else {
        return true;
    }
}

function getAuthorizationToken(options) {
    let authToken;
    let user = _getUser();
    if (options && options.authType === 'ProcessEngine' && user && user.authProcessEngine) {
        authToken = 'Basic ' + user.authProcessEngine;
    } else if (options && options.authType === 'Basic' && user && user.authBasic) {
        authToken = 'Basic ' + user.authBasic;
    } else if (user && user.token) {
        authToken = 'Bearer ' + user.token;
    }
    return authToken;
}

function generateUUID() {
    let textA = getLoginName().split('@')[0];
    let textB = Date.now().toString();
    let mergeA;
    let mergeB;
    if (textA.length > textB.length) {
        mergeA = textB;
        mergeB = textA;
    } else {
        mergeA = textA;
        mergeB = textB;
    }
    return Array.from(mergeA.length > mergeB.length ? mergeA : mergeB, (_, i) => (mergeA[i] || "") + (mergeB[i] || "")).join('');
}

function getUserId() {
    const user = _getUser();
    return user.id;
}

function getLoginName() {
    const user = _getUser();
    return user.username;
}

function getDisplayName() {
    const user = _getUser();
    return (user.firstName || user.lastName) ? ((user.firstName || '') + ' ' + (user.lastName || '')).trim() : user.username.split('@')[0];
}

function getAccessRoutes() {
    const user = _getUser();
    let accessKeys = Object.keys(user.accessPermission);
    return routes.filter(route => accessKeys.indexOf(route.id) >= 0);
}

function hasPermission(studioRouter, actionType) {
    const user = _getUser();
    let accessInfo = {};
    if (actionType && actionType.startsWith('L')) {
        return user.accessPermission[actionType] !== undefined;
    } else {
        accessInfo = user.accessPermission[studioRouter.id] || {};
    }
    return accessInfo[actionType] || false;
}
