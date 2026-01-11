
import { IMenuItem } from "@/interfaces/dashboard";
import {
  FiHome,
  FiPlusCircle,
  FiUsers,
  FiCreditCard,
  FiLogOut,
} from "react-icons/fi";

export const SUPERADMIN_SIDEBAR_ITEMS:IMenuItem[] = [
  {
    label: "Dashboard",
    href: "/frontend/superadmin/dashboard",
    tab: "dashboard",
    icon: FiHome,
  },
  {
    label: "Add School",
    href: "/frontend/superadmin/dashboard?tab=addschool",
    tab: "addschool",
    icon: FiPlusCircle,
  },
  {
    label: "Schools",
    href: "/frontend/superadmin/dashboard?tab=schools",
    tab: "schools",
    icon: FiUsers,
  },
  {
    label: "Fees Transactions",
    href: "/frontend/superadmin/dashboard?tab=transactions",
    tab: "transactions",
    icon: FiCreditCard,
  },
  {
    label: "Sign Out",
    action: "logout",
    icon: FiLogOut,
    href: "#",
  },
];
