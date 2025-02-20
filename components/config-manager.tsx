"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Config = {
  name: string
  urls: string[]
  categories: { name: string; keywords: string[] }[]
}

export function ConfigManager() {
  const [configs, setConfigs] = useState<Config[]>([])
  const [selectedConfig, setSelectedConfig] = useState<Config | null>(null)
  const [newConfigName, setNewConfigName] = useState("")

  useEffect(() => {
    // Cargar configuraciones guardadas
    const savedConfigs = localStorage.getItem("scraperConfigs")
    if (savedConfigs) {
      setConfigs(JSON.parse(savedConfigs))
    }
  }, [])

  const saveConfig = () => {
    if (!newConfigName) return

    const newConfig: Config = {
      name: newConfigName,
      urls: selectedConfig?.urls || [],
      categories: selectedConfig?.categories || [],
    }

    const updatedConfigs = [...configs, newConfig]
    setConfigs(updatedConfigs)
    localStorage.setItem("scraperConfigs", JSON.stringify(updatedConfigs))
    setNewConfigName("")
  }

  const loadConfig = (config: Config) => {
    setSelectedConfig(config)
    // Aquí podrías actualizar el estado global de la aplicación con la configuración cargada
  }

  const deleteConfig = (configToDelete: Config) => {
    const updatedConfigs = configs.filter((config) => config.name !== configToDelete.name)
    setConfigs(updatedConfigs)
    localStorage.setItem("scraperConfigs", JSON.stringify(updatedConfigs))
    if (selectedConfig?.name === configToDelete.name) {
      setSelectedConfig(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="configSelect">Cargar Configuración</Label>
        <Select onValueChange={(value) => loadConfig(configs.find((c) => c.name === value) || configs[0])}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar configuración" />
          </SelectTrigger>
          <SelectContent>
            {configs.map((config) => (
              <SelectItem key={config.name} value={config.name}>
                {config.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedConfig && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Configuración Actual: {selectedConfig.name}</h3>
          <Textarea
            value={selectedConfig.urls.join("\n")}
            onChange={(e) => setSelectedConfig({ ...selectedConfig, urls: e.target.value.split("\n") })}
            placeholder="URLs (una por línea)"
            rows={5}
          />
          {selectedConfig.categories.map((category, index) => (
            <div key={index} className="mt-4">
              <Input
                value={category.name}
                onChange={(e) => {
                  const newCategories = [...selectedConfig.categories]
                  newCategories[index].name = e.target.value
                  setSelectedConfig({ ...selectedConfig, categories: newCategories })
                }}
                placeholder="Nombre de la categoría"
              />
              <Textarea
                value={category.keywords.join(", ")}
                onChange={(e) => {
                  const newCategories = [...selectedConfig.categories]
                  newCategories[index].keywords = e.target.value.split(",").map((k) => k.trim())
                  setSelectedConfig({ ...selectedConfig, categories: newCategories })
                }}
                placeholder="Palabras clave (separadas por comas)"
                className="mt-2"
              />
            </div>
          ))}
          <Button onClick={() => deleteConfig(selectedConfig)} className="mt-4">
            Eliminar Configuración
          </Button>
        </div>
      )}

      <div>
        <Label htmlFor="newConfigName">Guardar Nueva Configuración</Label>
        <Input
          id="newConfigName"
          value={newConfigName}
          onChange={(e) => setNewConfigName(e.target.value)}
          placeholder="Nombre de la nueva configuración"
        />
        <Button onClick={saveConfig} className="mt-2">
          Guardar Configuración
        </Button>
      </div>
    </div>
  )
}

