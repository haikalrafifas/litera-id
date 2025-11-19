import compose from '@/utilities/server/compose-middleware';
import {
  accessToken,
  optionalAccessToken,
} from '@/middlewares/authentication';
import { checkRole } from '@/middlewares/authorization';
import parseFormData from '@/middlewares/form-upload';
import validate from '@/middlewares/request-validation';
import { body, query } from '@/schemas/book';
import { index, create } from '@/domains/book/controller';

export const GET = compose(
  optionalAccessToken,
  validate({ query, optional: 'query' }),
)(index);

export const POST = compose(
  accessToken,
  checkRole({ only: 'admin' }),
  parseFormData(),
  validate({ body }),
)(create);
