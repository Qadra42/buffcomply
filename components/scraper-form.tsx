"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Minus } from "lucide-react"

type Category = {
  name: string
  keywords: string[]
}

export function ScraperForm() {
  const [urls, setUrls] = useState("")
  const [categories, setCategories] = useState<Category[]>([
    { name: "Bonuses", keywords: ["welcome bonus", "free spins", "no deposit"] },
    { name: "Games", keywords: ["slots", "roulette", "blackjack"] },
    { name: "Payments", keywords: ["deposit", "withdrawal", "payment methods"] },
  ])

  const handleAddCategory = () => {
    setCategories([...categories, { name: "", keywords: [] }])
  }

  const handleRemoveCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index))
  }

  const handleCategoryNameChange = (index: number, name: string) => {
    const newCategories = [...categories]
    newCategories[index].name = name
    setCategories(newCategories)
  }

  const handleAddKeyword = (categoryIndex: number, keyword: string) => {
    const newCategories = [...categories]
    newCategories[categoryIndex].keywords.push(keyword)
    setCategories(newCategories)
  }

  const handleRemoveKeyword = (categoryIndex: number, keywordIndex: number) => {
    const newCategories = [...categories]
    newCategories[categoryIndex].keywords.splice(keywordIndex, 1)
    setCategories(newCategories)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para iniciar el scraping
    console.log("Iniciando scraping con:", { urls, categories })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          <CardTitle>Keyword Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-4 p-4 border rounded">
              <div className="flex items-center mb-2">
                <Input
                  value={category.name}
                  onChange={(e) => handleCategoryNameChange(categoryIndex, e.target.value)}
                  placeholder="Category name"
                  className="mr-2"
                />
                <Button type="button" variant="outline" size="icon" onClick={() => handleRemoveCategory(categoryIndex)}>
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
              {category.keywords.map((keyword, keywordIndex) => (
                <div key={keywordIndex} className="flex items-center mt-2">
                  <Input
                    value={keyword}
                    onChange={(e) => {
                      const newCategories = [...categories]
                      newCategories[categoryIndex].keywords[keywordIndex] = e.target.value
                      setCategories(newCategories)
                    }}
                    placeholder="Keyword"
                    className="mr-2"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveKeyword(categoryIndex, keywordIndex)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => handleAddKeyword(categoryIndex, "")}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Keyword
              </Button>
            </div>
          ))}
          <Button type="button" onClick={handleAddCategory}>
            <Plus className="h-4 w-4 mr-2" /> Add Category
          </Button>
        </CardContent>
      </Card>

      <Button type="submit">Start Scraping</Button>
    </form>
  )
}

