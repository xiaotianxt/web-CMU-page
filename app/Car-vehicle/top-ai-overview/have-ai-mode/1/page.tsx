"use client"
import { SearchResults } from "@/components/search-results"
import { AiOverview } from "@/components/ai-overview"
import { VideosSection } from "@/components/videos-section"
import { Pagination } from "@/components/pagination"
import { SearchTabs } from "@/components/search-tabs"
import { PeopleAlsoSearch } from "@/components/people-also-search"
import {DiscussionsAndForums} from "@/components/discussions-and-forums"

import HeadSection from "@/components/head-section"
import { usePathname } from "next/navigation"

export default function Home() {
  const pathname = usePathname();
  const pageName = pathname.split("/").slice(1, 2).join("-");
  const searchData = require(`@/data/${pageName}/1.json`);
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

      {/* AI Overview Section */}
      <div className="px-42">
        <AiOverview />
      </div>
      <main className="container mx-auto px-15 py-4">
        <div className="max-w-2xl">

          <SearchResults results={beforePeopleAlsoAsk} />

          <SearchResults results={beforeVideos} />

          {/* Videos Section */}
          <VideosSection />

          <SearchResults results={beforePeopleAlsoSearchFor} />
          {/* People Also Search for */}
          <DiscussionsAndForums />

          <SearchResults results={bottomResults} />

          <PeopleAlsoSearch/>

          {/* Pagination */}
          <Pagination />
        </div>
      </main>
    </div>
  )
}
