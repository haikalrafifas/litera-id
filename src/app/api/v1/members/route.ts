import compose from '@/utilities/server/compose-middleware';
import { accessToken } from '@/middlewares/authentication';
import { checkRole } from '@/middlewares/authorization';
import parseFormData from '@/middlewares/form-upload';
import validate from '@/middlewares/request-validation';
import { body, query } from '@/schemas/achievement';
import { index, create } from '@/domains/achievement/controller';

export const GET = compose(
  accessToken,
  checkRole({ only: 'admin' }),
  validate({ query, optional: 'query' }),
)(index);

export const POST = compose(
  accessToken,
  checkRole({ only: 'admin' }),
  parseFormData(),
  validate({ body }),
)(create);
