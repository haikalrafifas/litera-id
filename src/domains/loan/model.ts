import Model from '@/database/orm';
import softDelete from '@/database/soft-delete';

export default class Loan extends softDelete(Model) {
  static tableName = 'loans';

  id!: number;
  uuid!: string;
  user_id!: string;
  book_id!: string;
  qty!: number;
  loan_date!: Date;
  due_date!: Date;
  return_date?: Date | null;
  notes?: string;
  status!: 'requested' | 'approved' | 'cancelled' | 'denied' |
        'loaned' | 'returned' | 'overdue';

  $formatJson(json: any) {
    const serialized = super.$formatJson(json);

    serialized.qty = Number(serialized.qty);

    delete serialized.id;
    delete serialized.deleted_at;

    return serialized;
  }
}
