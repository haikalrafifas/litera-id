import compose from '@/utilities/server/compose-middleware';
import { accessToken } from '@/middlewares/authentication';
// import { checkRole } from '@/middlewares/authorization';
import parseFormData from '@/middlewares/form-upload';
import validate from '@/middlewares/request-validation';
import { updateBody, param } from '@/schemas/loan';
import { show, update } from '@/domains/loan/controller';

export const GET = compose(
  accessToken,
  validate({ param }),
)(show);

export const PATCH = compose(
  accessToken,
  parseFormData(),
  validate({ body: updateBody, param, optional: 'body' }),
)(update);
