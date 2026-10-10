import type { Metadata, Viewport } from "next";
import { AdminApp } from "@/components/admin/admin-app";

export const metadata: Metadata = {
  title: "Hays",
  robots: { index: false, follow: false },
  manifest: "/admin.webmanifest",
  icons: { apple: "/admin-apple-icon.png" },
  appleWebApp: {
    capable: true,
    title: "Hays",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#13264b",
};

const AdminPage = () => <AdminApp />;

export default AdminPage;
