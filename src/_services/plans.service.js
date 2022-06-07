import { authHeader } from '@/_helpers';

export const plansService = {
    getAll,
};

const apiUrl = process.env.VUE_APP_ROOT_API;

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };

    return fetch(`${apiUrl}/plans/`, requestOptions).then(handleResponse);
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
