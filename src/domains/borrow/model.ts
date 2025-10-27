import Model from '@/database/orm';
import softDelete from '@/database/soft-delete';

export default class Borrow extends softDelete(Model) {
  static tableName = 'borrowings';

  id!: number;
  uuid!: string;
  name!: string;
  borrowed_by!: number;
  item_id!: string; // uuid
  qty!: number;
  borrowed_at!: Date;
  returned_at?: Date;
  notes?: string;

  $formatJson(json: any) {
    const serialized = super.$formatJson(json);

    serialized.qty = Number(serialized.qty);

    delete serialized.id;
    delete serialized.deleted_at;

    return serialized;
  }
}
