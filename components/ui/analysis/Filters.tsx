"use client";

import SelectField from "@/components/ui/common/SelectField";

interface FiltersProps {
  filters?: any;
  onChange: (filters: any) => void;
}

export default function Filters({ filters = {}, onChange }: FiltersProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <SelectField
        label="Parameter"
        value={filters.parameter || ""}
        placeholder="Select parameter"
        options={[
          { id: "enrollment", name: "Student Enrollment" },
          { id: "attendance", name: "Attendance" },
          { id: "fees", name: "Fees Collected" },
        ]}
        onChange={(e) =>
          onChange({ ...filters, parameter: e.target.value })
        }
      />

      <SelectField
        label="Time Period"
        value={filters.period || ""}
        placeholder="Select period"
        disabled={!filters.parameter}
        options={[
          { id: "monthly", name: "Monthly" },
          { id: "yearly", name: "Yearly" },
        ]}
        onChange={(e) =>
          onChange({ ...filters, period: e.target.value })
        }
      />

      <SelectField
        label="Year"
        value={filters.year || ""}
        placeholder="Select year"
        disabled={filters.period !== "yearly"}
        options={[
          { id: "2025", name: "2025" },
        ]}
        onChange={(e) =>
          onChange({ ...filters, year: e.target.value })
        }
      />
    </div>
  );
}
