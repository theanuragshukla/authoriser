import { Metadata } from "next";
import { Providers } from "../providers/chakraProvider";
import { AuthProvider } from "../providers/AuthProvider";
import ProfileProvider from "../providers/ProfileProvider";
import DashLayout from "../layouts/DashLayout";

export const metadata: Metadata = {
  title: "Authoriser",
  description: "Next Level OAuth Solution",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ProfileProvider>
            <AuthProvider
              requireLogin={true}
              exception={{ "/": null, "/token": null }}
            >
              <DashLayout>{children}</DashLayout>
            </AuthProvider>
          </ProfileProvider>
        </Providers>
      </body>
    </html>
  );
}
