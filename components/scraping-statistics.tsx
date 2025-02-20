import { Card, CardContent } from "@/components/ui/card"

type ScrapingResult = {
  start_url: string
  duration_seconds: number
  scraped_sites: number
  total_coincidences: number
  results: Record<string, Record<string, boolean>>
}

export function ScrapingStatistics({ results }: { results: ScrapingResult }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-4">
          <p className="text-sm font-medium text-gray-500 mb-1">URL Base</p>
          <p className="text-lg font-bold text-center break-all">{results.start_url}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-4">
          <p className="text-sm font-medium text-gray-500 mb-1">URLs Escaneadas</p>
          <p className="text-3xl font-bold">{results.scraped_sites}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-4">
          <p className="text-sm font-medium text-gray-500 mb-1">Coincidencias Totales</p>
          <p className="text-3xl font-bold">{results.total_coincidences}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-4">
          <p className="text-sm font-medium text-gray-500 mb-1">Duración</p>
          <p className="text-3xl font-bold">{results.duration_seconds.toFixed(2)}s</p>
        </CardContent>
      </Card>
    </div>
  )
}

