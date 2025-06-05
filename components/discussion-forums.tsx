import Image from "next/image"
import Link from "next/link"
import { MoreVertical, ChevronDown } from "lucide-react"

export function DiscussionsForums() {
  const discussions = [
    {
      title: "The best printer for home use to buy? What do you recommend right now?",
      platform: "Reddit",
      source: "r/BuyItForLife",
      comments: "140+ comments",
      timeAgo: "1 week ago",
      snippet:
        "HP and Canon are always going to hit all the right notes; it's difficult to argue against the sheer number of versatile options available from ...",
      logo: "https://www.reddit.com/favicon.ico?height=40&width=40",
    },
    {
      title: "Can you recommend a good printer to buy for home and school use?",
      platform: "Quora",
      comments: "4 answers",
      timeAgo: "1 year ago",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      title: "Which printer is the best to buy?",
      platform: "Quora",
      comments: "1 answer",
      timeAgo: "2 years ago",
      logo: "/placeholder.svg?height=40&width=40",
    },
  ]

  return (
    <div className="mb-8">
      <h2 className="text-2xl mb-4">Discussions and forums</h2>

      <div className="space-y-4">
        {discussions.map((discussion, index) => (
            
          <div key={index} className="border-b border-gray-200 pb-4">
            <Link href="#" className="text-blue-800 text-xl hover:underline">
              {discussion.title}
            </Link>

            <div className="flex items-center mt-2">
              <Image
                src={discussion.logo || "/placeholder.svg"}
                alt={discussion.platform}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="ml-2 text-gray-600">
                {discussion.platform} {discussion.source && `· ${discussion.source}`} · {discussion.comments} ·{" "}
                {discussion.timeAgo}
              </span>
              <button className="ml-auto">
                <MoreVertical className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {discussion.snippet && (
              <p className="text-sm text-gray-700 mt-2">
                {discussion.snippet}{" "}
                <Link href="#" className="text-blue-800">
                  More
                </Link>
              </p>
            )}

            <button className="mt-1 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100">
              <ChevronDown className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-800 py-3 px-6 rounded-full hover:bg-gray-200 w-full max-w-md">
          <span>See more</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
