import Image from "next/image"
import Link from "next/link"
import peopleAlsoSearchData from "@/data/people-also-search.json" 

export function PeopleAlsoSearch() {
  return (
    <div className="mb-8">
      <h2 className="text-2xl mb-4">People also search for</h2>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        {peopleAlsoSearchData.map((item, index) => (
          <Link
            href="#"
            key={index}
            className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 border border-gray-200 shadow-sm flex flex-col items-center text-center"
          >
            <Image
              src={`/people-also-search-thumbnails/${index+1}.png`} 
              alt={item.name}
              width={120}
              height={120}
              className="mb-2"
            />
            <div className="text-sm font-medium text-gray-800">{item.name}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}