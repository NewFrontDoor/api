import test from 'ava';
import {IncomingMessage, ServerResponse} from 'http';
import * as sinon from 'sinon';
import {accessToken} from '../src';

test.afterEach(() => {
  sinon.restore();
});

test('it requires the access token to be provided by the authorization header', async (t) => {
  process.env.SOME_ACCESS_TOKEN = 'some-token';
  const endFake = sinon.fake();
  const fakeRequest: Partial<IncomingMessage> = {
    headers: {
      authorization: 'some-token'
    }
  };
  const fakeResponse: Partial<ServerResponse> = {
    end: endFake
  };

  const requireAccesToken = accessToken('SOME_ACCESS_TOKEN');

  await requireAccesToken(
    fakeRequest as IncomingMessage,
    fakeResponse as ServerResponse
  );

  t.true(endFake.notCalled);
});

test('it ends the response if the access token does not match', (t) => {
  process.env.SOME_ACCESS_TOKEN = 'not-a-token';
  const endFake = sinon.fake();
  const fakeRequest: Partial<IncomingMessage> = {
    headers: {
      authorization: 'some-token'
    }
  };
  const fakeResponse: Partial<ServerResponse> = {
    end: endFake
  };

  const requireAccesToken = accessToken('SOME_ACCESS_TOKEN');

  void requireAccesToken(
    fakeRequest as IncomingMessage,
    fakeResponse as ServerResponse
  );

  t.true(endFake.calledOnce);
  t.is(fakeResponse.statusCode, 403);
});
