import compose from '@/utilities/server/compose-middleware';
import parseFormData from '@/middlewares/form-upload';
import validate from '@/middlewares/request-validation';
import { body } from '@/schemas/login';
import { login } from '@/domains/auth/controller';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { books as initialBooks } from '@/mocks/books';

// in-memory stores for demo (not persistent)
let books = initialBooks.map((b) => ({ ...b }));
type BorrowRec = {
  id: string;
  user: { id: string; name: string } | null;
  items: { book_id: string; title?: string; quantity: number }[];
  status: string;
  requested_at: string;
  approved_at?: string;
  borrowed_at?: string;
  returned_at?: string;
  due_date?: string;
  cancelled?: boolean;
};

let borrowings: BorrowRec[] = [];

export async function GET() {
  // Admin view: return all borrowings
  return NextResponse.json(borrowings);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items: { book_id: string; quantity: number }[] = body.items || [];
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: 'Items required' }, { status: 400 });
    }

    // basic validation: ensure book id exists
    const resolved = items.map((it) => {
      const book = books.find((b) => String(b.id) === String(it.book_id) || String(b.isbn) === String(it.book_id));
      return { book, quantity: Number(it.quantity || 1) };
    });

    for (const r of resolved as any) {
      if (!r.book) {
        return NextResponse.json({ message: `Buku tidak ditemukan (${r?.book?.id ?? 'unknown'})` }, { status: 400 });
      }
      if (r.quantity <= 0) {
        return NextResponse.json({ message: 'Quantity tidak valid' }, { status: 400 });
      }
    }

    const id = randomUUID();
    const record: BorrowRec = {
      id,
      user: { id: 'member-demo', name: 'Member Demo' }, // for demo purposes
      items: resolved.map((r) => ({ book_id: String(r.book!.id), title: r.book!.title, quantity: r.quantity })),
      status: 'requested',
      requested_at: new Date().toISOString(),
    };
    borrowings.unshift(record);
    return NextResponse.json(record, { status: 201 });
  } catch (e) {
    return NextResponse.json({ message: 'Bad request' }, { status: 400 });
  }
}

// export const POST = compose(
//   parseFormData(),
//   validate({ body }),
// )(login);
