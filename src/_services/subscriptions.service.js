import { authHeader } from '@/_helpers';
export const subscriptionsService = {
    upgrade,
    downgrade,
};

const apiUrl = process.env.VUE_APP_ROOT_API;

function upgrade(plan_id, recurring_payment_period) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({plan_id, recurring_payment_period})
    };

    return fetch(`${apiUrl}/subscriptions/upgrade`, requestOptions).then(handleResponse);
}

function downgrade(data) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({data})
    };

    return fetch(`${apiUrl}/subscriptions/downgrade`, requestOptions).then(handleResponse);
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