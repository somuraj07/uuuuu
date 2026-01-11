"use client";

import { ChevronDown, User } from "lucide-react";
import { useEffect, useState } from "react";

type School = {
  id: string;
  name?: string;
  icon?: string | null;
};

export default function MobileTopBar() {
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const res = await fetch("/api/school/mine", {
          credentials: "include",
        });
        const data = await res.json();

        if (data?.school) {
          setSchool(data.school);
        }
      } catch (err) {
        console.error("Failed to load school", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchool();
  }, []);

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-300">
      {/* LEFT : LOGO + SCHOOL NAME */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-9 h-9 rounded-full bg-[#43b771] flex items-center justify-center overflow-hidden shrink-0">
          {school?.icon ? (
            <img
              src={school.icon}
              alt="School Logo"
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-white font-bold">
              {school?.name?.[0] ?? "S"}
            </span>
          )}
        </div>

        <span className="font-semibold text-sm truncate">
          {loading ? "Loading..." : school?.name ?? "School"}
        </span>
      </div>

      {/* RIGHT : PROFILE SWITCHER */}
      <div className="flex items-center gap-2">
        <User size={20} className="text-gray-600" />
        <ChevronDown size={18} className="text-gray-500" />
      </div>
    </div>
  );
}
