import { FiTrash, FiUser } from "react-icons/fi";
import { Teacher } from "@/interfaces/dashboard";

export default function TeacherMobileCard({
  teacher,
}: {
  teacher: Teacher;
}) {
  return (
    <div className="bg-white border rounded-xl p-4 space-y-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
          <FiUser />
        </div>

        <div className="flex-1">
          <p className="font-semibold text-sm">{teacher.name}</p>
          <p className="text-xs text-gray-500">{teacher.email}</p>
        </div>

        <button className="text-red-500">
          <FiTrash />
        </button>
      </div>

      <div className="text-xs text-gray-600 grid grid-cols-2 gap-2">
        <p>
          <span className="font-medium">Phone:</span> {teacher.mobile}
        </p>
        <p>
          <span className="font-medium">Subject:</span>{" "}
          <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700">
            {teacher.subject}
          </span>
        </p>
      </div>
    </div>
  );
}
