"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Minus, Play, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type WizardStep = 'config' | 'keywords' | 'review'

export function SiteScraperForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<WizardStep>('config')
  const [title, setTitle] = useState("")
  const [urls, setUrls] = useState<string[]>([])
  const [newUrl, setNewUrl] = useState("")
  const [keywords, setKeywords] = useState<string[]>([])
  const [newKeyword, setNewKeyword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [bulkUrls, setBulkUrls] = useState("")

  const validateUrls = (urlList: string[]): boolean => {
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
    return urlList.every(url => urlPattern.test(url))
  }

  const handleAddUrl = () => {
    if (!newUrl.trim()) {
      setError("La URL no puede estar vacía")
      return
    }

    if (!validateUrls([newUrl])) {
      setError("URL inválida")
      return
    }

    setUrls([...urls, newUrl.trim()])
    setNewUrl("")
    setSuccess("URL agregada correctamente")
    setTimeout(() => setSuccess(null), 2000)
  }

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) {
      setError("La keyword no puede estar vacía")
      return
    }

    if (keywords.includes(newKeyword.trim())) {
      setError("Esta keyword ya existe")
      return
    }

    setKeywords([...keywords, newKeyword.trim()])
    setNewKeyword("")
    setSuccess("Keyword agregada correctamente")
    setTimeout(() => setSuccess(null), 2000)
  }

  const handleBulkUrlsAdd = () => {
    if (!bulkUrls.trim()) return
    
    const urlList = bulkUrls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url)
    
    if (!validateUrls(urlList)) {
      setError("Una o más URLs son inválidas")
      return
    }

    setUrls(Array.from(new Set([...urls, ...urlList])))
    setBulkUrls("")
    setSuccess(`${urlList.length} URLs agregadas correctamente`)
    setTimeout(() => setSuccess(null), 2000)
  }

  const validateStep = () => {
    switch (currentStep) {
      case 'config':
        if (!title.trim()) {
          setError("El título del análisis es obligatorio")
          return false
        }
        if (urls.length === 0) {
          setError("Debe agregar al menos una URL")
          return false
        }
        break
      case 'keywords':
        if (keywords.length === 0) {
          setError("Debe agregar al menos una keyword")
          return false
        }
        break
    }
    setError(null)
    return true
  }

  const handleNextStep = () => {
    if (validateStep()) {
      switch (currentStep) {
        case 'config':
          setCurrentStep('keywords')
          setSuccess("Configuración básica guardada")
          break
        case 'keywords':
          setCurrentStep('review')
          setSuccess("Keywords configuradas correctamente")
          break
      }
    }
  }

  const handlePreviousStep = () => {
    switch (currentStep) {
      case 'keywords':
        setCurrentStep('config')
        break
      case 'review':
        setCurrentStep('keywords')
        break
    }
    setError(null)
  }

  const handleSubmit = async () => {
    if (!validateStep()) return

    try {
      const params = new URLSearchParams()
      
      urls.forEach(url => params.append('urls', url))
      
      keywords.forEach(keyword => params.append('keywords', keyword))
      
      params.append('title', title)
      params.append('max_depth', '1')

      const response = await fetch(`https://api.buffcomply.com/api/v1/scrape/?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Error al iniciar el scraping')
      }

      router.push('/results')
    } catch (error) {
      console.error('Error:', error)
      setError("Error al iniciar el scraping")
    }
  }

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <div className="flex justify-between mb-8">
        {['Configuración', 'Keywords', 'Revisión'].map((step, index) => (
          <div
            key={step}
            className={`flex items-center ${
              index === ['config', 'keywords', 'review'].indexOf(currentStep)
                ? 'text-blue-600'
                : 'text-gray-400'
            }`}
          >
            <div className="flex items-center">
              <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 
                ${index === ['config', 'keywords', 'review'].indexOf(currentStep)
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300'}`}
              >
                {index + 1}
              </div>
              <span className="ml-2">{step}</span>
            </div>
            {index < 2 && <div className="h-1 w-12 bg-gray-200 mx-2" />}
          </div>
        ))}
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
          {success}
        </div>
      )}

      {/* Steps Content */}
      {currentStep === 'config' && (
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título del análisis</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ej: Análisis de competencia SEO"
                      />
                      <AlertCircle className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Nombre identificativo para este análisis</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="space-y-2">
              <Label>URLs a analizar</Label>
              <div className="flex gap-2">
                <Input
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://ejemplo.com"
                  onKeyPress={(e) => e.key === "Enter" && handleAddUrl()}
                />
                <Button onClick={handleAddUrl}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </div>

              <div className="mt-4">
                <Label>O pega varias URLs (una por línea)</Label>
                <div className="space-y-2">
                  <Textarea
                    value={bulkUrls}
                    placeholder="https://ejemplo1.com&#10;https://ejemplo2.com"
                    className="mt-2"
                    onChange={(e) => setBulkUrls(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        e.preventDefault()
                        handleBulkUrlsAdd()
                      }
                    }}
                  />
                  <Button 
                    onClick={handleBulkUrlsAdd}
                    variant="outline"
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar URLs
                  </Button>
                  <p className="text-sm text-gray-500">
                    Presiona Ctrl + Enter o el botón para agregar las URLs
                  </p>
                </div>
              </div>

              {urls.length > 0 && (
                <div className="mt-4 space-y-2">
                  <Label>URLs agregadas ({urls.length})</Label>
                  <div className="flex flex-wrap gap-2">
                    {urls.map((url, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-2"
                      >
                        {url}
                        <button
                          onClick={() => setUrls(urls.filter((_, i) => i !== index))}
                          className="ml-1 hover:text-red-500"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 'keywords' && (
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label>Keywords a buscar</Label>
              <div className="flex gap-2">
                <Input
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Ingresa una keyword"
                  onKeyPress={(e) => e.key === "Enter" && handleAddKeyword()}
                />
                <Button onClick={handleAddKeyword}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </div>

              {keywords.length > 0 && (
                <div className="mt-4 space-y-2">
                  <Label>Keywords agregadas ({keywords.length})</Label>
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-2"
                      >
                        {keyword}
                        <button
                          onClick={() => setKeywords(keywords.filter((_, i) => i !== index))}
                          className="ml-1 hover:text-red-500"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 'review' && (
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-600">Título del análisis</h3>
                <p className="text-lg font-medium">{title}</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-600">URLs a analizar ({urls.length})</h3>
                <div className="mt-2 space-y-1">
                  {urls.map((url, index) => (
                    <div key={index} className="text-sm">{url}</div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-600">Keywords ({keywords.length})</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        {currentStep !== 'config' && (
          <Button
            type="button"
            variant="outline"
            onClick={handlePreviousStep}
          >
            Anterior
          </Button>
        )}
        {currentStep !== 'review' ? (
          <Button
            type="button"
            onClick={handleNextStep}
            className="ml-auto"
          >
            Siguiente
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className="ml-auto bg-blue-600 hover:bg-blue-700"
          >
            <Play className="h-4 w-4 mr-2" />
            Iniciar Scraping
          </Button>
        )}
      </div>
    </div>
  )
} 