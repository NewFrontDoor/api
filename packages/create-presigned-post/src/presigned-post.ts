import assert from 'assert';
import type {NextApiRequest, NextApiResponse} from 'next';
import S3 from 'aws-sdk/clients/s3';
import mime from 'mime';
import path from 'path';
import slugify from '@sindresorhus/slugify';
import cryptoRandomString from 'crypto-random-string';
import type {AsyncRequestHandler} from '@newfrontdoor/init-middleware';

type CreatePresignedPostOptions = {
  fileNameKey?: string;
  mimeTypeKey?: string;
  bucket: string;
  s3Client?: S3;
  s3Options?: Pick<
    S3.Types.ClientConfiguration,
    'region' | 'accessKeyId' | 'secretAccessKey'
  >;
};

function createS3Key(name: string): string {
  const key = cryptoRandomString({length: 16, type: 'url-safe'});
  const file = path.parse(name);
  const safeFile = path.format({
    name: slugify(file.name),
    ext: file.ext
  });
  return `${key}-${safeFile}`;
}

async function createPresignedPost(
  s3: S3,
  parameters: S3.PresignedPost.Params
): Promise<S3.PresignedPost> {
  return new Promise((resolve, reject) => {
    s3.createPresignedPost(parameters, (error, data) =>
      error ? reject(error) : resolve(data)
    );
  });
}

function presignedPost({
  fileNameKey = 'name',
  mimeTypeKey = 'type',
  bucket,
  ...optionsOrS3
}: CreatePresignedPostOptions): AsyncRequestHandler<
  NextApiRequest,
  NextApiResponse,
  S3.PresignedPost
> {
  let s3: S3;

  assert(bucket, 'bucket must be provided');

  if (optionsOrS3.s3Client instanceof S3) {
    s3 = optionsOrS3.s3Client;
  } else {
    const {s3Options} = optionsOrS3;
    assert(
      typeof s3Options !== 'undefined',
      'Either s3Options, or a s3Client, must be provided'
    );
    assert(s3Options.region, 'region must be provided');
    assert(s3Options.accessKeyId, 'accessKeyId must be provided');
    assert(s3Options.secretAccessKey, 'secretAccessKey must be provided');

    // Set the region according to the bucket's needs
    s3 = new S3({
      region: s3Options.region,
      credentials: {
        accessKeyId: s3Options.accessKeyId,
        secretAccessKey: s3Options.secretAccessKey
      }
    });
  }

  return async (request) => {
    const fileName = request.body[fileNameKey];
    const mimeType = request.body[mimeTypeKey];
    const key = createS3Key(fileName);
    const contentType = mimeType ? mimeType : mime.getType(fileName);

    const parameters: S3.PresignedPost.Params = {
      Expires: 60,
      Bucket: bucket,
      Conditions: [['content-length-range', 100, 100000000]], // 100Byte - 10MB
      Fields: {
        'Content-Type': contentType,
        key
      }
    };

    return createPresignedPost(s3, parameters);
  };
}

export default presignedPost;
