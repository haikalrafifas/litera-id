import compose from '@/utilities/server/compose-middleware';
import { accessToken } from '@/middlewares/authentication';
import parseFormData from '@/middlewares/form-upload';
import validate from '@/middlewares/request-validation';
import { body, query } from '@/schemas/loan';
import { index, create } from '@/domains/loan/controller';

export const GET = compose(
  accessToken,
  validate({ query, optional: 'query' }),
)(index);

export const POST = compose(
  accessToken,
  parseFormData(),
  validate({ body }),
)(create);
