import m from 'mithril';
import Auth from '../models/Auth';
import Shares from '../models/Shares';

var userBrowser = browser;

const Background = {
  initAuthorization: () => {
    Auth.getToken().then((result) => {
      // Set the auth token to be used elsewhere
      // TODO: background and app files dont share states
      Auth.token = result.authToken;

      // Get urls/friend requests/
      console.log('bout to fetch shares');
      Shares.fetchShares();
      console.log('got the shares brody');

      // Setup browser button
      userBrowser.browserAction.setBadgeBackgroundColor({ color: '#ED2939' });
      userBrowser.browserAction.setBadgeText({ text: '10' });

      // Add listeners to communicate between background script and popup
      // browser.runtime.sendMessage({ greeting: 'hello dudes' }, function (response) { console.log('response: ', response); }); // eslint-disable-line
      userBrowser.runtime.onConnect.addListener(function(port) { // eslint-disable-line
        console.log('Connected .....');
        port.onMessage.addListener(function(msg) { // eslint-disable-line
          console.log('message recieved: ', msg);
          port.postMessage({ authToken: Auth.token });
        });
      });
    }).catch(error => console.log('error retrieving token: ', error));
  },
  oninit: function () { // eslint-disable-line
    // See if the user is already logged in
    Background.initAuthorization();
  },
  view: function () { // eslint-disable-line
    return m('div', 'background stuff');
  },
};

m.mount(document.body, Background);
