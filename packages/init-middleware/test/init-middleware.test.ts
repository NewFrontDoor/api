import test from 'ava';
import * as sinon from 'sinon';
import type {NextApiRequest, NextApiResponse} from 'next';
import initMiddleware, {NextFunction} from '../src';

test.afterEach(() => {
  sinon.restore();
});

test('it resolves after calling the middleware function', async (t) => {
  const jsonFake = sinon.fake();
  const fakeRequest: Partial<NextApiRequest> = {};
  const fakeResponse: Partial<NextApiResponse> = {
    json: jsonFake
  };

  function fakeMiddleware(
    _request: NextApiRequest,
    response: NextApiResponse,
    next: NextFunction
  ) {
    response.json({some: 'json'});
    next();
  }

  const middleware = initMiddleware(fakeMiddleware);

  await middleware(
    fakeRequest as NextApiRequest,
    fakeResponse as NextApiResponse
  );

  t.true(jsonFake.calledWith({some: 'json'}));
});

test('it rejects with an error if the middleware function fails', async (t) => {
  const jsonFake = sinon.fake();
  const fakeRequest: Partial<NextApiRequest> = {};
  const fakeResponse: Partial<NextApiResponse> = {
    json: jsonFake
  };

  function fakeMiddleware(
    _request: NextApiRequest,
    _response: NextApiResponse,
    next: NextFunction
  ) {
    next(new Error('ohno..'));
  }

  const middleware = initMiddleware(fakeMiddleware);

  await t.throwsAsync(
    middleware(fakeRequest as NextApiRequest, fakeResponse as NextApiResponse),
    {
      message: 'ohno..'
    }
  );
});
