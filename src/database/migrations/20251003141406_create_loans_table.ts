import type { Knex } from 'knex';

const enums = {
  status: 'loan_status',
};

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('loans', table => {
    table.bigIncrements('id');
    table.uuid('uuid').notNullable().unique();
    table.bigInteger('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.bigInteger('book_id').notNullable().references('id').inTable('books').onDelete('CASCADE');
    table.timestamp('loan_date').defaultTo(knex.fn.now());
    table.timestamp('due_date').notNullable();
    table.timestamp('return_date').nullable();
    table.bigInteger('qty').defaultTo(0);
    table.text('notes').nullable();
    table.enum('status', [
        'requested', 'approved', 'cancelled', 'denied',
        'loaned', 'returned', 'overdue',
      ], { useNative: true, enumName: enums.status })
      .defaultTo('requested');

    table.timestamps(true, true);
    table.timestamp('deleted_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('loans');
}
