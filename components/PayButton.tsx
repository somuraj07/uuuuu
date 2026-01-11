"use client";

import { CreditCard, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/services/toast/toast.service";
import { generateFeeReceipt } from "./parent/fees/utils";
import { StudentFeeApiResponse } from "@/interfaces/student";
import { MAIN_COLOR } from "@/constants/colors";


interface PayButtonProps {
  amount: number;
  feesAllRes: StudentFeeApiResponse;
  onSuccess?: () => void;
  onFailure?: () => void;
  onStart?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function PayButton({
  amount,
  onSuccess,
  onFailure,
  onStart,
  disabled,
  loading,
  feesAllRes,
}: PayButtonProps) {
  const payNow = async () => {
    if (disabled || loading) return;

    try {
      onStart?.();

      const normalizedAmount = Number(amount.toFixed(2));

      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: normalizedAmount }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || "Failed to create order");
        onFailure?.();
        return;
      }

      const order = await res.json();

      if (!(window as any).Razorpay) {
        toast.error("Razorpay SDK not loaded");
        onFailure?.();
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount,
        currency: "INR",
        order_id: order.id,
        name: "School Management System",
        description: "Complete your payment",
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: normalizedAmount,
              }),
            });

            const data = await verifyRes.json();

            if (!verifyRes.ok) {
              toast.error(data.message || "Payment verification failed");
              onFailure?.();
              return;
            }

            toast.success("Payment successful!");
            generateFeeReceipt({
              payment: data.payment,
              student: feesAllRes.student,
              school: feesAllRes.school,
            });
            onSuccess?.();
          } catch {
            toast.error("Verification failed");
            onFailure?.();
          }
        },
        modal: {
          ondismiss: () => onFailure?.(),
        },
        theme: { color: `${MAIN_COLOR}` },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch {
      toast.error("Payment failed");
      onFailure?.();
    }
  };

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.97 } : undefined}
      onClick={payNow}
      disabled={disabled || loading}
      style={{backgroundColor:`${MAIN_COLOR}`}}
      className="
        w-full text-white py-4 rounded-xl font-semibold
        flex items-center justify-center gap-2 shadow-md
        hover:bg-green-700 transition
        disabled:opacity-60 disabled:cursor-not-allowed
      "
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={20} />
          Processing...
        </>
      ) : (
        <>
          <CreditCard size={20} />
          Pay ₹{amount}
        </>
      )}
    </motion.button>
  );
}
