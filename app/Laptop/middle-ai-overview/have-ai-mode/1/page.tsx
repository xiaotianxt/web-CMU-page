"use client"
import { SearchResults } from "@/components/search-results"
import { AiOverview } from "@/components/ai-overview"
import { VideosSection } from "@/components/videos-section"
import { Pagination } from "@/components/pagination"
import { SearchTabs } from "@/components/search-tabs"

import searchData from "@/app/Laptop/data/1.json"
import HeadSection from "@/components/head-section"

export default function Home() {
  const beforePeopleAlsoAsk = searchData.slice(0, 1)
  const beforeVideos = searchData.slice(1, 2)
  const beforePeopleAlsoSearchFor = searchData.slice(2, 3)
  const bottomResults = searchData.slice(3)

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header with search bar */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <HeadSection></HeadSection>
        <div className="px-48">
          <SearchTabs />
        </div>
      </header>

      <div className="container mx-auto px-15 py-4">
        <div className="max-w-2xl">

          <SearchResults results={beforePeopleAlsoAsk} />

          <SearchResults results={beforeVideos} />

          {/* Videos Section */}
          <VideosSection />

        </div>
      </div>
      {/* AI Overview Section */}
      <div className="px-42">
        <AiOverview />
      </div>
      <div className="container mx-auto px-15 py-4">
        <div className="max-w-2xl">

          <SearchResults results={beforePeopleAlsoSearchFor} />

          <SearchResults results={bottomResults} />

          {/* Pagination */}
          <Pagination />
        </div>
      </div>
    </div >
  )
}
