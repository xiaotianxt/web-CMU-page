import Image from "next/image"
import Link from "next/link"
import { MoreVertical } from "lucide-react"

export function WhatPeopleSaying() {
  const reviews = [
    {
      title: "The best printer for home use to buy? What do you recommend right now?",
      topComment:
        "All printers suck and none are BIFL. That being said, Brother printers suck less than others. If you can reconsider your need for color,...",
      commentsCount: "140+ comments",
      timeAgo: "1 day ago",
      source: "r/BuyItForLife",
      platform: "Reddit",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      title: "The 4 Best Home Printers of 2025 | Reviews by Wirecutter",
      timeAgo: "1 week ago",
      author: "Ben Keough, Kaitlyn Wells",
      source: "The New York Times",
      logo: "/placeholder.svg?height=40&width=40",
      image: "/placeholder.svg?height=180&width=320",
    },
    {
      title:
        "Best Printer for Your Home or Office in 2025: I've Spent Hundreds of Hours Using Dozens of Printers to Brin...",
      timeAgo: "2 weeks ago",
      author: "James Bricknell",
      authorTitle: "Technology writer for CNET",
      source: "CNET",
      logo: "/placeholder.svg?height=40&width=40",
      image: "/placeholder.svg?height=180&width=320",
    },
  ]

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <h2 className="text-2xl">What people are saying</h2>
        <button className="ml-2">
          <MoreVertical className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reviews.map((review, index) => (
          <div key={index} className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="p-4">
              <Link href="#" className="text-blue-800 text-lg hover:underline">
                {review.title}
              </Link>

              {review.topComment && (
                <div className="mt-2">
                  <div className="text-sm text-gray-700 font-medium">Top comment ·</div>
                  <p className="text-sm text-gray-700 mt-1">{review.topComment}</p>
                </div>
              )}

              <div className="mt-3 text-sm text-gray-600">
                {review.commentsCount && <span>{review.commentsCount} · </span>}
                {review.timeAgo}
              </div>

              <div className="mt-3 flex items-center">
                <Image
                  src={review.logo || "/placeholder.svg"}
                  alt={review.source}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <div className="ml-2 text-sm text-gray-600">
                  {review.source}
                  {review.platform && ` · ${review.platform}`}
                </div>
                <button className="ml-auto">
                  <MoreVertical className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            {review.image && (
              <div className="mt-2">
                <Image
                  src={review.image || "/placeholder.svg"}
                  alt={review.title}
                  width={320}
                  height={180}
                  className="w-full h-auto"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
