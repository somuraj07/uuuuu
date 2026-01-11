export default function FeeStatusBadge({ paid }: { paid: boolean }) {
  return (
    <span
      className={`px-3 py-1 text-xs rounded-full font-medium
      ${paid
        ? "bg-green-100 text-green-700"
        : "bg-orange-100 text-orange-700"}`}
    >
      {paid ? "Paid" : "Pending"}
    </span>
  );
}
