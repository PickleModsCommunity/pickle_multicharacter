"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"

type UpdateInfo = {
  version: string
  date: string
  changes: string[]
}

export default function UpdatesList({ updates }: { updates: UpdateInfo[] }) {
    const [expandedVersion, setExpandedVersion] = useState<number>(-1)

    const toggleExpand = (index: number) => {
        if (expandedVersion == index) {
            setExpandedVersion(-1)
        } else {
            setExpandedVersion(index)
        }
    }

  return (
    <>
        {updates.map((update, index) => (
            <div key={update.version} className="h-full bg-background/50 border-none p-4 rounded-md flex flex-col gap-4 cursor-pointer" onClick={() => toggleExpand(index)}>
                <div
                    className="flex flex-row items-center justify-between"
                >
                    <div className="flex items-center gap-2 justify-between w-full">
                    <div className="flex items-center gap-2">
                        {expandedVersion == index ? (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        ) : (
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div className="text-lg font-semibold">Update {update.version}</div>
                    </div>
                    <Badge className="bg-background/50 text-primary">
                        {update.date}
                    </Badge>
                    </div>
                </div>

                <AnimatePresence>
                    {expandedVersion == index && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="bg-background/50 p-4 rounded-md">
                            {update.changes.map((change, i) => (
                                <div key={i} className="flex flex-row gap-2">
                                    <div className="text-primary">•</div>
                                    <div className="">{change}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                    )}
                </AnimatePresence>
            </div>
        ))}
    </>
  )
}