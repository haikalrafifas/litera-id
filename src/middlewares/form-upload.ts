import ApiResponse from '@/utilities/server/response';

// Define types for the request object to ensure proper typing in Next.js API routes
export interface ParsedBody {
  [key: string]: string | string[];
}

export interface ParsedFiles {
  [key: string]: File | File[];
}

const usingUpload = (req: Request, type: string): boolean => {
  return (
    ['POST', 'PUT', 'PATCH'].includes(req.method)
    && req.headers.get('content-type')?.includes(type)
  ) || false;
};

// Create a helper function to parse multipart form data
export default function parseFormData() {
  return async function (req: Request, next: () => Promise<Response>) {
    if (usingUpload(req, 'multipart/form-data')) {
      try {
        const formData = await req.formData();

        const fields: ParsedBody = {};
        const files: ParsedFiles = {};

        for (const [key, value] of formData.entries()) {
          if (typeof value === 'string') {
            fields[key] = fields[key]
              ? ([] as string[]).concat(fields[key] as string, value)
              : value;
          } else if (value instanceof File) {
            files[key] = files[key]
              ? ([] as File[]).concat(files[key] as File, value)
              : value;
          }
        }

        (req as any).parsed = { text: fields, file: files };

        return next();
      } catch {
        return ApiResponse.error(500, 'Error parsing form data');
      }
    } else if (usingUpload(req, 'application/json')) {
      (req as any).parsed = { text: await req.json(), file: {} };

      return next();
    }
    
    return next();
  }
};
