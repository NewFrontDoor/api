import type {AsyncRequestHandler} from '@newfrontdoor/init-middleware';

function requireAccessToken(accessToken: string): AsyncRequestHandler {
  return async (request, response) => {
    return new Promise((resolve) => {
      let token = '';

      if (typeof accessToken === 'string') {
        token = process.env[accessToken] ?? accessToken;
      }

      const canAccess = request.headers.authorization === token;

      if (canAccess) {
        resolve();
      } else {
        response.statusCode = 403;
        response.end();
      }
    });
  };
}

export default requireAccessToken;
