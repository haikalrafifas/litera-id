import compose from '@/utilities/server/compose-middleware';
import { accessToken } from '@/middlewares/authentication';
import { checkRole } from '@/middlewares/authorization';
import parseFormData from '@/middlewares/form-upload';
import validate from '@/middlewares/request-validation';
import { body, param } from '@/schemas/user';
import { adminUpdate } from '@/domains/user/controller';

export const PATCH = compose(
  accessToken,
  checkRole({ only: 'admin' }),
  parseFormData(),
  validate({ body, param, optional: 'body' }),
)(adminUpdate);
