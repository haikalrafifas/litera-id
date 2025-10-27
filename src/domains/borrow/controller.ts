import ApiResponse from '@/utilities/server/response';
import * as inventoryService from './service';

export const index = async (req: Request) => {
  const { page, limit } = (req as any).validated;
  const userId = (req as any).user.id;

  const data = await inventoryService.fetchPaginated(
    { page, limit }, userId,
  );

  return ApiResponse.success(
    'Successfully get historical borrowings!',
    data,
    { page ,limit },
  );
};

export const show = async (req: Request) => {
  const uuid = (req as any).validated['uuid'];

  const data = await inventoryService.findByUuid(uuid);
  if (!data) {
    return ApiResponse.error(404, 'Data not found');
  }

  return ApiResponse.success(
    'Successfully get borrowings by uuid!',
    data.toJSON(),
  );
};

export const create = async (req: Request) => {
  const payload = (req as any).validated;
  const userId = (req as any).user.id;
  
  const newRecord = await inventoryService.create(
    payload, userId,
  );

  return ApiResponse.success(
    'Successfully created new borrowings!',
    newRecord.toJSON(),
  );
};

export const update = async (req: Request) => {
  const payload = (req as any).validated;
  const uuid = payload['uuid'];

  const data = await inventoryService.findByUuid(uuid);
  if (!data) {
    return ApiResponse.error(404, 'Data not found');
  }

  const updated = await inventoryService.update(data, payload);

  return ApiResponse.success(
    'Successfully updated borrowings by uuid!',
    updated.toJSON(),
  );
};

export const destroy = async (req: Request) => {
  const payload = (req as any).validated;
  const uuid = payload['uuid'];

  const data = await inventoryService.findByUuid(uuid);
  if (!data) {
    return ApiResponse.error(404, 'Data not found');
  }

  const deleted = await inventoryService.destroy(data);

  return ApiResponse.success(
    'Successfully deleted borrowings by uuid!',
    deleted.toJSON(),
  );
};
