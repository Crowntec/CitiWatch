import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Categories",
  description: "Explore all available complaint categories on CitiWatch. From infrastructure and public safety to environmental issues and municipal services - find the right category for your concern.",
  keywords: ["complaint categories", "municipal issues", "public services", "infrastructure", "environmental issues", "community concerns"],
  openGraph: {
    title: "Complaint Categories - CitiWatch",
    description: "Browse all available categories for reporting municipal issues and community concerns.",
  },
};

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
