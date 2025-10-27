import ApiResponse from './response';
// import logger from './logger';

type Middleware = (
  req: Request,
  next: () => Promise<Response>
) => Promise<Response>

type FinalHandler = (req: Request, { params }: any) => Promise<Response>

/**
 * Middleware composer.
 * 
 * - Stacks middlewares
 * - Wraps them within error-response as fail-safe mechanism
 * 
 * @param middlewares 
 * @returns 
 */
export default function compose(...middlewares: Middleware[]) {
  return function (finalHandler: FinalHandler) {
    return async function handler(req: Request, { params }: any) {
      (req as any).params = await params;
      let index = -1;

      const dispatch = async (i: number): Promise<Response> => {
        if (i <= index) throw new Error('next() called multiple times');
        index = i;
        const fn = i === middlewares.length ? finalHandler : middlewares[i];

        return await fn(req, () => dispatch(i + 1));
      };

      try {
        return await dispatch(0);
      } catch (error) {
        console.error('Unhandled error:', error);
        return ApiResponse.error(500, 'Internal server error');
      }
    }
  }
}
