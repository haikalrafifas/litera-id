import compose from '@/utilities/server/compose-middleware';
import { accessToken } from '@/middlewares/authentication';
import { checkRole } from '@/middlewares/authorization';
import validate from '@/middlewares/request-validation';
import { query } from '@/schemas/user';
import { adminList } from '@/domains/user/controller';

export const GET = compose(
  accessToken,
  checkRole({ only: 'admin' }),
  validate({ query, optional: 'query' }),
)(adminList);
