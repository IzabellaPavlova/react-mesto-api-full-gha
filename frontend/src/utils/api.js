class Api {
  constructor( {baseUrl, headers} ) {
    this._baseUrl = baseUrl;
    this._headers = headers;
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
      headers: this._headers,
    }).then(this._checkResponse);
  }

  updateUserInfo(body) {
    const requestUrl = this._baseUrl + '/users/me';
    return fetch(requestUrl, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify(body),
    }).then(this._checkResponse);
  }

  getInitialCards() {
    const requestUrl = this._baseUrl + '/cards';
    return fetch(requestUrl, {
      headers: this._headers,
    }).then(this._checkResponse);
  }

  addNewCard(card) {
    const requestUrl = this._baseUrl + '/cards';
    return fetch(requestUrl, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify(card),
    }).then(this._checkResponse);
  }

  removeCard(cardId) {
    const requestUrl = this._baseUrl + `/cards/${cardId}`;
    return fetch(requestUrl, {
      method: 'DELETE',
      headers: this._headers,
    }).then(this._checkResponse);
  }

  addCardLike(cardId) {
    const requestUrl = this._baseUrl + `/cards/${cardId}/likes`;
    return fetch(requestUrl, {
      method: 'PUT',
      headers: this._headers,
    }).then(this._checkResponse);
  }

  removeCardLike(cardId) {
    const requestUrl = this._baseUrl + `/cards/${cardId}/likes`;
    return fetch(requestUrl, {
      method: 'DELETE',
      headers: this._headers,
    }).then(this._checkResponse);
  }

  updateProfileAvatar(avatarLink) {
    const requestUrl = this._baseUrl + '/users/me/avatar';
    return fetch(requestUrl, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify(avatarLink),
    }).then(this._checkResponse);
  }
}

const api = new Api({
  baseUrl: 'https://api.feierabend.nomoreparties.co',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api;
