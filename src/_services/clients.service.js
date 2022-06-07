import { authHeader } from '@/_helpers';
export const clientsService = {
  getAll,
  getBilling,
  modifyCredit,
  modifyTrial,
  create,
  verifyHash,
  getUserTeam,
  setParameters,
  getPriceMeeting,
  setAgency,
  getAgency,
  getProposalAgency,
  searchAgencies,
  searchAgenciesTotal
};

const apiUrl = process.env.VUE_APP_ROOT_API;

function getAll() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader('application/json')
  };
  return fetch(`${apiUrl}/clients/`, requestOptions).then(handleResponse);
}

function getPriceMeeting() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader('application/json')
  };
  return fetch(`${apiUrl}/clients/price-meeting`, requestOptions).then(handleResponse);
}

function getBilling(date, type) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader('application/json')
  };
  return fetch(`${apiUrl}/billings/?dateRange=${date}&type=${type}`, requestOptions).then(handleResponse);
}

function getUserTeam(user_id) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader('application/json')
  };

  return fetch(`${apiUrl}/clients/all-users-team/${user_id}`, requestOptions).then(handleResponse);

}

function create(company, website) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader('application/json'),
    body: JSON.stringify({ company, website })
  };

  return fetch(`${apiUrl}/clients/create`, requestOptions)
    .then(handleResponse);
}

function setParameters(salaries, categories_allowed, how_they_know_us, looking_for) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader('application/json'),
    body: JSON.stringify({ salaries, categories_allowed, how_they_know_us, looking_for })
  };

  return fetch(`${apiUrl}/clients/parameters`, requestOptions)
    .then(handleResponse);
}

function modifyCredit(id, amount) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader('application/json'),
    body: JSON.stringify({ id, amount })
  };

  return fetch(`${apiUrl}/clients/modify-credit`, requestOptions)
    .then(handleResponse);
}

function modifyTrial(data) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader('application/json'),
    body: JSON.stringify({data})
  };

  return fetch(`${apiUrl}/clients/modify-trial`, requestOptions)
    .then(handleResponse);
}

function verifyHash(hash) {

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hash })
  };

  return fetch(`${apiUrl}/clients/verify-hash`, requestOptions).then(handleResponse);
}

function setAgency(model) {

  const requestOptions = {
    method: 'POST',
    headers: authHeader('application/json'),
    body: JSON.stringify({ model })
  };

  return fetch(`${apiUrl}/clients/agency`, requestOptions).then(handleResponse);
}

function getAgency(clientId) {

  const requestOptions = {
    method: 'GET',
    headers: authHeader('application/json'),
  };

  return fetch(`${apiUrl}/clients/agency/${clientId}`, requestOptions).then(handleResponse);
}

function getProposalAgency(clientHash) {

  const requestOptions = {
    method: 'GET',
    headers: authHeader('application/json'),
  };

  return fetch(`${apiUrl}/clients/proposal/agency/${clientHash}`, requestOptions).then(handleResponse);
}

function searchAgencies(model) {
  model.total = 0
  let searchFilter = getDefault(model)
  const requestOptions = {
    method: 'POST',
    headers: authHeader('application/json'),
    body: JSON.stringify({ searchFilter }),
  };

  return fetch(`${apiUrl}/clients/get-agencies`, requestOptions).then(handleResponse);
}

function searchAgenciesTotal(model) {
  model.total = 1
  let searchFilter = getDefault(model)
  const requestOptions = {
    method: 'POST',
    headers: authHeader('application/json'),
    body: JSON.stringify({ searchFilter }),
  };

  return fetch(`${apiUrl}/clients/get-agencies`, requestOptions).then(handleResponse);
}

function getDefault(model) {
  let searchFilter = Array()
  searchFilter =
  {
    'currentPage': (model.currentPage !== undefined) ? JSON.stringify(model.currentPage) : undefined,
    'cantPerPage': (model.cantPerPage !== undefined) ? JSON.stringify(model.cantPerPage) : undefined,
    'total': (model.total !== undefined) ? JSON.stringify(model.total) : undefined,
    'clientStatusId':(model.clientStatusId !== undefined) ? JSON.stringify(model.clientStatusId) : undefined,
  }
  return searchFilter
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