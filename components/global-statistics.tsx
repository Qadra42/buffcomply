import { Card, CardContent } from "@/components/ui/card"
import { Globe, Search, Clock, Signal, BarChart2 } from "lucide-react"

type SiteScrapingResult = {
  start_urls: string[]
  duration_seconds: number
  scraped_sites: number
  total_coincidences: number
  results: Record<string, Record<string, boolean>>
  last_scan: string
}

export function GlobalStatistics({ sites }: { sites: SiteScrapingResult[] }) {
  const stats = {
    baseSites: sites.reduce((total, site) => total + site.start_urls.length, 0),
    totalUrls: sites.reduce((sum, site) => sum + Object.keys(site.results).length, 0),
    totalCoincidences: sites.reduce((sum, site) => sum + site.total_coincidences, 0),
    averageDuration: sites.reduce((sum, site) => sum + site.duration_seconds, 0) / sites.length || 0
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatsCard
        label="Sitios Base"
        value={stats.baseSites}
        Icon={Globe}
        trend="neutral"
      />
      <StatsCard
        label="URLs Escaneadas"
        value={stats.totalUrls}
        Icon={Search}
        trend="positive"
      />
      <StatsCard
        label="Coincidencias"
        value={stats.totalCoincidences}
        Icon={BarChart2}
        trend="neutral"
      />
      <StatsCard
        label="Duración Promedio"
        value={`${stats.averageDuration.toFixed(1)}s`}
        Icon={Clock}
        trend="neutral"
      />
    </div>
  )
}

interface StatsCardProps {
  label: string
  value: number | string
  Icon: React.ElementType
  trend: "positive" | "negative" | "neutral"
}

function StatsCard({ label, value, Icon, trend }: StatsCardProps) {
  const getBgColor = () => {
    switch (trend) {
      case "positive":
        return "bg-gradient-to-br from-green-50 to-green-100/50"
      case "negative":
        return "bg-gradient-to-br from-red-50 to-red-100/50"
      default:
        return "bg-gradient-to-br from-gray-50 to-gray-100/50"
    }
  }

  const getTextColor = () => {
    switch (trend) {
      case "positive":
        return "text-green-700"
      case "negative":
        return "text-red-700"
      default:
        return "text-gray-700"
    }
  }

  return (
    <div
      className={`
        rounded-xl p-4 transition-all duration-200
        hover:shadow-md ${getBgColor()}
      `}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-gray-600" />
        <p className="text-sm font-medium text-gray-600">{label}</p>
      </div>
      <p className={`text-2xl font-bold mt-1 ${getTextColor()}`}>{value}</p>
    </div>
  )
}

