import test from 'ava';
import * as sinon from 'sinon';
import S3 from 'aws-sdk/clients/s3';
import type {NextApiRequest, NextApiResponse} from 'next';
import {presignedPost} from '../src';

test.afterEach(() => {
  sinon.restore();
});

type CreatePresignedPostCallback = (
  err: Error | null,
  data: S3.PresignedPost
) => void;

const fakePresignedPost = {
  url: 'https://s3.ap-southeast-2.amazonaws.com/sermons.somechurch.org',
  fields: {
    'Content-Type': 'audio/mpeg',
    Policy: 'someVeryLongPolicyString==',
    'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
    'X-Amz-Credential':
      'some-credential/20201129/ap-southeast-2/s3/aws4_request',
    'X-Amz-Date': '20201129T082601Z',
    'X-Amz-Signature': 'some-long-signature',
    bucket: 'sermons.somechurch.org',
    key: 'some-fancy-key_some-file-name.mp3'
  }
};

test('it calls s3.createPresignedPost()', async (t) => {
  const s3Client = new S3();
  const createPresignedPostFake = sinon.fake(
    (
      _parameters: S3.PresignedPost.Params,
      callback: CreatePresignedPostCallback
    ): void => {
      callback(null, fakePresignedPost);
    }
  );

  sinon
    .stub(s3Client, 'createPresignedPost')
    .callsFake(createPresignedPostFake);
  const fakeRequest: Partial<NextApiRequest> = {
    body: {
      name: 'some file name.mp3'
    }
  };
  const fakeResponse: Partial<NextApiResponse> = {};

  const createPresignedPost = presignedPost({
    bucket: 'some-bucket',
    s3Client
  });

  const result = await createPresignedPost(
    fakeRequest as NextApiRequest,
    fakeResponse as NextApiResponse
  );

  const [parameters] = createPresignedPostFake.getCall(0).args;

  t.is(parameters.Expires, 60);
  t.is(parameters.Bucket, 'some-bucket');
  t.deepEqual(parameters.Conditions, [
    ['content-length-range', 100, 100000000]
  ]);
  t.is(parameters.Fields['Content-Type'], 'audio/mpeg');
  t.regex(parameters.Fields.key, /some-file-name\.mp3/);

  t.deepEqual(result, fakePresignedPost);
});

test('it requires s3 options', (t) => {
  t.throws(
    () => {
      presignedPost({
        bucket: 'some-bucket',
        s3Options: {}
      });
    },
    {
      message: 'region must be provided'
    }
  );

  t.throws(
    () => {
      presignedPost({
        bucket: 'some-bucket',
        s3Options: {
          region: 'region'
        }
      });
    },
    {
      message: 'accessKeyId must be provided'
    }
  );

  t.throws(
    () => {
      presignedPost({
        bucket: 'some-bucket',
        s3Options: {
          region: 'region',
          accessKeyId: 'accessKeyId'
        }
      });
    },
    {
      message: 'secretAccessKey must be provided'
    }
  );

  t.notThrows(() => {
    presignedPost({
      bucket: 'some-bucket',
      s3Options: {
        region: 'region',
        accessKeyId: 'accessKeyId',
        secretAccessKey: 'secretAccessKey'
      }
    });
  });
});
