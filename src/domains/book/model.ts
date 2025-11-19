import Model from '@/database/orm';
import softDelete from '@/database/soft-delete';

export default class Book extends softDelete(Model) {
  static tableName = 'books';

  id!: number;
  isbn!: string;
  title!: string;
  image?: string;
  author!: string;
  publisher!: string;
  published_at?: Date;
  category!: string;
  description?: string;
  stock!: number;

  $formatJson(json: any) {
    const serialized = super.$formatJson(json);

    delete serialized.id;
    delete serialized.deleted_at;

    return serialized;
  }
}
