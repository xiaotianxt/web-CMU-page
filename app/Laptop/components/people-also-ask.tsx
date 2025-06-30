"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, MoreVertical } from "lucide-react"

export function PeopleAlsoAsk() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const questions = [
    {
      question: "What is the best printer for home use?",
      answer:
        "The best printer for home use depends on your specific needs. For most homes, the HP OfficeJet Pro 9125e and Brother HL-L2460DW are highly recommended for their reliability and cost-effectiveness. If you print photos frequently, consider the Epson EcoTank Photo ET-8500.",
    },
    {
      question: "Which is better, inkjet or laser printer?",
      answer:
        "Laser printers are better for high-volume text documents and have lower per-page costs, while inkjet printers excel at color and photo printing with better image quality. Laser printers have faster print speeds and longer-lasting toner, while inkjet printers typically have a lower upfront cost but more expensive ink replacements.",
    },
    {
      question: "How much does a good printer cost?",
      answer:
        "A good home printer typically costs between $100-$300 for basic models. All-in-one printers range from $150-$500. Professional-grade printers can cost $500-$1000+. Budget-friendly options start around $100, while photo-specialized printers are $300-$800. Laser printers generally cost more upfront ($200-$600) but have lower long-term costs.",
    },
    {
      question: "What printer has the cheapest ink?",
      answer:
        "Printers with the cheapest ink costs include Epson EcoTank models, Brother INKvestment Tank printers, and HP Smart Tank series. These use refillable ink tank systems rather than traditional cartridges, significantly reducing per-page costs. Canon MegaTank printers also offer economical ink usage with their high-capacity ink bottles.",
    },
  ]

  const toggleQuestion = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null)
    } else {
      setOpenIndex(index)
    }
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl mb-4 flex items-center">
        People also ask
        <button className="ml-2">
          <MoreVertical className="h-5 w-5 text-gray-500" />
        </button>
      </h2>

      <div className="space-y-1">
        {questions.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <button
              className="w-full text-left p-4 flex items-center justify-between hover:bg-gray-50"
              onClick={() => toggleQuestion(index)}
            >
              <span>{item.question}</span>
              {openIndex === index ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>

            {openIndex === index && (
              <div className="p-4 pt-0 text-sm text-gray-700 border-t border-gray-200">{item.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
