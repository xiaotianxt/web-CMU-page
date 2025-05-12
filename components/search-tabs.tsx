import Link from "next/link"

export function SearchTabs() {
  const tabs = [
    { name: "AI Mode", active: false, href: "#" },
    { name: "All", active: true, href: "#" },
    { name: "Videos", active: false, href: "#" },
    { name: "Images", active: false, href: "#" },
    { name: "News", active: false, href: "#" },
    { name: "Short videos", active: false, href: "#" },
    { name: "Shopping", active: false, href: "#" },
    { name: "More", active: false, href: "#" },
  ]

  return (
    <div className="flex items-center space-x-6 px-4 overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => (
        <Link
          key={tab.name}
          href={tab.href}
          className={`py-2 px-1 text-sm border-b-2 whitespace-nowrap ${
            tab.active ? "text-[#8ab4f8] border-[#8ab4f8]" : "text-gray-400 border-transparent hover:text-gray-300"
          }`}
        >
          {tab.name}
        </Link>
      ))}
      <div className="ml-auto">
        <Link href="#" className="text-sm text-gray-400 hover:text-gray-300">
          Tools
        </Link>
      </div>
    </div>
  )
}
