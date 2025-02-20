"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScraperForm } from "@/components/scraper-form"
import { ResultsView } from "@/components/results-view"
import { ConfigManager } from "@/components/config-manager"

export function ScraperDashboard() {
  const [activeTab, setActiveTab] = useState("scraper")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="scraper">Scraper</TabsTrigger>
        <TabsTrigger value="results">Resultados</TabsTrigger>
        <TabsTrigger value="config">Configuraciones</TabsTrigger>
      </TabsList>
      <TabsContent value="scraper">
        <ScraperForm />
      </TabsContent>
      <TabsContent value="results">
        <ResultsView />
      </TabsContent>
      <TabsContent value="config">
        <ConfigManager />
      </TabsContent>
    </Tabs>
  )
}

