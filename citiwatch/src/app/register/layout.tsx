import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Create your CitiWatch account to start reporting municipal issues, tracking complaints, and engaging with local government services. Join thousands of active citizens making a difference.",
  keywords: ["register", "sign up", "create account", "citizen registration", "join CitiWatch"],
  openGraph: {
    title: "Register - CitiWatch",
    description: "Create your free CitiWatch account and start engaging with municipal services today.",
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
