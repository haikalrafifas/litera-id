import User from './model';

export const findById = async (
  userId: number,
): Promise<User | undefined> => {
  return await User.query().findById(userId).whereNull('deleted_at');
};

export const update = async (
  entity: User,
  payload: User,
): Promise<User> => {
  return await entity.$query()
    .patch({ ...payload })
    .returning('*')
    .first() as User;
};
