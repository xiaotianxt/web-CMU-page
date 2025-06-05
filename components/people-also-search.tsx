import Image from "next/image"
import Link from "next/link"
import { Search } from "lucide-react"

export function PeopleAlsoSearch() {
  const printerModels = [
    {
      name: "HP OfficeJet Pro 9125e",
      description: "All-in-One Printer",
      image: "/placeholder.svg?height=120&width=120",
    },
    {
      name: "Epson EcoTank ET-4850",
      description: "All-in-One Printer",
      image: "/placeholder.svg?height=120&width=120",
    },
    {
      name: "Brother HL-L2460DW",
      description: "Wireless Compact Laser Printer",
      image: "/placeholder.svg?height=120&width=120",
    },
    {
      name: "Brother MFC-J1010DW",
      description: "All-in-One Inkjet Printer",
      image: "/placeholder.svg?height=120&width=120",
    },
    {
      name: "Epson EcoTank ET-2800",
      description: "Wireless Color All-in-One Printer",
      image: "/placeholder.svg?height=120&width=120",
    },
    {
      name: "HP OfficeJet Pro 8135e",
      description: "All-in-One Printer",
      image: "/placeholder.svg?height=120&width=120",
    },
  ]

  const relatedSearches = [
    {
      query: "Is there any popular recommendation for printer choice reddit",
    },
    {
      query: "Best printer for home use with cheap ink",
    },
    {
      query: "Top 5 best printer for home use",
    },
    {
      query: "Best printer brand",
    },
    {
      query: "Is there any popular recommendation for printer choice epson",
    },
    {
      query: "Best wireless printer for home use",
    },
    {
      query: "best all-in-one printer for home use",
    },
    {
      query: "Best printer for small business",
    },
  ]

  return (
    <div className="mb-8">
      <h2 className="text-2xl mb-4">People also search for</h2>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        {printerModels.map((printer, index) => (
          <Link
            href="#"
            key={index}
            className="bg-white rounded-lg p-4 hover:bg-gray-50 border border-gray-200 shadow-sm flex flex-col items-center text-center"
          >
            <Image
              src={printer.image || "/placeholder.svg"}
              alt={printer.name}
              width={120}
              height={120}
              className="mb-2"
            />
            <div className="text-sm font-medium text-gray-800">{printer.name}</div>
            <div className="text-xs text-gray-600 mt-1">{printer.description}</div>
          </Link>
        ))}
      </div>

      <hr className="my-7 border-gray-200" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {relatedSearches.map((search, index) => (
          <Link
            href="#"
            key={index}
            className="flex items-center justify-between bg-gray-100 rounded-md py-3 px-4 hover:bg-gray-200 h-16 group"
          >
            <span className="text-gray-800 group-hover:underline">{search.query}</span>
            <Search className="h-5 w-5 text-gray-500 flex-shrink-0 ml-3" />
          </Link>
        ))}
      </div>

      <div className="mt-4 text-right">
        <button className="text-blue-800 text-sm hover:underline">Feedback</button>
      </div>
    </div>
  )
}
