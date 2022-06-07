import { authHeader } from '@/_helpers';
export const notificationService = {
    getTasks,
    getAllTasks,
    getTasksPopup,
    removeNotification,
    closeTask,
    openTask,
};

const apiUrl = process.env.VUE_APP_ROOT_API;
var lastquery = new Array();


function getTasks(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json'),
    };
    return fetch(`${apiUrl}/notifications/tasks/${id}`, requestOptions).then(handleResponse);
}

function getAllTasks(notification_status_id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json'),
    };
    return fetch(`${apiUrl}/notifications/tasks/all/${notification_status_id}`, requestOptions).then(handleResponse);
}


function closeTask(id) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({notification_status_id:2})
    };

    return fetch(`${apiUrl}/notifications/${id}/change-status`, requestOptions).then(handleResponse);
}

function openTask(id) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({notification_status_id:1})
    };

    return fetch(`${apiUrl}/notifications/${id}/change-status`, requestOptions).then(handleResponse);
}

function removeNotification(id) {

    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({id})
    };

    return fetch(`${apiUrl}/notifications/${id}/delete`, requestOptions).then(handleResponse);
}


function getTasksPopup() {
    const controller = new AbortController();
    const signal = controller.signal;

    if(lastquery['search'] == undefined || lastquery['search'] == false){
        lastquery['search'] = true 
        const requestOptions = {
            method: 'GET',
            headers: authHeader('application/json'),
        };

        const promise = fetch(`${apiUrl}/notifications/type/1/seconds/19`, requestOptions)
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
        return Promise.reject(800);
    }
    
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