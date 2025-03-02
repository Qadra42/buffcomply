"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Search, TrendingDown, TrendingUp, Minus } from "lucide-react"

type Ranking = {
  affiliateSite: string
  currentPosition: number
  previousPosition: number
  trend: "up" | "down" | "stable"
  competitors: { name: string; position: number }[]
}

type HistoricalData = {
  date: string
  position: number
}

const mockRankings: Ranking[] = [
  {
    affiliateSite: "topbettingsites.com",
    currentPosition: 3,
    previousPosition: 5,
    trend: "up",
    competitors: [
      { name: "Competitor A", position: 1 },
      { name: "Competitor B", position: 2 },
    ],
  },
  {
    affiliateSite: "casinoreviews.net",
    currentPosition: 1,
    previousPosition: 1,
    trend: "stable",
    competitors: [
      { name: "Competitor C", position: 2 },
      { name: "Competitor D", position: 3 },
    ],
  },
  {
    affiliateSite: "gamblingexperts.org",
    currentPosition: 7,
    previousPosition: 4,
    trend: "down",
    competitors: [
      { name: "Competitor E", position: 5 },
      { name: "Competitor F", position: 6 },
    ],
  },
  {
    affiliateSite: "bettingguide.com",
    currentPosition: 2,
    previousPosition: 3,
    trend: "up",
    competitors: [
      { name: "Competitor G", position: 1 },
      { name: "Competitor H", position: 3 },
    ],
  },
  {
    affiliateSite: "casinoratings.io",
    currentPosition: 4,
    previousPosition: 6,
    trend: "up",
    competitors: [
      { name: "Competitor I", position: 1 },
      { name: "Competitor J", position: 2 },
    ],
  },
]

const mockHistoricalData: HistoricalData[] = [
  { date: "2023-01-01", position: 5 },
  { date: "2023-02-01", position: 4 },
  { date: "2023-03-01", position: 4 },
  { date: "2023-04-01", position: 3 },
  { date: "2023-05-01", position: 2 },
  { date: "2023-06-01", position: 3 },
]

export function RankingsView() {
  const { t } = useTranslation()
  const [rankings, setRankings] = useState<Ranking[]>(mockRankings)
  const [filteredRankings, setFilteredRankings] = useState<Ranking[]>(mockRankings)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"position" | "site">("position")
  const [selectedSite, setSelectedSite] = useState<string | null>(null)

  useEffect(() => {
    const filtered = rankings.filter((ranking) =>
      ranking.affiliateSite.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    const sorted = filtered.sort((a, b) => {
      if (sortBy === "position") {
        return a.currentPosition - b.currentPosition
      } else {
        return a.affiliateSite.localeCompare(b.affiliateSite)
      }
    })
    setFilteredRankings(sorted)
  }, [searchTerm, sortBy, rankings])

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="text-green-500" />
      case "down":
        return <TrendingDown className="text-red-500" />
      case "stable":
        return <Minus className="text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('rankings.overview')}</CardTitle>
          <div className="flex justify-between items-center">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder={t('rankings.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select onValueChange={(value) => setSortBy(value as "position" | "site")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('rankings.sortBy')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="position">{t('rankings.sortByPosition')}</SelectItem>
                <SelectItem value="site">{t('rankings.sortBySite')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Affiliate Site</TableHead>
                <TableHead>Current Position</TableHead>
                <TableHead>Previous Position</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead>Top Competitors</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRankings.map((ranking, index) => (
                <TableRow
                  key={index}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => setSelectedSite(ranking.affiliateSite)}
                >
                  <TableCell>{ranking.affiliateSite}</TableCell>
                  <TableCell>{ranking.currentPosition}</TableCell>
                  <TableCell>{ranking.previousPosition}</TableCell>
                  <TableCell>{getTrendIcon(ranking.trend)}</TableCell>
                  <TableCell>
                    {ranking.competitors.slice(0, 2).map((competitor, i) => (
                      <div key={i}>
                        {competitor.name}: #{competitor.position}
                      </div>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedSite && (
        <Card>
          <CardHeader>
            <CardTitle>Historical Ranking for {selectedSite}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockHistoricalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis reversed={true} domain={[1, "dataMax"]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="position" stroke="#8884d8" name="Betano Position" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

