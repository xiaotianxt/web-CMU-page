"use client"
import { SearchResults } from "@/components/search-results"
import { Pagination } from "@/components/pagination"
import { SearchTabs } from "@/components/search-tabs-no-ai-mode"


import searchData from "@/data/Laptop/3.json"
import HeadSection from "@/components/head-section"

export default function Home() {

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header with search bar */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <HeadSection></HeadSection>
        <div className="px-48">
          <SearchTabs />
        </div>
      </header>

      <main className="container mx-auto px-15 py-4">
        <div className="max-w-2xl">

          <SearchResults results={searchData.slice(0)}/>

          <Pagination />
        </div>
      </main>
    </div>
  )
}
