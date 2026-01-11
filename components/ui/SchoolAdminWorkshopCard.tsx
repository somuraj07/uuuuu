export default function SchoolAdminWorkshopCard({ workshops }: { workshops: any[] }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="font-medium mb-3">Upcoming Workshops</h3>

      <div className="space-y-3">
        {workshops.map((w) => (
          <div key={w.id} className="border rounded-lg p-3 border-gray-200">
            <p className="font-medium">{w.title}</p>
            <p className="text-sm text-gray-500">
              {new Date(w.eventDate).toDateString()} •{" "}
              {w.class?.name ?? "All Classes"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
