export default function HomeworkSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-5 border border-gray-100 animate-pulse">
      <div className="flex gap-2 mb-3">
        <div className="h-6 w-20 bg-gray-200 rounded-full" />
        <div className="h-6 w-24 bg-gray-200 rounded-full" />
      </div>

      <div className="h-4 w-2/3 bg-gray-200 rounded mb-2" />
      <div className="h-3 w-full bg-gray-100 rounded mb-4" />

      <div className="flex justify-between">
        <div className="h-3 w-32 bg-gray-100 rounded" />
        <div className="h-8 w-24 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}
