import { useUserStore } from '@/stores/user';
import StatCard from '@/components/atoms/app/StatCard';

export default function MemberDashboard() {
  const { name } = useUserStore();

  const analytics = [
    { title: 'Buku Dipinjam', value: 12, color: 'bg-blue-500', },
    { title: 'Terlambat Dikembalikan', value: 1, color: 'bg-red-500', },
  ];

  return (
    <>
      {/* Header */}
      <header className="shadow-sm mb-2">
        <h1 className="text-2xl font-semibold">
          Selamat datang, <span className="text-blue-600">{name}</span>!
        </h1>

        <p>Berikut adalah statistik bulan ini:</p>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
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
              <span>[2025-10-20 00:00]</span> Meminjam <b>Laskar Pelangi</b> - jatuh tempo 5 November 2025
            </li>
            <li className="bg-white p-4 shadow rounded-lg">
              <span>[2025-10-19 00:00]</span> Bergabung ke aplikasi
            </li>
          </ul>
        </div>
      </main>

      {/* Footer fixed at bottom */}
      {/* <footer className="bg-white text-center py-4 text-gray-500 text-sm">
        © 2025 Inventory & CMS App. All rights reserved.
      </footer> */}
    </>
  );
}
