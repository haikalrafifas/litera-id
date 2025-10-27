export default function BorrowCheckoutModal({ isOpen, chosenItems, onCancel, onBorrow }: any) {
  if (!isOpen) return null;

  // Calculate total qty (you can adjust this logic if you need to calculate based on a different logic)
  const totalQty = chosenItems.reduce((sum: any, item: any) => sum + item.qty, 0);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Konfirmasi</h2>
        
        <table className="min-w-full table-auto mb-4">
          <thead>
            <tr className="text-left text-sm font-medium text-gray-600">
              <th className="py-2 px-4">#</th>
              <th className="py-2 px-4">Nama</th>
              <th className="py-2 px-4">Qty</th>
            </tr>
          </thead>
          <tbody>
            {chosenItems.map((item: any) => (
              <tr key={item.id} className="text-gray-700">
                <td className="py-2 px-4 border-b">{item.id}</td>
                <td className="py-2 px-4 border-b">{item.name}</td>
                <td className="py-2 px-4 border-b">{item.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4">
          <span className="font-semibold text-gray-600">Total: {totalQty}</span>
          <div>
            <button
              className="mr-2 bg-gray-500 text-white py-2 px-4 rounded-md"
              onClick={onCancel}
            >
              Batal
            </button>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-md"
              onClick={onBorrow}
            >
              Pinjam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
