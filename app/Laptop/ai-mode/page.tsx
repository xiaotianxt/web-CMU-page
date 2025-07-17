"use client"
import Image from "next/image"
import { SearchTabs } from "@/components/search-tabs"
import { Mic, MoreVertical, Clock, Edit } from "lucide-react"
import aiOverviewData from "@/data/Laptop/ai-overview.json"
import { TrackedLink } from "@/components/research-tracked-link"
import { WebsiteFavicon } from "@/components/website-favicon"
import { getWebsiteName } from "@/lib/favicon-service"

interface TextBlock {
  type: string
  snippet?: string
  title?: string
  snippet_highlighted_words?: string[]
  reference_indexes?: number[]
  list?: Array<{
    title: string
    snippets?: {
      [key: string]: string
    }
    snippet?: {
      [key: string]: string
    }
    reference_indexes?: number[]
    type?: string
    list?: Array<{
      snippet: {
        [key: string]: string
      }
      reference_indexes?: number[]
    }>
  }>
}

interface Reference {
  title: string
  link: string
  snippet: string
  source: string
  index: number
}

interface AIOverviewData {
  text_blocks: TextBlock[]
  references: Reference[]
}

export default function AiModePage() {
  const data = aiOverviewData as AIOverviewData

  const getImageForReference = (referenceIndex: number) => {
    return `/Laptop/images/${referenceIndex+1}.jpeg`
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="flex items-center px-6 py-4">
          <TrackedLink href="/" componentName="AiMode-Header" linkIndex={0} className="mr-8">
            <Image src="/google-logo.png" alt="Google" width={92} height={30} className="h-8 w-auto" />
          </TrackedLink>
          <div className="flex-1 max-w-2xl">{/* Search tabs only, no search bar on AI Mode page */}</div>
          <div className="ml-auto flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-600"
              >
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
              </svg>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-600"
              >
                <rect width="3" height="3" x="9" y="9"></rect>
                <rect width="3" height="3" x="9" y="15"></rect>
                <rect width="3" height="3" x="15" y="9"></rect>
                <rect width="3" height="3" x="15" y="15"></rect>
              </svg>
            </button>
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium">
              W
            </div>
          </div>
        </div>
        <div className="px-6">
          <SearchTabs currentPage="ai-mode" />
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-16 flex-shrink-0 border-r border-gray-200">
          <div className="flex flex-col items-center py-4 space-y-4">
            <button className="p-3 rounded-full hover:bg-gray-100">
              <Clock className="h-6 w-6 text-gray-600" />
            </button>
            <button className="p-3 rounded-full hover:bg-gray-100">
              <Edit className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Content Area */}
          <div className="flex-1 px-8 py-8 max-w-4xl">
            {/* Main Title */}
            <h1 className="text-3xl font-normal text-gray-900 mb-6">
              Is there any popular recommendation for laptop choice
            </h1>

            {/* Introduction */}
            <p className="text-gray-700 mb-6 text-base leading-relaxed">
              Based on recent reviews and expert recommendations, here are some popular laptop choices in 2025:
            </p>

            {/* For Overall Excellence and Value */}
            <h2 className="text-lg font-normal text-gray-900 mb-4">For Overall Excellence and Value:</h2>
            <ul className="space-y-4 mb-8 ml-4">
              <li className="flex">
                <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                <div>
                  <span className="font-semibold">Dell Inspiron 14 Plus (2024):</span>
                  <span className="ml-1">
                    Considered the best overall laptop by PCWorld. It offers strong performance, exceptional battery
                    life (up to 17 hours), and a great user experience with a comfortable keyboard and bright display.
                  </span>
                </div>
              </li>
              <li className="flex">
                <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                <div>
                  <span className="font-semibold">Asus Zenbook 14 OLED Touch (UM3406):</span>
                  <span className="ml-1">
                    PCMag names this the best laptop for most people. It provides great value for its price with a
                    vibrant OLED display, long battery life, and decent performance for everyday tasks.
                  </span>
                </div>
              </li>
            </ul>

            {/* For Apple Users */}
            <h2 className="text-lg font-normal text-gray-900 mb-4">For Apple Users:</h2>
            <ul className="space-y-4 mb-8 ml-4">
              <li className="flex">
                <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                <div>
                  <span className="font-semibold">Apple MacBook Air 13-inch (M4, 2025):</span>
                  <span className="ml-1">
                    This is a top contender for the best overall laptop, especially for those in the Apple ecosystem. It
                    offers a lightweight design, excellent performance with the M4 chip, and long battery life.
                  </span>
                </div>
              </li>
              <li className="flex">
                <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                <div>
                  <span className="font-semibold">Apple MacBook Pro 14 (2024):</span>
                  <span className="ml-1 text-gray-600">
                    Ideal for users who need a powerful workstation with a premium build, excellent display, and strong
                    performance for demanding tasks.
                  </span>
                </div>
              </li>
            </ul>

            {/* Ask Anything Input */}
            <div className="mt-16">
              <div className="relative max-w-2xl">
                <input
                  type="text"
                  placeholder="Ask anything"
                  className="w-full px-6 py-4 text-lg border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:shadow-lg pr-16 bg-gray-50"
                />
                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-200 rounded-full">
                  <Mic className="h-6 w-6 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 flex-shrink-0 px-6 py-8">
            {/* Sites indicator */}
            <div className="flex items-center mb-6">
              <div className="flex -space-x-1 mr-3">
                {data.references.slice(0, 3).map((ref, index) => (
                  <WebsiteFavicon
                    key={index}
                    url={ref.link}
                    size={24}
                    className="border-2 border-white"
                    fallbackText={getWebsiteName(ref.link).charAt(0)}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">11 sites</span>
              <button className="ml-auto">
                <MoreVertical className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Reference Articles */}
            <div className="space-y-4">
              {data.references.slice(0, 3).map((ref, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="flex">
                    <div className="flex-1 p-4">
                      <h3 className="text-blue-700 hover:underline text-sm font-medium leading-tight mb-2">
                        <TrackedLink href={ref.link} componentName="AiMode-Sidebar" linkIndex={index}>
                          {ref.title}
                        </TrackedLink>
                      </h3>
                      <p className="text-xs text-gray-600 mb-2">May 27, 2025 — {ref.snippet.substring(0, 60)}...</p>
                      <div className="flex items-center">
                        <WebsiteFavicon url={ref.link} size={16} fallbackText={getWebsiteName(ref.link).charAt(0)} />
                        <span className="text-xs text-gray-600 ml-2">{getWebsiteName(ref.link)}</span>
                        <button className="ml-auto">
                          <MoreVertical className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                    <div className="w-20 h-20 m-3">
                      <Image
                        src={getImageForReference(ref.index) || "/placeholder.svg"}
                        alt="Article thumbnail"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover rounded"
                        onError={(e) => {
                          // Fallback to placeholder if image doesn't exist
                          e.currentTarget.src = "/placeholder.svg?height=80&width=80"
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Show all button */}
            <div className="mt-6 text-right">
              <TrackedLink
                href="/analytics"
                componentName="AiMode-Sidebar"
                linkIndex={3}
                className="text-blue-700 hover:underline text-sm font-medium"
              >
                Show all
              </TrackedLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
