import ApiResponse from '@/utilities/server/response';
import * as inventoryService from './service';

export const index = async (req: Request) => {
  const { page, limit } = (req as any).validated;

  const { data, pagination } = await inventoryService
    .fetchPaginated({ page, limit });

  return ApiResponse.success(
    'Successfully get inventories!',
    data,
    pagination,
  );
};

export const show = async (req: Request) => {
  const uuid = (req as any).validated['uuid'];

  const data = await inventoryService.findByUuid(uuid);
  if (!data) {
    return ApiResponse.error(404, 'Inventory not found');
  }

  return ApiResponse.success(
    'Successfully get inventory by uuid!',
    data.toJSON(),
  );
};

export const create = async (req: Request) => {
  const payload = (req as any).validated;
  
  const newRecord = await inventoryService.create(payload);

  return ApiResponse.success(
    'Successfully created new inventory!',
    newRecord.toJSON(),
  );
};

export const update = async (req: Request) => {
  const payload = (req as any).validated;
  const uuid = payload['uuid'];

  const data = await inventoryService.findByUuid(uuid);
  if (!data) {
    return ApiResponse.error(404, 'Inventory not found');
  }

  const updated = await inventoryService.update(data, payload);

  return ApiResponse.success(
    'Successfully updated inventory by uuid!',
    updated.toJSON(),
  );
};

export const destroy = async (req: Request) => {
  const payload = (req as any).validated;
  const uuid = payload['uuid'];

  const data = await inventoryService.findByUuid(uuid);
  if (!data) {
    return ApiResponse.error(404, 'Inventory not found');
  }

  const deleted = await inventoryService.destroy(data);

  return ApiResponse.success(
    'Successfully deleted inventory by uuid!',
    deleted.toJSON(),
  );
};
