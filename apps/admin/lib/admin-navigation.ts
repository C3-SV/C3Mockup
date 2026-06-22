import { FiCalendar, FiGrid } from "react-icons/fi";
import type { AdminNavigationItem } from "./admin-types";

export const adminModules: AdminNavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/admin",
    icon: FiGrid,
  },
  {
    id: "events",
    label: "Eventos",
    href: "/admin/events",
    icon: FiCalendar,
  },
];
