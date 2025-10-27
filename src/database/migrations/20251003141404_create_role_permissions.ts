import type { Knex } from 'knex';

// Implement role_permissions later
export async function up(knex: Knex): Promise<void> {
  // return knex.schema.createTable('role_permissions', table => {
  //   table.integer('permission_id').notNullable().references('id').inTable('permissions').onDelete('CASCADE');
  //   table.integer('role_id').notNullable().references('id').inTable('roles').onDelete('CASCADE');
  // });
}

export async function down(knex: Knex): Promise<void> {
  // await knex.schema.dropTableIfExists('role_permissions');
}
