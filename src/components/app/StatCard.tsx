
export default function StatCard({ title, value }: any) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800">{value}</h3>
      <p className="text-gray-600 mt-2">{title}</p>
    </div>
  );
}
