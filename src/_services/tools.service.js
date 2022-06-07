import { authHeader } from '@/_helpers';

export const toolsService = {
    analyzeLogo,
    analyzeColors,
    uploadImage
};

const apiUrl = process.env.VUE_APP_ROOT_API;

function analyzeLogo(domain) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };

    return fetch(`${apiUrl}/tools/analyze-logo?url=${domain}`, requestOptions).then(handleResponse);
}

function analyzeColors(logoUrl, domain) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };

    logoUrl = isDataURL(logoUrl) ? false : logoUrl;

    return fetch(`${apiUrl}/tools/analyze-colors?logo=${logoUrl}&url=${domain}`, requestOptions).then(handleResponse);
}

function uploadImage(image) {
    let formData = new FormData();
    formData.append('image', image);
    const requestOptions = {
        method: 'POST',
        headers: authHeader(null),
        body: formData
    };

    return fetch(`${apiUrl}/tools/upload-image`, requestOptions).then(handleResponse);
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

function isDataURL(s) {
    var strArray = s.split('data:');
    if (strArray.length > 1) {
        s = `data:${strArray[1]}`;
    }
    return !!s.match(/^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i);
}