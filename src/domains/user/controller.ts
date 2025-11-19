import ApiResponse from '@/utilities/server/response';
import * as userService from './service';
import { authenticate } from '../auth/service';

export const show = async (req: Request) => {
  const userId = (req as any).user.id;

  const data = await userService.findById(userId);
  if (!data) {
    return ApiResponse.error(404, 'User not found');
  }

  return ApiResponse.success(
    'Successfully get user profile!',
    data.toJSON(),
  );
};

export const update = async (req: Request) => {
  const payload = (req as any).validated;
  const userId = (req as any).user.id;

  const data = await userService.findById(userId);
  if (!data) {
    return ApiResponse.error(404, 'User not found');
  }

  const updated = await userService.update(data, payload);

  const token = await authenticate(updated);

  return ApiResponse.success(
    'Successfully updated user profile!',
    { token, user: updated.toJSON(), }
  );
};

/**
 * Admin Actions
 */
export const adminList = async (req: Request) => {
  const { page, limit } = (req as any).validated;

  const { data, pagination } = await userService
    .fetchPaginated({ page, limit });

  return ApiResponse.success(
    'Successfully get accounts!',
    data,
    pagination,
  );
}

export const adminUpdate = async (req: Request) => {
  const payload = (req as any).validated;
  const username = (req as any).validated['username'];

  const data = await userService.findByUsername(username);
  if (!data) {
    return ApiResponse.error(404, 'Account not found');
  }

  payload.verified_at = payload.verified ? new Date() : null;
  if (payload.verified !== undefined) delete payload.verified;

  const updated = await userService.update(data, payload);

  return ApiResponse.success(
    'Successfully updated user account!',
    updated.toJSON(),
  );
}
