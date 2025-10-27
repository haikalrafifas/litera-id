import Model from '@/database/orm';
// import User from '../../user/model';
// import Permission from './permission';

export default class Role extends Model {
  static tableName = 'roles';

  id!: number;
  name!: string;

  static relationMappings = {
    // users: {
    //   relation: Model.ManyToManyRelation,
    //   modelClass: User,
    //   join: {
    //     from: 'roles.id',
    //     through: {
    //       from: 'user_roles.role_id',
    //       to: 'user_roles.user_id',
    //     },
    //     to: 'users.id',
    //   },
    // },


    // permissions: {
    //   relation: Model.ManyToManyRelation,
    //   modelClass: Permission,
    //   join: {
    //     from: 'roles.id',
    //     through: {
    //       from: 'role_permissions.role_id',
    //       to: 'role_permissions.permission_id',
    //     },
    //     to: 'permissions.id',
    //   },
    // },
  };
}