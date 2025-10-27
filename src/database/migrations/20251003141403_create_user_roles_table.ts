import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // return knex.schema.createTable('user_roles', table => {
  //   table.integer('role_id').notNullable().references('id').inTable('roles').onDelete('CASCADE');
  //   table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
  // });
}

export async function down(knex: Knex): Promise<void> {
  // await knex.schema.dropTableIfExists('user_roles');
}
