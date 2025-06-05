import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function Pagination() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex items-center">
        <Link href="#" className="flex items-center text-blue-600 mr-4 hover:underline">
          <ChevronLeft className="h-5 w-5 mr-1" />
          <span>Previous</span>
        </Link>

        <div className="flex space-x-2">
          <Link href="/app" className="flex items-center justify-center w-8 h-8 text-blue-600 hover:underline">
            1
          </Link>
          <Link href="#" className="flex items-center justify-center w-8 h-8 text-blue-600 hover:underline">
            2
          </Link>
          <Link href="#" className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full">
            3
          </Link>
          <Link href="#" className="flex items-center justify-center w-8 h-8 text-blue-600 hover:underline">
            4
          </Link>
          <Link href="#" className="flex items-center justify-center w-8 h-8 text-blue-600 hover:underline">
            5
          </Link>
          <span className="flex items-center justify-center w-8 h-8 text-gray-600">...</span>
          <Link href="#" className="flex items-center justify-center w-8 h-8 text-blue-600 hover:underline">
            10
          </Link>
        </div>

        <Link href="#" className="flex items-center text-blue-600 ml-4 hover:underline">
          <span>Next</span>
          <ChevronRight className="h-5 w-5 ml-1" />
        </Link>
      </div>
    </div>
  )
}
