import Model from '@/database/orm';
import softDelete from '@/database/soft-delete';
import Role from '../auth/models/role';

export default class User extends softDelete(Model) {
  static tableName = 'users';

  id!: number;
  uuid!: string;
  name!: string;
  username!: string;
  password!: string;
  image?: string | null;
  verified_at?: Date;

  // role?: Role;
  role!: string;

  async hasPermission(permissionName: string): Promise<boolean> {
    const result = await User.query()
      .where('users.id', this.id)
      .joinRelated('roles.permissions')
      .where('permissions.name', permissionName)
      .resultSize();

    return result > 0;
  }

  async hasPermissions(permissionNames: string[]): Promise<boolean> {
    if (!permissionNames.length) return false;

    const result = await User.query()
      .where('users.id', this.id)
      .joinRelated('roles.permissions')
      .whereIn('permissions.name', permissionNames)
      .distinct('permissions.name');

    const found = result.map((p: any) => p.name);
    return permissionNames.every(p => found.includes(p));
  }

  $formatJson(json: any) {
    const serialized = super.$formatJson(json);

    delete serialized.id;
    delete serialized.password;
    // delete serialized.verified_at;
    delete serialized.deleted_at;

    return serialized;
  }

  $parseJson(json: any, opt: any) {
    const parsed = super.$parseJson(json, opt);

    delete parsed.confirmPassword;

    return parsed;
  }

  static relationMappings = {
    role: {
      relation: Model.BelongsToOneRelation,
      modelClass: Role,
      join: {
        from: `${User.tableName}.${User.idColumn}`,
        through: {
          from: 'user_roles.user_id',
          to: 'user_roles.role_id',
        },
        to: `${Role.tableName}.user_id`,
      },
    },
    // permissions: {
    //   relation: Model.HasManyRelation,
    //   modelClass: Permission,
    //   join: {
    //     from: '',
    //     to: '',
    //   },
    // },
    // sessions: {
    //   relation: Model.HasManyRelation,
    //   modelClass: UserSession,
    //   join: {
    //     from: 'users.id',
    //     to: 'user_sessions.user_id',
    //   },
    // },
  };
}
