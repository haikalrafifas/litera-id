import Model from '@/database/orm';
import softDelete from '@/database/soft-delete';

export default class Inventory extends softDelete(Model) {
  static tableName = 'inventories';

  id!: number;
  uuid!: string;
  name!: string;
  qty!: number;
  image?: string;

  $formatJson(json: any) {
    const serialized = super.$formatJson(json);

    serialized.qty = Number(serialized.qty);

    delete serialized.id;
    delete serialized.deleted_at;

    return serialized;
  }
}
