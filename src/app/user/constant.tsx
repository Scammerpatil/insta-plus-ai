import { SideNavItem } from "@/Types";
import {
  IconLayoutDashboard,
  IconChartLine,
  IconMessage2,
  IconAlertTriangle,
  IconUsersGroup,
  IconWorld,
  IconFileText,
  IconSettings,
  IconRobot,
} from "@tabler/icons-react";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/user/dashboard",
    icon: <IconLayoutDashboard width="22" height="22" />,
  },
  {
    title: "Sentiment Analysis",
    path: "/user/sentiment",
    icon: <IconChartLine width="22" height="22" />,
  },
  {
    title: "Comments & Insights",
    path: "/user/comments",
    icon: <IconMessage2 width="22" height="22" />,
  },
  {
    title: "Account Analysis",
    path: "/user/account",
    icon: <IconUsersGroup width="22" height="22" />,
  },
  {
    title: "Location Trends",
    path: "/user/trends",
    icon: <IconWorld width="22" height="22" />,
  },
  {
    title: "Bot Detection",
    path: "/user/bots",
    icon: <IconRobot width="22" height="22" />,
  },
  {
    title: "Reports",
    path: "/user/reports",
    icon: <IconFileText width="22" height="22" />,
  },
  {
    title: "Settings",
    path: "/user/settings",
    icon: <IconSettings width="22" height="22" />,
  },
];
