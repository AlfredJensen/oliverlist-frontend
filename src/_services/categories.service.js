import { authHeader } from '@/_helpers';

export const categoriesService = {
    getAll,
    getAllCategoriesByClient,
    getCategoriesSearch,
    searchCategories,
    getCategoriesSearchFunction,
    getCategoriesSearchLevel,
    getCategoriesGoogleParent,
    getAllGoogle
};

const apiUrl = process.env.VUE_APP_ROOT_API;

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };

    return fetch(`${apiUrl}/categories/`, requestOptions).then(handleResponse);
}


function getAllGoogle() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };

    return fetch(`${apiUrl}/categories/google-categories`, requestOptions).then(handleResponse);
}

function searchCategories(filter,selected) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/categories/filter-google-categories?filter=${filter}&selected=${selected}`, requestOptions).then(handleResponse);
}

function getAllCategoriesByClient() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/categories/google-categories/client`, requestOptions).then(handleResponse);
}

function getCategoriesSearch() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/categories/search`, requestOptions).then(handleResponse);
}

function getCategoriesSearchFunction() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/categories/search-function`, requestOptions).then(handleResponse);
}

function getCategoriesSearchLevel() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/categories/search-level`, requestOptions).then(handleResponse);
}

function getCategoriesGoogleParent() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/categories/google-categories/parent`, requestOptions).then(handleResponse);
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
