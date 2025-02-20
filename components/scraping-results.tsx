'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ScrapeResult {
  start_urls: string[]
  duration_seconds: number
  scraped_sites: number
  total_coincidences: number
  results: Record<string, Record<string, boolean>>
  created_at: string
}

export function ScrapingResults() {
  const [results, setResults] = useState<ScrapeResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch('/api/scraping')
        if (!response.ok) {
          throw new Error('Failed to fetch results')
        }
        const data = await response.json()
        setResults(data)
      } catch (error) {
        console.error('Error fetching results:', error)
        setError('Failed to load scraping results')
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Historial de Scraping
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((result, index) => (
              <Card key={index} className="border p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">
                      Sitios analizados: {result.scraped_sites}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Coincidencias encontradas: {result.total_coincidences}
                    </p>
                    <p className="text-sm text-gray-600">
                      Duración: {result.duration_seconds.toFixed(2)}s
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {format(new Date(result.created_at), 'dd/MM/yyyy HH:mm')}
                  </span>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">URLs analizadas:</h4>
                  <ul className="space-y-1">
                    {result.start_urls.map((url, i) => (
                      <li key={i} className="text-sm text-blue-600 truncate">
                        {url}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">Resultados por URL:</h4>
                  {Object.entries(result.results).map(([url, keywords], i) => (
                    <div key={i} className="mb-3">
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {url}
                      </p>
                      <ul className="ml-4">
                        {Object.entries(keywords).map(([keyword, found], j) => (
                          <li key={j} className="text-sm flex items-center space-x-2">
                            <span className={found ? "text-green-600" : "text-red-600"}>
                              {found ? "✓" : "✗"}
                            </span>
                            <span>{keyword}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 