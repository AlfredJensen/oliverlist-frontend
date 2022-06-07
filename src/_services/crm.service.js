import { authHeader } from '@/_helpers';

export const crmService = {
  authorize,
  getConfig,
  getConfigByCampaign,
  getCustomFields,
  getCustomFieldsValues,
  setCustomFields,
  getPipelines,
  getStages,
  deactivate,
  getContactSent,
  getUsers
};

const apiUrl = process.env.VUE_APP_ROOT_API;

function authorize(code, crm_config_type_id) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader('application/json'),
    body: JSON.stringify({ code, crm_config_type_id })
  };
  return fetch(`${apiUrl}/crm/authorize`, requestOptions)
    .then(handleResponse);
}

function getConfig(campaign_id) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader('application/json'),
    body: JSON.stringify({ campaign_id })
  };
  return fetch(`${apiUrl}/crm/get-config`, requestOptions)
    .then(handleResponse);
}


function getContactSent() {
  const requestOptions = {
    method: 'POST',
    headers: authHeader('application/json'),
    body: JSON.stringify({})
  };
  return fetch(`${apiUrl}/crm/contactssent`, requestOptions)
    .then(handleResponse);
}

function getConfigByCampaign(campaign_id) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader('application/json'),
    body: JSON.stringify({ campaign_id })
  };
  return fetch(`${apiUrl}/crm/get-account`, requestOptions)
    .then(handleResponse);
}

function getCustomFields() {
  const requestOptions = {
    method: 'POST',
    headers: authHeader('application/json'),
     body: JSON.stringify({})
  };
  return fetch(`${apiUrl}/crm/get-customfields`, requestOptions).then(handleResponse);
}

function getCustomFieldsValues() {
  const requestOptions = {
    method: 'POST',
    headers: authHeader('application/json'),
     body: JSON.stringify({})
  };
  return fetch(`${apiUrl}/crm/get-customfieldsvalues`, requestOptions).then(handleResponse);
}

function setCustomFields(custom_fields) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader('application/json'),
     body: JSON.stringify({custom_fields})
  };
  return fetch(`${apiUrl}/crm/set-customfields`, requestOptions)
    .then(handleResponse);
}

function getPipelines(campaign_id) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader('application/json'),
    body: JSON.stringify({ campaign_id })
  };
  return fetch(`${apiUrl}/crm/get-pipelines`, requestOptions)
    .then(handleResponse);
}

function getStages(campaign_id, pipeline_id) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader('application/json'),
    body: JSON.stringify({ campaign_id, pipeline_id })
  };
  return fetch(`${apiUrl}/crm/get-stages`, requestOptions)
    .then(handleResponse);
}

function deactivate() {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader('application/json'),
  };
  return fetch(`${apiUrl}/crm/`, requestOptions)
    .then(handleResponse);
}

function getUsers() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader('application/json'),
  };
  return fetch(`${apiUrl}/crm/users`, requestOptions)
    .then(handleResponse);
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