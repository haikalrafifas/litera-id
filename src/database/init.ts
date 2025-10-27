/**
 * Database configuration
 */
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
import type { Knex } from 'knex';

const config: Knex.Config = {
  client: process.env.DATABASE_CLIENT || 'pg',
  connection: process.env.DATABASE_URL,
  searchPath: process.env.DATABASE_SCHEMA?.split(',') || ['public'],
  migrations: {
    directory: './migrations',
  },
  seeds: {
    directory: './seeders',
  },
  // useNullAsDefault: true,
};

export default config;
