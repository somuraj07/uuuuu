"use client"

import { useEffect, useState } from "react"
import { MAIN_COLOR } from "@/constants/colors"

type Leave = {
  id: string
  leaveType: string
  reason?: string
  fromDate: string
  toDate: string
  status: string
  days: number | string
}

export default function TeacherLeavesPage() {
  const [leaves, setLeaves] = useState<Leave[]>([])
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    leaveType: "",
    reason: "",
    fromDate: "",
    toDate: "",
    isHalfDay: false,
  })

  const [days, setDays] = useState<number>(0)

  // ---------- Auto-calc days ----------
  useEffect(() => {
    if (form.fromDate && form.toDate) {
      const start = new Date(form.fromDate)
      const end = new Date(form.toDate)

      if (end >= start) {
        const diff =
          Math.floor(
            (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
          ) + 1
        
        // If single day and half day selected, set to 0.5, otherwise use calculated days
        if (diff === 1 && form.isHalfDay) {
          setDays(0.5)
        } else {
          setDays(diff)
        }
      } else {
        setDays(0)
      }
    } else {
      setDays(0)
    }
  }, [form.fromDate, form.toDate, form.isHalfDay])

  // ---------- Fetch leave history ----------
  const fetchLeaves = async () => {
    try {
      const res = await fetch("/api/leaves/my", { credentials: "include" })
      if (!res.ok) return
      const data = await res.json()
      setLeaves(data)
    } catch (err) {
      console.error("Failed to fetch leaves:", err)
    }
  }

  useEffect(() => {
    fetchLeaves()
  }, [])

  // ---------- Submit leave ----------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.leaveType || !form.fromDate || !form.toDate || !form.reason || days <= 0) {
      alert("Please fill all required fields correctly")
      return
    }

    setLoading(true)

    try {
      const payload = {
        leaveType: form.leaveType,
        reason: form.reason,
        fromDate: form.fromDate,
        toDate: form.toDate,
        days: days.toString(), // Convert to string as per schema
      }

      const res = await fetch("/api/leaves/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "Failed to apply leave")
        return
      }

      setForm({ leaveType: "", reason: "", fromDate: "", toDate: "", isHalfDay: false })
      setDays(0)
      fetchLeaves()
      alert("Leave applied successfully ✅")
    } catch (err) {
      console.error(err)
      alert("Network or server error")
    } finally {
      setLoading(false)
    }
  }

  const isSingleDay = form.fromDate && form.toDate && form.fromDate === form.toDate

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Leave Application</h1>
        <p className="text-gray-500 text-sm">
          Apply for leave and view your leave history
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow p-8 max-w-5xl">
        <h2 className="text-lg font-semibold mb-6">Apply for Leave</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium block mb-2">
                Leave Type <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={form.leaveType}
                onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
                className="w-full bg-gray-100 px-4 py-3 rounded-lg text-sm"
              >
                <option value="">Select leave type</option>
                <option value="CASUAL">Casual Leave</option>
                <option value="SICK">Sick Leave</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">
                Number of Days
              </label>
              <input
                readOnly
                value={days === 0.5 ? "0.5 (Half Day)" : days || ""}
                placeholder="Auto-calculated"
                className="w-full bg-gray-100 px-4 py-3 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium block mb-2">
                From Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={form.fromDate}
                onChange={(e) => {
                  setForm({ ...form, fromDate: e.target.value, toDate: e.target.value || form.toDate })
                }}
                className="w-full bg-gray-100 px-4 py-3 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">
                To Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                min={form.fromDate}
                value={form.toDate}
                onChange={(e) => setForm({ ...form, toDate: e.target.value })}
                className="w-full bg-gray-100 px-4 py-3 rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Half Day Option - Only show if single day */}
          {isSingleDay && (
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isHalfDay}
                  onChange={(e) => setForm({ ...form, isHalfDay: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm font-medium">Half Day Leave</span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                Select this if you need leave for only half a day
              </p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium block mb-2">
              Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="w-full bg-gray-100 px-4 py-4 rounded-lg h-28 text-sm"
              placeholder="Enter reason for leave"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 rounded-lg text-white font-semibold ${
              loading ? "bg-gray-400" : ""
            }`}
            style={loading ? {} : { backgroundColor: MAIN_COLOR }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {loading ? "Submitting..." : "Submit Leave Application"}
          </button>
        </form>
      </div>

      <div className="max-w-5xl mt-10">
        <h3 className="text-lg font-semibold mb-4">My Leave Requests</h3>

        {leaves.length === 0 ? (
          <div className="bg-white p-4 rounded-xl shadow-sm text-center text-gray-500">
            No leave requests found
          </div>
        ) : (
          leaves.map((leave) => (
            <div key={leave.id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between mb-3">
              <div>
                <p className="font-medium">{leave.leaveType}</p>
                <p className="text-sm text-gray-500">
                  {new Date(leave.fromDate).toLocaleDateString()} → {new Date(leave.toDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Days: {leave.days === "0.5" || leave.days === 0.5 ? "0.5 (Half Day)" : leave.days}
                </p>
                {leave.reason && (
                  <p className="text-sm text-gray-400 mt-1">{leave.reason}</p>
                )}
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                leave.status === "APPROVED" 
                  ? "bg-purple-100"
                  : leave.status === "REJECTED"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
              style={leave.status === "APPROVED" ? { color: MAIN_COLOR } : undefined}
              >
                {leave.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
