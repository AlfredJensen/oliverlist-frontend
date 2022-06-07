import { authHeader } from '@/_helpers';
export const smtpMailboxesService = {
    getByUser,
    getConfig,
    connectData,
    hasOurServer,
    deactivate,
};

const apiUrl = process.env.VUE_APP_ROOT_API;

function getByUser() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/smtp-mailboxes/user`, requestOptions).then(handleResponse);
}
function getConfig() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/smtp-mailboxes/my-config`, requestOptions).then(handleResponse);
}
function hasOurServer() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/smtp-mailboxes/has-our-server`, requestOptions).then(handleResponse);
}
function deactivate() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/smtp-mailboxes/deactivate`, requestOptions).then(handleResponse);
}
function connectData(info) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify(info)
    };

    return fetch(`${apiUrl}/smtp-mailboxes/my-config`, requestOptions).then(handleResponse);
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