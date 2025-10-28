export interface User {
  _id?: string;
  name: string;
  email?: string;
  phone?: string;
  password?: string;
  profileImage?: string;
  instaUserName?: string;
}

export interface SideNavItem {
  title: string;
  path: string;
  icon?: JSX.Element;
  submenu?: boolean;
  subMenuItems?: SideNavItem[];
}
