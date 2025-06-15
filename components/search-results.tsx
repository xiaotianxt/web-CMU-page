import { MoreVertical } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"

interface SearchResult {
  position: number
  title: string
  link: string
  redirect_link: string
  displayed_link: string
  favicon?: string
  date?: string
  snippet: string
  snippet_highlighted_words?: string[]
  sitelinks?: {
    inline?: {
      title: string
      link: string
    }[]
  }
  rich_snippet?: {
    bottom?: {
      extensions?: string[]
    }
    top?: {
      extensions?: string[]
    }
  }
  source?: string
}

interface SearchResultsProps {
  results: SearchResult[]
}

export function SearchResults({ results }: SearchResultsProps) {
  return (
    <div className="space-y-8 mb-10">
      {results.map((result) => (
        <div key={result.position} className="max-w-2xl">
          <div className="flex items-start">
            <div className="w-4 h-4 mr-2 mt-1 flex-shrink-0">
              {result.source ? (
                <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-700">
                  {result.source.charAt(0)}
                </div>
              ) : (
                <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
              )}
            </div>
            <div>
              <div className="text-sm text-gray-600">
                {result.displayed_link}
                <button className="ml-2">
                  <MoreVertical className="h-4 w-4 inline" />
                </button>
              </div>
              <h3 className="text-xl">
                <TrackedLink
                  href={result.link}
                  componentName="SearchResults"
                  linkIndex={result.position}
                  className="text-blue-800 hover:underline"
                >
                  {result.title}
                </TrackedLink>
              </h3>
              {result.date && <div className="text-sm text-gray-600 mt-1">{result.date}</div>}
              <p className="text-sm text-gray-700 mt-1">
                {result.snippet.split(new RegExp(`(${result.snippet_highlighted_words?.join("|")})`)).map((part, i) =>
                  result.snippet_highlighted_words?.includes(part) ? (
                    <span key={i} className="font-bold">
                      {part}
                    </span>
                  ) : (
                    part
                  ),
                )}
              </p>

              {result.sitelinks?.inline && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                  {result.sitelinks.inline.map((sitelink, index) => (
                    <TrackedLink
                      key={index}
                      href={sitelink.link}
                      componentName="SearchResults-Sitelinks"
                      linkIndex={index}
                      className="text-blue-800 text-sm hover:underline"
                    >
                      {sitelink.title}
                    </TrackedLink>
                  ))}
                </div>
              )}

              {(result.rich_snippet?.bottom?.extensions || result.rich_snippet?.top?.extensions) && (
                <div className="text-sm text-gray-600 mt-1">
                  {result.rich_snippet.bottom?.extensions?.join(" · ") ||
                    result.rich_snippet.top?.extensions?.join(" · ")}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
