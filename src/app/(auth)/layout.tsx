import { AuthProvider } from "../providers/AuthProvider";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AuthProvider requireLogin={false} exception={
        {
            "/token":null
        }
    }>{children}</AuthProvider>;
}
