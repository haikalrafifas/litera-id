import compose from '@/utilities/server/compose-middleware';
import {
  accessToken,
  optionalAccessToken,
} from '@/middlewares/authentication';
import { checkRole } from '@/middlewares/authorization';
import parseFormData from '@/middlewares/form-upload';
import validate from '@/middlewares/request-validation';
import { body, param } from '@/schemas/book';
import { show, update, destroy } from '@/domains/book/controller';

export const GET = compose(
  optionalAccessToken,
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
