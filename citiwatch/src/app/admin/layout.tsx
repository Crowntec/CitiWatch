import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "CitiWatch administrative dashboard for managing complaints, users, categories, and system settings. Monitor platform activity and ensure efficient citizen service delivery.",
  keywords: ["admin dashboard", "complaint management", "user management", "system administration", "municipal services"],
  openGraph: {
    title: "Admin Dashboard - CitiWatch",
    description: "Administrative interface for managing CitiWatch platform operations and citizen services.",
  },
  robots: {
    index: false, // Admin pages should not be indexed
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
