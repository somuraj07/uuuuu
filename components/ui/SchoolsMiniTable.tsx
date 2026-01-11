import { LIGHT_BG_COLOR } from "@/constants/colors";
import DataTable, { Column } from "./TableData";

interface School {
  id: string;
  name: string;
  studentCount: number;
}

export default function SchoolsMiniTable({
  schools,
}: {
  schools: School[];
}) {

  const getSchoolsMiniColumns = (): Column<School>[] => [
  {
    header: "#",
    render: (_: School, index: number) =>
      String(index + 1).padStart(2, "0"),
  },
  {
    header: "Name",
    render: (school: School) => school.name,
  },
  {
    header: "Total No. of Students",
    align: "right",
    render: (school: School) => (
      <span style={{backgroundColor:`${LIGHT_BG_COLOR}`}} className="px-3 py-1 rounded-full text-xs">
        {school.studentCount}
      </span>
    ),
  },
];

  return (
    <DataTable
      columns={getSchoolsMiniColumns()}
      data={Array.isArray(schools) ? schools : []}
    />
  );
}
