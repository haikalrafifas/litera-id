import ApiResponse from '@/utilities/server/response';
import * as authService from './service';

export const login = async (req: Request) => {
  const { username, password } = (req as any).validated;
  
  const data = await authService.findAccount(username, password);
  
  if (!data) {
    return ApiResponse.error(404, 'Account not found');
  }

  if (!data.verified_at) {
    return ApiResponse.error(403, 'Account not verified');
  }

  const token = await authService.authenticate(data);

  return ApiResponse.success(
    'Successfully logged in',
    { token, user: data.toJSON() },
  );
};

export const register = async (req: Request) => {
  const payload = (req as any).validated;
  const { username } = payload;

  const existingUser = await authService.findByUsername(username);

  if (existingUser) {
    return ApiResponse.error(400, 'Account already exist');
  }

  const newUser = await authService.create(payload);

  return ApiResponse.success(
    'Successfully registered a new account',
    newUser.toJSON(),
  );
};
