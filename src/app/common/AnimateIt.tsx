'use client'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface Props {
    children: ReactNode
}

export default function AnimateIt({ children }: Props) {
    return (
        <motion.div initial={{y:"20px"}} animate={{y:"0"}}  >
            {children}
        </motion.div>
    )
}
