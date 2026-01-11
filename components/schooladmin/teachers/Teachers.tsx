"use client";

import { useState } from "react";
import CommonModal from "@/components/ui/models/CommonModel";
import DataTable, { Column } from "@/components/ui/TableData";
import CommonButton from "@/components/ui/common/CommonButton";
import { Teacher } from "@/interfaces/dashboard";
import { FiPlus, FiTrash, FiUser } from "react-icons/fi";
import TeacherMobileCard from "@/components/responsivescreens/schooladmin/TeachersMobileCard";

import DynamicForm from "@/components/ui/models/DynamicForm";
import { addTeacherFields } from "@/constants/schooladmin/addTeacherForm";


export default function TeachersPage({teachers,reload,loading}:{
  teachers:Teacher[];
  loading:boolean;
  reload:()=>void;
}   ) {
  const [open, setOpen] = useState(false);

  const handleAddTeacher = async (formData: Record<string, any>) => {
    try {
      const res = await fetch("/api/teacher/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to add teacher");
      }

      setOpen(false);
      reload();
    } catch (error) {
      console.error("Add teacher error:", error);
    }
  };

  const columns: Column<Teacher>[] = [
    {
      header: "Name",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-7 sm:h-7 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
            <FiUser className="text-sm" />
          </div>
          <span className="text-sm font-medium whitespace-nowrap">
            {row.name}
          </span>
        </div>
      ),
    },
    {
      header: "Email",
      render: (row) => (
        <span className="text-gray-600 text-sm whitespace-nowrap">
          {row.email}
        </span>
      ),
    },
    {
      header: "Phone",
      render: (row) => (
        <span className="text-gray-600 text-sm whitespace-nowrap">
          {row.mobile}
        </span>
      ),
    },
    {
      header: "Subject",
      render: (row) => (
        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 whitespace-nowrap">
          {row.subjectsTaught}
        </span>
      ),
    },
    {
      header: "Action",
      align: "center",
      render: () => (
        <button className="text-red-500 hover:text-red-600 p-2">
          <FiTrash className="text-base" />
        </button>
      ),
    },
  ];

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-base sm:text-xl font-semibold text-gray-900">
            Teachers Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Manage teaching staff and their details
          </p>
        </div>

        <div className="w-full sm:w-auto">
          <CommonButton
            label="Add Teacher"
            icon={<FiPlus />}
            onClick={() => setOpen(true)}
          />
        </div>
      </div>

      <CommonModal
        open={open}
        onClose={() => setOpen(false)}
        title="Add New Teacher"
      >
        <DynamicForm
          fields={addTeacherFields}
          submitLabel="Add Teacher"
          onSubmit={handleAddTeacher}
          onSuccess={() => {
            setOpen(false);
            reload();
          }}
        />
      </CommonModal>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm sm:text-base font-semibold text-gray-900">
            All Teachers
          </h2>
          <p className="text-xs text-gray-500">
            Total: {teachers.length} teachers
          </p>
        </div>

        <div className="sm:hidden p-4 space-y-3">
          {teachers.length === 0 && !loading && (
            <p className="text-center text-sm text-gray-500">
              No teachers found
            </p>
          )}

          {teachers.map((teacher) => (
            <TeacherMobileCard key={teacher.id} teacher={teacher} />
          ))}
        </div>

        <div className="hidden sm:block relative overflow-x-auto">
          <div className="min-w-[750px] p-3">
            <DataTable
              columns={columns}
              data={teachers.length ? teachers : []}
              loading={loading}
              emptyText="No teachers found"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
