const { BASE_URL } = require('./constants');

class Api {
  constructor( {baseUrl} ) {
    this._baseUrl = baseUrl;
  }

  _getHeaders() {
    return {
      'authorization': `Bearer ${localStorage.getItem('jwt')}`,
      'Content-Type': 'application/json'
    };
  }

  _checkResponse(result) {
    if (result.ok) {
      return result.json();
    }
    else {
      return Promise.reject(`${result.status} Error: ${result.statusText}`);
    }
  }

  getUserInfo() {
    const requestUrl = this._baseUrl + '/users/me';
    return fetch(requestUrl, {
      headers: this._getHeaders(),
    }).then(this._checkResponse);
  }

  updateUserInfo(body) {
    const requestUrl = this._baseUrl + '/users/me';
    return fetch(requestUrl, {
      method: 'PATCH',
      headers: this._getHeaders(),
      body: JSON.stringify(body),
    }).then(this._checkResponse);
  }

  getInitialCards() {
    const requestUrl = this._baseUrl + '/cards';
    return fetch(requestUrl, {
      headers: this._getHeaders(),
    }).then(this._checkResponse);
  }

  addNewCard(card) {
    const requestUrl = this._baseUrl + '/cards';
    return fetch(requestUrl, {
      method: 'POST',
      headers: this._getHeaders(),
      body: JSON.stringify(card),
    }).then(this._checkResponse);
  }

  removeCard(cardId) {
    const requestUrl = this._baseUrl + `/cards/${cardId}`;
    return fetch(requestUrl, {
      method: 'DELETE',
      headers: this._getHeaders(),
    }).then(this._checkResponse);
  }

  addCardLike(cardId) {
    const requestUrl = this._baseUrl + `/cards/${cardId}/likes`;
    return fetch(requestUrl, {
      method: 'PUT',
      headers: this._getHeaders(),
    }).then(this._checkResponse);
  }

  removeCardLike(cardId) {
    const requestUrl = this._baseUrl + `/cards/${cardId}/likes`;
    return fetch(requestUrl, {
      method: 'DELETE',
      headers: this._getHeaders(),
    }).then(this._checkResponse);
  }

  updateProfileAvatar(avatarLink) {
    const requestUrl = this._baseUrl + '/users/me/avatar';
    return fetch(requestUrl, {
      method: 'PATCH',
      headers: this._getHeaders(),
      body: JSON.stringify(avatarLink),
    }).then(this._checkResponse);
  }
}

const api = new Api({ baseUrl: BASE_URL })

export default api;
