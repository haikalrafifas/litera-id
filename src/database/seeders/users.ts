import type { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt'

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();

  await knex('users').insert([
    {
      uuid: uuidv4(),
      name: 'Administrator',
      username: 'adminadmin',
      password: await bcrypt.hash('adminadmin', 10),
      role: 'admin',
      verified_at: new Date(),
    },
    {
      uuid: uuidv4(),
      name: 'Member',
      username: 'membermember',
      password: await bcrypt.hash('membermember', 10),
      role: 'member',
    },
  ]);
};
