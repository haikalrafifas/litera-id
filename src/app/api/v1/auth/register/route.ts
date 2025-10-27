import compose from '@/utilities/server/compose-middleware';
import parseFormData from '@/middlewares/form-upload';
import validate from '@/middlewares/request-validation';
import { body } from '@/schemas/user';
import { register } from '@/domains/auth/controller';

export const POST = compose(
  parseFormData(),
  validate({ body }),
)(register);
