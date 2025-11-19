import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('books', table => {
    table.bigIncrements('id');
    table.string('isbn', 13).notNullable().unique();
    table.string('title', 255);
    table.string('image', 255).nullable();
    table.string('author', 255).nullable();
    table.string('publisher', 255).nullable();
    table.timestamp('published_at').nullable();
    // table.string('available_at', 255).nullable();
    table.string('category', 100).nullable();
    table.text('description').nullable();
    table.integer('stock').defaultTo(0);

    table.timestamps(true, true);
    table.timestamp('deleted_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('books');
}
