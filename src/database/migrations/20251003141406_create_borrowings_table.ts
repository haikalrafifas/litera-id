import type { Knex } from 'knex';

const enums = {
  status: 'borrowings_status',
};

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('borrowings', table => {
    table.bigIncrements('id');
    table.uuid('uuid').notNullable().unique();
    table.string('name', 255);
    table.bigInteger('borrowed_by').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.bigInteger('item_id').notNullable().references('id').inTable('books').onDelete('CASCADE');
    table.timestamp('borrowed_at').defaultTo(knex.fn.now());
    table.timestamp('due_at').notNullable();
    table.timestamp('returned_at').nullable();
    table.bigInteger('qty').defaultTo(0);
    table.text('notes').nullable();
    table.enum('status', [
        'requested', 'approved', 'cancelled', 'denied',
        'borrowed', 'returned', 'overdue',
      ], { useNative: true, enumName: enums.status })
      .defaultTo('requested');

    table.timestamps(true, true);
    table.timestamp('deleted_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('borrowings');
}
