import { authHeader } from '@/_helpers';

export const websitesService = {
    getAll,
    updateSelected,
    deleteSelected
};

const apiUrl = process.env.VUE_APP_ROOT_API;

function getAll(currentPage, cantPerPage) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };

    return fetch(`${apiUrl}/websites/filtered-list?currentPage=${currentPage}&cantPerPage=${cantPerPage}`, requestOptions)
        .then(handleResponse)
        .then(websites => initializeAnalyzingProperty(websites));
}

function updateSelected(websites) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({ websites })
    };

    return fetch(`${apiUrl}/websites/update-selected`, requestOptions).then(handleResponse);
}

function deleteSelected(websites) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({ websites })
    };

    return fetch(`${apiUrl}/websites/delete-selected`, requestOptions).then(handleResponse);
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

function initializeAnalyzingProperty(websites) {
    websites.list.forEach(website => {
        website.analyzing = false;
    });

    return websites;
}