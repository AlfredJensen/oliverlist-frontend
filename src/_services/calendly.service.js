import { authHeader } from '@/_helpers';
export const calendlyService = {
    getEvent
};

const apiUrl = process.env.VUE_APP_ROOT_API;


function getEvent(id) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({ id })
    };
    return fetch(`${apiUrl}/calendly/event`, requestOptions).then(handleResponse);
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