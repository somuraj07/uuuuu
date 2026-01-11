"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, User, DollarSign, BookOpen, Calendar, BarChart3, Edit2, Save, X, Plus } from "lucide-react";
import { MAIN_COLOR, ACCENT_COLOR, GRADIENT_PRIMARY } from "@/constants/colors";
import { toast } from "@/services/toast/toast.service";

interface StudentData {
  student: {
    id: string;
    userId: string;
    name: string;
    email: string;
    AdmissionNo: string;
    fatherName: string;
    aadhaarNo: string;
    phoneNo: string;
    rollNo: string | null;
    dob: string;
    address: string | null;
    class: { id: string; name: string; section: string } | null;
  };
  fee: {
    id: string;
    totalFee: number;
    discountPercent: number;
    finalFee: number;
    amountPaid: number;
    remainingFee: number;
    installments: number;
  } | null;
  payments: any[];
  marks: any[];
  marksByExam: any[];
  attendances: any[];
  attendanceStats: {
    total: number;
    present: number;
    absent: number;
    late: number;
    percent: number;
  };
  exams: any[];
}

export default function StudentLookupPage() {
  const [admissionNo, setAdmissionNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [editingFee, setEditingFee] = useState(false);
  const [feeInputs, setFeeInputs] = useState({ totalFee: 0, discountPercent: 0, installments: 3 });
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");

  const searchStudent = async () => {
    if (!admissionNo.trim()) {
      toast.error("Please enter an admission number");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/student/by-admission?admissionNo=${admissionNo}`);
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Student not found");
        setStudentData(null);
        return;
      }

      setStudentData(data);
      if (data.fee) {
        setFeeInputs({
          totalFee: data.fee.totalFee,
          discountPercent: data.fee.discountPercent,
          installments: data.fee.installments,
        });
      }
      toast.success("Student found!");
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Error searching for student");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFee = async () => {
    if (!studentData?.student?.id) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/fees/student/${studentData.student.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalFee: feeInputs.totalFee,
          discountPercent: feeInputs.discountPercent,
          installments: feeInputs.installments,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to update fees");
        return;
      }

      toast.success("Fees updated successfully!");
      setEditingFee(false);
      // Refresh student data
      searchStudent();
    } catch (error) {
      console.error("Update fee error:", error);
      toast.error("Error updating fees");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async () => {
    if (!studentData?.student?.id || !paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/payment/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: studentData.student.id,
          amount: parseFloat(paymentAmount),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to add payment");
        return;
      }

      toast.success("Payment added successfully!");
      setPaymentAmount("");
      setShowPaymentForm(false);
      // Refresh student data
      searchStudent();
    } catch (error) {
      console.error("Add payment error:", error);
      toast.error("Error adding payment");
    } finally {
      setLoading(false);
    }
  };

  if (!studentData) {
    return (
      <div className="p-4 sm:p-6 min-h-screen" style={{ background: GRADIENT_PRIMARY }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-8"
          >
            <h1 className="text-3xl font-bold mb-4" style={{ color: MAIN_COLOR }}>
              Student Lookup
            </h1>
            <p className="text-gray-600 mb-6">
              Enter a student's admission number to view all details
            </p>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter admission number"
                value={admissionNo}
                onChange={(e) => setAdmissionNo(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && searchStudent()}
                className="flex-1 px-4 py-3 rounded-xl border glass focus:outline-none focus:ring-2 transition"
                style={{ borderColor: ACCENT_COLOR }}
              />
              <motion.button
                onClick={searchStudent}
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 disabled:opacity-60"
                style={{ backgroundColor: MAIN_COLOR }}
              >
                <Search size={20} />
                {loading ? "Searching..." : "Search"}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 min-h-screen" style={{ background: GRADIENT_PRIMARY }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Search */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: MAIN_COLOR }}>
                Student Details
              </h1>
              <p className="text-gray-600">Comprehensive student information</p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by admission number"
                value={admissionNo}
                onChange={(e) => setAdmissionNo(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && searchStudent()}
                className="flex-1 sm:w-64 px-4 py-2 rounded-xl border glass focus:outline-none focus:ring-2 transition text-sm"
                style={{ borderColor: ACCENT_COLOR }}
              />
              <motion.button
                onClick={searchStudent}
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-xl text-white font-semibold flex items-center gap-2 disabled:opacity-60"
                style={{ backgroundColor: MAIN_COLOR }}
              >
                <Search size={18} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Student Basic Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
              style={{ backgroundColor: MAIN_COLOR }}
            >
              {studentData.student.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{studentData.student.name}</h2>
              <p className="text-gray-600">
                {studentData.student.class ? `${studentData.student.class.name} - ${studentData.student.class.section}` : "No Class"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Admission Number</p>
              <p className="font-semibold">{studentData.student.AdmissionNo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold">{studentData.student.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Father's Name</p>
              <p className="font-semibold">{studentData.student.fatherName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-semibold">{studentData.student.phoneNo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Roll Number</p>
              <p className="font-semibold">{studentData.student.rollNo || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-semibold">{new Date(studentData.student.dob).toLocaleDateString()}</p>
            </div>
          </div>
        </motion.div>

        {/* Fees Section */}
        {studentData.fee && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <DollarSign size={24} style={{ color: MAIN_COLOR }} />
                <h3 className="text-xl font-bold" style={{ color: MAIN_COLOR }}>
                  Fee Details
                </h3>
              </div>
              {!editingFee ? (
                <button
                  onClick={() => setEditingFee(true)}
                  className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                  style={{ backgroundColor: ACCENT_COLOR, color: MAIN_COLOR }}
                >
                  <Edit2 size={16} />
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateFee}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2 disabled:opacity-60"
                    style={{ backgroundColor: MAIN_COLOR }}
                  >
                    <Save size={16} />
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingFee(false);
                      if (studentData.fee) {
                        setFeeInputs({
                          totalFee: studentData.fee.totalFee,
                          discountPercent: studentData.fee.discountPercent,
                          installments: studentData.fee.installments,
                        });
                      }
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-medium border flex items-center gap-2"
                    style={{ borderColor: ACCENT_COLOR }}
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {editingFee ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Fee</label>
                  <input
                    type="number"
                    value={feeInputs.totalFee}
                    onChange={(e) => setFeeInputs({ ...feeInputs, totalFee: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-lg border glass focus:outline-none focus:ring-2 transition"
                    style={{ borderColor: ACCENT_COLOR }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount %</label>
                  <input
                    type="number"
                    value={feeInputs.discountPercent}
                    onChange={(e) => setFeeInputs({ ...feeInputs, discountPercent: parseFloat(e.target.value) || 0 })}
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 rounded-lg border glass focus:outline-none focus:ring-2 transition"
                    style={{ borderColor: ACCENT_COLOR }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Installments</label>
                  <input
                    type="number"
                    value={feeInputs.installments}
                    onChange={(e) => setFeeInputs({ ...feeInputs, installments: parseInt(e.target.value) || 3 })}
                    min="1"
                    className="w-full px-4 py-2 rounded-lg border glass focus:outline-none focus:ring-2 transition"
                    style={{ borderColor: ACCENT_COLOR }}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass rounded-xl p-4">
                  <p className="text-sm text-gray-600">Total Fee</p>
                  <p className="text-xl font-bold" style={{ color: MAIN_COLOR }}>₹{studentData.fee.totalFee}</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <p className="text-sm text-gray-600">Discount</p>
                  <p className="text-xl font-bold" style={{ color: MAIN_COLOR }}>{studentData.fee.discountPercent}%</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <p className="text-sm text-gray-600">Paid</p>
                  <p className="text-xl font-bold" style={{ color: MAIN_COLOR }}>₹{studentData.fee.amountPaid}</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <p className="text-sm text-gray-600">Remaining</p>
                  <p className="text-xl font-bold" style={{ color: MAIN_COLOR }}>₹{studentData.fee.remainingFee}</p>
                </div>
              </div>
            )}

            {/* Payment Entry Form */}
            <div className="mt-6 pt-6 border-t" style={{ borderColor: ACCENT_COLOR }}>
              {!showPaymentForm ? (
                <button
                  onClick={() => setShowPaymentForm(true)}
                  className="w-full px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition"
                  style={{ backgroundColor: ACCENT_COLOR, color: MAIN_COLOR }}
                >
                  <Plus size={18} />
                  Add Payment
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="Enter amount paid"
                      className="w-full px-4 py-2 rounded-lg border glass focus:outline-none focus:ring-2 transition"
                      style={{ borderColor: ACCENT_COLOR }}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddPayment}
                      disabled={loading}
                      className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center justify-center gap-2 disabled:opacity-60"
                      style={{ backgroundColor: MAIN_COLOR }}
                    >
                      <Save size={16} />
                      {loading ? "Processing..." : "Add Payment"}
                    </button>
                    <button
                      onClick={() => {
                        setShowPaymentForm(false);
                        setPaymentAmount("");
                      }}
                      className="px-4 py-2 rounded-lg text-sm font-medium border flex items-center gap-2"
                      style={{ borderColor: ACCENT_COLOR }}
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Attendance Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Calendar size={24} style={{ color: MAIN_COLOR }} />
            <h3 className="text-xl font-bold" style={{ color: MAIN_COLOR }}>
              Attendance
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600">Present</p>
              <p className="text-2xl font-bold" style={{ color: MAIN_COLOR }}>{studentData.attendanceStats.present}</p>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600">Absent</p>
              <p className="text-2xl font-bold" style={{ color: MAIN_COLOR }}>{studentData.attendanceStats.absent}</p>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600">Late</p>
              <p className="text-2xl font-bold" style={{ color: MAIN_COLOR }}>{studentData.attendanceStats.late}</p>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600">Percentage</p>
              <p className="text-2xl font-bold" style={{ color: MAIN_COLOR }}>{studentData.attendanceStats.percent.toFixed(1)}%</p>
            </div>
          </div>
        </motion.div>

        {/* Marks by Exam */}
        {studentData.marksByExam.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <BookOpen size={24} style={{ color: MAIN_COLOR }} />
              <h3 className="text-xl font-bold" style={{ color: MAIN_COLOR }}>
                Exam Marks
              </h3>
            </div>
            <div className="space-y-4">
              {studentData.marksByExam.map((examData) => (
                <div key={examData.examId} className="glass rounded-xl p-4">
                  <h4 className="font-semibold text-lg mb-2">{examData.examName}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    {examData.marks.map((mark: any) => (
                      <div key={mark.id}>
                        <span className="text-gray-600">{mark.subject}:</span>{" "}
                        <span className="font-semibold" style={{ color: MAIN_COLOR }}>{mark.marks}</span>
                      </div>
                    ))}
                  </div>
                  {examData.totalSubjects > 0 && (
                    <p className="mt-2 text-sm text-gray-600">
                      Average: <span className="font-semibold" style={{ color: MAIN_COLOR }}>{examData.averageMarks.toFixed(2)}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Performance Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 size={24} style={{ color: MAIN_COLOR }} />
            <h3 className="text-xl font-bold" style={{ color: MAIN_COLOR }}>
              Performance Overview
            </h3>
          </div>
          <p className="text-gray-600 text-center py-8">
            Performance analytics and trends would be displayed here
          </p>
        </motion.div>
      </div>
    </div>
  );
}
