'use client'
import { TrackedLink } from "@/components/tracked-link"
import { usePathname } from "next/navigation"
interface SearchTabsProps {
  currentPage?: string
}

export function SearchTabs({ currentPage = "all" }: SearchTabsProps) {
  const pathname = usePathname()
  const match = pathname.match(/^(.*?)(\/\d+)?\/?$/)
  // Extract only the first segment of the path, e.g., /Laptop
  const basePath = match ? match[1].split('/')[1] ? `/${match[1].split('/')[1]}` : "" : "";
  const tabs = [
    { name: "AI Mode", key: "ai-mode", href: `${basePath}/ai-mode` },
    { name: "All", key: "all", href: "/" },
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
