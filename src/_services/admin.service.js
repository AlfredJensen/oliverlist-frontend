import { authHeader } from '@/_helpers';
export const adminService = {
    getLastUsers,
    getActive,
    getGmailImports,
    getLinkedinImports,
    getOliverSettings,
    updateWords,
    updateOliverVariables,
    insertNew
};

const apiUrl = process.env.VUE_APP_ROOT_API;


function getLastUsers() {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({})
        
    };
    return fetch(`${apiUrl}/admin/lastusers`, requestOptions).then(handleResponse);
}

function getActive() {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({})
    };
    return fetch(`${apiUrl}/admin/activecampaigns`, requestOptions).then(handleResponse);
}

function getOliverSettings(){
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({})
    };
    return fetch(`${apiUrl}/admin/settings`, requestOptions).then(handleResponse);  
}

function updateOliverVariables(words,name){
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({words,name})
    };
    return fetch(`${apiUrl}/admin/updateolivervariable`, requestOptions).then(handleResponse);  
}
function updateWords(words,id){
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({words,id})
    };
    return fetch(`${apiUrl}/admin/updatewords`, requestOptions).then(handleResponse);  
}
function insertNew(words,title,type){
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({words,title,type})
    };
    return fetch(`${apiUrl}/admin/insertwords`, requestOptions).then(handleResponse);  
}

function getGmailImports() {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({})
    };
    return fetch(`${apiUrl}/admin/gmailimports`, requestOptions).then(handleResponse);
}

function getLinkedinImports() {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({})
    };
    return fetch(`${apiUrl}/admin/linkedinimports`, requestOptions).then(handleResponse);
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
