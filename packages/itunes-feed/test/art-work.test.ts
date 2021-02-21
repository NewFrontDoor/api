import test, {ExecutionContext} from 'ava';
import serve, {TestServer} from './__helper__/_serve-static-file';
import isArtwork from '../src/is-artwork';

let server: TestServer;

test.after(async () => {
  await server.close();
});

async function testArtwork(
  t: ExecutionContext,
  input: string,
  expected: any
): Promise<void> {
  server = await serve(input);
  const result = await isArtwork(server.artworkUrl);
  t.is(result, expected);
}

test('1000.png artwork', testArtwork, '1000.png', false);
test('1400.jpg artwork', testArtwork, '1400.jpg', true);
test('1400.png artwork', testArtwork, '1400.png', true);
test('3000.png artwork', testArtwork, '3000.png', true);
test('3500.png artwork', testArtwork, '3500.png', false);
test('test.txt artwork', testArtwork, 'test.txt', false);
