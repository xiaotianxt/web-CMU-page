import Image from "next/image"
import { MoreVertical } from "lucide-react"

export function AiOverview() {
  return (
    <div className="mb-8 bg-[#303134] rounded-xl overflow-hidden">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="flex items-center text-[#8ab4f8]">
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
              className="mr-2"
            >
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
              <path d="m2 12 5.25 5.25"></path>
              <path d="M9 12h.01"></path>
              <path d="M15 12h.01"></path>
              <path d="M9.5 17a5 5 0 0 0 5 0"></path>
            </svg>
            <span className="font-medium">Search Labs | AI Overview</span>
          </div>
          <div className="ml-auto flex items-center">
            <button className="text-gray-400 hover:text-gray-300">Learn more</button>
            <button className="ml-2 text-gray-400 hover:text-gray-300">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <p className="text-[#bdc1c6] mb-4">
              <span className="text-[#8ab4f8]">A printer</span> is a device that accepts text and graphic output from a
              computer and transfers the information to paper, usually to standard-size, 8.5" x 11" sheets. Printers
              vary in size, speed, sophistication, and cost. In general, more expensive printers are used for
              higher-resolution color printing.
            </p>
            <p className="text-[#bdc1c6]">
              It leverages modern printing technology to produce physical copies of digital documents and images, making
              it an essential tool for home and office use.
            </p>

            <div className="mt-6">
              <button className="flex items-center justify-center w-full bg-[#3c4043] text-white py-2 rounded-full hover:bg-[#4d5156]">
                <span>Show more</span>
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
                  className="ml-1"
                >
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </button>
            </div>
          </div>

          <div className="w-64 h-auto">
            <Image
              src="/placeholder.svg?height=200&width=300"
              alt="Printer illustration"
              width={300}
              height={200}
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
