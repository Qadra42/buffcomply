"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ArrowUpDown, Filter, X } from "lucide-react"
import { SiteResultsCard } from "./site-results-card"
import { GlobalStatistics } from "./global-statistics"
import { ComparisonView } from "./comparison-view"
import { Checkbox } from "@/components/ui/checkbox"

type SiteScrapingResult = {
  title: string
  start_urls: string[]
  duration_seconds: number
  scraped_sites: number
  total_coincidences: number
  results: Record<string, Record<string, boolean>>
  last_scan: string
  search_query: string
  created_at?: string
  keywords?: string[]
}

export function ResultsView() {
  const [sites, setSites] = useState<SiteScrapingResult[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeView, setActiveView] = useState<"sites" | "comparison">("sites")
  const [sortBy, setSortBy] = useState<"coincidences" | "date">("date")
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    hasCoincidences: false,
    multipleUrls: false,
    recentScans: false,
  })

  const ITEMS_PER_PAGE = 20

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('/api/scraping')
        if (!response.ok) {
          throw new Error('Error fetching scraping results')
        }
        const data = await response.json()
        setSites(data)
      } catch (error) {
        console.error('Error loading scraping results:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [])

  const filteredSites = sites
    .filter((site) => {
      const matchesSearch = site.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.start_urls.some(url => url.toLowerCase().includes(searchTerm.toLowerCase()))

      if (!matchesSearch) return false

      if (filters.hasCoincidences && site.total_coincidences === 0) return false
      if (filters.multipleUrls && site.start_urls.length <= 1) return false
      if (filters.recentScans) {
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        if (new Date(site.last_scan) < oneWeekAgo) return false
      }

      return true
    })
    .sort((a, b) => {
      if (sortBy === "coincidences") {
        return b.total_coincidences - a.total_coincidences
      }
      return new Date(b.last_scan).getTime() - new Date(a.last_scan).getTime()
    })

  const totalPages = Math.ceil(filteredSites.length / ITEMS_PER_PAGE)
  const paginatedSites = filteredSites.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="flex-1 h-full overflow-auto pr-4">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white">
        <CardHeader className="space-y-4">
          <CardTitle className="text-2xl font-bold text-gray-800">Resultados del Scraping</CardTitle>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex flex-wrap items-center gap-4 flex-1">
                <div className="relative w-full max-w-[300px]">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Buscar sitios..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="pl-8 w-full transition-all duration-200 hover:border-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setSortBy(sortBy === "coincidences" ? "date" : "coincidences")}
                    className="hover:border-blue-500 hover:text-blue-500 transition-colors whitespace-nowrap"
                  >
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Ordenar por {sortBy === "coincidences" ? "fecha" : "coincidencias"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`hover:border-blue-500 hover:text-blue-500 transition-colors whitespace-nowrap ${
                      showFilters || Object.values(filters).some(Boolean) ? "border-blue-500 text-blue-500" : ""
                    }`}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                    {Object.values(filters).some(Boolean) && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">
                        {Object.values(filters).filter(Boolean).length}
                      </span>
                    )}
                  </Button>
                </div>
              </div>
              <Button
                onClick={() => setActiveView(activeView === "sites" ? "comparison" : "sites")}
                className="bg-blue-500 hover:bg-blue-600 transition-colors whitespace-nowrap shrink-0"
              >
                {activeView === "sites" ? "Ver Comparación" : "Ver Sitios"}
              </Button>
            </div>

            {/* Panel de filtros */}
            {showFilters && (
              <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Filtros aplicados</h3>
                  {Object.values(filters).some(Boolean) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFilters({
                        hasCoincidences: false,
                        multipleUrls: false,
                        recentScans: false,
                      })}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Limpiar filtros
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasCoincidences"
                      checked={filters.hasCoincidences}
                      onCheckedChange={(checked) => {
                        setFilters(prev => ({ ...prev, hasCoincidences: checked === true }))
                        setCurrentPage(1)
                      }}
                    />
                    <label htmlFor="hasCoincidences" className="text-sm">
                      Con coincidencias
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="multipleUrls"
                      checked={filters.multipleUrls}
                      onCheckedChange={(checked) => {
                        setFilters(prev => ({ ...prev, multipleUrls: checked === true }))
                        setCurrentPage(1)
                      }}
                    />
                    <label htmlFor="multipleUrls" className="text-sm">
                      Múltiples URLs
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="recentScans"
                      checked={filters.recentScans}
                      onCheckedChange={(checked) => {
                        setFilters(prev => ({ ...prev, recentScans: checked === true }))
                        setCurrentPage(1)
                      }}
                    />
                    <label htmlFor="recentScans" className="text-sm">
                      Últimos 7 días
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Cargando resultados...</div>
          ) : (
            <div className="space-y-6">
              <GlobalStatistics sites={sites} />
              {activeView === "sites" ? (
                <div className="space-y-6">
                  {paginatedSites.map((site, index) => (
                    <SiteResultsCard 
                      key={`${site.title}-${index}`} 
                      site={{
                        ...site, 
                        search_query: site.search_query || "",
                        created_at: site.created_at || site.last_scan
                      }} 
                    />
                  ))}
                  
                  {/* Paginación */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 mt-6">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        Anterior
                      </Button>
                      <span className="text-sm text-gray-600">
                        Página {currentPage} de {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Siguiente
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <ComparisonView sites={filteredSites} />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
