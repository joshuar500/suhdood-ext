import m from 'mithril';
import request from '../api/request';
import { common } from '../api/apiConfig';

var userBrowser = browser;

const Auth = {
  username: '',
  password: '',
  token: '',
  setUsername: (value) => {
    Auth.username = value;
  },
  setPassword: (value) => {
    Auth.password = value;
  },
  setToken: (value) => {
    userBrowser.storage.local.set({ authToken: value });
    Auth.token = value;
  },
  getToken: () => {
    const storedToken = userBrowser.storage.local.get(['authToken']);
    // return this promise
    return storedToken;
  },
  canSubmit: () => Auth.username !== '' && Auth.password !== '',
  login: () => {
    const loginApi = common.api.suhdood.authentication.login;
    const payload = {
      username: Auth.username,
      password: Auth.password,
    }
    request( loginApi, payload ).then((result) => {
      // store the token
      Auth.setToken(result.token);
      // reset the password
      Auth.password = '';
      m.route.set('/loggedin');
    });
    return null;
  },
};

export default Auth;
