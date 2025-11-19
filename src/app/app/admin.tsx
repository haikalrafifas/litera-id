import { useUserStore } from '@/stores/user';
import StatCard from '@/components/atoms/app/StatCard';

export default function AdminDashboard() {
  const { name } = useUserStore();

  const analytics = [
    { title: 'Total Buku', value: 3, color: 'bg-green-500', },
    { title: 'Total Anggota', value: 1, color: 'bg-red-500', },
    { title: 'Buku Dipinjam', value: 0, color: 'bg-blue-500', },
    { title: 'Pending Permintaan', value: 1, color: 'bg-yellow-500', },
  ];

  return (
    <>
      {/* Header */}
      <header className="shadow-sm mb-2">
        <h1 className="text-2xl font-semibold">
          Selamat datang, <span className="text-blue-600">{name}</span>!
        </h1>
      </header>

      {/* Main content */}
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {analytics.map((item, idx) => (
            <StatCard key={idx} title={item.title} value={item.value} />
            

            // <div
            //   key={idx}
            //   className={`${item.color} text-white p-6 rounded-lg shadow-md`}
            // >
            //   <h2 className="text-lg font-medium">{item.title}</h2>
            //   <p className="text-3xl font-bold mt-2">{item.value}</p>
            // </div>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Aktivitas Terbaru</h3>
          <ul className="space-y-2">
            <li className="bg-white p-4 shadow rounded-lg">
              [2025-10-20 00:00] Member meminjam <b>Laskar Pelangi</b> — jatuh tempo 5 November 2025
            </li>
            <li className="bg-white p-4 shadow rounded-lg">
              [2025-10-19 00:00] Admin menambahkan <b>Member</b> sebagai anggota
            </li>
          </ul>
        </div>
      </main>
    </>
  );
}
