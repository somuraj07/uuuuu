"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, CreditCard, History, TrendingUp } from "lucide-react";
import { useSession } from "next-auth/react";
import PayButton from "@/components/PayButton";
import { StudentFeeApiResponse, Payment } from "@/interfaces/student";
import { MAIN_COLOR, MAIN_COLOR_LIGHT, ACCENT_COLOR } from "@/constants/colors";

interface StudentFee {
  id: string;
  totalFee: number;
  discountPercent: number;
  finalFee: number;
  amountPaid: number;
  remainingFee: number;
  installments: number;
}

interface FeeWithStudent extends StudentFee {
  student: {
    id: string;
    user: { id: string; name: string | null; email: string | null };
    class: { id: string; name: string; section: string | null } | null;
  };
}

interface FeeStats {
  totalStudents: number;
  paid: number;
  pending: number;
  totalCollected: number;
  totalDue: number;
}

export default function Page() {
  const { data: session, status } = useSession();
  const [feeData, setFeeData] = useState<StudentFeeApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<1 | 3>(1);
  const [adminFees, setAdminFees] = useState<FeeWithStudent[]>([]);
  const [stats, setStats] = useState<FeeStats | null>(null);
  const [selectedFee, setSelectedFee] = useState<FeeWithStudent | null>(null);
  const [totalFeeInput, setTotalFeeInput] = useState<number | "">("");
  const [discountInput, setDiscountInput] = useState<number | "">("");
  const [installmentsInput, setInstallmentsInput] = useState<number | "">("");
  const [saving, setSaving] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const fetchFee = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/fees/mine");
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to fetch fee details");
        return;
      }
      setFeeData(data);
    } catch (err) {
      console.error("Fetch fee error:", err);
      alert("Something went wrong while fetching fee details");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminSummary = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/fees/summary");
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to fetch fees");
        return;
      }
      setAdminFees(data.fees || []);
      setStats(data.stats || null);
      if (data.fees?.length) {
        const first = data.fees[0];
        setSelectedFee(first);
        setTotalFeeInput(first.totalFee);
        setDiscountInput(first.discountPercent);
        setInstallmentsInput(first.installments);
      } else {
        setSelectedFee(null);
      }
    } catch (err) {
      console.error("Fetch admin fees error:", err);
      alert("Something went wrong while fetching fee details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status !== "authenticated") return;
    const role = session?.user?.role;
    if (role === "STUDENT") {
      fetchFee();
    } else if (role === "SCHOOLADMIN" || role === "SUPERADMIN") {
      fetchAdminSummary();
    } else {
      setLoading(false);
    }
  }, [status, session?.user?.role]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #F5F3FF 0%, #E9D5FF 100%)" }}>
        <div className="glass-card rounded-2xl p-8">
          <p className="font-medium" style={{ color: MAIN_COLOR }}>Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #F5F3FF 0%, #E9D5FF 100%)" }}>
        <div className="glass-card rounded-2xl p-6">
          <p className="font-semibold text-red-600">
            Please sign in to view payments.
          </p>
        </div>
      </div>
    );
  }

  const role = session.user.role;

  if (role === "STUDENT" && !feeData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #F5F3FF 0%, #E9D5FF 100%)" }}>
        <div className="glass-card rounded-2xl p-6 max-w-md w-full">
          <p className="font-semibold text-red-600">
            Fee details not configured for your profile. Please contact admin.
          </p>
        </div>
      </div>
    );
  }

  if (role !== "STUDENT" && role !== "SCHOOLADMIN" && role !== "SUPERADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #F5F3FF 0%, #E9D5FF 100%)" }}>
        <div className="glass-card rounded-2xl p-6 max-w-md w-full">
          <p className="font-semibold text-red-600">
            Payments are available for students and school admins.
          </p>
        </div>
      </div>
    );
  }

  if (role === "STUDENT" && feeData) {
    const fee = feeData.fee;
    const payments = feeData.payments || [];
    const remainingAmount = fee.remainingFee;
    const payable = plan === 1 ? remainingAmount : remainingAmount / plan;
    const progress =
      fee.finalFee > 0 ? Math.min((fee.amountPaid / fee.finalFee) * 100, 100) : 0;

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    };

    return (
      <div className="min-h-screen px-4 py-8" style={{ background: "linear-gradient(135deg, #F5F3FF 0%, #E9D5FF 100%)" }}>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6"
          >
            <h1 className="text-3xl font-bold mb-2" style={{ color: MAIN_COLOR }}>Payment Portal</h1>
            <p className="text-gray-600">Manage your fees and payment history</p>
          </motion.div>

          {/* Main Payment Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 md:p-8 space-y-6"
          >
            {/* Fee Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass rounded-xl p-4 border" style={{ borderColor: ACCENT_COLOR }}>
                <p className="text-sm text-gray-600 mb-1">Total Fee</p>
                <p className="text-xl font-bold" style={{ color: MAIN_COLOR }}>₹{fee.totalFee}</p>
              </div>
              <div className="glass rounded-xl p-4 border" style={{ borderColor: ACCENT_COLOR }}>
                <p className="text-sm text-gray-600 mb-1">Discount</p>
                <p className="text-xl font-bold" style={{ color: MAIN_COLOR_LIGHT }}>{fee.discountPercent}%</p>
              </div>
              <div className="glass rounded-xl p-4 border" style={{ borderColor: ACCENT_COLOR }}>
                <p className="text-sm text-gray-600 mb-1">Paid</p>
                <p className="text-xl font-bold" style={{ color: MAIN_COLOR }}>₹{fee.amountPaid}</p>
              </div>
              <div className="glass rounded-xl p-4 border" style={{ borderColor: ACCENT_COLOR }}>
                <p className="text-sm text-gray-600 mb-1">Remaining</p>
                <p className="text-xl font-bold text-orange-600">₹{fee.remainingFee}</p>
              </div>
            </div>

            {/* Progress Bar */}
            {fee.finalFee > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Payment Progress</span>
                  <span className="font-semibold">
                    ₹{fee.amountPaid.toFixed(2)} / ₹{fee.finalFee.toFixed(2)}
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${MAIN_COLOR} 0%, ${MAIN_COLOR_LIGHT} 100%)` }}
                  />
                </div>
              </div>
            )}

            {/* Plan Selector */}
            {remainingAmount > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Payment Plan</p>
                <div className="grid grid-cols-2 gap-3">
                  {[1, 3].map((p) => (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      key={p}
                      onClick={() => setPlan(p as 1 | 3)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        plan === p
                          ? "glass-strong"
                          : "glass border-gray-200 hover:border-purple-300"
                      }`}
                      style={plan === p ? { borderColor: MAIN_COLOR } : {}}
                    >
                      <div className="text-left">
                        <p className="font-medium text-gray-800">
                          {p === 1 ? "Pay Full" : `${p} Installments`}
                        </p>
                        <p className="text-lg font-bold mt-1" style={{ color: plan === p ? MAIN_COLOR : "#666" }}>
                          ₹{(remainingAmount / p).toFixed(2)}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Summary */}
            {remainingAmount > 0 && (
              <div className="glass rounded-xl p-4 space-y-2" style={{ backgroundColor: ACCENT_COLOR + "40" }}>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Pay Now</span>
                  <span className="text-2xl font-bold" style={{ color: MAIN_COLOR }}>
                    ₹{payable.toFixed(2)}
                  </span>
                </div>
                {plan !== 1 && (
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Remaining after payment</span>
                    <span>₹{(remainingAmount - payable).toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Pay Button */}
            {remainingAmount <= 0 ? (
              <div className="flex items-center justify-center gap-2 p-4 rounded-xl" style={{ backgroundColor: ACCENT_COLOR + "40" }}>
                <CheckCircle style={{ color: MAIN_COLOR }} />
                <span className="font-semibold" style={{ color: MAIN_COLOR }}>All fees paid. Thank you!</span>
              </div>
            ) : (
              <PayButton amount={payable} feesAllRes={feeData} onSuccess={fetchFee} />
            )}

            {/* Payment History Toggle */}
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl glass hover:glass-strong transition"
            >
              <History size={18} style={{ color: MAIN_COLOR }} />
              <span className="font-medium" style={{ color: MAIN_COLOR }}>
                {showHistory ? "Hide" : "Show"} Payment History
              </span>
            </button>
          </motion.div>

          {/* Payment History */}
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="glass-card rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: MAIN_COLOR }}>
                <TrendingUp size={20} />
                Payment History
              </h2>
              {payments.length > 0 ? (
                <div className="space-y-3">
                  {payments.map((payment: Payment) => (
                    <div
                      key={payment.id}
                      className="glass rounded-xl p-4 border flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                      style={{ borderColor: ACCENT_COLOR }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-800">₹{payment.amount}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            payment.status === "SUCCESS" ? "bg-purple-100" : 
                            payment.status === "FAILED" ? "bg-red-100 text-red-700" : 
                            "bg-yellow-100 text-yellow-700"
                          }`}
                          style={payment.status === "SUCCESS" ? { color: MAIN_COLOR } : undefined}
                          >
                            {payment.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">Payment ID: {payment.razorpayPaymentId.slice(-8)}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(payment.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No payment history available</p>
              )}
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // Admin view
  return (
    <div className="min-h-screen px-4 py-8" style={{ background: "linear-gradient(135deg, #F5F3FF 0%, #E9D5FF 100%)" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 mb-6"
        >
          <h1 className="text-3xl font-bold mb-2" style={{ color: MAIN_COLOR }}>Fee Management</h1>
          <p className="text-gray-600">Manage student fees and payments</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Stats & Students */}
          <div className="lg:col-span-1 space-y-4">
            {/* Stats */}
            {stats && (
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4" style={{ color: MAIN_COLOR }}>Statistics</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-600">Paid</p>
                    <p className="text-xl font-bold" style={{ color: MAIN_COLOR }}>{stats.paid}</p>
                  </div>
                  <div className="glass rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-600">Pending</p>
                    <p className="text-xl font-bold text-orange-600">{stats.pending}</p>
                  </div>
                  <div className="glass rounded-xl p-3 text-center col-span-2">
                    <p className="text-xs text-gray-600">Total Collected</p>
                    <p className="text-2xl font-bold" style={{ color: MAIN_COLOR }}>₹{stats.totalCollected.toFixed(2)}</p>
                  </div>
                  <div className="glass rounded-xl p-3 text-center col-span-2">
                    <p className="text-xs text-gray-600">Total Due</p>
                    <p className="text-2xl font-bold text-red-600">₹{stats.totalDue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Students List */}
            <div className="glass-card rounded-2xl p-4">
              <h2 className="text-lg font-bold mb-3" style={{ color: MAIN_COLOR }}>Students</h2>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {adminFees.map((feeItem) => (
                  <button
                    key={feeItem.student.id}
                    onClick={() => {
                      setSelectedFee(feeItem);
                      setTotalFeeInput(feeItem.totalFee);
                      setDiscountInput(feeItem.discountPercent);
                      setInstallmentsInput(feeItem.installments);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition ${
                      selectedFee?.student.id === feeItem.student.id
                        ? "glass-strong"
                        : "glass border-gray-200 hover:border-purple-300"
                    }`}
                    style={selectedFee?.student.id === feeItem.student.id ? { borderColor: MAIN_COLOR } : {}}
                  >
                    <div className="font-semibold text-gray-800">
                      {feeItem.student.user.name || "Unnamed"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {feeItem.student.user.email || "No email"}
                    </div>
                    {feeItem.student.class && (
                      <div className="text-xs text-gray-600 mt-1">
                        {feeItem.student.class.name}
                        {feeItem.student.class.section ? ` - ${feeItem.student.class.section}` : ""}
                      </div>
                    )}
                  </button>
                ))}
                {adminFees.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No students found.</p>
                )}
              </div>
            </div>
          </div>

          {/* Main Content - Fee Details */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl p-6">
              {selectedFee ? (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-gray-500">Selected Student</p>
                    <h3 className="text-2xl font-bold mt-1" style={{ color: MAIN_COLOR }}>
                      {selectedFee.student.user.name || "Student"}
                    </h3>
                    <p className="text-sm text-gray-500">{selectedFee.student.user.email}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="glass rounded-xl p-4">
                      <p className="text-sm text-gray-600">Total Fee</p>
                      <p className="text-xl font-bold mt-1" style={{ color: MAIN_COLOR }}>₹{selectedFee.totalFee}</p>
                    </div>
                    <div className="glass rounded-xl p-4">
                      <p className="text-sm text-gray-600">Discount</p>
                      <p className="text-xl font-bold mt-1" style={{ color: MAIN_COLOR_LIGHT }}>{selectedFee.discountPercent}%</p>
                    </div>
                    <div className="glass rounded-xl p-4">
                      <p className="text-sm text-gray-600">Payable</p>
                      <p className="text-xl font-bold mt-1" style={{ color: MAIN_COLOR }}>₹{selectedFee.finalFee}</p>
                    </div>
                    <div className="glass rounded-xl p-4">
                      <p className="text-sm text-gray-600">Paid</p>
                      <p className="text-xl font-bold mt-1 text-blue-600">₹{selectedFee.amountPaid}</p>
                    </div>
                  </div>

                  <div className="glass rounded-xl p-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Remaining</span>
                      <span className="font-semibold text-orange-600">₹{selectedFee.remainingFee}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min((selectedFee.amountPaid / selectedFee.finalFee) * 100, 100)}%`,
                        }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${MAIN_COLOR} 0%, ${MAIN_COLOR_LIGHT} 100%)` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Installments allowed: {selectedFee.installments}
                    </p>
                  </div>

                  {/* Update Fees Form */}
                  <div className="glass rounded-xl p-4 space-y-4">
                    <h4 className="font-semibold" style={{ color: MAIN_COLOR }}>Update Fees</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Total Fee</label>
                        <input
                          type="number"
                          value={totalFeeInput}
                          onChange={(e) => setTotalFeeInput(e.target.value === "" ? "" : Number(e.target.value))}
                          className="w-full border rounded-lg px-3 py-2 glass"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Discount %</label>
                        <input
                          type="number"
                          value={discountInput}
                          onChange={(e) => setDiscountInput(e.target.value === "" ? "" : Number(e.target.value))}
                          className="w-full border rounded-lg px-3 py-2 glass"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Installments</label>
                        <input
                          type="number"
                          value={installmentsInput}
                          onChange={(e) => setInstallmentsInput(e.target.value === "" ? "" : Number(e.target.value))}
                          className="w-full border rounded-lg px-3 py-2 glass"
                        />
                      </div>
                    </div>
                    <button
                      disabled={saving}
                      onClick={async () => {
                        if (!selectedFee) return;
                        setSaving(true);
                        try {
                          const res = await fetch(`/api/fees/student/${selectedFee.student.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              totalFee: totalFeeInput === "" ? undefined : Number(totalFeeInput),
                              discountPercent: discountInput === "" ? undefined : Number(discountInput),
                              installments: installmentsInput === "" ? undefined : Number(installmentsInput),
                            }),
                          });
                          const data = await res.json();
                          if (!res.ok) {
                            alert(data.message || "Failed to update fee");
                            return;
                          }
                          const updatedFee = data.fee as StudentFee;
                          const merged: FeeWithStudent = { ...updatedFee, student: selectedFee.student };
                          setSelectedFee(merged);
                          setAdminFees((prev) =>
                            prev.map((f) => (f.student.id === selectedFee.student.id ? merged : f))
                          );
                          fetchAdminSummary();
                        } finally {
                          setSaving(false);
                        }
                      }}
                      className="w-full py-3 rounded-lg font-semibold text-white transition disabled:opacity-60"
                      style={{ backgroundColor: MAIN_COLOR }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-12">Select a student to view payment details</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
