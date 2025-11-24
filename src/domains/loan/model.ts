import Model from '@/database/orm';
import softDelete from '@/database/soft-delete';
import Book from '../book/model';
import User from '../user/model';

export default class Loan extends softDelete(Model) {
  static tableName = 'loans';

  id!: number;
  uuid!: string;
  user_id!: number;
  book_id!: number;
  qty!: number;
  requested_at!: Date | null;
  approved_at!: Date | null;
  loaned_at!: Date | null
  due_at!: Date | null;
  cancelled_at!: Date | null
  denied_at!: Date | null;
  returned_at!: Date | null;
  notes?: string;
  status!: 'requested' | 'approved' | 'cancelled' | 'denied' |
        'loaned' | 'returned' | 'overdue';

  book?: Book;
  user?: User;

  static get relationMappings() {
    return {
      book: {
        relation: Model.BelongsToOneRelation,
        modelClass: Book,
        join: {
          from: 'loans.book_id',
          to: 'books.id',
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'loans.user_id',
          to: 'users.id',
        },
      },
    };
  }

  $formatJson(json: any) {
    const serialized = super.$formatJson(json);

    serialized.qty = Number(serialized.qty);

    delete serialized.id;
    delete serialized.user_id;
    delete serialized.book_id;
    delete serialized.deleted_at;

    return serialized;
  }
}
