"use client"

import { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ExternalLink, ChevronDown, ChevronRight, Download, Search, AlertCircle, Globe } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"

type SiteScrapingResult = {
  title: string
  start_urls: string[]
  duration_seconds: number
  scraped_sites: number
  total_coincidences: number
  results: Record<string, Record<string, boolean>>
  last_scan: string
  search_query: string
  keywords?: string[]
  created_at: string
}

export function SiteResultsCard({ site }: { site: SiteScrapingResult }) {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const [detailsSearch, setDetailsSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedConditions, setSelectedConditions] = useState<Record<string, boolean>>({})
  const [showErrors, setShowErrors] = useState(false)
  const itemsPerPage = 10

  // Wrap keywords in useMemo to avoid re-renders
  const keywords = useMemo(() => site.keywords || [], [site.keywords])

  // Inicializar las condiciones usando las keywords del modelo
  useEffect(() => {
    if (Object.keys(selectedConditions).length === 0 && keywords.length > 0) {
      const initial = keywords.reduce((acc, keyword) => ({
        ...acc,
        [keyword]: false
      }), {})
      setSelectedConditions(initial)
    }
  }, [keywords, selectedConditions])

  // Separar resultados con error y exitosos
  const { errorResults, successResults } = Object.entries(site.results).reduce(
    (acc, [url, result]) => {
      if (result && typeof result === 'object' && 'error' in result) {
        // @ts-expect-error - Type checking for results object
        acc.errorResults.push([url, result])
      } else {
        acc.successResults.push([url, result])
      }
      return acc
    },
    { errorResults: [], successResults: [] } as {
      errorResults: [string, { error: string }][],
      successResults: [string, Record<string, boolean>][]
    }
  )

  // Filtrar según el modo seleccionado
  const filteredResults = (showErrors ? errorResults : successResults)
    .filter(([url]) => url.toLowerCase().includes(detailsSearch.toLowerCase()))
    .filter(([, result]) => {
      if (showErrors) return true // No aplicar filtros de keywords a errores

      const activeConditions = Object.entries(selectedConditions)
        .filter(([, isSelected]) => isSelected)
        .map(([keyword]) => keyword)
      
      if (activeConditions.length === 0) return true
      // @ts-expect-error - Type checking for nested object
      return activeConditions.every(keyword => result[keyword])
    })

  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage)

  const getHostname = (url: string): string => {
    try {
      // Asegurarse de que la URL tenga el protocolo
      const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`
      return new URL(urlWithProtocol).hostname
    } catch {
      // Si falla, devolver la URL original o un texto alternativo
      return url
    }
  }

  // Remove unused function if not needed elsewhere
  // If you need to keep it for future use, you can add a comment to disable the linter warning
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const extractMainDomain = (urls: string[]) => {
    try {
      if (!urls || urls.length === 0) return '';
      const url = new URL(urls[0]);
      return url.hostname;
    } catch {
      // Si la URL es inválida, devolvemos la URL original o un string vacío
      return urls[0] || '';
    }
  };
  
  const isGoogleSearch = Boolean(site?.search_query)

  const handleExportCSV = () => {
    // Preparar los datos según el modo
    const csvData = showErrors
      ? errorResults.map(([url, result]) => ({
          URL: url,
          Error: (result as { error: string }).error
        }))
      : successResults.map(([url, result]) => ({
          URL: url,
          ...keywords.reduce((acc, keyword) => ({
            ...acc,
            [keyword]: result[keyword] ? "Sí" : "No"
          }), {}),
          Total: Object.values(result).filter(Boolean).length
        }))

    // Convertir a CSV
    const headers = showErrors
      ? ["URL", "Error"]
      : ["URL", ...keywords, "Total"]
    
    const csvContent = [
      headers.join(","),
      ...csvData.map(row => headers.map(header => 
        `"${(row as Record<string, string | number>)[header]}"`
      ).join(","))
    ].join("\n")

    // Crear y descargar el archivo
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${site.title}-${showErrors ? 'errores' : 'resultados'}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card className="min-w-0">
      <CardHeader>
        <div className="flex items-center justify-between min-w-0">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <CardTitle className="truncate">{site.title}</CardTitle>
              {isGoogleSearch && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 border border-blue-100">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="text-sm text-blue-700 font-medium">{t('results.googleSearch')}</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {t('results.lastScan')}: {site.created_at}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button 
              variant="outline" 
              onClick={handleExportCSV}
              className="border border-gray-200 bg-white hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              {t('common.export')} CSV
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsExpanded(!isExpanded)}
              className="border border-gray-200 bg-white hover:bg-gray-50 whitespace-nowrap"
            >
              <ChevronRight className={`h-4 w-4 mr-2 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
              {t('common.viewDetails')}
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium text-gray-600 mb-2">
            {t('results.analyzedSites')}:
          </p>
          <div className="flex flex-wrap gap-2">
            {site.start_urls.map((url, index) => (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md transition-colors"
              >
                <Globe className="h-4 w-4" />
                {getHostname(url)}
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-4">
          <StatsCard
            label={t('results.scannedUrls')}
            value={Object.keys(site.results).length}
            trend="neutral"
          />
          <StatsCard
            label={t('results.totalMatches')}
            value={site.total_coincidences}
            trend={site.total_coincidences > 0 ? "positive" : "neutral"}
          />
          <StatsCard
            label={t('results.foundKeywords')}
            value={Object.keys(Object.values(site.results)[0] || {}).length}
            trend="neutral"
          />
          <StatsCard
            label={t('results.duration')}
            value={`${site.duration_seconds.toFixed(1)}s`}
            trend="neutral"
          />
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder={t('results.searchPlaceholder')}
                  value={detailsSearch}
                  onChange={(e) => {
                    setDetailsSearch(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-8"
                />
              </div>

              <div className="flex items-center gap-4">
                {/* Toggle de errores */}
                <div className="flex items-center gap-2">
                  <Switch
                    checked={showErrors}
                    onCheckedChange={setShowErrors}
                    id="error-mode"
                  />
                  <label
                    htmlFor="error-mode"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {showErrors ? t('results.showErrors') : t('results.showResults')}
                  </label>
                </div>

                {/* Solo mostrar filtros de keywords en modo resultados */}
                {!showErrors && keywords.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        {t('results.filters')}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>{t('results.keywords')}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className="p-2">
                        {keywords.map(keyword => (
                          <label
                            key={keyword}
                            className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded-md cursor-pointer"
                          >
                            <Checkbox
                              id={keyword}
                              checked={selectedConditions[keyword] || false}
                              onCheckedChange={(checked: boolean) => {
                                setSelectedConditions(prev => ({
                                  ...prev,
                                  [keyword]: checked
                                }))
                                setCurrentPage(1)
                              }}
                            />
                            <span className="text-sm">{keyword}</span>
                          </label>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

            {/* Mostrar estadísticas de errores/éxitos */}
            <div className="flex gap-4 text-sm text-gray-600">
              <span>
                {t('results.successResults')}: {successResults.length}
              </span>
              <span>
                {t('results.errorsFound')}: {errorResults.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">{t('results.url')}</th>
                    {!showErrors && keywords.map((keyword) => (
                      <th key={keyword} className="px-6 py-3">{keyword}</th>
                    ))}
                    <th className="px-6 py-3">
                      {showErrors ? t('results.error') : t('results.total')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedResults.map(([url, result]) => (
                    <tr key={url} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <a 
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {url}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                      {showErrors ? (
                        <td className="px-6 py-4 text-red-600">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            <span>{(result as { error: string }).error}</span>
                          </div>
                        </td>
                      ) : (
                        <>
                          {keywords.map((keyword) => (
                            <td key={keyword} className="px-6 py-4">
                              {!('error' in result) && result[keyword] ? "Sí" : "No"}
                            </td>
                          ))}
                          <td className="px-6 py-4">
                            {Object.values(result).filter(Boolean).length}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    {t('common.previous')}
                  </Button>
                  <span className="py-2 px-4 bg-gray-100 rounded">
                    {t('common.page')} {currentPage} {t('common.of')} {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    {t('common.next')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

function StatsCard({
  label,
  value,
  trend,
}: {
  label: string
  value: string | number
  trend: "positive" | "negative" | "neutral"
}) {
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
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${getTextColor()}`}>{value}</p>
    </div>
  )
}
