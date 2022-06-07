import { authHeader } from '@/_helpers';

export const linksService = {
    createComment,
    createEvent
};

const apiUrl = process.env.VUE_APP_ROOT_API;

function createComment(linkId, comment) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({ comment })
    };
    return fetch(`${apiUrl}/links/${linkId}/comments`, requestOptions).then(handleResponse);
}

function createEvent(linkId, eventId, remark, eventDate) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({ eventId, remark, eventDate })
    };
    return fetch(`${apiUrl}/links/${linkId}/events`, requestOptions).then(handleResponse);
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