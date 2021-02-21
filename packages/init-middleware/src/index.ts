import assert from 'assert';
import {IncomingMessage, ServerResponse} from 'http';

export type NextFunction = (error?: Error) => void;

export type RequestHandler<
  Request extends IncomingMessage = IncomingMessage,
  Response extends ServerResponse = ServerResponse
> = (request: Request, response: Response, next: NextFunction) => void;

export type AsyncRequestHandler<
  Request extends IncomingMessage = IncomingMessage,
  Response extends ServerResponse = ServerResponse,
  T = void
> = (request: Request, response: Response) => Promise<T>;

function initMiddleware<
  Request extends IncomingMessage = IncomingMessage,
  Response extends ServerResponse = ServerResponse
>(
  middleware: RequestHandler<Request, Response>
): AsyncRequestHandler<Request, Response> {
  return async (request, response) => {
    const middlewareName: string = middleware.name ?? 'middleware';
    assert(request, `request object must be provided to ${middlewareName}`);
    assert(response, `response object must be provided to ${middlewareName}`);
    return new Promise((resolve, reject) => {
      middleware(request, response, (result) => {
        if (result instanceof Error) {
          reject(result);
        } else {
          resolve();
        }
      });
    });
  };
}

export default initMiddleware;
