'use client'

import Link from "next/link"
import { ReactNode } from "react"


interface Props {
    to: string,
    children: ReactNode
}

export default function Router({ to, children }: Props) {
    return <Link href={to}>
        {children}
    </Link>
}
