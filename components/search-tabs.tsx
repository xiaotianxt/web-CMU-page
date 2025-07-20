'use client'

import { TrackedLink } from "@/components/tracked-link"
import { usePathname, useSearchParams } from "next/navigation"

interface SearchTabsProps {
  currentPage?: string
}

export function SearchTabs({ currentPage = "all" }: SearchTabsProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const match = pathname.match(/^(.*?)(\/\d+)?\/?$/)
  const basePath = match ? match[1].split('/')[1] ? `/${match[1].split('/')[1]}` : "" : "";

  //  href for 'All' tab
  let allHref = "/"

  if (pathname.endsWith("/ai-mode")) {
    // AI Mode 
    const from = searchParams.get("from")
    allHref = from || "/" 
  } else {
    // not AI mode, turn to 1
    const parts = pathname.split("/").filter(Boolean)
    if (parts.length >= 4) {
      parts[parts.length - 1] = "1"
      allHref = "/" + parts.join("/")
    }
  }

  const tabs = [
    { name: "AI Mode", key: "ai-mode", href: `${basePath}/ai-mode?from=${pathname}` },
    { name: "All", key: "all", href: allHref },
    { name: "Images", key: "images", href: "#" },
    { name: "Short videos", key: "videos", href: "#" },
    { name: "Forums", key: "forums", href: "#" },
    { name: "More", key: "more", href: "#" },
  ]

  return (
    <div className="flex items-center space-x-6 overflow-x-auto scrollbar-hide">
      {tabs.map((tab, index) => (
        <TrackedLink
          key={tab.name}
          href={tab.href}
          componentName="SearchTabs"
          linkIndex={index}
          className={`py-3 px-1 text-sm border-b-2 whitespace-nowrap ${
            currentPage === tab.key
              ? "text-blue-600 border-blue-600"
              : "text-gray-600 border-transparent hover:text-gray-800"
          }`}
        >
          {tab.name}
        </TrackedLink>
      ))}
    </div>
  )
}