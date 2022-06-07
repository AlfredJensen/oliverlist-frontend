import { authHeader } from '@/_helpers';

export const regionsService = {
    getAll,
    getHierarchy,
    getCountries,
    getTimezones
};

const apiUrl = process.env.VUE_APP_ROOT_API;

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };

    return fetch(`${apiUrl}/regions/`, requestOptions).then(handleResponse);
}

function getHierarchy() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/regions/hierarchy`, requestOptions).then(handleResponse);
}


function getCountries() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/regions/countries`, requestOptions).then(handleResponse);
}

function getTimezones() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };

    return fetch(`${apiUrl}/regions/timezones`, requestOptions).then(handleResponse);
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
