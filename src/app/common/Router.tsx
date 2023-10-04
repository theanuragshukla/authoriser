'use client'

import Link from "next/link"
import { ReactNode } from "react"
import {  Url } from "url"


interface Props {
    to: Url,
    children: ReactNode
}

export default function Router({ to, children }: Props) {
    return <Link href={to}>
        {children}
    </Link>
}
