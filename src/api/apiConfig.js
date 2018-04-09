import loginNormalizer from './normalizers/payloads/loginNormalizer';

const config = {
  common: {
    servicePaths: {
      api: {
        dev: 'http://localhost:5050',
        staging: '',
        prod: ''
      }
    }
  }
}

const GET = 'GET';
const PUT = 'PUT';
const POST = 'POST';
const DELETE = 'DELETE';

function getBaseHeaders() {
  return {
    Accept: 'application/json',
    Authorization: '{AUTH_TOKEN}',
    'Content-Type': 'application/json; charset=UTF-8',
  };
}

const common = {
  api: {
    suhdood: {
      authentication: {
        login: {
          method: POST,
          basePath: config.common.servicePaths.api.dev, // TODO: Change to use current environment
          path: '/login',
          interceptors: {
            payload: loginNormalizer,
          },
          headers: {
            ...getBaseHeaders(),
          },
        }
      },
      shares: {
        shares: {
          method: GET,
          basePath: config.common.servicePaths.api.dev, // TODO: Change to use current environment
          path: '/shares',
          interceptors: {
            response: null,
          },
          headers: {
            ...getBaseHeaders(),
          },
        }
      }
    }
  }
}

export { common };