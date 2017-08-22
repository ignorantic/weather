/**
 * ajax.js
 * Created by Andrii Sorokin on 08/20/17
 * https://github.com/ignorantic/weather.git
 */

const ajax = {};

function error(e) {
  return {
    error: e,
  };
}

function json(response) {
  return response.json();
}

function status(response) {
  if (response.ok) {
    return response;
  }
  throw new Error(response.statusText);
}

ajax.get = (url, parameters) => {
  let paramString = '';
  Object.keys(parameters).forEach((item) => {
    if (paramString !== '') {
      paramString += '&';
    } else {
      paramString = '?';
    }
    paramString += `${item}=${parameters[item]}`;
  });
  return fetch(url + paramString)
    .then(status)
    .then(json)
    .catch(error);
};

ajax.post = (url, headers, body) =>
  fetch(url, {
    headers,
    method: 'POST',
    body: JSON.stringify(body),
  })
    .then(status)
    .then(json)
    .catch(error);


export default ajax;
