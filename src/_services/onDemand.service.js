import { authHeader } from '@/_helpers';

export const onDemandService = {
    addSearch,
    getList,
    changestatus,
    getHistoyList
};

const apiUrl = process.env.VUE_APP_ROOT_API;

var lastquery = new Array();


function addSearch(ind,loc,fun,name,searchlinkedin) {

    const requestOptions = {
        method: 'POST', 
        headers: authHeader('application/json'),   
        body: JSON.stringify({ ind , loc, fun, name,searchlinkedin})
    };
    return fetch(`${apiUrl}/ondemand/add-search`, requestOptions)
        .then(handleResponse);
}

function changestatus(ondemand_id,status) {

    const requestOptions = {
        method: 'POST', 
        headers: authHeader('application/json'),   
        body: JSON.stringify({ondemand_id,status})
    };
    return fetch(`${apiUrl}/ondemand/changestatus`, requestOptions)
        .then(handleResponse);
}


function getList() {
    const controller = new AbortController();
    const signal = controller.signal;

    if(lastquery['search'] == undefined || lastquery['search'] == false){
        lastquery['search'] = true 
        const requestOptions = {
            method: 'POST',
            headers: authHeader('application/json'),
        };

        const promise = fetch(`${apiUrl}/ondemand/searchlist`, requestOptions)
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
        return Promise.reject(400);
    }
    
}

function getHistoyList(limit) {

    const requestOptions = {
        method: 'POST', 
        headers: authHeader('application/json'),   
        body: JSON.stringify({limit})
    };
    return fetch(`${apiUrl}/ondemand/searchhistorylist`, requestOptions)
        .then(handleResponse);
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