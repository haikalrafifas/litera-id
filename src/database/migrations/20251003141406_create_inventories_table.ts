import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('inventories', table => {
    table.bigIncrements('id');
    table.uuid('uuid').notNullable().unique();
    table.string('name', 255);
    table.bigInteger('qty').defaultTo(0);
    table.string('image', 255).nullable();

    table.timestamps(true, true);
    table.timestamp('deleted_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('inventories');
}
