import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your CitiWatch account to report municipal issues, track complaint status, and engage with local government services. Secure access to your citizen portal.",
  keywords: ["login", "sign in", "citizen portal", "account access", "authentication"],
  openGraph: {
    title: "Login - CitiWatch",
    description: "Access your CitiWatch account to manage complaints and track municipal service requests.",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
