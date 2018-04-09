import m from 'mithril';
import request from '../api/request';
import { common } from '../api/apiConfig';

const Shares = {
  urls: undefined,
  fetchShares: () => {
    const sharesApi = common.api.suhdood.shares.shares;
    request(sharesApi).then((result) => {
      // store the urls
      console.log('result: ', result);
    }).catch((error) => console.log('error fetching shares: ', error));
  },
  set concatUrls(urls) {
    this.urls.concat(urls);
  },
  get shares() {
    return this.urls;
  },
};

export default Shares;
