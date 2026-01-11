import CreateClassForm from "@/components/ui/SchoolAdminClassForm";

interface Props {
  teachers: any[];
  loadingTeachers: boolean;
  reload: () => void;
}

export default function SchoolAdminClassesPage({
  teachers,
  loadingTeachers,
  reload,
}: Props) {
  return (
    <div className="p-0">
      <h1 className="text-2xl font-semibold">Create New Class</h1>
      <p className="text-sm text-gray-500 ">
        Add a new class to your school management system
      </p>

      <div className="max-w-xl mx-auto">
        <CreateClassForm
          teachers={teachers}
          loadingTeachers={loadingTeachers}
          reload={reload}
        />
      </div>
    </div>
  );
}
