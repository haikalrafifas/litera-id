import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('achievements', table => {
    table.bigIncrements('id');
    table.string('slug', 255).notNullable().unique();
    table.string('title', 255);
    table.bigInteger('posted_by').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('image', 255).nullable();
    table.text('content').nullable();

    table.timestamps(true, true);
    table.timestamp('deleted_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('achievements');
}
