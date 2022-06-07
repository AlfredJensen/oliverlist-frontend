import { store } from '@/_store'

export function authHeader(contentType) {
    // return authorization header with jwt token
    //let user = JSON.parse(localStorage.getItem('user'));
    
    let user = store.state.authentication.user;

    if (user && user.token) {
        if (contentType != null) {
            return { 
                'Authorization': 'Bearer ' + user.token,
                'Content-Type': contentType
            };
        } else {
            return {
                'Authorization': 'Bearer ' + user.token
            };
        }
    } else {
        return {};
    }
}