import Model from '@/database/orm';
import softDelete from '@/database/soft-delete';

export default class Book extends softDelete(Model) {
  static tableName = 'books';

  id!: number;
  isbn!: string;
  slug!: string;
  title!: string;
  posted_by!: number;
  image?: string;
  content?: string;

  $formatJson(json: any) {
    const serialized = super.$formatJson(json);

    delete serialized.id;
    delete serialized.deleted_at;

    return serialized;
  }
}
