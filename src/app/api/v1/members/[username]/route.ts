// import compose from '@/utilities/server/compose-middleware';
// import { accessToken } from '@/middlewares/authentication';
// import { checkRole } from '@/middlewares/authorization';
// import parseFormData from '@/middlewares/form-upload';
// import validate from '@/middlewares/request-validation';
// import { body, param } from '@/schemas/book';
// import { show, update, destroy } from '@/domains/book/controller';

// export const GET = compose(
//   accessToken,
//   checkRole({ only: 'admin' }),
//   validate({ param }),
// )(show);

// export const PATCH = compose(
//   accessToken,
//   checkRole({ only: 'admin' }),
//   parseFormData(),
//   validate({ body, param, optional: 'body' }),
// )(update);

// export const DELETE = compose(
//   accessToken,
//   checkRole({ only: 'admin' }),
//   validate({ param }),
// )(destroy);

import { NextResponse } from 'next/server';

let members = [
  { id: 'm1', name: 'Member Demo', username: 'member', banned: false },
  { id: 'm2', name: 'John Doe', username: 'john', banned: false },
];

export async function PATCH(request: Request, { params }: { params: { username: string } }) {
  try {
    const { username } = params;
    const body = await request.json();
    const idx = members.findIndex((m) => m.username === username);
    if (idx === -1) return NextResponse.json({ message: 'Member not found' }, { status: 404 });
    if (typeof body.banned === 'boolean') members[idx].banned = body.banned;
    return NextResponse.json(members[idx]);
  } catch (e) {
    return NextResponse.json({ message: 'Bad request' }, { status: 400 });
  }
}
