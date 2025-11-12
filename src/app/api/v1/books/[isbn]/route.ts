import compose from '@/utilities/server/compose-middleware';
import { accessToken } from '@/middlewares/authentication';
import parseFormData from '@/middlewares/form-upload';
import validate from '@/middlewares/request-validation';
import { body, param } from '@/schemas/book';
import { show, update, destroy } from '@/domains/book/controller';

export const GET = compose(
  validate({ param }),
)(show);

export const PATCH = compose(
  accessToken,
  parseFormData(),
  validate({ body, param, optional: 'body' }),
)(update);

export const DELETE = compose(
  accessToken,
  validate({ param }),
)(destroy);
