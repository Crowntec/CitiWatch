import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Dashboard",
  description: "Your personal CitiWatch dashboard for managing complaint submissions, tracking resolution progress, and accessing citizen services. View your complaint history and community impact.",
  keywords: ["user dashboard", "citizen portal", "complaint tracking", "service requests", "personal account"],
  openGraph: {
    title: "Dashboard - CitiWatch",
    description: "Access your personal CitiWatch dashboard to manage complaints and track service requests.",
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
