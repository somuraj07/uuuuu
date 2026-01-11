import AnimatedCard from "@/components/ui/common/AnimatedCard";
import FeeStatusBadge from "@/components/ui/fee/FeeStatusBadge";

export default function FeeMobileCards({ fees }: { fees: any[] }) {
  return (
    <div className="space-y-3">
      {fees.map((fee, index) => (
        <AnimatedCard key={fee.id}>
          <div className="p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-semibold">
                {fee.student.user.name}
              </span>
              <FeeStatusBadge paid={fee.remainingFee <= 0} />
            </div>

            <div className="flex justify-between text-muted-foreground">
              <span>Roll No</span>
              <span>{fee.rollNo}</span>
            </div>

            <div className="flex justify-between">
              <span>Total</span>
              <span>₹{fee.totalFee}</span>
            </div>

            <div className="flex justify-between text-green-600">
              <span>Paid</span>
              <span>₹{fee.amountPaid}</span>
            </div>

            <div className="flex justify-between text-red-600">
              <span>Due</span>
              <span>₹{fee.remainingFee}</span>
            </div>
          </div>
        </AnimatedCard>
      ))}
    </div>
  );
}
