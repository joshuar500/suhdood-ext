import m from 'mithril';
import Auth from '../models/Auth';

const AUTHORIZATION_HEADER = 'Authorization';

export function constructHeaders(headers, value) {
  const constructedHeader = {};
  if (headers) {
      Object.keys(headers).forEach((key) => {
        constructedHeader[key] = headers[key];
        if (key === AUTHORIZATION_HEADER) {
          constructedHeader[key] = `${Auth.token}`;
        }
    });
  }
  return constructedHeader;
}

export default function request(api, payload = {}) {
  if (api) {
    const requestConfiguration = {
      method: api.method,
      url: api.basePath + api.path,
      headers: constructHeaders(api.headers),
    };

    const responseNormalizer = api.interceptors.response;
    const payloadNormalizer = api.interceptors.payload;

    // Payload takes precedence
    // Normalize the data to be sent
    if (payloadNormalizer) {
      requestConfiguration.data = payloadNormalizer(payload);
    }
    return m.request(requestConfiguration);
  }
  return null;
}