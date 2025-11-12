import bcrypt from 'bcrypt';
import JWTAuth from '@/utilities/server/jwt';

import User from '../user/model';

export const findByUsername = async (
  username: string,
): Promise<User | undefined> => {
  return await User.query().findOne({ username });
};

export const findAccount = async (
  username: string,
  password: string,
): Promise<User | null> => {
  const user = await findByUsername(username);
  if (!user) return null;
  
  const storedHash = user.password;
  const isMatch = await bcrypt.compare(password, storedHash);

  if (!isMatch) return null;

  return user;
};

export const authenticate = async (user: User) => {
  const payload = {
    id: user.id,
    username: user.username,
    name: user.name,
    image: user.image,
    role: user.role,
  };

  const accessToken = await JWTAuth.access.sign(payload);

  return {
    access: accessToken,
  };
};

export const create = async (
  user: User
): Promise<User> => {
  user.password = await bcrypt.hash(user.password, 10);
  return await User.query().insert(user).returning('*');
};
