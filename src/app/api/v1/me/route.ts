import compose from '@/utilities/server/compose-middleware';
import { accessToken } from '@/middlewares/authentication';
import parseFormData from '@/middlewares/form-upload';
import validate from '@/middlewares/request-validation';
import { body } from '@/schemas/user';
import { show, update } from '@/domains/user/controller';

export const GET = compose(
  accessToken,
)(show);

export const PATCH = compose(
  accessToken,
  parseFormData(),
  validate({ body, optional: 'body' }),
)(update);
