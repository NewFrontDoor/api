import got from 'got';
import {ValidationError} from 'yup';
import {fromBuffer} from 'file-type';
import {imageSize} from 'image-size';

const validImage = new Set(['image/png', 'image/jpeg']);

export default async function isArtwork(
  value?: string
): Promise<boolean | ValidationError> {
  if (typeof value !== 'string') {
    return false;
  }

  const file = await got(value).buffer();
  const result = await fromBuffer(file);
  const mime = result?.mime ?? '';

  if (validImage.has(mime)) {
    const {width, height} = imageSize(file);

    /* istanbul ignore else */
    if (width && height) {
      const isMinimum = height >= 1400 && width >= 1400;
      const isMaximum = height <= 3000 && width <= 3000;

      return isMinimum && isMaximum;
    }
  }

  return false;
}
