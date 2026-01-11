import FeeStatusBadge from "./FeeStatusBadge";

export default function FeeTable({ fees }: { fees: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b text-left">
          <tr>
            <th className="py-2">Roll No</th>
            <th>Student Name</th>
            <th>Total</th>
            <th>Paid</th>
            <th>Due</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {fees.map((fee) => (
            <tr key={fee.id} className="border-b last:border-none">
              <td className="py-3">{fee.rollNo}</td>
              <td>{fee.student.user.name}</td>
              <td>₹{fee.totalFee}</td>
              <td className="text-green-600">₹{fee.amountPaid}</td>
              <td className="text-red-600">₹{fee.remainingFee}</td>
              <td>
                <FeeStatusBadge paid={fee.remainingFee <= 0} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
