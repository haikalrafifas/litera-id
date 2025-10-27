import ApiResponse from '@/utilities/server/response';
import * as achievementService from './service';

export const index = async (req: Request) => {
  const { page, limit } = (req as any).validated;

  const { data, pagination } = await achievementService
    .fetchPaginated({ page, limit });

  return ApiResponse.success(
    'Successfully get achievements!',
    data,
    pagination,
  );
};

export const show = async (req: Request) => {
  const slug = (req as any).validated['slug'];

  const data = await achievementService.findBySlug(slug);
  if (!data) {
    return ApiResponse.error(404, 'Achievement not found');
  }

  return ApiResponse.success(
    'Successfully get achievement by slug!',
    data.toJSON(),
  );
};

export const create = async (req: Request) => {
  const payload = (req as any).validated;
  const creatorId = (req as any).user.id;
  
  const newRecord = await achievementService.create(payload, creatorId);

  return ApiResponse.success(
    'Successfully created new achievement!',
    newRecord.toJSON(),
  );
};

export const update = async (req: Request) => {
  const payload = (req as any).validated;
  const slug = payload.slug;

  const data = await achievementService.findBySlug(slug);
  if (!data) {
    return ApiResponse.error(404, 'Achievement not found');
  }

  const updated = await achievementService.update(data, payload);

  return ApiResponse.success(
    'Successfully updated achievement by slug!',
    updated.toJSON(),
  );
};

export const destroy = async (req: Request) => {
  const payload = (req as any).validated;
  const slug = payload.slug;

  const data = await achievementService.findBySlug(slug);
  if (!data) {
    return ApiResponse.error(404, 'Achievement not found');
  }

  const deleted = await achievementService.destroy(data);

  return ApiResponse.success(
    'Successfully deleted achievement by slug!',
    deleted.toJSON(),
  );
};
