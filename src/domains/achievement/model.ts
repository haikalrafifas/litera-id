import Model from '@/database/orm';
import softDelete from '@/database/soft-delete';
import User from '../user/model';

export default class Achievement extends softDelete(Model) {
  static tableName = 'achievements';

  id!: number;
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

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'achievements.id',
        to: 'users.id',
      },
    },
  };
}
