import { authHeader } from '@/_helpers';

export const businessContactsService = {
    getAll,
    getAllByFilter,
    getAll2,
    getById,
    getContactById,
    changeStatus,
    changeStatusByLinkId,
    changeStatusContactUnsubscribe,
    saveSelected,
    sendToCrm,
    setPhone,
    getAllFilters,
    getDataToCsv,
    getCredits,
    search,
    exportData,
    total,
    deleteChecked,
    insertCustomField,
    getCustomFields,
    importContact,
    getImportList,
    insertIntoCampaign,
    update,
    previewEmail,
    searchAutocomplete,
    deactivateSelected,
    deleteSelected,
    deleteImport,
    getEmail,
    getStatus,
    getOpportunities,
    searchEmail
};

const apiUrl = process.env.VUE_APP_ROOT_API;

var lastquery = new Array();

function getAll(currentPage, cantPerPage, searchFilter, emailFilter, companyFilter, cityFilter, jobFilter, roleFilter, contactFilter) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/business-contact/filtered-list?currentPage=${currentPage}&cantPerPage=${cantPerPage}&searchFilter=${searchFilter}&emailFilter=${emailFilter}&companyFilter=${companyFilter}&cityFilter=${cityFilter}&jobFilter=${jobFilter}&roleFilter=${roleFilter}&contactFilter=${contactFilter}`, requestOptions).then(handleResponse);
}

function searchAutocomplete(text){
  const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({text})
    };
    return fetch(`${apiUrl}/business-contact/search-autocomplete`, requestOptions).then(handleResponse);
   
}


function previewEmail(id){
  const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({id})
    };
    return fetch(`${apiUrl}/business-contact/preview-email`, requestOptions).then(handleResponse);
   
}

function getDefault(model){
    console.log(model)
   let searchFilter = Array()
    searchFilter = 
    {   
        'filterquery' :  (model.custom !== undefined && model.custom.filterquery !== undefined) ? JSON.stringify(model.custom.filterquery) : undefined,
        'currentPage' :  (model.currentPage !== undefined) ? JSON.stringify(model.currentPage) : undefined,
        'cantPerPage' :  (model.cantPerPage !== undefined) ? JSON.stringify(model.cantPerPage) : undefined,
        'total' :  (model.total !== undefined) ? JSON.stringify(model.total) : undefined,
        'business_id' :  (model.business_id !== undefined) ? JSON.stringify(model.business_id) : undefined,
        'business_all' :  (model.business_all !== undefined) ? JSON.stringify(model.business_all) : undefined,
        'contacts_all' :  (model.contacts_all !== undefined) ? JSON.stringify(model.contacts_all) : undefined,
        'business_contacts' :  (model.business_contacts !== undefined) ? JSON.stringify(model.business_contacts) : undefined,
        'industry' : { 'select' : (model.industry !== undefined) ? JSON.stringify(model.industry.hierarchy) : undefined },
        'googlewords' : {
            'anyof' : (model.industry !== undefined && model.industry.words !== undefined && model.industry.words.word !== undefined) ? JSON.stringify(model.industry.words.word.keywords.anyof) : undefined,
            'notanyof' : (model.industry !== undefined && model.industry.words !== undefined && model.industry.words.word !== undefined) ? JSON.stringify(model.industry.words.word.keywords.notanyof) : undefined
        },
        'industryall' : { 'select' : (model.industry !== undefined) ? JSON.stringify(model.industry.list) : undefined },
        'campaign' : {
            'select' : (model.campaignselected !== undefined) ? JSON.stringify(model.campaignselected.select) : undefined,
        },
        'maxpercompany' : (model.maxpercompany !== undefined) ? model.maxpercompany : undefined,
        'importlist' : { 'select' : JSON.stringify(model.importlist) },
        'linkedin' : { 'select' : JSON.stringify(model.linkedin) },
        'ondemand' : { 'select' : JSON.stringify(model.ondemand) },
        'imported' : (model.imported !== undefined && model.imported == true) ? true : undefined,
        'status' : {
            'engaged' : (model.status !== undefined && model.status.engaged !== undefined) ? JSON.stringify(model.status.engaged) : undefined,
            'notengaged' : (model.status !== undefined && model.status.notengaged !== undefined) ? JSON.stringify(model.status.notengaged) : undefined,
            'buy' : (model.status !== undefined && model.status.buy !== undefined) ? JSON.stringify(model.status.buy) : undefined,
            'notbuy' : (model.status !== undefined && model.status.notbuy !== undefined) ? JSON.stringify(model.status.notbuy) : undefined,
            'bounced' : (model.status !== undefined && model.status.bounced !== undefined) ? JSON.stringify(model.status.bounced) : undefined,
            'donotcontact' : (model.status !== undefined && model.status.donotcontact !== undefined) ? JSON.stringify(model.status.donotcontact) : undefined,
            'new' : (model.status !== undefined && model.status.newcontacts !== undefined) ? JSON.stringify(model.status.newcontacts) : undefined,
            'excluded' : (model.status !== undefined && model.status.excluded !== undefined) ? JSON.stringify(model.status.excluded) : undefined,
        },
        'job' : {
            'functions' : (model.job !== undefined) ? JSON.stringify(model.job.functions) : undefined,
            'level' : (model.job !== undefined) ? JSON.stringify(model.job.level) : undefined,
            'anyof' : (model.job !== undefined) ? JSON.stringify(model.job.keywords.anyof) : undefined,
            'notanyof' : (model.job !== undefined) ? JSON.stringify(model.job.keywords.notanyof) : undefined,
            'known' : (model.job !== undefined) ? JSON.stringify(model.job.keywords.known) : undefined,
            'unknown' : (model.job !== undefined) ? JSON.stringify(model.job.keywords.unknown) : undefined,
        },
        'location' : {
            'select' : (model.location !== undefined && model.location.regions !== undefined) ? JSON.stringify(model.location.regions.select) : undefined,
            'anyof' : (model.location !== undefined) ? JSON.stringify(model.location.keywords.anyof) : undefined,
            'notanyof' : (model.location !== undefined) ? JSON.stringify(model.location.keywords.notanyof) : undefined,
            'known' : (model.location !== undefined) ? JSON.stringify(model.location.keywords.known) : undefined,
            'unknown' : (model.location !== undefined) ? JSON.stringify(model.location.keywords.unknown) : undefined,
        },
        'word' : {
            'anyof' : (model.word !== undefined) ? JSON.stringify(model.word.keywords.anyof) : undefined,
        },
        'country' : {
            'select' : (model.location !== undefined && model.location.countries !== undefined) ? JSON.stringify(model.location.countries.select) : undefined,
        },
        'employees' : {
            'select' : (model.employees !== undefined) ? JSON.stringify(model.employees.select) : undefined,
            'greater' : (model.employees !== undefined) ? JSON.stringify(model.employees.keywords.greater) : undefined,
            'less' : (model.employees !== undefined) ? JSON.stringify(model.employees.keywords.less) : undefined,
        },
        'url' : {
            'anyof' : (model.url !== undefined) ? JSON.stringify(model.url.keywords.anyof) : undefined,
            'notanyof' : (model.url !== undefined) ? JSON.stringify(model.url.keywords.notanyof) : undefined,
            'known' : (model.url !== undefined) ? JSON.stringify(model.url.keywords.known) : undefined,
            'unknown' : (model.url !== undefined) ? JSON.stringify(model.url.keywords.unknown) : undefined,
        },
    }
    return searchFilter
}

function total(model) { 
    model.total = 1
    const controller = new AbortController();
    const signal = controller.signal;

    if(lastquery['total']){
        lastquery['total'].controller(lastquery['total'].querykey)
        lastquery['total'] = false
    }
   
    let searchFilter = getDefault(model)
    let querykey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({searchFilter,querykey}),
        signal: signal
    };

    const abort = function(querykey){
        controller.abort()
        let req = {
            method: 'POST',
            headers: authHeader('application/json'),
            body: JSON.stringify({querykey}),
        };
        fetch(`${apiUrl}/users/kill`, req).then(handleResponse);
    }



    const promise = fetch(`${apiUrl}/business-contact/search`, requestOptions).then(handleResponse).catch((err) => {
        lastquery['search'] = false
    });

    lastquery['total'] = {
        'controller' : abort, // notice binding context
        'querykey' : querykey
    }

    
    return promise
    
}

function search(model) {
     model.total = 0
    const controller = new AbortController();
    const signal = controller.signal;

    if(lastquery['search']){
        lastquery['search'].controller(lastquery['search'].querykey)
        lastquery['search'] = false
    }
   
    let searchFilter = getDefault(model)
    let querykey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({searchFilter,querykey}),
        signal: signal
    };

    const abort = function(querykey){
        controller.abort()
        let req = {
            method: 'POST',
            headers: authHeader('application/json'),
            body: JSON.stringify({querykey}),
        };
        fetch(`${apiUrl}/users/kill`, req).then(handleResponse);
    }



    const promise = fetch(`${apiUrl}/business-contact/search`, requestOptions).then(handleResponse).catch((err) => {
        lastquery['search'] = false
    });

    lastquery['search'] = {
        'controller' : abort, // notice binding context
        'querykey' : querykey
    }

    
    
    return promise
    
}


function exportData(model) { 
    model.total = 0
    let searchFilter = getDefault(model)
    searchFilter.selectedIds = (model.selectedIds !== undefined) ? JSON.stringify(model.selectedIds) : undefined
    searchFilter.selectAll = (model.selectAll !== undefined) ? JSON.stringify(model.selectAll) : undefined
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({searchFilter})
    };
    return fetch(`${apiUrl}/business-contact/exportData`, requestOptions).then(handleResponse);
}

function insertIntoCampaign(model) {
    model.total = 0
    let searchFilter = getDefault(model)
    searchFilter.selectAll = (model.selectAll !== undefined) ? JSON.stringify(model.selectAll) : undefined
    searchFilter.selectedIds = (model.selectedIds !== undefined) ? JSON.stringify(model.selectedIds) : undefined
    searchFilter.excludedIds = (model.excludedIds !== undefined) ? JSON.stringify(model.excludedIds) : undefined
    searchFilter.selectedCampaign = (model.selectedCampaign !== undefined) ? JSON.stringify(model.selectedCampaign) : undefined
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({searchFilter})
    };
    return fetch(`${apiUrl}/business-contact/insertintocampaign`, requestOptions).then(handleResponse);
}

function saveSelected(model){
    model.total = 0
    let searchFilter = getDefault(model)
    searchFilter.selectAll = (model.selectAll !== undefined) ? JSON.stringify(model.selectAll) : undefined
    searchFilter.selectedIds = (model.selectedIds !== undefined) ? JSON.stringify(model.selectedIds) : undefined
    searchFilter.excludedIds = (model.excludedIds !== undefined) ? JSON.stringify(model.excludedIds) : undefined
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({searchFilter})
    };
    return fetch(`${apiUrl}/business-contact/unlockcontacts`, requestOptions).then(handleResponse);
}

function sendToCrm(model){
    model.total = 0
    let searchFilter = getDefault(model)
    searchFilter.selectAll = (model.selectAll !== undefined) ? JSON.stringify(model.selectAll) : undefined
    searchFilter.selectedIds = (model.selectedIds !== undefined) ? JSON.stringify(model.selectedIds) : undefined
    searchFilter.excludedIds = (model.excludedIds !== undefined) ? JSON.stringify(model.excludedIds) : undefined
    searchFilter.crmUserId = (model.crmUserId !== undefined) ? model.crmUserId : undefined
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({searchFilter})
    };
    return fetch(`${apiUrl}/business-contact/sendtocrm`, requestOptions).then(handleResponse);
}


function deactivateSelected(model) {
    model.total = 0
    let searchFilter = getDefault(model)
    searchFilter.selectAll = (model.selectAll !== undefined) ? JSON.stringify(model.selectAll) : undefined
    searchFilter.selectedIds = (model.selectedIds !== undefined) ? JSON.stringify(model.selectedIds) : undefined
    searchFilter.excludedIds = (model.excludedIds !== undefined) ? JSON.stringify(model.excludedIds) : undefined
    searchFilter.selectedCampaign = (model.selectedCampaign !== undefined) ? JSON.stringify(model.selectedCampaign) : undefined
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({searchFilter})
    };
    return fetch(`${apiUrl}/campaigns/business-contact/cancel`, requestOptions).then(handleResponse);
}

function deleteSelected(model) {
    model.total = 0
    let searchFilter = getDefault(model)
    searchFilter.selectAll = (model.selectAll !== undefined) ? JSON.stringify(model.selectAll) : undefined
    searchFilter.selectedIds = (model.selectedIds !== undefined) ? JSON.stringify(model.selectedIds) : undefined
    searchFilter.excludedIds = (model.excludedIds !== undefined) ? JSON.stringify(model.excludedIds) : undefined
    searchFilter.selectedCampaign = (model.selectedCampaign !== undefined) ? JSON.stringify(model.selectedCampaign) : undefined
    if(model.deleteFromCampaign !== undefined){
        searchFilter.campaign.select = JSON.stringify([model.deleteFromCampaign])
    }
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({searchFilter})
    };
    return fetch(`${apiUrl}/campaigns/business-contact/remove`, requestOptions).then(handleResponse);
}

function deleteImport(model) {
    model.total = 0
    let searchFilter = getDefault(model)

    searchFilter.selectAll = (model.selectAll !== undefined) ? JSON.stringify(model.selectAll) : undefined
    searchFilter.selectedIds = (model.selectedIds !== undefined) ? JSON.stringify(model.selectedIds) : undefined
    searchFilter.excludedIds = (model.excludedIds !== undefined) ? JSON.stringify(model.excludedIds) : undefined
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({searchFilter})
    };
    return fetch(`${apiUrl}/business-contact/delete-imported`, requestOptions).then(handleResponse);
}

function getAllByFilter(currentPage, cantPerPage, searchFilter) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({currentPage, cantPerPage, searchFilter})
    };
    return fetch(`${apiUrl}/business-contact/filtered-list`, requestOptions).then(handleResponse);
    
}

function getEmail(bcid) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({bcid})
    };
    return fetch(`${apiUrl}/business-contact/get-email`, requestOptions).then(handleResponse);
    
}

function getStatus(bcid,campaignid) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({bcid,campaignid})
    };
    return fetch(`${apiUrl}/business-contact/get-status`, requestOptions).then(handleResponse);
    
}
function getOpportunities(bcid,campaignid) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({bcid,campaignid})
    };
    return fetch(`${apiUrl}/business-contact/get-opportunities`, requestOptions).then(handleResponse);
    
}

function searchEmail(bcid) {

    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({bcid})
    };
    return fetch(`${apiUrl}/business-contact/search-email`, requestOptions).then(handleResponse);
    
}

function insertCustomField(label,type){
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({label, type})
    };
    return fetch(`${apiUrl}/business-contact/insert-custom-field`, requestOptions).then(handleResponse);
     
}

function getCustomFields() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/business-contact/get-custom-fields`, requestOptions).then(handleResponse);
}

function getCredits() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/plans/credits`, requestOptions).then(handleResponse);
}

function deleteChecked(checkedIds){
       const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({checkedIds})
    };
    return fetch(`${apiUrl}/business-contact/delete-imported`, requestOptions).then(handleResponse);
     
}

function getAll2(currentPage, cantPerPage, searchFilter, campaignId, typeList) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/business-contact/filtered-list2?currentPage=${currentPage}&cantPerPage=${cantPerPage}&searchFilter=${searchFilter}&typeList=${typeList}&campaignId=${campaignId}`, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json'),
    };

    return fetch(`${apiUrl}/business-contact/${id}`, requestOptions).then(handleResponse);
}

function getContactById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json'),
    };

    return fetch(`${apiUrl}/business-contact/contact/${id}`, requestOptions).then(handleResponse);
}

function changeStatus(id, statusId) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
    };

    return fetch(`${apiUrl}/business-contact/${id}/status/${statusId}`, requestOptions).then(handleResponse);
}


function getAllFilters(){
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };

    return fetch(`${apiUrl}/business-contact/contacts-filters`, requestOptions).then(handleResponse);
}


function getDataToCsv() {

    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json'),
    };
    return fetch(`${apiUrl}/business-contact/filtered-list?currentPage=1&cantPerPage=9999&searchFilter=&emailFilter=&companyFilter=&cityFilter=&jobFilter=&roleFilter=&contactFilter=`, requestOptions).then(handleResponse);
}


function update(contact) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify(contact)
    };
    return fetch(`${apiUrl}/business-contact/update`, requestOptions).then(handleResponse);
    
}

function getImportList(){
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json'),
    };
    return fetch(`${apiUrl}/business-contact/importlist`, requestOptions).then(handleResponse);
}

function importContact(contact,importname,importid) {
    contact["importname"] = importname
    contact["importid"] = importid
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify(contact)
    };
    
    return fetch(`${apiUrl}/business-contact/import`, requestOptions).then(handleResponse);
    
}


function changeStatusByLinkId(id, linkId, businessContactStatusId) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({ 
            link_id: linkId,
            business_contact_status_id: businessContactStatusId
         })
    };

    return fetch(`${apiUrl}/business-contact/${id}/change-status-for-client`, requestOptions).then(handleResponse);
}


function setPhone(id, phone) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({ phone })
    };

    return fetch(`${apiUrl}/business-contact/${id}/phone`, requestOptions).then(handleResponse);
}

function changeStatusContactUnsubscribe(id, link_id) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
    };

    return fetch(`${apiUrl}/business-contact/${id}/link/${link_id}/unsubscribe`, requestOptions).then(handleResponse);
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