import m from 'mithril';
import Shares from '../models/Shares';
import Auth from '../models/Auth';
import { Login, LoggedIn } from '../components/Login';

const port = browser.runtime.connect({ name: 'NextSharePort' });

const App = {
  // get token and user data (urls, friend requests, etc)
  oninit () {
    // get the data from the background script
    port.postMessage('Hi BackGround');
    port.onMessage.addListener(function(msg) {
      Auth.token = msg.authToken;
      if (Auth.token) m.redraw();
      console.log('Auth.token', Auth.token);
    });
  },
  view (vnode) {
    return Auth.token ?
      m("div[id='Next'", [
        // TODO: doing pop for now, will need to implement queue
        m('button', { onclick: () => { console.log('Shares.urls: ', Shares.urls); browser.tabs.update({ url: Shares.urls.pop }); } }, ['Next URL']),
      ]) :
      m("div[id='Login'", [
        m('button', { onclick: () => browser.tabs.create({ url: '#!/login' }) }, ['Login']),
      ]);
  },
};

// m.render('suh-login', m(Login));
// m.render(document.body, m(App));
m.route(document.body, '', {
  '': App,
  '/login': Login,
  '/loggedin': LoggedIn,
});
