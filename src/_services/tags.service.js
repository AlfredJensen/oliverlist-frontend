import { authHeader } from '@/_helpers';
export const tagsService = {
    getAll,
    getAllByClientId,
    createTag,
    removeTag,
    createLinkTag,
    removeLinkTag,
    getAllByLinkId,
    getKeyWordGroups,
    tagOpportunity
};

const apiUrl = process.env.VUE_APP_ROOT_API;

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/tags/`, requestOptions).then(handleResponse);
}

function getKeyWordGroups() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader('application/json')
    };
    return fetch(`${apiUrl}/link-tags/getkeywordgroups/`, requestOptions).then(handleResponse);
}

function getAllByClientId() {
  const requestOptions = {
      method: 'GET',
      headers: authHeader('application/json')
  };
  return fetch(`${apiUrl}/tags/client`, requestOptions).then(handleResponse);
}

function getAllByLinkId(link_id) {
  const requestOptions = {
      method: 'GET',
      headers: authHeader('application/json')
  };
  return fetch(`${apiUrl}/link-tags/data-by-link/${link_id}`, requestOptions).then(handleResponse);
}

function createTag(name, description, color) {
  const requestOptions = {
      method: 'POST',
      headers: authHeader('application/json'),
      body: JSON.stringify({ name, description, color})
  };
  return fetch(`${apiUrl}/tags/create`, requestOptions).then(handleResponse);
}
function removeTag(tag_id) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({ tag_id})
    };
    return fetch(`${apiUrl}/tags/delete`, requestOptions).then(handleResponse);
}
function tagOpportunity(wordkey_id,op_id,campaign_id,business_id,business_contact_id) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({ wordkey_id,op_id,campaign_id,business_id,business_contact_id})
    };
    return fetch(`${apiUrl}/link-tags/tagkeyword`, requestOptions).then(handleResponse);
}

function createLinkTag(link_id, tag_id) {
   const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({ link_id, tag_id})
    };
    return fetch(`${apiUrl}/link-tags/create`, requestOptions).then(handleResponse);
}

function removeLinkTag(link_id, tag_id) {//7224 "2"
console.log(link_id, tag_id)
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({ link_id, tag_id})
    };
    return fetch(`${apiUrl}/link-tags/delete`, requestOptions).then(handleResponse);
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