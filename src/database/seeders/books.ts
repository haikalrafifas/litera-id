import type { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('books').del();

  await knex('books').insert([
    {
      id: 1,
      isbn: '9786021234567',
      title: 'Pemrograman Web Modern',
      author: 'Andi Setiawan',
      publisher: 'MediaTech',
      published_at: '2022-03-10',
      image: '/uploads/books/pemrograman-web.jpg',
      stock: 4,
      category: 'Teknologi',
    },
    {
      id: 2,
      isbn: '9786027654321',
      title: 'Belajar TypeScript',
      author: 'Siti Aisyah',
      publisher: 'CodePress',
      published_at: '2021-11-02',
      image: null,
      stock: 2,
      category: 'Pemrograman',
    },
    {
      id: 3,
      isbn: '9789791239876',
      title: 'Sejarah Perpustakaan',
      author: 'Budi Santoso',
      publisher: 'Sejati',
      published_at: '2019-06-15',
      image: null,
      stock: 0,
      category: 'Sejarah',
    },
  ]);
};
