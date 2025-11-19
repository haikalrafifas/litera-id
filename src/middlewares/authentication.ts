import ApiResponse from '@/utilities/server/response';
import JWTAuth from '@/utilities/server/jwt';

const unauthorized = () => {
  return ApiResponse.error(401, 'Unauthorized');
}

const expired = () => {
  return ApiResponse.error(401, 'Token expired or invalid');
};

export async function accessToken(req: Request, next: () => Promise<Response>) {
  const authHeader = req.headers.get('authorization')

  const tokenAbsent = !authHeader || !authHeader.startsWith('Bearer ');
  if (tokenAbsent) return unauthorized();

  const token = authHeader.split(' ')[1]
  if (!token) return unauthorized();

  // --- Verify token ---
  try {
    const decoded = await JWTAuth.access.verify(token);
    if (!decoded) return expired();

    (req as any).user = decoded;

    return next();
  } catch {
    return ApiResponse.error(401, 'Unauthorized');
  }
}

export async function optionalAccessToken(req: Request, next: () => Promise<Response>) {
  const authHeader = req.headers.get('authorization')

  const tokenAbsent = !authHeader || !authHeader.startsWith('Bearer ');
  if (tokenAbsent) return next();

  const token = authHeader.split(' ')[1]
  if (!token) return next();

  // --- Verify token ---
  try {
    const decoded = await JWTAuth.access.verify(token);
    if (!decoded) return next();

    (req as any).user = decoded;

    return next();
  } catch {
    return next();
  }
}

export async function refreshToken() {}

export async function verificationToken() {}
