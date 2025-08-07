"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { trackLinkClick } from "@/lib/analytics"

interface TrackedLinkProps {
  href: string
  componentName: string
  linkIndex: number
  className?: string
  children: ReactNode
}

export function TrackedLink ({ href, componentName, linkIndex, className, children }: TrackedLinkProps) {
  const handleClick = async () => {
    // Extract text content for tracking
    let linkText = ""
    if (typeof children === "string") {
      linkText = children
    } else if (
      children &&
      typeof children === "object" &&
      "props" in children &&
      children.props &&
      typeof children.props.children === "string"
    ) {
      linkText = children.props.children
    } else {
      linkText = "[Complex content]"
    }

    // Track the click
    const result = await trackLinkClick(componentName, linkIndex, linkText, href)
    console.log("Tracking result:", result);
    localStorage.removeItem('current_task_session');
    
  }

  return (
    <Link href={href} className={className} onClick={handleClick} rel="noopener noreferrer">
      {children}
    </Link>
  )
}
