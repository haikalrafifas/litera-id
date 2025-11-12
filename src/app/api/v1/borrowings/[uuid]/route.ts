// // import compose from '@/utilities/server/compose-middleware';
// // import parseFormData from '@/middlewares/form-upload';
// // import validate from '@/middlewares/request-validation';
// // import { body } from '@/schemas/login';
// // import { login } from '@/domains/auth/controller';

// // export const POST = compose(
// //   parseFormData(),
// //   validate({ body }),
// // )(login);

// import { NextResponse } from 'next/server';
// import { books as initialBooks } from '@/mocks/books';

// // keep module-level state in sync with other borrowings file
// let books = initialBooks.map((b) => ({ ...b }));
// // attempt to import borrowings from parent module is not possible in this serverless demo,
// // so we keep a tiny shared state by using globalThis (demo only)
// const globalStore: any = globalThis as any;
// globalStore.__LITERA_BORROWINGS = globalStore.__LITERA_BORROWINGS ?? [];
// let borrowings = globalStore.__LITERA_BORROWINGS;

// // helper to save back
// function saveBorrowings() {
//   globalStore.__LITERA_BORROWINGS = borrowings;
// }

// export async function PATCH(request: Request, { params }: { params: { uuid: string } }) {
//   try {
//     const { uuid } = params;
//     const body = await request.json();
//     const action: string = body.action;
//     borrowings = globalStore.__LITERA_BORROWINGS ?? borrowings;

//     const idx = borrowings.findIndex((b: any) => b.uuid === uuid);
//     if (idx === -1) return NextResponse.json({ message: 'Borrowing not found' }, { status: 404 });

//     const rec = borrowings[idx];

//     if (action === 'approve') {
//       // ensure stock sufficient for each item
//       for (const it of rec.items) {
//         const b = books.find((bb) => String(bb.id) === String(it.book_id) || String(bb.isbn) === String(it.book_id));
//         if (!b || (b.stock ?? 0) < it.quantity) {
//           return NextResponse.json({ message: `Stok tidak mencukupi untuk "${it.title}"` }, { status: 400 });
//         }
//       }
//       // decrement stock
//       for (const it of rec.items) {
//         const b = books.find((bb) => String(bb.id) === String(it.book_id) || String(bb.isbn) === String(it.book_id));
//         if (b) b.stock = (b.stock ?? 0) - it.quantity;
//       }
//       rec.status = 'approved';
//       rec.approved_at = new Date().toISOString();
//     } else if (action === 'deny') {
//       rec.status = 'denied';
//     } else if (action === 'mark_borrowed') {
//       if (rec.status !== 'approved') {
//         return NextResponse.json({ message: 'Only approved can be marked borrowed' }, { status: 400 });
//       }
//       rec.status = 'borrowed';
//       rec.borrowed_at = new Date().toISOString();
//       // set due date 7 days
//       rec.due_date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
//     } else if (action === 'mark_returned') {
//       if (rec.status !== 'borrowed') {
//         return NextResponse.json({ message: 'Only borrowed can be returned' }, { status: 400 });
//       }
//       // increment stock back
//       for (const it of rec.items) {
//         const b = books.find((bb) => String(bb.id) === String(it.book_id) || String(bb.isbn) === String(it.book_id));
//         if (b) b.stock = (b.stock ?? 0) + it.quantity;
//       }
//       rec.status = 'returned';
//       rec.returned_at = new Date().toISOString();
//     } else if (action === 'mark_due') {
//       rec.status = 'due';
//     } else if (action === 'cancel') {
//       if (!(rec.status === 'requested' || rec.status === 'approved')) {
//         return NextResponse.json({ message: 'Cannot cancel this request' }, { status: 400 });
//       }
//       // if already approved, restore stock
//       if (rec.status === 'approved') {
//         for (const it of rec.items) {
//           const b = books.find((bb) => String(bb.id) === String(it.book_id) || String(bb.isbn) === String(it.book_id));
//           if (b) b.stock = (b.stock ?? 0) + it.quantity;
//         }
//       }
//       rec.status = 'cancelled';
//       rec.cancelled = true;
//     } else {
//       return NextResponse.json({ message: 'Unknown action' }, { status: 400 });
//     }

//     borrowings[idx] = rec;
//     saveBorrowings();
//     return NextResponse.json(rec);
//   } catch (e) {
//     return NextResponse.json({ message: 'Bad request' }, { status: 400 });
//   }
// }

import compose from '@/utilities/server/compose-middleware';
import { accessToken } from '@/middlewares/authentication';
import parseFormData from '@/middlewares/form-upload';
import validate from '@/middlewares/request-validation';
import { body } from '@/schemas/user';
import { show, update } from '@/domains/user/controller';

export const GET = compose(
  accessToken,
)(show);

export const PATCH = compose(
  accessToken,
  parseFormData(),
  validate({ body, optional: 'body' }),
)(update);
