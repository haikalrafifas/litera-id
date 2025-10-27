import compose from '@/utilities/server/compose-middleware';
import { accessToken } from '@/middlewares/authentication';
import { checkRole } from '@/middlewares/authorization';
import parseFormData from '@/middlewares/form-upload';
import validate from '@/middlewares/request-validation';
import { body, param } from '@/schemas/achievement';
import { show, update, destroy } from '@/domains/achievement/controller';

export const GET = compose(
  accessToken,
  checkRole({ only: 'admin' }),
  validate({ param }),
)(show);

export const PATCH = compose(
  accessToken,
  checkRole({ only: 'admin' }),
  parseFormData(),
  validate({ body, param, optional: 'body' }),
)(update);

export const DELETE = compose(
  accessToken,
  checkRole({ only: 'admin' }),
  validate({ param }),
)(destroy);
