import ServiceConstants from './ServiceConstants';
import { requestSigninPassword } from "../utils/StudioUtils";
import { notify } from "../utils/Notifications";
import { userService } from './UserService';

const axios = require("axios").default;
const REQUEST_QUEUE = [];

export const requestHandler = {
    // GET,   GET Pagination,  POST,   PUT,    DELETE
    fetch, fetchPagination, submit, update, remove
};

function fetch(url, options) {
    if (ServiceConstants.USE_AXIOS) {
        return requestProvier().get(url, requestConfig(options)).then(handleResponse).catch(handleError);
    } else {
        const requestOptions = {
            method: 'GET',
            headers: requestHeaders(options)
        };
        return requestProvier().fetch(url, requestOptions).then(handleResponse).catch(handleError);
    }
}

function fetchPagination(url, limit, options) {
    let pageLimit = (limit && limit > 0) ? limit : 20;
    let pageIndex = 0;
    let pageTotal = 0;
    let content = [];
    const asyncErrors = [];
    const paramDelimiter = url.indexOf('?') < 0 ? '?' : '&'
    if (ServiceConstants.USE_AXIOS) {
        return requestProvier().get(`${url}${paramDelimiter}page=${pageIndex}&size=${pageLimit}`, requestConfig(options)).then(handleResponse)
            .then(response => {
                if (response.content) {
                    content = content.concat(response.content);
                }
                pageTotal = response.totalPages || 0;
                var promiseArray = [];
                for (pageIndex++; pageIndex < pageTotal; pageIndex++) {
                    const asyncRequest = requestProvier().get(`${url}${paramDelimiter}page=${pageIndex}&size=${pageLimit}`, requestConfig(options))
                        .then(handleResponse)
                        .catch(error => {
                            asyncErrors.push(error);
                            handleError(error);
                        });
                    promiseArray.push(asyncRequest);
                }
                return Promise.all(promiseArray);
            }).then(response => {
                if (asyncErrors.length > 0) {
                    return Promise.reject(asyncErrors[0]);
                } else {
                    response.forEach(function (arrayItem) {
                        if (arrayItem && arrayItem.content) {
                            content = content.concat(arrayItem.content);
                        }
                    })
                    return content;
                }
            }).catch(handleError);
    } else {
        const requestOptions = {
            method: 'GET',
            headers: requestHeaders(options)
        };
        return requestProvier().fetch(`${url}${paramDelimiter}page=${pageIndex}&size=${pageLimit}`, requestOptions).then(handleResponse)
            .then(response => {
                if (response.content) {
                    content = content.concat(response.content);
                }
                pageTotal = response.totalPages || 0;
                var promiseArray = []
                for (pageIndex++; pageIndex < pageTotal; pageIndex++) {
                    const asyncRequest = requestProvier().fetch(`${url}${paramDelimiter}page=${pageIndex}&size=${pageLimit}`, requestOptions)
                        .then(handleResponse)
                        .catch(error => {
                            asyncErrors.push(error);
                            handleError(error);
                        });
                    promiseArray.push(asyncRequest);
                }
                return Promise.all(promiseArray);
            }).then(response => {
                if (asyncErrors.length > 0) {
                    return Promise.reject(asyncErrors[0]);
                } else {
                    response.forEach(function (arrayItem) {
                        if (arrayItem && arrayItem.content) {
                            content = content.concat(arrayItem.content);
                        }
                    })
                    return content;
                }
            }).catch(handleError);
    }
}

function submit(url, payload, options) {
    if (ServiceConstants.USE_AXIOS) {
        if (options && options.contentType === 'multipart/form-data') {
            var multipartData = new FormData();
            Object.keys(payload).forEach(function (payloadKey) {
                multipartData.append(payloadKey, payload[payloadKey])
            });
            return requestProvier().post(url, multipartData, requestConfig(options)).then(handleResponse).catch(handleError);
        } else {
            return requestProvier().post(url, JSON.stringify(payload), requestConfig(options)).then(handleResponse).catch(handleError);
        }
    } else {
        const requestOptions = {
            method: 'POST',
            headers: requestHeaders(options),
            body: JSON.stringify(payload)
        };
        return requestProvier().fetch(url, requestOptions).then(handleResponse).catch(handleError);
    }
}

function update(url, payload, options) {
    // TODO: Remove condition when payload is sent instead of String content
    if (ServiceConstants.USE_AXIOS) {
        if (options && options.contentType === 'multipart/form-data') {
            var multipartData = new FormData();
            Object.keys(payload).forEach(function (payloadKey) {
                multipartData.append(payloadKey, payload[payloadKey])
            });
            return requestProvier().put(url, multipartData, requestConfig(options)).then(handleResponse).catch(handleError);
        } else {
            return requestProvier().put(url, url.endsWith('/publish') ? payload : JSON.stringify(payload), requestConfig(options)).then(handleResponse).catch(handleError);
        }
    } else {
        const requestOptions = {
            method: 'PUT',
            headers: requestHeaders(options),
            body: url.endsWith('/publish') ? payload : JSON.stringify(payload)
        };
        return requestProvier().fetch(url, requestOptions).then(handleResponse).catch(handleError);
    }
}

function remove(url, options) {
    if (ServiceConstants.USE_AXIOS) {
        return requestProvier().delete(url, requestConfig(options)).then(handleResponse).catch(handleError);
    } else {
        const requestOptions = {
            method: 'DELETE',
            headers: requestHeaders(options)
        };
        return requestProvier().fetch(url, requestOptions).then(handleResponse).catch(handleError);
    }
}

function requestProvier() {
    document.body.style.cursor = 'progress'
    REQUEST_QUEUE.unshift('x')

    if (ServiceConstants.USE_AXIOS) {
        return axios;
    } else {
        return window;
    }
}

function requestConfig(options) {
    const requestConfig = {
        headers: requestHeaders(options)
    }

    // `timeout` specifies the number of milliseconds before the request times out.
    // If the request takes longer than `timeout`, the request will be aborted.
    // default is `0` (no timeout)
    requestConfig.timeout = 60 * 1000;

    // `validateStatus` defines whether to resolve or reject the promise for a given HTTP response status code.
    // If `validateStatus` returns `true` (or is set to `null` or `undefined`), the promise will be resolved;
    // otherwise, the promise will be rejected.
    // requestConfig.validateStatus = function (status) {
    //     return (status >= 200 && status < 300) || status === 401;
    // }
    requestConfig.validateStatus = null;

    return requestConfig;
}

function requestHeaders(options) {
    const requestHeader = {
        'Content-Type': 'application/json'
    };

    let authToken = userService.getAuthorizationToken(options);
    if (authToken && !(options && options.authType === 'NONE')) {
        requestHeader['Authorization'] = authToken;
    }
    return requestHeader;
}

function handleResponse(response) {
    // console.log('handleResponse:', response);
    REQUEST_QUEUE.pop();
    if (REQUEST_QUEUE.length === 0) {
        document.body.style.cursor = ''
    }

    if (response.status === 401) {
        if (userService.isAuthenticated()) {
            if (response.request.responseURL.includes('/engine-rest/')) {
                return Promise.reject(new Error("Failed Authentication with ProcessEngine.  Invalid Username / Password"));
            } else {
                notify("Unauthorized / Session Expired", "Reauthenticate to continue");
                return requestSigninPassword('Enter password for ' + userService.getLoginName()).then(function (userInput) {
                    return userService.login(userService.getLoginName(), userInput.value);
                }).then(function (loginResponse) {
                    return Promise.reject(new Error("Session Expired.  Retry previous action"));
                }).catch(error => {
                    return Promise.reject(new Error("Session Expired.  Retry previous action"));
                });
            }
        } else {
            return Promise.reject(new Error("Invalid Username / Password"));
        }
    } else if (response.status >= 400 && response.status <= 599) {
        return Promise.reject(new Error((response.data && response.data.message) || response.statusText || ("Error " + response.status + " received from server")));
    } else if ("" === response.data) {
        return "";
    } else {
        return response.data ? response.data : response.text().then(text => {
            return text && JSON.parse(text);
        });
    }
}

function handleError(error) {
    // console.log('handleError:', error);
    REQUEST_QUEUE.pop();
    if (REQUEST_QUEUE.length === 0) {
        document.body.style.cursor = ''
    }
    return Promise.reject(error)
}
