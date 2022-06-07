import { authHeader } from '@/_helpers';

export const pipedriveService = {
  sendPipedrive  
};

const apiUrl = process.env.VUE_APP_ROOT_API;


function sendPipedrive(user_id, code) {

  const requestOptions = {
    method: 'POST',
    headers: authHeader('application/json'),
    body: JSON.stringify({ user_id, code })
  };
  return fetch(`${apiUrl}/pipedrive/add-person`, requestOptions)
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