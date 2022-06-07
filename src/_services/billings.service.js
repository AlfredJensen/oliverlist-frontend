import { authHeader } from '@/_helpers';
export const billingsService = {
    getBillingProfile,
    saveBillingProfile,
    getTransactions,
    getSummary,
    getPaymentMethods,
    getPaymentMethod,
    getInvoices,
    saveSepaPaymentMethod,
    deletePaymentMethod,
    confirmPaymentMethod,
    getPendingPayments,
    downloadPDF,
    getUsages,
    lastPayment,
    chargePendingPayments,
    getDashboard,
    getStats
};

const apiUrl = process.env.VUE_APP_ROOT_API;


function getBillingProfile() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/payments/payment-profile`, requestOptions).then(handleResponse);
}

function saveBillingProfile(billingProfile) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify(billingProfile)
    };

    return fetch(`${apiUrl}/payments/payment-profile`, requestOptions).then(handleResponse);
}

function getTransactions() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/payments/transactions`, requestOptions).then(handleResponse);
}

function getSummary() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/payments/summary`, requestOptions).then(handleResponse);
}

function getPaymentMethods() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/payments/payment-methods`, requestOptions).then(handleResponse);
}

function getInvoices() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/payments/invoices`, requestOptions).then(handleResponse);
}

function saveSepaPaymentMethod(paymentMethod) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify(paymentMethod)
    };

    return fetch(`${apiUrl}/payments/payment-method`, requestOptions).then(handleResponse);
}

function getPaymentMethod(id, paymentType) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/payments/payment-method/${paymentType}/${id}`, requestOptions).then(handleResponse);
}

function deletePaymentMethod(paymentMethodId, paymentType) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({id: paymentMethodId, payment_type : paymentType})
    };

    return fetch(`${apiUrl}/payments/payment-method/delete`, requestOptions).then(handleResponse);
}

function confirmPaymentMethod(ingenicoResponse) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify(ingenicoResponse)
    };

    return fetch(`${apiUrl}/payments/payment-method/confirmed`, requestOptions).then(handleResponse);
}

function getPendingPayments() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/payments/pendings`, requestOptions).then(handleResponse);
}

function downloadPDF(paymentId) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/billings/download?id=${paymentId}`, requestOptions).then(handleResponse);
}

function getUsages(currentPage, cantPerPage, initDateFilter, endDateFilter, productFilter, companyNameFilter, companyIdFilter) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/payments/usages?currentPage=${currentPage}&cantPerPage=${cantPerPage}&initDateFilter=${initDateFilter}&endDateFilter=${endDateFilter}&productFilter=${productFilter}&companyNameFilter=${companyNameFilter}&companyIdFilter=${companyIdFilter}`, requestOptions).then(handleResponse);
}

function lastPayment() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/payments/last-payment`, requestOptions).then(handleResponse);
}

function chargePendingPayments(generate_payment) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({generate_payment: generate_payment})
        
    };
    return fetch(`${apiUrl}/payments/charge-pendings`, requestOptions).then(handleResponse);
}

function getDashboard() {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/billings/dashboard`, requestOptions).then(handleResponse);
}

function getStats() {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/billings/get-stats`, requestOptions).then(handleResponse);
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

function handlePDFResponse(response) {
    return response.text();
}