import { Metadata } from "next"
import { Providers } from "./providers/chakraProvider"

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
                    {children}
                </Providers>
            </body>
        </html>
    )
}
