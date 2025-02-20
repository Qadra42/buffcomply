"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ArrowUpDown } from "lucide-react"
import { SiteResultsCard } from "./site-results-card"
import { GlobalStatistics } from "./global-statistics"
import { ComparisonView } from "./comparison-view"

type SiteScrapingResult = {
  start_url: string
  duration_seconds: number
  scraped_sites: number
  total_coincidences: number
  results: Record<string, Record<string, boolean>>
  last_scan: string
}

export function ResultsView() {
  const [sites, setSites] = useState<SiteScrapingResult[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeView, setActiveView] = useState<"sites" | "comparison">("sites")
  const [sortBy, setSortBy] = useState<"coincidences" | "date">("date")

  useEffect(() => {
    // Simular la carga de resultados de múltiples sitios
    const mockSites: SiteScrapingResult[] = [
      {
        start_url: "https://gainblers.com/br/",
        duration_seconds: 32.53,
        scraped_sites: 5,
        total_coincidences: 2,
        last_scan: "2024-02-17T10:30:00Z",
        results: {
          "https://gainblers.com/br/": {
            "boas vindas": false,
            bonus: false,
          },
          "https://gainblers.com/br/prognosticos/": {
            "boas vindas": false,
            bonus: true,
          },
        },
      },
      {
        start_url: "https://gambling.com",
        duration_seconds: 28.15,
        scraped_sites: 6,
        total_coincidences: 3,
        last_scan: "2024-02-17T11:45:00Z",
        results: {
          "https://gambling.com": {
            "boas vindas": true,
            bonus: false,
          },
          "https://gambling.com/sports": {
            "boas vindas": false,
            bonus: true,
          },
        },
      },
      {
        start_url: "https://betohio.com",
        duration_seconds: 25.8,
        scraped_sites: 4,
        total_coincidences: 1,
        last_scan: "2024-02-17T09:15:00Z",
        results: {
          "https://betohio.com": {
            "boas vindas": false,
            bonus: true,
          },
          "https://betohio.com/sports": {
            "boas vindas": false,
            bonus: false,
          },
        },
      },
    ]
    setSites(mockSites)
  }, [])

  const filteredSites = sites
    .filter((site) => site.start_url.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "coincidences") {
        return b.total_coincidences - a.total_coincidences
      }
      return new Date(b.last_scan).getTime() - new Date(a.last_scan).getTime()
    })

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">Resultados del Scraping</CardTitle>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Buscar sitios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-[300px] transition-all duration-200 hover:border-blue-500 focus:border-blue-500"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setSortBy(sortBy === "coincidences" ? "date" : "coincidences")}
                className="hover:border-blue-500 hover:text-blue-500 transition-colors"
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Ordenar por {sortBy === "coincidences" ? "fecha" : "coincidencias"}
              </Button>
            </div>
            <Button
              onClick={() => setActiveView(activeView === "sites" ? "comparison" : "sites")}
              className="bg-blue-500 hover:bg-blue-600 transition-colors"
            >
              {activeView === "sites" ? "Ver Comparación" : "Ver Sitios"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <GlobalStatistics sites={sites} />

          {activeView === "sites" ? (
            <div className="space-y-6 mt-6">
              {filteredSites.map((site) => (
                <SiteResultsCard key={site.start_url} site={site} />
              ))}
            </div>
          ) : (
            <ComparisonView sites={filteredSites} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

