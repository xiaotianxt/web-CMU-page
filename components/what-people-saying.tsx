import { MoreVertical } from "lucide-react"

export function WhatPeopleSaying() {
  const reviews = [
    {
      source: "TechRadar",
      rating: "4.5/5",
      quote:
        "The HP OfficeJet Pro 9125e is a versatile all-in-one that delivers exceptional print quality and reliability for home offices.",
      date: "March 2025",
    },
    {
      source: "CNET",
      rating: "9/10",
      quote:
        "Brother's HL-L2460DW offers unbeatable value with its efficient toner usage and consistent performance for everyday printing needs.",
      date: "April 2025",
    },
    {
      source: "PCMag",
      rating: "Excellent",
      quote:
        "Epson's EcoTank Photo ET-8500 revolutionizes home photo printing with its incredible color accuracy and extremely low running costs.",
      date: "February 2025",
    },
  ]

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <h2 className="text-xl">What people are saying</h2>
        <button className="ml-2">
          <MoreVertical className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      <div className="grid gap-4">
        {reviews.map((review, index) => (
          <div key={index} className="bg-[#303134] p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div className="font-medium">{review.source}</div>
              <div className="text-[#8ab4f8]">{review.rating}</div>
            </div>
            <p className="text-sm text-[#bdc1c6]">"{review.quote}"</p>
            <div className="text-xs text-gray-400 mt-2">{review.date}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
