export default function ContentCard({ content }: any) {
  return (
  <div className="bg-white p-6 shadow-lg rounded-lg flex flex-col">
    <img
      src={content.image}
      alt={content.title}
      className="w-full object-cover rounded-md"
    />
    <h3 className="text-xl font-semibold text-green-600 mt-4 text-center">
      {content.title}
    </h3>
    <p className="mt-4 text-gray-600 text-center line-clamp-3 min-h-[4.5rem] loading-relaxed">
      {content.snippets}
      </p>
  </div>
  );
}
