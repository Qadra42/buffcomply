"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Minus } from "lucide-react"
import { Label } from "@/components/ui/label"

export function ScraperForm() {
  const [title, setTitle] = useState("")
  const [urls, setUrls] = useState("")
  const [keywords, setKeywords] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleAddKeyword = () => {
    setKeywords([...keywords, ""])
  }

  const handleRemoveKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index))
  }

  const handleKeywordChange = (index: number, value: string) => {
    const newKeywords = [...keywords]
    newKeywords[index] = value
    setKeywords(newKeywords)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const urlList = urls.split('\n').filter(url => url.trim() !== '')
      
      const params = new URLSearchParams()
      params.append('title', title)
      urlList.forEach(url => params.append('urls', url.trim()))
      keywords.forEach(keyword => params.append('keywords', keyword))
      params.append('max_depth', '1')

      const response = await fetch(`http://127.0.0.1:8000/api/v1/scrape/?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      console.log('Scraping results:', data)
      // Handle the results here

    } catch (error) {
      console.error('Error during scraping:', error)
      // Handle error here
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Título del análisis</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Análisis de sitios de apuestas"
          required
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Target URLs</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            placeholder="Enter URLs to scrape (one per line)"
            rows={5}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Keywords</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {keywords.map((keyword, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={keyword}
                  onChange={(e) => handleKeywordChange(index, e.target.value)}
                  placeholder="Enter keyword"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleRemoveKeyword(index)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={handleAddKeyword}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Keyword
            </Button>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Scraping..." : "Start Scraping"}
      </Button>
    </form>
  )
}

