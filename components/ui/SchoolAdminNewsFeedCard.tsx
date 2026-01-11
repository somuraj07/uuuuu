export default function SchoolAdminNewsFeedCard({ news }: { news: any[] }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="font-medium mb-3">Latest News</h3>

      <div className="space-y-3">
        {news.map((n) => (
          <div key={n.id} className="border rounded-lg p-3 border-gray-200">
            <p className="font-medium">{n.title}</p>
            <p className="text-sm text-gray-500">
              {new Date(n.createdAt).toDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
