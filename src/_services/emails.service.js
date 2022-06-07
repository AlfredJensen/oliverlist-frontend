import { authHeader } from '@/_helpers';
export const emailsService = {
  getAll,
  getThreadById,
  getById,
  associateOpportunity,
  associateBusinessContact,
  setValidStatus,
  replyEmail,
  sendTestEmail,
  createOpportunity,
  updateTemplate,
  getAllTemplates,
  getTemplate
};

const apiUrl = process.env.VUE_APP_ROOT_API;

function getAll(currentPage, cantPerPage, searchFilter, salesUserFilter) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader('application/json')
  };
  return fetch(`${apiUrl}/email-response/filtered-list?currentPage=${currentPage}&cantPerPage=${cantPerPage}&searchFilter=${searchFilter}&userFilter=${salesUserFilter}`, requestOptions).then(handleResponse);
}

function getById(id) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader('application/json')
  };
  return fetch(`${apiUrl}/email-response/${id}`, requestOptions)
    .then(handleResponse)
    .then(message => decodeMessage(message));
}

function decodeMessage(message) {

  return message;
}

function getThreadById(id) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader('application/json')
  };
  return fetch(`${apiUrl}/email-response/${id}/thread`, requestOptions).then(handleResponse);
}

function replyEmail(email, image) {
  let formData = new FormData();
  formData.append('image', image);
  formData.append('email', JSON.stringify(email));

  const requestOptions = {
    method: 'POST',
    headers: authHeader(null),
    body: formData
  };

  // const requestOptions = {
  //     method: 'POST',
  //     headers: authHeader('application/json'),
  //     body: JSON.stringify(email)
  // };

  return fetch(`${apiUrl}/email-sent/`, requestOptions).then(handleResponse);
}

function sendTestEmail(campaign, testBusinessContactSelected) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader('application/json'),
    body: JSON.stringify({ campaign: campaign, testBusinessContactSelected: testBusinessContactSelected })
  };

  return fetch(`${apiUrl}/email-sent/test`, requestOptions).then(handleResponse);
}

function associateOpportunity(id, oppotunity) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader('application/json'),
    body: JSON.stringify(oppotunity)
  };

  return fetch(`${apiUrl}/email-response/${id}/associateOpportunity`, requestOptions).then(handleResponse);
}

function associateBusinessContact(id, business_contact) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader('application/json'),
    body: JSON.stringify(business_contact)
  };

  return fetch(`${apiUrl}/email-response/${id}/associateBusinessContact`, requestOptions).then(handleResponse);
}

function setValidStatus(id, status_id, message) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader('application/json'),
    body: JSON.stringify({
      email_response_status_id: status_id,
      message: message,
    })
  };

  return fetch(`${apiUrl}/email-response/${id}/status`, requestOptions).then(handleResponse);
}

function createOpportunity(id) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader('application/json'),
  };
  return fetch(`${apiUrl}/email-response/${id}/create-opportunity`, requestOptions).then(handleResponse);
}

function updateTemplate(data) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader('application/json'),
    body: JSON.stringify({
      data
    })
  };
  return fetch(`${apiUrl}/email-template/`, requestOptions).then(handleResponse);
}

function getAllTemplates(data) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader('application/json'),
    body: JSON.stringify({
      data
    })
  };
  return fetch(`${apiUrl}/email-template/filtered-list`, requestOptions).then(handleResponse);
}

function getTemplate(id) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader('application/json'),
  };
  return fetch(`${apiUrl}/email-template/${id}`, requestOptions).then(handleResponse);
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