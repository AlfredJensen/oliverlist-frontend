import { authHeader } from '@/_helpers';

export const captainDataService = {
    startSearch,
    stopSearch,
    getWorkflows,
    getSearchList,
    getHistory,
    getScheduleHistory,
    importResult,
    getImporting,
    getActualList,
    pauseSearch,
    getSchedule,
    getUser,
    removeUser,
    changeStatus,
    changeStatusSchedule,
    deleteSearch,
    getLinkedinCookie,
    getUsers,
    unSync,
    getUserByCaptainUid,
    getWorkflowStatus
};

const apiUrl = process.env.VUE_APP_ROOT_API;
var lastquery = new Array();

function getLinkedinCookie(){
   return localStorage.getItem("oliverlinkedin")
}

function getSchedule() {

    const requestOptions = {
        method: 'POST', 
        headers: authHeader('application/json'),   
        body: JSON.stringify()
    };
    return fetch(`${apiUrl}/captain/schedule`, requestOptions)
        .then(handleResponse);
}

function getUsers() {

    const requestOptions = {
        method: 'POST', 
        headers: authHeader('application/json'),   
        body: JSON.stringify()
    };
    return fetch(`${apiUrl}/captain/getusers`, requestOptions)
        .then(handleResponse);
}

function startSearch(url,name,limit,campaignid,scheduledays,recurrent) {

    const requestOptions = {
        method: 'POST', 
        headers: authHeader('application/json'),   
        body: JSON.stringify({ url , name, limit, campaignid, scheduledays, recurrent})
    };
    return fetch(`${apiUrl}/captain/add-search`, requestOptions)
        .then(handleResponse);
}

function stopSearch(id) {

    const requestOptions = {
        method: 'POST', 
        headers: authHeader('application/json'),   
        body: JSON.stringify({ id })
    };
    return fetch(`${apiUrl}/captain/stop-search`, requestOptions)
        .then(handleResponse);
}

function deleteSearch(id) {

    const requestOptions = {
        method: 'POST', 
        headers: authHeader('application/json'),   
        body: JSON.stringify({ id })
    };
    return fetch(`${apiUrl}/captain/delete-search`, requestOptions)
        .then(handleResponse);
}

function getWorkflowStatus(id) {

    const requestOptions = {
        method: 'POST', 
        headers: authHeader('application/json'),   
        body: JSON.stringify({ id })
    };
    return fetch(`${apiUrl}/captain/workflowstatus`, requestOptions)
        .then(handleResponse);
}


function changeStatusSchedule(id,status) {

    const requestOptions = {
        method: 'POST', 
        headers: authHeader('application/json'),   
        body: JSON.stringify({ id, status})
    };
    return fetch(`${apiUrl}/captain/changeschedule`, requestOptions)
        .then(handleResponse);
}

function pauseSearch(id) {
 
    const requestOptions = {
        method: 'POST', 
        headers: authHeader('application/json'),   
        body: JSON.stringify({ id })
    };
    return fetch(`${apiUrl}/captain/pause-search`, requestOptions)
        .then(handleResponse);
}


function changeStatus(id,status) {

    const requestOptions = {
        method: 'POST', 
        headers: authHeader('application/json'),   
        body: JSON.stringify({ id,status })
    };
    return fetch(`${apiUrl}/captain/change-status`, requestOptions)
        .then(handleResponse);
}

function getImporting(id,getdata) {

    const controller = new AbortController();
    const signal = controller.signal;


    if(lastquery[id] == undefined || lastquery[id] == false){
        lastquery[id] = true 
        const requestOptions = {
            method: 'POST', 
            headers: authHeader('application/json'),   
            body: JSON.stringify({ id,getdata })
        };

        const promise = fetch(`${apiUrl}/captain/getimporting`, requestOptions)
                .then((response) => {
                        lastquery[id] = false;
                        return response.text().then(text => {
                            const data = text && JSON.parse(text);
                            if (!response.ok) {
                                const error = data || response.statusText;
                                return Promise.reject(error);
                            }
                            return data;
                        });
                    })
                .catch((err) => {
                    lastquery[id] = false
                });
                

        return promise

    }else{
        return Promise.reject(900);
    }
    
}

function getUser(cookie) {

    const requestOptions = {
        method: 'POST', 
        headers: authHeader('application/json'),   
        body: JSON.stringify({ cookie })
    };

    localStorage.removeItem("oliverlinkedin")

    return fetch(`${apiUrl}/captain/getuser`, requestOptions)
        .then(handleResponse);

}

function getUserByCaptainUid(captaindata_uid) {

    const requestOptions = {
        method: 'POST', 
        headers: authHeader('application/json'),   
        body: JSON.stringify({ captaindata_uid })
    };

    localStorage.removeItem("oliverlinkedin")

    return fetch(`${apiUrl}/captain/getuserbycaptainuid`, requestOptions)
        .then(handleResponse);

}

function removeUser(id) {

    const requestOptions = {
        method: 'POST', 
        headers: authHeader('application/json'),   
        body: JSON.stringify({ id })
    };
    return fetch(`${apiUrl}/captain/removeuser`, requestOptions)
        .then(handleResponse);
}

function unSync() {

    const requestOptions = {
        method: 'POST', 
        headers: authHeader('application/json'),   
        body: JSON.stringify({})
    };
    return fetch(`${apiUrl}/captain/unsync`, requestOptions)
        .then(handleResponse);
}

function importResult(id) {

    const requestOptions = {
        method: 'POST', 
        headers: authHeader('application/json'),   
        body: JSON.stringify({ id })
    };
    return fetch(`${apiUrl}/captain/importresult`, requestOptions)
        .then(handleResponse);
}


function getActualList(){

    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
    };

    const promise = fetch(`${apiUrl}/captain/actualsearchlist`, requestOptions)
            .then((response) => {
                    lastquery['search'] = false;
                    return response.text().then(text => {
                        const data = text && JSON.parse(text);
                        if (!response.ok) {
                            const error = data || response.statusText;
                            return Promise.reject(error);
                        }
                        return data;
                    });
                })
            .catch((err) => {
                lastquery['search'] = false
            });
            
    return promise
}


function getScheduleHistory(schedule_id){

    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({schedule_id})
    };

    const promise = fetch(`${apiUrl}/captain/schedulehistory`, requestOptions)
            .then((response) => {
                    lastquery['search'] = false;
                    return response.text().then(text => {
                        const data = text && JSON.parse(text);
                        if (!response.ok) {
                            const error = data || response.statusText;
                            return Promise.reject(error);
                        }
                        return data;
                    });
                })
            .catch((err) => {
                lastquery['search'] = false
            });
            
    return promise
}

function getHistory(limit){

    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({ limit })
    };

    const promise = fetch(`${apiUrl}/captain/searchlisthistory`, requestOptions)
            .then((response) => {
                    lastquery['search'] = false;
                    return response.text().then(text => {
                        const data = text && JSON.parse(text);
                        if (!response.ok) {
                            const error = data || response.statusText;
                            return Promise.reject(error);
                        }
                        return data;
                    });
                })
            .catch((err) => {
                lastquery['search'] = false
            });
            
    return promise
}

function getSearchList(force) {
    const controller = new AbortController();
    const signal = controller.signal;

    if(force){
         lastquery['search'] = undefined   
    }

    if(lastquery['search'] == undefined || lastquery['search'] == false){
        lastquery['search'] = true 
        const requestOptions = {
            method: 'POST',
            headers: authHeader('application/json'),
        };

        const promise = fetch(`${apiUrl}/captain/searchlist`, requestOptions)
                .then((response) => {
                        lastquery['search'] = false;
                        return response.text().then(text => {
                            const data = text && JSON.parse(text);
                            if (!response.ok) {
                                const error = data || response.statusText;
                                return Promise.reject(error);
                            }
                            return data;
                        });
                    })
                .catch((err) => {
                    lastquery['search'] = false
                });
                

        return promise

    }else{
        return Promise.reject(900);
    }
    
}


function getWorkflows(id) {

    const requestOptions = {
        method: 'POST', 
        headers: authHeader('application/json'),  
        body: JSON.stringify({ id })
    };
    return fetch(`${apiUrl}/captain/workflowresult`, requestOptions)
        .then(handleResponse);
}


function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                logout();
            }

            const error = data || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}