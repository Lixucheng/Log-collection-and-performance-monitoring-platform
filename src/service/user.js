import fetch from 'helpers/fetch';
import cookie from 'js-cookie';

export function login(user) {
  return fetch(`/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user),
  });
}

export function logout(name) {
  return fetch(`/api/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name
    }),
  });
}


class User {
  constructor() {
    this._user = null;
  }
  get User() {
    if (!this._user) {
      this._user = cookie.get('lp-platform') && JSON.parse(cookie.get('lp-platform'));
    }
    return this._user;
  }
  set User(user) {
    this._user = user;
  }
  async login(user) {
    const ret = await login(user);
    if (ret === 1) {
      this.User = user;
    }
    return ret;
  }
  async logout(name) {
    const ret = await logout(name);
    if (ret === 1) {
      this.User = null;
    }
  }
}
const user = new User();
window.user = user;
export default user;
