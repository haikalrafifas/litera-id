import type { Knex } from 'knex';

const enums = {
  role: 'users_role',
};

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', table => {
    table.bigIncrements('id');
    table.uuid('uuid').notNullable().unique();
    table.string('username', 32).notNullable().unique();
    table.string('password', 255).notNullable();
    table.string('name', 255).notNullable();
    table.enum('role', [
      'member', 'admin',
    ], { useNative: true, enumName: enums.role }).defaultTo('member');
    table.string('image', 255).nullable();
    table.timestamp('verified_at').nullable();

    table.timestamps(true, true);
    table.timestamp('deleted_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');

  for (const typeName of Object.values(enums)) {
    await knex.schema.raw(`DROP TYPE IF EXISTS "${typeName}"`);
  }
}
