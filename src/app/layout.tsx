import { Metadata } from "next"
import { Providers } from "./providers/chakraProvider"
import { AuthProvider } from "./providers/AuthProvider"

export const metadata: Metadata = {
    title: 'Authoriser',
    description: 'Next Level OAuth Solution',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <Providers>
                <AuthProvider requireLogin={true} exception={{"/":null, "/token":null}}>
                    {children}
                    </AuthProvider>
                </Providers>
            </body>
        </html>
    )
}
