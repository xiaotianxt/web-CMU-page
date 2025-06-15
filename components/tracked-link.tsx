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

export function TrackedLink({ href, componentName, linkIndex, className, children }: TrackedLinkProps) {
  const handleClick = () => {
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
    trackLinkClick(componentName, linkIndex, linkText, href)
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}
