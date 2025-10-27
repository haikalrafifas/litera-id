interface Book {
  id: number;
  category_id: number;
  title: string;
  snippets: string;
  image: string;
  created_at: Date;
  updated_at: Date;
}

const data: Book[] = [
  {
    id: 1,
    category_id: 1,
    title: 'Filsafat Kopi',
    snippets: 'Kumpulan cerita pendek karya Dee Lestari yang menggugah makna kehidupan dan secangkir kopi.',
    image: '/images/robotics.svg',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    category_id: 1,
    title: 'Laskar Pelangi',
    snippets: 'Novel inspiratif karya Andrea Hirata tentang perjuangan anak-anak Belitung dalam meraih pendidikan.',
    image: '/images/robotics.svg',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 3,
    category_id: 1,
    title: 'Atomic Habits',
    snippets: 'Panduan membangun kebiasaan kecil yang membawa perubahan besar dalam hidup, karya James Clear.',
    image: '/images/robotics.svg',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 4,
    category_id: 1,
    title: 'Belajar Next.js Pemula',
    snippets: 'Belajar menggunakan framework Next.js, ramah bagi pemula.',
    image: '/images/robotics.svg',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 5,
    category_id: 2,
    title: 'Negeri 5 Menara',
    snippets: 'Kisah enam santri yang belajar di pesantren dan bermimpi besar menggapai dunia, karya Ahmad Fuadi.',
    image: '/images/robotics.svg',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 6,
    category_id: 2,
    title: 'Rich Dad Poor Dad',
    snippets: 'Robert Kiyosaki membahas pentingnya literasi finansial dan cara berpikir berbeda tentang uang.',
    image: '/images/robotics.svg',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 7,
    category_id: 2,
    title: 'The Psychology of Money',
    snippets: 'Morgan Housel menjelaskan bagaimana perilaku dan emosi memengaruhi keputusan finansial kita.',
    image: '/images/robotics.svg',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export default data;