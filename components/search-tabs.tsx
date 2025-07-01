import { TrackedLink } from "@/app/Laptop/components/tracked-link"

interface SearchTabsProps {
  currentPage?: string
}

export function SearchTabs({ currentPage = "all" }: SearchTabsProps) {
  const tabs = [
    { name: "AI Mode", key: "ai-mode", href: "/ai-mode" },
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
