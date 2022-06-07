import { authHeader } from '@/_helpers';

export const businessesService = {
    getAll,
    getById,
    getByBusinessContactEmail,
    getAvailableCampaigns,
    update,
    updateBusinessContacts,
    doNotContactBusiness,
    deleteBusiness,
    positiveBusiness,
    negativeBusiness
};

const apiUrl = process.env.VUE_APP_ROOT_API;

function getAll(currentPage, cantPerPage, searchFilter, statusFilter, categoryFilter) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/business/filtered-list?currentPage=${currentPage}&cantPerPage=${cantPerPage}&searchFilter=${searchFilter}&statusFilter=${statusFilter}&categoryFilter=${categoryFilter}`, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json'),
    };

    return fetch(`${apiUrl}/business/${id}`, requestOptions).then(handleResponse);
}

function getByBusinessContactEmail(email) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json'),
    };

    return fetch(`${apiUrl}/business/business-contact/email/${email}`, requestOptions).then(handleResponse);
}

function getAvailableCampaigns(businessId) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json'),
    };

    return fetch(`${apiUrl}/business/${businessId}/available-campaigns`, requestOptions).then(handleResponse);
}

function update(business) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify(business)
    };

    return fetch(`${apiUrl}/business/`, requestOptions).then(handleResponse);
}

function updateBusinessContacts(businessId, editedBusinessContacts, newBusinessContacts, deletedBusinessContacts) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({ 
            edited_business_contacts: editedBusinessContacts, 
            new_business_contacts: newBusinessContacts, 
            deleted_business_contacts: deletedBusinessContacts, 
        })
    };

    return fetch(`${apiUrl}/business/${businessId}/update-business-contacts`, requestOptions).then(handleResponse);
}

function doNotContactBusiness(businessId) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
    };
    return fetch(`${apiUrl}/business/${businessId}/do-not-contact`, requestOptions).then(handleResponse);
}

function positiveBusiness(businessId) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
    };
    return fetch(`${apiUrl}/business/${businessId}/positive`, requestOptions).then(handleResponse);
}


function negativeBusiness(businessId) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
    };
    return fetch(`${apiUrl}/business/${businessId}/negative`, requestOptions).then(handleResponse);
}

function deleteBusiness(businessId) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
    };

    return fetch(`${apiUrl}/business/${businessId}/delete`, requestOptions).then(handleResponse);
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