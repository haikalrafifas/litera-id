import ApiResponse from '@/utilities/server/response';
import * as loanService from './service';

export const index = async (req: Request) => {
  const { page, limit, status } = (req as any).validated;
  const user = (req as any).user;

  const userId = user.role !== 'admin' ? user.id : undefined;

  const { data, pagination } = await loanService.fetchPaginated(
    { page, limit }, userId, status,
  );

  return ApiResponse.success(
    'Successfully get loans!',
    data,
    pagination,
  );
};

export const show = async (req: Request) => {
  const uuid = (req as any).validated['uuid'];

  const data = await loanService.findByUuid(uuid);
  if (!data) {
    return ApiResponse.error(404, 'Data not found');
  }

  return ApiResponse.success(
    'Successfully get loan detail by uuid!',
    data.toJSON(),
  );
};

export const create = async (req: Request) => {
  const payload = (req as any).validated;
  const userId = (req as any).user.sub;
  
  const newRecord = await loanService.create(
    payload, userId,
  );

  return ApiResponse.success(
    'Successfully created new loan!',
    newRecord.toJSON(),
  );
};

export const update = async (req: Request) => {
  const payload = (req as any).validated;
  const uuid = payload['uuid'];

  const data = await loanService.findByUuid(uuid);
  if (!data) {
    return ApiResponse.error(404, 'Data not found');
  }

  const updated = await loanService.update(data, payload);

  return ApiResponse.success(
    'Successfully updated loan by uuid!',
    updated.toJSON(),
  );
};

export const destroy = async (req: Request) => {
  const payload = (req as any).validated;
  const uuid = payload['uuid'];

  const data = await loanService.findByUuid(uuid);
  if (!data) {
    return ApiResponse.error(404, 'Data not found');
  }

  const deleted = await loanService.destroy(data);

  return ApiResponse.success(
    'Successfully deleted loan by uuid!',
    deleted.toJSON(),
  );
};
