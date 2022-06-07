import { authHeader } from '@/_helpers';

export const campaignsService = {
    getAll,
    getAllByFilter,
    getStatusOptions,
    getAvailableStatus,
    getAllByClientId,
    getFilterByLink,
    getById,
    getParameterTypes,
    getParameterTypesOptions,
    update,
    changeStatus,
    getSteps,
    getStats,
    getStatsRange,
    getAgencyStatsRange,
    getStatsGroupRange,
    updateStep,
    getModelEdit,
    calculateTotal,
    getAvailableTokens,
    scheduleStatusChange,
    getEmailCampaignById,
    verifyScript,
    getActiveCampaigns,
    getInfoCampaigns,
    getStatisticsByFilter,
    getStatistics,
    getLastMonthActiveCampaigns,
    stopCampaign,
    getContactInfo,
    getConsultors
};

const apiUrl = process.env.VUE_APP_ROOT_API;

function getAll(currentPage, cantPerPage, searchFilter, statusFilter, siteFilter, budgetFilter, ownerFilter) {
    // ownerFilter = ownerFilter.replace(' ', '_')
    
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };

    return fetch(`${apiUrl}/campaigns/filtered-list?currentPage=${currentPage}&cantPerPage=${cantPerPage}&searchFilter=${searchFilter}&statusFilter=${statusFilter}&siteFilter=${siteFilter}&budgetFilter=${budgetFilter}&ownerFilter=${ownerFilter}`, requestOptions).then(handleResponse);
}


function getAllByFilter(currentPage, cantPerPage, searchFilter) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({currentPage, cantPerPage, searchFilter})
    };
    return fetch(`${apiUrl}/campaigns/filtered-list`, requestOptions).then(handleResponse);
}

function getContactInfo(id) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({id})
    };
    return fetch(`${apiUrl}/campaigns/contacts-info`, requestOptions).then(handleResponse);
}

function getStatusOptions() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };

    return fetch(`${apiUrl}/campaigns/campaing-status`, requestOptions).then(handleResponse);
}

function getAvailableStatus(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };

    return fetch(`${apiUrl}/campaigns/${id}/available-status`, requestOptions).then(handleResponse);
}

function getModelEdit(id){
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/campaigns/${id}/getedit`, requestOptions)
    .then(handleResponse)
    .catch(reason => {console.error("Error: " + reason.message);});
    
}

function getAllByClientId() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };

    return fetch(`${apiUrl}/campaigns/`, requestOptions).then(handleResponse);
}

function getFilterByLink() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };

    return fetch(`${apiUrl}/campaigns/filter-by-link`, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/campaigns/${id}`, requestOptions).then(handleResponse);
}

function getEmailCampaignById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/campaigns/${id}/email`, requestOptions).then(handleResponse);
}

function getParameterTypes() {
  const requestOptions = {
      method: 'GET',
      headers: authHeader('application/json')
  };
  return fetch(`${apiUrl}/campaigns/parameter/types`, requestOptions).then(handleResponse);
}

function getParameterTypesOptions(type_id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/campaigns/parameter/types/${type_id}/options`, requestOptions).then(handleResponse);
}

function update(campaign) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify(campaign)
    };

    return fetch(`${apiUrl}/campaigns/`, requestOptions).then(handleResponse);
}

function calculateTotal(model) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify(model)
    };
    return fetch(`${apiUrl}/campaigns/calculatetotal`, requestOptions).then(handleResponse);
}

function verifyScript(url) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({url})
    };
    return fetch(`${apiUrl}/campaigns/verifyscript`, requestOptions).then(handleResponse);
}

function stopCampaign(id, status_id, answerwhy) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({status_id,answerwhy})
    };

    return fetch(`${apiUrl}/campaigns/${id}/change-status`, requestOptions).then(handleResponse);
}

function changeStatus(id, status_id) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({status_id})
    };

    return fetch(`${apiUrl}/campaigns/${id}/change-status`, requestOptions).then(handleResponse);
}

function getSteps(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/campaigns/${id}/steps`, requestOptions).then(handleResponse);
}

function getStats(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/campaigns/${id}/stats`, requestOptions).then(handleResponse);
}

// filter by date range
function getStatsRange(id,startDate, endDate, clientId, filters) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({id,startDate, endDate, clientId, filters})
    };

    return fetch(`${apiUrl}/campaigns/${id}/stats`, requestOptions).then(handleResponse);
}

// filter by date range
function getAgencyStatsRange(startDate, endDate, clientId) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };

    return fetch(`${apiUrl}/campaigns/0/agency-stats?startDate=${startDate}&endDate=${endDate}&clientId=${clientId}`, requestOptions).then(handleResponse);
}

function getStatsGroupRange(id,startDate, endDate) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };

    return fetch(`${apiUrl}/campaigns/${id}/stats-group-filter?startDate=${startDate}&endDate=${endDate}`, requestOptions).then(handleResponse);
}

function updateStep(step) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify(step)
    };

    return fetch(`${apiUrl}/campaigns/steps`, requestOptions).then(handleResponse);
}

function getAvailableTokens(){
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json'),
    };
    return fetch(`${apiUrl}/campaigns/steps/tokens/availables`, requestOptions).then(handleResponse);
}

function scheduleStatusChange(id, status_id, schedule_date) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({status_id, schedule_date})
    };

    return fetch(`${apiUrl}/campaigns/scheduleStatusChange/${id}`, requestOptions).then(handleResponse);
}


function getActiveCampaigns() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/campaigns/active`, requestOptions).then(handleResponse);
}

function getInfoCampaigns() {    
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/campaigns/get-info-campaigns`, requestOptions).then(handleResponse);
}

function getLastMonthActiveCampaigns() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/campaigns/last-month-active`, requestOptions).then(handleResponse);
}


function getStatistics(id,datefrom,dateto){
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({ id:id, datefrom:datefrom, dateto:dateto })
    };

    return fetch(`${apiUrl}/campaigns/statistics`, requestOptions)
    .then(handleResponse)
    .catch(reason => {console.error("Error: " + reason.message);});   
}

function getStatisticsByFilter(id,filter,datefrom,dateto){
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({ id:id, filter:filter, datefrom:datefrom, dateto:dateto })
    };
    return fetch(`${apiUrl}/campaigns/statistics-filter`, requestOptions)
    .then(handleResponse)
    .catch(reason => {console.error("Error: " + reason.message);});
}



function getConsultors(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/campaigns/${id}/consultors`, requestOptions).then(handleResponse);
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
