"use client"

import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export function IconLoadingSpinner({
  className,
}: {
  className?: string
}) {
  return (
    <Loader2
      className={cn(
        "animate-spin size-8",
        className,
      )}
    />
  )
}