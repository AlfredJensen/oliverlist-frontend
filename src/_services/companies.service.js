import { authHeader } from '@/_helpers';

export const companiesService = {
    getAll,
    getAllByFilter,
    getAllFilters,
    getDataToCsv,
};

const apiUrl = process.env.VUE_APP_ROOT_API;

function getAll(currentPage, cantPerPage, searchFilter, companyFilter, domainFilter, cityFilter) {
    // ownerFilter = ownerFilter.replace(' ', '_')
    
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };

    return fetch(`${apiUrl}/business/filtered-list?currentPage=${currentPage}&cantPerPage=${cantPerPage}&searchFilter=${searchFilter}&companyFilter=${companyFilter}&domainFilter=${domainFilter}&cityFilter=${cityFilter}`, requestOptions).then(handleResponse);
}

function getAllByFilter(currentPage, cantPerPage, searchFilter) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({currentPage, cantPerPage, searchFilter})
    };
    return fetch(`${apiUrl}/business/filtered-list`, requestOptions).then(handleResponse);
}


function getAllFilters(){
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };

    return fetch(`${apiUrl}/business/company-filters`, requestOptions).then(handleResponse);
}

function getDataToCsv() {

    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json'),
    };
    return fetch(`${apiUrl}/business/filtered-list?currentPage=1&cantPerPage=9999&searchFilter=&companyFilter=&domainFilter=&cityFilter=`, requestOptions).then(handleResponse);
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
