import {join} from 'path';
import {createReadStream} from 'fs';
import {once} from 'events';
import {promisify} from 'util';
import {createServer} from 'http';

export type TestServer = {
  artworkUrl: string;
  close(): Promise<void>;
};

async function serveStatic(file: string): Promise<TestServer> {
  const server = createServer((_, response) => {
    createReadStream(join(__dirname, '../../../static', file)).pipe(response);
  }).listen();

  await once(server, 'listening');

  const address = server.address();

  if (address && typeof address !== 'string') {
    return {
      artworkUrl: `http://localhost:${String(address.port)}/${file}`,
      close: promisify(server.close.bind(server))
    };
  }

  throw new Error('what is address even?');
}

export default serveStatic;
