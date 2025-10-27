import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // return knex.schema.createTable('roles', table => {
  //   table.increments('id');
  //   table.string('name', 255).notNullable().unique();
  // });
}

export async function down(knex: Knex): Promise<void> {
  // await knex.schema.dropTableIfExists('roles');
}
