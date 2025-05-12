"use client"

import { useState } from "react"
import { Search, X, Mic, Camera } from "lucide-react"

interface SearchBarProps {
  defaultValue?: string
}

export function SearchBar({ defaultValue = "" }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)

  return (
    <div className="flex-1 max-w-xl">
      <div className="relative">
        <div className="flex items-center bg-[#303134] rounded-full px-4 py-2 border border-[#5f6368] focus-within:border-[#8ab4f8]">
          <Search className="h-5 w-5 text-gray-400 mr-2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-white"
            placeholder="Search Google or type a URL"
          />
          {query && (
            <button onClick={() => setQuery("")} className="p-1 mr-1">
              <X className="h-5 w-5 text-gray-400" />
            </button>
          )}
          <div className="h-5 border-r border-gray-600 mx-2"></div>
          <button className="p-1 mr-1">
            <Mic className="h-5 w-5 text-[#8ab4f8]" />
          </button>
          <button className="p-1">
            <Camera className="h-5 w-5 text-[#8ab4f8]" />
          </button>
        </div>
      </div>
    </div>
  )
}
