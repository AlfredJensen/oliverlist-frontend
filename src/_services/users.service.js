import { authHeader } from '@/_helpers';

export const usersService = {
    login,
    logout,
    create,
    addNewUser,
    verificationCode,
    verificationCodeLoggedIn,
    getAll,
    getUserSettings,
    getNotifications,
    setUserSettings,
    changePassword,
    requestNewPassword,
    sendImprovement,
    getList,
    getGroupList,
    getUserGroupList,
    getAllGroups,
    deleteMember,
    getUserById,
    saveCalendly,
    getCalendly,
    hasPaymentDefault,
    getAuthenticationUrl,
    verificationAuthenticationCode,
    getEmailSettings,
    deactivateEmailSettings,
    setParameters,
    refreshToken,
    downgrade,
    resendVerificationCode,
    verificationCodeAdmin,
    unBlock,
    getAllByFilter
};

const apiUrl = process.env.VUE_APP_ROOT_API;

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        console.log("response ==", data);
        console.log("Response status ==", response.status);  
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

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include', // include, same-origin, omit
    };

    return fetch(`${apiUrl}/users/login`, requestOptions).then(handleResponse)
        
        .then(user => {
        //     // login successful if there's a jwt token in the response
        //     /*if (user.token) {
        //         // store user details and jwt token in local storage to keep user logged in between page refreshes
        //         //localStorage.setItem('user', JSON.stringify(user));
        //         this.hasPaymentDefault().then(response => { 
        //             if(response.trialPeriodEnded.result == 1 && 
        //                 response.hasDefaultPaymentMethod.length == 0){
        //                 localStorage.setItem('trialPeriodEnded', true); 
        //             } else{ 
        //                 localStorage.setItem('trialPeriodEnded', false);
        //             }
        //             localStorage.setItem('subscriptionActive', response.subscriptionActive);
        //         })
                
        //         // Initialize variables for user filter of priority product and category
        //         localStorage.setItem('priorityCategoryFilter', JSON.stringify({}));
        //         localStorage.setItem('priorityProductFilter', JSON.stringify({}));
        //     }*/
            return user;
        });
}
  
function refreshToken() {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // include, same-origin, omit
    };

    return fetch(`${apiUrl}/users/refresh-token`, requestOptions).then(handleResponse)
}

function verificationCode(code, username, password) {

    const requestOptions = {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, username, password })
    };
    return fetch(`${apiUrl}/users/verificationcode`, requestOptions)
        .then(handleResponse);
}



function verificationCodeLoggedIn(code) {
    const requestOptions = {
        method: 'POST', 
        headers: authHeader('application/json'),
        body: JSON.stringify({ code })
    };
    return fetch(`${apiUrl}/users/verificationcodeloggedin`, requestOptions)
        .then(handleResponse);
}


function verificationCodeAdmin(userid) {
    const requestOptions = {
        method: 'POST', 
        headers: authHeader('application/json'),
        body: JSON.stringify({ userid })
    };
    return fetch(`${apiUrl}/users/verificationcodeadmin`, requestOptions)
        .then(handleResponse);
}


function unBlock(userid) {
    const requestOptions = {
        method: 'POST', 
        headers: authHeader('application/json'),
        body: JSON.stringify({ userid })
    };
    return fetch(`${apiUrl}/users/unblock`, requestOptions)
        .then(handleResponse);
}


function create(data) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: data})
    };

    window.dataLayer = window.dataLayer || []
    dataLayer.push({
     'event': 'formSubmission',
     'formType': 'create_account',
    });

    return fetch(`${apiUrl}/users/create`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // login successful if there's a jwt token in the response
            if (user.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                // Initialize variables for user filter of priority product and category
                localStorage.setItem('priorityCategoryFilter', JSON.stringify({}));
                localStorage.setItem('priorityProductFilter', JSON.stringify({}));
            }
            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    localStorage.removeItem('xkhx$$');
    // Remove user filter of priority product and category
    localStorage.removeItem('priorityProductFilter')
    localStorage.removeItem('priorityCategoryFilter')
    localStorage.clear;
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };

    return fetch(`${apiUrl}/users/`, requestOptions).then(handleResponse);
}


function addNewUser(data) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({ user: data})
    };

    return fetch(`${apiUrl}/users/`, requestOptions).then(handleResponse);
}

function getUserById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/users/user/${id}`, requestOptions).then(handleResponse);
}

function getList(currentPage, cantPerPage, searchFilter) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/users/filtered-list?currentPage=${currentPage}&cantPerPage=${cantPerPage}&searchFilter=${searchFilter}`, requestOptions).then(handleResponse);
}

function getGroupList() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/users/mygroup`, requestOptions).then(handleResponse);
}

function getUserGroupList(id){
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({id})
    };
    return fetch(`${apiUrl}/users/usergrouplist`, requestOptions).then(handleResponse);  
}

function deleteMember(team_user_id){
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({team_user_id})
    };
    return fetch(`${apiUrl}/users/deletegroupmember`, requestOptions).then(handleResponse);  
}

function getAllGroups() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/users/groups`, requestOptions).then(handleResponse);
}

function getAllByFilter(currentPage, cantPerPage, searchFilter) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({currentPage, cantPerPage, searchFilter})
    };
    return fetch(`${apiUrl}/users/filtered-list`, requestOptions).then(handleResponse);
    
}

function getUserSettings() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };

    return fetch(`${apiUrl}/users/account`, requestOptions).then(handleResponse);
}
function getNotifications() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };

    return fetch(`${apiUrl}/users/notifications`, requestOptions).then(handleResponse);
}

function saveCalendly(calendly) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({calendly: calendly})
    };

    return fetch(`${apiUrl}/calendly/calendly`, requestOptions).then(handleResponse);
}

function getCalendly(user_id) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({user_id:user_id})
    };
    return fetch(`${apiUrl}/calendly/getcalendly`, requestOptions).then(handleResponse);
}


function setUserSettings(user,client, avatar) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({
            user: user,
            client: client,
            avatar: avatar})
    };

    return fetch(`${apiUrl}/users/account`, requestOptions).then(handleResponse);
}

function changePassword(currentPassword,newPassword) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({
            currentPassword: currentPassword,
            newPassword: newPassword})
    };

    return fetch(`${apiUrl}/users/changePassword`, requestOptions).then(handleResponse);
}

function sendImprovement(message) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({
            message: message})
    };

    return fetch(`${apiUrl}/users/improvement`, requestOptions).then(handleResponse);
}

function requestNewPassword(email) {
    const requestOptions = {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
    };

    return fetch(`${apiUrl}/users/request-new-password`, requestOptions).then(handleResponse);
}

function hasPaymentDefault() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };

    return fetch(`${apiUrl}/users/has-payment-default`, requestOptions).then(handleResponse);
}


function getAuthenticationUrl(email, firstname, lastname, user_id){
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({
            email_address: email,
            first_name: firstname,
            last_name: lastname,
            user_id: user_id
        })
    };

    return fetch(`${apiUrl}/users/authentication`, requestOptions).then(handleResponse);
}

function verificationAuthenticationCode(code, state){
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({
            code: code,
            state: state
        })
    };
    return fetch(`${apiUrl}/users/authentication-code`, requestOptions).then(handleResponse);
}

function getEmailSettings(user_id) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({user_id })
    };

    return fetch(`${apiUrl}/users/get-email-settings`, requestOptions).then(handleResponse);
}

function deactivateEmailSettings(user_id) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({user_id })
    };

    return fetch(`${apiUrl}/users/email-settings/deactivate`, requestOptions).then(handleResponse);
}

function setParameters(categories_search_function, categories_search_level) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({categories_search_function, categories_search_level })
    };

    return fetch(`${apiUrl}/users/parameters`, requestOptions)
    .then(handleResponse);
}

function downgrade(data) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({data})
    };

    return fetch(`${apiUrl}/users/downgrade`, requestOptions).then(handleResponse);

}

function resendVerificationCode(username) {
    const requestOptions = {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
    };

    return fetch(`${apiUrl}/users/resend-verificationcode`, requestOptions).then(handleResponse);
}
