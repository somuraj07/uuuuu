export default function LeaveTypeBadge({ type }: { type: string }) {
  return (
    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 capitalize">
      {type.toLowerCase()}
    </span>
  );
}
