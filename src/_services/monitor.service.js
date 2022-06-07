import { authHeader } from '@/_helpers';

export const monitorService = {
    getMonitorList,
    getMonitorUser,
    getClients
};

const apiUrl = process.env.VUE_APP_ROOT_API;

function getMonitorList(team_id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };

    return fetch(`${apiUrl}/users/monitorlist/${team_id}`, requestOptions).then(handleResponse);
}


function getClients(team_id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };

    return fetch(`${apiUrl}/users/clientsagency`, requestOptions).then(handleResponse);
}

function getMonitorUser(user_id,type,range) {

    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({user_id,type,range})
    };
    return fetch(`${apiUrl}/users/monitor`, requestOptions).then(handleResponse);  

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