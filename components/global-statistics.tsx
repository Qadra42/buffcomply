import { Card, CardContent } from "@/components/ui/card"
import { Globe, Search, Clock, Signal } from "lucide-react"

type SiteScrapingResult = {
  start_url: string
  duration_seconds: number
  scraped_sites: number
  total_coincidences: number
  results: Record<string, Record<string, boolean>>
  last_scan: string
}

export function GlobalStatistics({ sites }: { sites: SiteScrapingResult[] }) {
  const totalSites = sites.length
  const totalUrlsScanned = sites.reduce((sum, site) => sum + site.scraped_sites, 0)
  const totalCoincidences = sites.reduce((sum, site) => sum + site.total_coincidences, 0)
  const averageDuration = sites.reduce((sum, site) => sum + site.duration_seconds, 0) / sites.length

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard icon={Globe} label="Sitios Base" value={totalSites} color="blue" />
      <StatCard icon={Search} label="URLs Escaneadas" value={totalUrlsScanned} color="green" />
      <StatCard icon={Signal} label="Coincidencias" value={totalCoincidences} color="purple" />
      <StatCard icon={Clock} label="Duración Promedio" value={`${averageDuration.toFixed(1)}s`} color="orange" />
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any
  label: string
  value: string | number
  color: "blue" | "green" | "purple" | "orange"
}) {
  const getGradient = () => {
    switch (color) {
      case "blue":
        return "from-blue-50 to-blue-100/50"
      case "green":
        return "from-green-50 to-green-100/50"
      case "purple":
        return "from-purple-50 to-purple-100/50"
      case "orange":
        return "from-orange-50 to-orange-100/50"
    }
  }

  const getIconColor = () => {
    switch (color) {
      case "blue":
        return "text-blue-500"
      case "green":
        return "text-green-500"
      case "purple":
        return "text-purple-500"
      case "orange":
        return "text-orange-500"
    }
  }

  const getValueColor = () => {
    switch (color) {
      case "blue":
        return "text-blue-700"
      case "green":
        return "text-green-700"
      case "purple":
        return "text-purple-700"
      case "orange":
        return "text-orange-700"
    }
  }

  return (
    <Card
      className={`
      overflow-hidden transition-all duration-200 hover:shadow-lg
      bg-gradient-to-br ${getGradient()}
    `}
    >
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className={`text-2xl font-bold ${getValueColor()}`}>{value}</p>
          </div>
          <Icon className={`h-8 w-8 ${getIconColor()}`} />
        </div>
      </CardContent>
    </Card>
  )
}

