import { authHeader } from '@/_helpers';

export const opportunitiesService = {
    getAll,
    getAllByFilter,
    getPriority,
    getOpportunityById,
    getDashboardData,
    getDashboardTotals,
    getClients,
    changeStatus,
    unlockContactsOpportunity,
    createOpportunity,
    getListOpportunities,
    getContacts,
    getSessions,
    refuse,
    getBusinessesFilter,
    getDataToCsv,
    getActivityLink
};

const apiUrl = process.env.VUE_APP_ROOT_API;

function getAll(currentPage, cantPerPage, searchFilter, productFilter, parentCategoryFilter, linkStatusFilter, salesUserFilter, orderBy, businessFilter, tagFilter) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json'),
    };
    return fetch(`${apiUrl}/opportunities/filtered-list?currentPage=${currentPage}&cantPerPage=${cantPerPage}&searchFilter=${searchFilter}&productFilter=${productFilter}&parentCategoryFilter=${parentCategoryFilter}&linkStatusFilter=${linkStatusFilter}&salesUserFilter=${salesUserFilter}&orderBy=${orderBy}&businessFilter=${businessFilter}&tagFilter=${tagFilter}`, requestOptions).then(handleResponse);
}

function getAllByFilter(currentPage, cantPerPage, searchFilter) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({currentPage, cantPerPage, searchFilter})
    };
    return fetch(`${apiUrl}/opportunities/filtered-list`, requestOptions).then(handleResponse);
}

function getActivityLink(id) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({linkid: id})
    };
    return fetch(`${apiUrl}/links/getactivitylink`, requestOptions).then(handleResponse);
}


function refuse(link_id,message) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({link_id,message})
    };
    return fetch(`${apiUrl}/links/refuse`, requestOptions).then(handleResponse);
}


function getListOpportunities(searchFilter) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json'),
    };
    return fetch(`${apiUrl}/opportunities/searched-list?searchFilter=${searchFilter}`, requestOptions).then(handleResponse);
}


function getSessions(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json'),
    };
    return fetch(`${apiUrl}/opportunities/${id}/session`, requestOptions).then(handleResponse);
}


function getPriority(parentCategoryFilter, productFilter) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json'),
    };
    // Agusdeluca96: return fetch(`${apiUrl}/opportunities/priority?categoryFilter=${categoryFilter.id}&productFilter=${productFilter.id}`, requestOptions)
    return fetch(`${apiUrl}/opportunities/priority?productFilter=${productFilter.id}`, requestOptions)
    .then(handleResponse)
    .then(opportunity => mergeOpportunityCommentsAndEvents(opportunity));
}

function getOpportunityById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json'),
    };
    return fetch(`${apiUrl}/opportunities/${id}`, requestOptions)
    .then(handleResponse)
    .then(opportunity => mergeOpportunityCommentsAndEvents(opportunity));
}

function getDashboardData(){
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json'),
    };
    return fetch(`${apiUrl}/opportunities/dashboard`, requestOptions)
    .then(handleResponse);
}

function getDashboardTotals(){
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json'),
    };
    return fetch(`${apiUrl}/opportunities/dashboard/totals`, requestOptions)
    .then(handleResponse);
}

function getClients() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json'),
    };
    return fetch(`${apiUrl}/clients/users`, requestOptions)
    .then(handleResponse);
}

function getDataToCsv(searchFilter) {
    let currentPage = 1;
    let cantPerPage = 1000000;
    searchFilter.total=0;
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({currentPage, cantPerPage, searchFilter})
    };
    return fetch(`${apiUrl}/opportunities/filtered-list`, requestOptions).then(handleResponse);
}
    

function getBusinessesFilter() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json'),
    };

    return fetch(`${apiUrl}/opportunities/businesses-filter`, requestOptions).then(handleResponse);
}



function unlockContactsOpportunity(linkId) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({
            linkId: linkId,
        })
    };
    return fetch(`${apiUrl}/opportunities/${linkId}/unlockcontacts`, requestOptions).then(handleResponse);
}

function changeStatus(statusId, linkId, linkStatusReasonId, nextCampaignId, nextCampaignDatetime, initDelay) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({
            link_status_reason_id: linkStatusReasonId,
            next_campaign_id: nextCampaignId,
            next_campaign_datetime: nextCampaignDatetime,
            status_id : statusId,
            init_delay : initDelay
        })
    };
    return fetch(`${apiUrl}/opportunities/${linkId}/changestatus`, requestOptions).then(handleResponse);
}

function createOpportunity(businessId, campaignId) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({
            business_id: businessId,
            campaign_id: campaignId
        })
    };
    return fetch(`${apiUrl}/opportunities/`, requestOptions).then(handleResponse);
}

function getContacts(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json'),
    };
    return fetch(`${apiUrl}/opportunities/${id}/contacts`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    if (response.data !== 204) {
        return response.text().then(text => {
            const data = text && JSON.parse(text);
            if (!response.ok) {
                const error = data || response.statusText;
                return Promise.reject(error);
            }
            return data;
        });
    }
}


function mergeOpportunityCommentsAndEvents(opportunity){
    if(opportunity.emails !== undefined){
        var emailsResult = []
        opportunity.emails.forEach(item => {
            emailsResult[item.id] = item
        });
        opportunity.emails = emailsResult
    }
    if (opportunity !== "" && opportunity !== null && opportunity != {}) {

        const timeline = opportunity.activities2
        opportunity.timelineRecent = []
        opportunity.timelineRecent = opportunity.activities
        opportunity.timelineComming = []
        opportunity.timelinePassed = []
        var timelinePassedAct = []
        var user_idant = false
        var typeant = false

        if(timeline !== undefined){
        timeline.forEach(item => {

            var pastevent = false;
            // Preparo la fecha en un formato comparable
            if(item.type == "event"){
                var commentDateArray = item.event_date.split(/-|\s|:/);
                var commentDate = new Date(commentDateArray[0], commentDateArray[1] - 1, commentDateArray[2], commentDateArray[3], commentDateArray[4], commentDateArray[5]);
                // Verifico si el comment ya pasó o no para agregarlo en el arreglo que corresponda
                if(commentDate <= new Date()){
                    pastevent = true;
                }
            }
            
            if(item.type == 'emailssent'){
                if(item.photo != null)
                    item.photo = item.photo.split(",");
                
                item.opendate = []
                if(item.unlocked != null && item.unlocked != ''){ //emailopen
                    item.opendate = item.unlocked.split(",");
                    item.from = item.response_from.split(",");
                }
            }
            if ( (item.type != "event" && item.type != "emailscheduled") || pastevent ) {
                if(item.link == "createdopportunity"){

                    if(timelinePassedAct.length>0){
                        var itemdemolink = timelinePassedAct[timelinePassedAct.length-1]
                        itemdemolink.activities = timelinePassedAct
                        opportunity.timelinePassed.push(itemdemolink)
                    }

                    opportunity.timelinePassed.push(item)
                }else{
                
                  
                    
                    if(item.type == 'activity'){
                        var pusshed = false
                        if(!user_idant){
                            user_idant = item.id
                        }else{
                            if(item.id && user_idant != item.id){

                                if(timelinePassedAct.length > 0){
                                    var itemdemolink = timelinePassedAct[timelinePassedAct.length-1]
                                    itemdemolink.activities = timelinePassedAct
                                    opportunity.timelinePassed.push(itemdemolink)
                                    timelinePassedAct = []
                                    pusshed = true
                                }
                                
                                user_idant = item.id
                            }
                        }

                        if(!pusshed){
                            if(!typeant){
                                typeant = item.link_activity_type_id
                            }
                            if(item.link_activity_type_id == 1 && typeant == 2){

                                if(timelinePassedAct.length > 0){
                                    var itemdemolink = timelinePassedAct[timelinePassedAct.length-1]
                                    itemdemolink.activities = timelinePassedAct
                                    opportunity.timelinePassed.push(itemdemolink)
                                    timelinePassedAct = []
                                }
                                
                            }
                            typeant = item.link_activity_type_id
                        }

                        


                        timelinePassedAct.push(item)
                    }else{
                        if(timelinePassedAct.length > 0){
                            var itemdemolink = timelinePassedAct[timelinePassedAct.length-1]
                            itemdemolink.activities = timelinePassedAct
                            opportunity.timelinePassed.push(itemdemolink)
                            timelinePassedAct = []
                        }
                        opportunity.timelinePassed.push(item)

                    }
                }

            }

            if(item.type == 'emailscheduled' && item.event_date != null){
                var today = new Date();
                today.setHours(0,0,0,0);
                // Preparo la fecha en un formato comparable
                var commentDateArray = item.event_date.split(/-|\s|:/);
                var commentDate = new Date(commentDateArray[0], commentDateArray[1] - 1, commentDateArray[2], commentDateArray[3], commentDateArray[4], commentDateArray[5]);
                // Verifico si el comment ya pasó o no para agregarlo en el arreglo que corresponda
                if (commentDate > today) {
                 opportunity.timelineComming.push(item)
                }
            }

            if(item.type == 'event' && item.event_date != null){
                var today = new Date();
                // Preparo la fecha en un formato comparable
                var commentDateArray = item.event_date.split(/-|\s|:/);
                var commentDate = new Date(commentDateArray[0], commentDateArray[1] - 1, commentDateArray[2], commentDateArray[3], commentDateArray[4], commentDateArray[5]);
                // Verifico si el comment ya pasó o no para agregarlo en el arreglo que corresponda
                if (commentDate > today) {
                 opportunity.timelineComming.push(item)
                }
            }

     });

        }


if(timelinePassedAct.length > 0){
    var itemdemolink = timelinePassedAct[timelinePassedAct.length-1]
    itemdemolink.activities = timelinePassedAct
    opportunity.timelinePassed.push(itemdemolink)
}



}

return opportunity
}

function sortCommentsAndEvents(object1, object2) {
    // Verifico si el objeto es un event (estos tienen el atributo 'event_date')
    if (isEvent(object1)) {
        if (isEvent(object2)) {
            // Significa que son dos events
            if (object1.event_date < object2.event_date) {
                return 1;
            }
            if (object1.event_date > object2.event_date) {
                return -1;
            }
            return 0;
        } else {
            // Significa que object1 es un event, pero object2 es un comment
            if (object1.event_date < object2.creation_date) {
                return 1;
            }
            if (object1.event_date > object2.creation_date) {
                return -1;
            }
            return 0;
        }
    } else {
        if (isEvent(object2)) {
            // Significa que object1 es un comment, pero object2 es un event
            if (object1.creation_date < object2.event_date) {
                return 1;
            }
            if (object1.creation_date > object2.event_date) {
                return -1;
            }
            return 0;
        } else {
            // Significa que son dos comments
            if (object1.creation_date < object2.creation_date) {
                return 1;
            }
            if (object1.creation_date > object2.creation_date) {
                return -1;
            }
            return 0;
        }
    }

    function isEvent(item) {
        return item.hasOwnProperty('event_date')
    }
}
