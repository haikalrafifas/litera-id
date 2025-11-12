import compose from '@/utilities/server/compose-middleware';
import { accessToken } from '@/middlewares/authentication';
import parseFormData from '@/middlewares/form-upload';
import validate from '@/middlewares/request-validation';
import { body, query } from '@/schemas/book';
import { index, create } from '@/domains/book/controller';
import { NextResponse } from 'next/server';
import { books as initialBooks } from '@/mocks/books';

// simple in-memory copy (serverless may reset between runs; this is for demo)
let books = initialBooks.map((b) => ({ ...b }));

// export const GET = compose(
//   validate({ query, optional: 'query' }),
// )(index);

export const POST = compose(
  accessToken,
  parseFormData(),
  validate({ body }),
)(create);

export async function GET() {
  return NextResponse.json(books);
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, delta } = body;
    const idx = books.findIndex((b) => String(b.id) === String(id));
    if (idx === -1) return NextResponse.json({ message: 'Book not found' }, { status: 404 });
    books[idx].stock = Math.max(0, (books[idx].stock ?? 0) + Number(delta || 0));
    return NextResponse.json(books[idx]);
  } catch (e) {
    return NextResponse.json({ message: 'Bad request' }, { status: 400 });
  }
}

