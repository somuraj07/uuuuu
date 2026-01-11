"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { SidebarItem } from "@/constants/schooladmin/sidebar";
import BrandLogo from "../ui/common/BrandLogo";

import { MAIN_COLOR, ACCENT_COLOR } from "@/constants/colors";

const ANIMATE_BG = ACCENT_COLOR + "80";
const FINAL_BG = ACCENT_COLOR + "60";
const ACTIVE_TEXT = MAIN_COLOR;

type School = {
  id: string;
  name?: string;
  icon?: string | null;
};

export default function SchoolAdminSideBar({
  menuItems,
  onClose,
}: {
  menuItems: SidebarItem[];
  onClose?: () => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "dashboard";

  const [schoolName, setSchoolName] = useState<string>("Loading...");
  const [school, setSchool] = useState<School | null>(null); 

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const res = await fetch("/api/school/mine", {
          credentials: "include",
        });

        const data = await res.json();

        if (data?.school) {
          setSchool(data.school); 
          setSchoolName(data.school.name || "School");
        }
      } catch (err) {
        console.error("Failed to fetch school", err);
      }
    };

    fetchSchool();
  }, []);

  const handleClick = async (item: SidebarItem) => {
    if (item.action === "logout") {
      await signOut({ callbackUrl: "/" });
      return;
    }

    if (item.href) {
      router.push(item.href);
      onClose?.();
    }
  };

  return (
    <aside className="relative w-64 bg-white h-full flex flex-col border-r border-gray-300">
      
      {/* TOP PROFILE / BRAND */}
      <div className="px-4 py-5 flex items-center gap-3 border-b border-gray-200">
        <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: MAIN_COLOR }}>
          {school?.icon ? (
            <img
              src={school.icon}
              alt="School Logo"
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-white font-bold">
              {schoolName?.[0] ?? "S"}
            </span>
          )}
        </div>

        <div>
          <p className="font-semibold text-sm text-gray-900">
            {schoolName}
          </p>
          <p className="text-xs text-gray-500">
            Management System
          </p>
        </div>
      </div>

      {/* SIDEBAR MENU */}
      <div className="flex-1 px-3 py-4 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = item.tab === activeTab;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.label}
              onClick={() => handleClick(item)}
              whileHover={{ x: 3, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              animate={{ scale: isActive ? 1.06 : 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full mb-2 overflow-hidden rounded-xl"
            >
              {isActive && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  style={{ originY: 0, backgroundColor: ACCENT_COLOR + "60" }}
                  className="absolute inset-0"
                />
              )}

              <div
                className={`relative z-10 flex items-center gap-3 px-4 py-3 text-sm font-medium ${
                  isActive
                    ? "shadow-md"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <Icon
                  className="text-lg"
                  style={{
                    color: isActive ? ACTIVE_TEXT : "#9ca3af",
                  }}
                />
                <span
                  style={{
                    color: isActive ? ACTIVE_TEXT : "#6b7280",
                  }}
                >
                  {item.label}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* BOTTOM ADMIN PROFILE */}
      <div className="px-4 py-4 border-t border-gray-300 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm font-semibold" style={{ backgroundColor: MAIN_COLOR }}>
          AD
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">
            {schoolName}
          </p>
          <p className="text-xs text-gray-500">
            School Admin
          </p>
        </div>
      </div>

      {/*  BRAND LOGO */}
      <div className="border-t border-gray-100">
        <div className="h-14 w-full overflow-hidden px-4 flex items-center">
          <div className="-ml-8 scale-[0.9]">
            <BrandLogo isbrandLogoWhite={false} />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute top-0 -right-6 h-full w-6 bg-gradient-to-r from-gray-300/40 via-gray-200/20 to-transparent" />
    </aside>
  );
}
