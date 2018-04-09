import m from 'mithril';
import Auth from '../models/Auth';

const Login = {
  view: () => m('div', [
    m("div[id='overlay'"),
    m('.loginbox', [
      m('h1', 'Sign in'),
      m('br'),
      m('form', [
        m('input', {
          type: 'text',
          placeholder:
          'Username',
          oninput: m.withAttr('value', Auth.setUsername),
          value: Auth.username,
        }),
        m('br'),
        m('input', {
          type: 'password',
          placeholder: 'Password',
          oninput: m.withAttr('value', Auth.setPassword),
          value: Auth.password,
        }),
        m('button', { disabled: !Auth.canSubmit(), onclick: Auth.login }, 'LOGIN'),
      ]),
      m("span[id='text-account']", 'By invitation only. Please email invite@suhdood.com'),
    ]),
  ]),
};

const LoggedIn = {
  view: () => m('div', [
    m("div[id='overlay'"),
    m('.loginbox', [
      m('h1', 'Sign in'),
      m('br'),
      m("span[id='text-account']", 'You are now logged in.'),
    ]),
  ]),
};

export { Login, LoggedIn };
