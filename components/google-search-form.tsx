"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BasicConfigStep } from "@/components/steps/basic-config-step"
import { KeywordsConfigStep } from "@/components/steps/keywords-config-step"
import { ReviewStep } from "@/components/steps/review-step"

type Category = {
  name: string
  keywords: string[]
}

// Definir los pasos del wizard
type WizardStep = 'basic' | 'keywords' | 'review'

export function GoogleSearchForm() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [resultsCount, setResultsCount] = useState("100")
  const [googleDomain, setGoogleDomain] = useState("google.com")
  const [language, setLanguage] = useState("en")
  const [categories, setCategories] = useState<Category[]>([
    {
      name: "Casinos",
      keywords: [],
    },
    {
      name: "Bonos",
      keywords: [],
    },
  ])
  const [currentStep, setCurrentStep] = useState<WizardStep>('basic')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Validación del paso básico
  const validateBasicStep = () => {
    if (!searchQuery.trim()) {
      setError('El término de búsqueda es obligatorio')
      return false
    }
    setError(null)
    return true
  }

  // Validación del paso de keywords
  const validateKeywordsStep = () => {
    if (categories.some(cat => !cat.name.trim())) {
      setError('Todas las categorías deben tener un nombre')
      return false
    }
    if (categories.some(cat => cat.keywords.length === 0)) {
      setError('Cada categoría debe tener al menos una keyword')
      return false
    }
    setError(null)
    return true
  }

  const handleNextStep = () => {
    switch (currentStep) {
      case 'basic':
        if (validateBasicStep()) {
          setCurrentStep('keywords')
          setSuccess('Configuración básica guardada')
        }
        break
      case 'keywords':
        if (validateKeywordsStep()) {
          setCurrentStep('review')
          setSuccess('Keywords configuradas correctamente')
        }
        break
    }
  }

  const handlePreviousStep = () => {
    switch (currentStep) {
      case 'keywords':
        setCurrentStep('basic')
        break
      case 'review':
        setCurrentStep('keywords')
        break
    }
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!searchQuery.trim()) {
      console.error('La búsqueda no puede estar vacía')
      return
    }
    
    try {
      // Extraer todas las keywords como array
      const allKeywords = categories
        .flatMap(cat => cat.keywords)
        .filter(k => k.trim() !== '')

      // Construir la URL con los parámetros
      const params = new URLSearchParams()
      params.append('query', searchQuery)
      // Agregar cada keyword individualmente
      allKeywords.forEach(keyword => {
        params.append('keywords', keyword)
      })
      params.append('country', googleDomain.split('.').pop() || 'com')
      params.append('max_results', resultsCount)
      params.append('max_depth', '1')
      
      const response = await fetch(`https://api.buffcomply.com/api/v1/google-search/?${params.toString()}`)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Error en la búsqueda')
      }

      const data = await response.json()
      console.log(data, "??????")
      router.push(`/results/`)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Stepper indicator */}
      <div className="flex justify-between mb-8">
        {['Configuración Básica', 'Keywords', 'Revisión'].map((step, index) => (
          <div
            key={step}
            className={`flex items-center ${
              index === ['basic', 'keywords', 'review'].indexOf(currentStep)
                ? 'text-blue-600'
                : 'text-gray-400'
            }`}
          >
            <div className="flex items-center">
              <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 
                ${index === ['basic', 'keywords', 'review'].indexOf(currentStep)
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

      {/* Error/Success messages */}
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

      {/* Content based on current step */}
      {currentStep === 'basic' && (
        <BasicConfigStep
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          resultsCount={resultsCount}
          setResultsCount={setResultsCount}
          googleDomain={googleDomain}
          setGoogleDomain={setGoogleDomain}
          language={language}
          setLanguage={setLanguage}
        />
      )}
      {currentStep === 'keywords' && (
        <KeywordsConfigStep
          categories={categories}
          setCategories={setCategories}
        />
      )}
      {currentStep === 'review' && (
        <ReviewStep
          searchQuery={searchQuery}
          resultsCount={resultsCount}
          googleDomain={googleDomain}
          language={language}
          categories={categories}
        />
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        {currentStep !== 'basic' && (
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
            type="submit"
            onClick={handleSubmit}
            className="ml-auto bg-blue-600 hover:bg-blue-700"
          >
            Iniciar Búsqueda
          </Button>
        )}
      </div>
    </div>
  )
}

