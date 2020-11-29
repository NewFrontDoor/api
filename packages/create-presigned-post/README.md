# `@newfrontdoor/api-create-presigned-post`

API for creating presigned urls when uploading objects to S3

## `presignedPost(options)`

Creates a middleware function for creating a Presigned Post.

> ⚠️Warning ⚠️
> This is not a great idea, unless you protect your API in someway

See [`accessToken(token)`](#accessTokentoken)

### Usage

```js
import {presignedPost} from '@newfrontdoor/api-create-presigned-post';

const createPresignedPost = presignedPost({
  bucket: 'your-bucket',
  s3Options: {
    region: 'your-region',
    accessKeyId: 'your-access-key-id',
    secretAccessKey: 'your-secret-access-key'
  }
});

// or bring your own S3 client
const createPresignedPost = presignedPost({
  bucket: 'your-bucket',
  s3Client: new S3(config)
});

export default async function(request, response) {
  const presignedPost = await createPresignedPost(request, response);
  response.status(200).json(presignedPost)
}
```

## `accessToken(token)`

Compares the request `authorization` header with an environment variable.

`token` is the key for the Access Token environment variable, for example

```js
accessToken('YOUR_ACCESS_TOKEN')
```
Will compare the `authorization` header against the value in

```js
process.env.YOUR_ACCESS_TOKEN
```

### Usage

```js
import {accessToken} from '@newfrontdoor/api-create-presigned-post';

const requireAccesToken = accessToken('YOUR_ACCESS_TOKEN');

export default async function(request, response) {
  await requireAccesToken(request, response)
}
```
