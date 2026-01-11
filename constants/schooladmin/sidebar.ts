import {
  FiHome,
  FiBookOpen,
  FiUsers,
  FiUser,
  FiCalendar,
  FiCreditCard,
  FiFileText,
  FiBarChart2,
  FiLogOut,
  FiClock,
  FiSearch,
} from "react-icons/fi";

export type SidebarItem = {
  label: string;
  tab?: string;              // used for active state
  href?: string;             // navigation
  icon: any;
  action?: "logout";         // special actions
};

export const SCHOOLADMIN_MENU_ITEMS: SidebarItem[] = [
  {
    label: "Dashboard",
    tab: "dashboard",
    href: "/frontend/schooladmin/dashboard",
    icon: FiHome,
  },
  {
    label: "Classes",
    tab: "classes",
    href: "/frontend/schooladmin/dashboard?tab=classes",
    icon: FiBookOpen,
  },
  {
    label: "Students",
    tab: "students",
    href: "/frontend/schooladmin/dashboard?tab=students",
    icon: FiUsers,
  },
  {
    label: "Student Lookup",
    tab: "student-lookup",
    href: "/frontend/schooladmin/dashboard?tab=student-lookup",
    icon: FiSearch,
  },
  {
    label: "Teachers",
    tab: "teachers",
    href: "/frontend/schooladmin/dashboard?tab=teachers",
    icon: FiUser,
  },
  {
    label: "Teacher Leaves",
    tab: "teacher-leaves",
    href: "/frontend/schooladmin/dashboard?tab=teacher-leaves",
    icon: FiCalendar,
  },
  {
    label: "Teacher Attendance",
    tab: "teacher-attendance",
    href: "/frontend/schooladmin/dashboard?tab=teacher-attendance",
    icon: FiCalendar,
  },
  {
    label: "Workshops",
    tab: "workshops",
    href: "/frontend/schooladmin/dashboard?tab=workshops",
    icon: FiCalendar,
  },
  {
    label: "Newsfeed",
    tab: "newsfeed",
    href: "/frontend/schooladmin/dashboard?tab=newsfeed",
    icon: FiFileText,
  },
  {
    label: "TC Approvals",
    tab: "tc-approvals",
    href: "/frontend/schooladmin/dashboard?tab=tc-approvals",
    icon: FiFileText,
  },
  {
    label: "Fee Payments",
    tab: "payments",
    href: "/frontend/schooladmin/dashboard?tab=payments",
    icon: FiCreditCard,
  },
  {
    label: "Timetable",
    tab: "timetable",
    href: "/frontend/schooladmin/dashboard?tab=timetable",
    icon: FiClock,
  },
  {
    label: "Exams",
    tab: "exams",
    href: "/frontend/schooladmin/dashboard?tab=exams",
    icon: FiFileText,
  },
  {
    label: "Analysis",
    tab: "analysis",
    href: "/frontend/schooladmin/dashboard?tab=analysis",
    icon: FiBarChart2,
  },
  // {
  //   label: "New User",
  //   tab: "new-user",
  //   href: "/frontend/schooladmin/dashboard?tab=new-user",
  //   icon: FiUser,
  // },
  {
    label: "Logout",
    icon: FiLogOut,
    action: "logout",
  },
];
