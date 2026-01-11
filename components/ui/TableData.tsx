"use client";

import { LIGHT_BG_COLOR } from "@/constants/colors";
import { ReactNode } from "react";

export type Column<T> = {
  header: string;
  accessor?: keyof T;
  render?: (row: T, index: number) => ReactNode;
  align?: "left" | "center" | "right";
};

export type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyText?: string;
};

export default function DataTable<T>({
  columns,
  data,
  loading,
  emptyText = "No data found",
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden border border-gray-200 rounded-xl animate-slide-in-left">
      <table className="w-full text-sm border-collapse">
        <thead
          style={{ backgroundColor: LIGHT_BG_COLOR }}
          className="text-black border-b border-gray-200"
        >
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`p-3 font-medium text-${col.align ?? "left"}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* ================= BODY ================= */}
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="p-6 text-center text-gray-400"
              >
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="p-6 text-center text-gray-400"
              >
                {emptyText}
              </td>
            </tr>
          ) : ( 
            data.map((row, index) => (
              <tr
                key={index}
                style={{ animationDelay: `${index * 60}ms` }}
                className="
                  border-b border-gray-200 last:border-b-0
                  hover:bg-gray-50
                  animate-slide-in-left
                "
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={`p-3 text-${col.align ?? "left"}`}
                  >
                    {col.render
                      ? col.render(row, index)
                      : (row[col.accessor as keyof T] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
