import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type SiteScrapingResult = {
  start_urls: string[]
  duration_seconds: number
  scraped_sites: number
  total_coincidences: number
  results: Record<string, Record<string, boolean>>
  last_scan: string
}

export function ComparisonView({ sites }: { sites: SiteScrapingResult[] }) {
  // Obtener todas las palabras clave únicas
  const allKeywords = Array.from(
    new Set(sites.flatMap((site) => Object.values(site.results).flatMap((results) => Object.keys(results)))),
  )

  return (
    <div className="mt-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sitio</TableHead>
            <TableHead className="text-center">URLs Escaneadas</TableHead>
            <TableHead className="text-center">Coincidencias</TableHead>
            {allKeywords.map((keyword) => (
              <TableHead key={keyword} className="text-center">
                {keyword}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sites.map((site) => {
            const keywordStats = allKeywords.map((keyword) => {
              const foundInUrls = Object.values(site.results).filter((results) => results[keyword]).length
              return foundInUrls
            })

            return (
              <TableRow key={site.start_urls[0]}>
                <TableCell className="font-medium">{new URL(site.start_urls[0]).hostname}</TableCell>
                <TableCell className="text-center">{site.scraped_sites}</TableCell>
                <TableCell className="text-center">{site.total_coincidences}</TableCell>
                {keywordStats.map((count, index) => (
                  <TableCell key={index} className="text-center">
                    <Badge variant={count > 0 ? "default" : "secondary"}>{count}</Badge>
                  </TableCell>
                ))}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

