import { authHeader } from '@/_helpers';

export const linkStatusReasonsService = {
    getQualifiedStatusReasons,
    getLateQualifiedStatusReasons,
    getBusyStatusReasons,
    getDisqualifiedStatusReasons,
    getConvertedStatusReasons,
    getLostStatusReasons
};

const apiUrl = process.env.VUE_APP_ROOT_API;

function getQualifiedStatusReasons() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };

    return fetch(`${apiUrl}/link-status-reasons/positive`, requestOptions).then(handleResponse);
}

function getLateQualifiedStatusReasons() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };

    return fetch(`${apiUrl}/link-status-reasons/late-qualified`, requestOptions).then(handleResponse);
}

function getBusyStatusReasons() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };

    return fetch(`${apiUrl}/link-status-reasons/busy`, requestOptions).then(handleResponse);
}

function getDisqualifiedStatusReasons() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };

    return fetch(`${apiUrl}/link-status-reasons/negative`, requestOptions).then(handleResponse);
}

function getConvertedStatusReasons() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };

    return fetch(`${apiUrl}/link-status-reasons/converted`, requestOptions).then(handleResponse);
}

function getLostStatusReasons() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };

    return fetch(`${apiUrl}/link-status-reasons/lost`, requestOptions).then(handleResponse);
}
function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            const error = data || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}
