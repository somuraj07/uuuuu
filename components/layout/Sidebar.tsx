"use client";

import { MAIN_COLOR } from "@/constants/colors";
import { IMenuItem } from "@/interfaces/dashboard";
import { useRouter, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react"; // if using NextAuth

export default function Sidebar({ menuItems }: { menuItems: IMenuItem[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";

  const handleClick = async (item: IMenuItem) => {
    if (item.action === "logout") {
      // NextAuth logout
      await signOut({ callbackUrl: "/" });
      return;
    }

    if (item.href) {
      router.push(item.href);
    }
  };

  return (
    <aside className="w-64 bg-white px-3 py-4">
      {menuItems.map((item) => {
        const isActive = item.tab === activeTab;
        const Icon = item.icon;

        return (
          <button
            key={item.label}
            onClick={() => handleClick(item)}
            className={`
              w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-xl
              text-sm font-medium transition
              ${
                isActive
                  ? "text-white shadow-md"
                  : "text-gray-500 hover:bg-gray-100"
              }
            `}
            style={isActive ? styles.activeTab : undefined}
          >
            <Icon
              className={`text-lg ${
                isActive ? "text-white" : "text-gray-400"
              }`}
            />
            <span>{item.label}</span>
          </button>
        );
      })}
    </aside>
  );
}

const styles = {
  activeTab: {
    backgroundColor: MAIN_COLOR,
    color: "white",
    fontWeight: 600,
    borderRadius: "12px",
  },
};
