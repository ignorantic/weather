/**
 * ajax.js
 * Created by Andrii Sorokin on 08/19/17
 * https://github.com/ignorantic/quotes.git
 */

let ajax = {};

function error (e) {
    return {
        error: e
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

ajax.get = function(url, parameters) {
    let paramString = '';
    for (let key in parameters) {
        if (Object.prototype.hasOwnProperty.call(parameters, key)) {
            if (paramString !== '') {
                paramString += '&';
            }
            paramString += `${key}=${parameters[key]}`;
        }
    }
    return fetch(url + paramString)
        .then(status)
        .then(json)
        .catch(error);
};

ajax.post = function(url, headers, body) {

    return fetch(url, {
        headers: headers,
        method: 'POST',
        mode: mode,
        body: JSON.stringify(body)
    })
    .then(status)
    .then(json)
    .catch(error);
};

export default ajax;