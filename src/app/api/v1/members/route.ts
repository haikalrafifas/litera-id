import compose from '@/utilities/server/compose-middleware';
import { accessToken } from '@/middlewares/authentication';
import { checkRole } from '@/middlewares/authorization';
import parseFormData from '@/middlewares/form-upload';
import validate from '@/middlewares/request-validation';
import { body, query } from '@/schemas/book';
import { index, create } from '@/domains/book/controller';
import { NextResponse } from 'next/server';

let members = [
  { id: 'm1', name: 'Member Demo', email: 'member@demo.local', banned: false },
  { id: 'm2', name: 'John Doe', email: 'john@example.com', banned: false },
];

export async function GET() {
  return NextResponse.json(members);
}

// export const GET = compose(
//   accessToken,
//   checkRole({ only: 'admin' }),
//   validate({ query, optional: 'query' }),
// )(index);

export const POST = compose(
  accessToken,
  checkRole({ only: 'admin' }),
  parseFormData(),
  validate({ body }),
)(create);
