"use client";

import { useState } from "react";
import DataTable, { Column } from "@/components/ui/TableData";
import { useStudents } from "@/hooks/schooladmin/useStudents";
import { toast } from "@/services/toast/toast.service";
import { Trash2 } from "lucide-react";
import { MAIN_COLOR } from "@/constants/colors";
import SelectField from "@/components/ui/common/SelectField";
import StudentMobileCard from "@/components/responsivescreens/schooladmin/StudentMobileCard";
import AddStudentModal from "@/components/ui/models/AddStudentModal";
import UploadCSVModal from "@/components/ui/models/UploadCsvDataModel";
import { useDashboardData } from "@/hooks/useSchoolAdminDashboard";

export type Student = {
  id: string;
  userId: string;
  adhaarNumber: string;
  address: string;
  class: { id: string; name: string; section: string };
  dob: string;
  name: string;
  email: string;
  rollNo: string;
  phoneNo: string;
  user: { email: string; name: string; id: string };
};

export default function StudentsManagementPage({
  classes,
  reload,
}: {
  classes: any[];
  reload: () => void;
}) {
  const [selectedClass, setSelectedClass] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const { students, loading, refresh } = useStudents(selectedClass);

  const { reloadDashboard } = useDashboardData();

  const selectedClassObj = classes.find((c) => c.id === selectedClass);

  /* ---------------- Table Columns ---------------- */
  const columns: Column<Student>[] = [
    {
      header: "Roll No",
      render: (row) => row.rollNo || "-",
    },
    {
      header: "Name",
      render: (row) => row.user?.name || "-",
    },
    {
      header: "Email",
      render: (row) => row.user?.email || "-",
    },
    {
      header: "Parent Contact",
      render: (row) => row.phoneNo || "-",
    },
    {
      header: "Action",
      align: "left",
      render: () => (
        <Trash2
          size={16}
          className="text-gray-400 hover:text-red-500 cursor-pointer"
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* ================= Header ================= */}
      <div>
        <h1 className="text-2xl font-semibold">Students Management</h1>
        <p className="text-sm text-gray-500">
          Add and manage students by class
        </p>
      </div>

      {/* ================= Class + Bulk Upload ================= */}
      <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col lg:flex-row gap-4 justify-between">
        {/* Select Class */}
        <div className="w-full lg:w-1/2">
          <SelectField
            label="Select Class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            options={classes.map((c) => ({
              name: `${c.name} - ${c.section}`,
              id: c.id,
            }))}
          />
        </div>

        {/* Bulk Upload */}
        <div className="w-full lg:w-1/2">
          <label className="text-sm text-black">
            Bulk Upload (CSV)
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => {
                !selectedClass
                  ? toast.error("Please select a class first")
                  : setShowUpload(true);
              }}
              className="flex-1 border rounded-lg px-3 py-2 text-sm h-11 border-gray-300"
            >
              ⬆ Upload CSV
            </button>
            <button className="border rounded-lg px-3 py-2 text-sm text-green-600">
              ⬇ Template
            </button>
          </div>
        </div>
      </div>

      {/* ================= Students Table ================= */}
      {/* ================= Students List ================= */}
      {!selectedClass ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow-sm">
          Please select a class to view and manage students
        </div>
      ) : (
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <h2 className="font-semibold">
                Students in {selectedClassObj?.name} -{" "}
                {selectedClassObj?.section}
              </h2>
              <p className="text-sm text-gray-500">
                Total: {students.length} students
              </p>
            </div>

            <button
              onClick={() => setShowAdd(true)}
              style={{ backgroundColor: MAIN_COLOR }}
              className="text-white px-4 py-2 rounded-lg text-sm w-full sm:w-auto"
            >
              + Add Student
            </button>
          </div>

          {/* MOBILE VIEW */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {loading ? (
              <p className="text-center text-gray-400">Loading...</p>
            ) : students.length === 0 ? (
              <p className="text-center text-gray-400">No students found</p>
            ) : (
              students.map((student, index) => (
                <StudentMobileCard
                  key={student.id}
                  student={student}
                  index={index}
                />
              ))
            )}
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden md:block">
            <DataTable<Student>
              columns={columns}
              data={students}
              loading={loading}
              emptyText="No students found"
            />
          </div>
        </div>
      )}

      {/* ================= Modals ================= */}
      {showAdd && (
        <AddStudentModal
          classId={selectedClass}
          onClose={() => setShowAdd(false)}
          onSuccess={() => {
            refresh();
            reload();
            reloadDashboard();
            setShowAdd(false);
          }}
        />
      )}

      {showUpload && (
        <UploadCSVModal
          classId={selectedClass}
          onClose={() => setShowUpload(false)}
          onSuccess={() => {
            refresh();
            reloadDashboard();
            reload();
            setShowUpload(false);
          }}
        />
      )}
    </div>
  );
}
