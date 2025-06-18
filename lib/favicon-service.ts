// Service to automatically fetch website favicons

// Cache for storing favicon URLs to avoid repeated requests
const faviconCache = new Map<string, string>()

// Extract domain from URL
export const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace("www.", "")
  } catch {
    return ""
  }
}

// Get favicon URL using multiple fallback methods
export const getFaviconUrl = (url: string, size = 32): string => {
  const domain = extractDomain(url)
  if (!domain) return "/placeholder.svg?height=32&width=32"

  // Check cache first
  const cacheKey = `${domain}-${size}`
  if (faviconCache.has(cacheKey)) {
    return faviconCache.get(cacheKey)!
  }

  // Method 1: Google's favicon service (most reliable)
  const googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`

  // Cache the result
  faviconCache.set(cacheKey, googleFaviconUrl)

  return googleFaviconUrl
}

// Alternative method: Direct favicon.ico
export const getDirectFaviconUrl = (url: string): string => {
  const domain = extractDomain(url)
  if (!domain) return "/placeholder.svg?height=32&width=32"

  return `https://${domain}/favicon.ico`
}

// Get high-quality favicon with multiple fallbacks
export const getHighQualityFavicon = async (url: string, size = 64): Promise<string> => {
  const domain = extractDomain(url)
  if (!domain) return "/placeholder.svg?height=64&width=64"

  const cacheKey = `${domain}-hq-${size}`
  if (faviconCache.has(cacheKey)) {
    return faviconCache.get(cacheKey)!
  }

  // Try multiple sources in order of preference
  const sources = [
    `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`,
    `https://${domain}/favicon.ico`,
    `https://${domain}/apple-touch-icon.png`,
    `https://${domain}/favicon.png`,
  ]

  // For now, we'll use Google's service as it's most reliable
  const faviconUrl = sources[0]
  faviconCache.set(cacheKey, faviconUrl)

  return faviconUrl
}

// Clear favicon cache
export const clearFaviconCache = (): void => {
  faviconCache.clear()
}

// Preload favicons for better performance
export const preloadFavicons = (urls: string[]): void => {
  urls.forEach((url) => {
    const faviconUrl = getFaviconUrl(url)
    // Create image element to preload
    const img = new Image()
    img.src = faviconUrl
  })
}

// Get website name from domain for better display
export const getWebsiteName = (url: string): string => {
  const domain = extractDomain(url)
  if (!domain) return "Unknown"

  // Common website name mappings
  const nameMap: Record<string, string> = {
    "pcmag.com": "PCMag",
    "cnet.com": "CNET",
    "techradar.com": "TechRadar",
    "laptopmag.com": "Laptop Mag",
    "rtings.com": "RTINGS.com",
    "nytimes.com": "The New York Times",
    "forbes.com": "Forbes",
    "reddit.com": "Reddit",
    "consumerreports.org": "Consumer Reports",
    "techgearlab.com": "Tech Gear Lab",
    "wired.com": "WIRED",
    "pcworld.com": "PCWorld",
    "telegraph.co.uk": "The Telegraph",
  }

  return nameMap[domain] || domain.split(".")[0].charAt(0).toUpperCase() + domain.split(".")[0].slice(1)
}
