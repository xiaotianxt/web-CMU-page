import Image from "next/image"
import Link from "next/link"
import { MoreVertical } from "lucide-react"

export function VideosSection() {
  const videos = [
    {
      title: "Best Printers in 2025 - How to Choose a Printer?",
      channel: "Tech Reviewer",
      views: "1.2M views",
      date: "2 months ago",
      duration: "12:34",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      title: "Top 5 Printers for Home Office in 2025",
      channel: "Office Essentials",
      views: "450K views",
      date: "3 weeks ago",
      duration: "8:21",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      title: "Printer Buying Guide - What You Need to Know",
      channel: "Consumer Tech",
      views: "820K views",
      date: "1 month ago",
      duration: "15:47",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
  ]

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <h2 className="text-xl">Videos</h2>
        <button className="ml-2">
          <MoreVertical className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {videos.map((video, index) => (
          <div key={index} className="group">
            <div className="relative">
              <Image
                src={video.thumbnail || "/placeholder.svg"}
                alt={video.title}
                width={320}
                height={180}
                className="rounded-lg w-full object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1 rounded">
                {video.duration}
              </div>
            </div>

            <div className="mt-2">
              <h3 className="text-sm font-medium line-clamp-2 group-hover:text-[#8ab4f8]">
                <Link href="#">{video.title}</Link>
              </h3>
              <div className="text-xs text-gray-400 mt-1">{video.channel}</div>
              <div className="text-xs text-gray-400">
                {video.views} • {video.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
