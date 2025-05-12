import Image from "next/image"
import Link from "next/link"
import { SearchResults } from "@/components/search-results"
import { AiOverview } from "@/components/ai-overview"
import { PeopleAlsoAsk } from "@/components/people-also-ask"
import { VideosSection } from "@/components/videos-section"
import { WhatPeopleSaying } from "@/components/what-people-saying"
import { Pagination } from "@/components/pagination"
import { SearchBar } from "@/components/search-bar"
import { SearchTabs } from "@/components/search-tabs"
import searchData from "@/data/search-data.json"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#202124] text-gray-200">
      {/* Header with search bar */}
      <header className="sticky top-0 z-10 bg-[#202124] border-b border-gray-700">
        <div className="container mx-auto px-4 py-2 flex items-center">
          <Link href="/" className="mr-4">
            <Image src="/google-logo.png" alt="Google" width={92} height={30} className="h-7 w-auto" />
          </Link>
          <SearchBar defaultValue="best printer" />
          <div className="ml-auto flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-700">
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
                className="text-gray-300"
              >
                <path d="M9 3v18"></path>
                <path d="M9 3h6a6 6 0 0 1 0 12H9"></path>
              </svg>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-700">
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
                className="text-gray-300"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium">
              W
            </div>
          </div>
        </div>
        <SearchTabs />
      </header>

      <main className="container mx-auto px-4 py-4">
        <div className="max-w-3xl">
          <p className="text-sm text-gray-400 mb-4">About 1,230,000,000 results (0.30 seconds)</p>

          {/* AI Overview Section */}
          <AiOverview />

          {/* Search Results */}
          <SearchResults results={searchData} />

          {/* People Also Ask */}
          <PeopleAlsoAsk />

          {/* Videos Section */}
          <VideosSection />

          {/* What People Are Saying */}
          <WhatPeopleSaying />

          {/* Pagination */}
          <Pagination />
        </div>
      </main>
    </div>
  )
}
