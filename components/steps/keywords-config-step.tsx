"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Minus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Category {
  name: string
  keywords: string[]
}

interface KeywordsConfigStepProps {
  categories: Category[]
  setCategories: (categories: Category[]) => void
}

export function KeywordsConfigStep({ categories, setCategories }: KeywordsConfigStepProps) {
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

  const handleAddKeyword = (categoryIndex: number) => {
    const newKeyword = (document.getElementById(`keyword-input-${categoryIndex}`) as HTMLInputElement)?.value
    if (!newKeyword?.trim()) return

    const newCategories = [...categories]
    newCategories[categoryIndex].keywords.push(newKeyword.trim())
    setCategories(newCategories)
    ;(document.getElementById(`keyword-input-${categoryIndex}`) as HTMLInputElement).value = ""
  }

  const handleRemoveKeyword = (categoryIndex: number, keywordIndex: number) => {
    const newCategories = [...categories]
    newCategories[categoryIndex].keywords.splice(keywordIndex, 1)
    setCategories(newCategories)
  }

  return (
    <div className="space-y-6">
      {categories.map((category, categoryIndex) => (
        <Card key={categoryIndex}>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-4">
                <Label htmlFor={`category-${categoryIndex}`}>Nombre de la categoría</Label>
                <Input
                  id={`category-${categoryIndex}`}
                  value={category.name}
                  onChange={(e) => handleCategoryNameChange(categoryIndex, e.target.value)}
                  placeholder="Ej: Afiliados"
                />
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleRemoveCategory(categoryIndex)}
                className="mt-6"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  id={`keyword-input-${categoryIndex}`}
                  placeholder="Agregar keyword..."
                  onKeyPress={(e) => e.key === "Enter" && handleAddKeyword(categoryIndex)}
                />
                <Button onClick={() => handleAddKeyword(categoryIndex)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {category.keywords.map((keyword, keywordIndex) => (
                  <Badge
                    key={keywordIndex}
                    variant="secondary"
                    className="flex items-center gap-2"
                  >
                    {keyword}
                    <button
                      onClick={() => handleRemoveKeyword(categoryIndex, keywordIndex)}
                      className="ml-1 hover:text-red-500"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button onClick={handleAddCategory} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Agregar Nueva Categoría
      </Button>
    </div>
  )
} 