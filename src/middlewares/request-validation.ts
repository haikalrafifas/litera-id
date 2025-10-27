import { z } from 'zod'
import ApiResponse from '@/utilities/server/response';

type RequestLocation = 'body' | 'query' | 'param';
interface ValidationOption {
  body?: z.ZodObject;
  query?: z.ZodObject;
  param?: z.ZodObject;
  optional?: RequestLocation | RequestLocation[] | '*';
}

type ValidationIssue = {
  expected?: string;
  code: string;
  path: (string | number)[];
  message: string;
};

type ValidationResponse = {
  [key: string]: string[];
};

function makeSchemaOptional<T extends z.ZodObject<any>> (schema: T) {
  return schema.partial();
}

function validationFailed(error: z.ZodError<Record<string, unknown>>) {
  const errorParsed = mapValidationErrors(JSON.parse(error.message));
  return ApiResponse.error(400, 'Validation failed', errorParsed);
}

/**
 * Converts an array of validation issues (e.g. from Zod) into
 * a Laravel-style validation error map.
 *
 * Example:
 * [
 *   { path: ['email'], message: 'Invalid email' },
 *   { path: ['password'], message: 'Too short' }
 * ]
 * ->
 * { email: ['Invalid email'], password: ['Too short'] }
 */
function mapValidationErrors(
  errors: ValidationIssue[] | undefined | null
): ValidationResponse {
  const result: ValidationResponse = {};

  if (!errors) return result;

  for (const err of errors) {
    // Extract the field name (first element in path)
    const field = err.path?.[0] as string;
    if (!field) continue;

    // Add message to array for this field
    if (!result[field]) result[field] = [];
    result[field].push(err.message);
  }

  return result;
}

/**
 * HTTP Request Validation Middleware.
 * 
 * Example usage:
 * validate({ body, query, param, optional: 'query' });
 * 
 * @param option 
 * @returns 
 */
export default function validate(option: ValidationOption) {
  return async function (req: Request, next: () => Promise<Response>) {
    let body, query, param = null;

    // apply optional to all location
    if (option.optional === '*') {
      if (option.body) option.body = makeSchemaOptional(option.body);
      if (option.query) option.query = makeSchemaOptional(option.query);
      if (option.param) option.param = makeSchemaOptional(option.param);
    }

    body = {
      ...req.body,
      ...(req as any).parsed?.text,
      ...(req as any).parsed?.file,
    };
    if (body && option.body) {
      if (option.optional === 'body') {
        option.body = makeSchemaOptional(option.body);
      }
      body = option.body.safeParse(body);

      if (!body.success) return validationFailed(body.error);
    }

    param = {
      ...(req as any).params,
    };
    if (param && option.param) {
      if (option.optional === 'param') {
        option.param = makeSchemaOptional(option.param);
      }
      param = option.param.safeParse(param);

      if (!param.success) return validationFailed(param.error);
    }

    query = Object.fromEntries(new URL(req.url).searchParams.entries());
    if (query && option.query) {
      if (option.optional === 'query') {
        option.query = makeSchemaOptional(option.query);
      }
      query = option.query.safeParse(query);

      if (!query.success) return validationFailed(query.error);
    }

    (req as any).validated = {
      ...body.data,
      ...param.data,
      ...query.data as object,
    };

    return next();
  }
}
