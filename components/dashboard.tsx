"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

type ScrapingResult = {
  url: string
  bonusAmount: number
  keywordsFound: number
  paymentMethods: number
}

export function Dashboard() {
  const [results, setResults] = useState<ScrapingResult[]>([])

  useEffect(() => {
    // Simular la carga de datos
    const mockResults: ScrapingResult[] = [
      { url: "casino1.com", bonusAmount: 100, keywordsFound: 5, paymentMethods: 3 },
      { url: "casino2.com", bonusAmount: 200, keywordsFound: 7, paymentMethods: 5 },
      { url: "casino3.com", bonusAmount: 150, keywordsFound: 6, paymentMethods: 4 },
      { url: "casino4.com", bonusAmount: 300, keywordsFound: 8, paymentMethods: 6 },
      { url: "casino5.com", bonusAmount: 50, keywordsFound: 4, paymentMethods: 2 },
    ]
    setResults(mockResults)
  }, [])

  const totalSites = results.length
  const averageBonus = results.reduce((sum, result) => sum + result.bonusAmount, 0) / totalSites
  const totalKeywords = results.reduce((sum, result) => sum + result.keywordsFound, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Sites Scanned</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalSites}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Bonus</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${averageBonus.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Keywords Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalKeywords}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Bonus Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={results}>
              <XAxis dataKey="url" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bonusAmount" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

