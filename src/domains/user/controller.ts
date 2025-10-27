import ApiResponse from '@/utilities/server/response';
import * as userService from './service';

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

  return ApiResponse.success(
    'Successfully updated user profile!',
    updated.toJSON(),
  );
};
