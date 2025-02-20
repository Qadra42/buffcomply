"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

type Result = {
  url: string
  keywords: Record<string, boolean>
}

export function ResultsTable() {
  const [results, setResults] = useState<Result[]>([])

  // Función para descargar el informe (simulada)
  const handleDownload = () => {
    console.log("Descargando informe...")
    // Aquí iría la lógica para generar y descargar el informe
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Resultados del Scraping</h2>
      {results.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                {Object.keys(results[0].keywords).map((keyword) => (
                  <TableHead key={keyword}>{keyword}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result, index) => (
                <TableRow key={index}>
                  <TableCell>{result.url}</TableCell>
                  {Object.entries(result.keywords).map(([keyword, value]) => (
                    <TableCell key={keyword}>{value ? "Sí" : "No"}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={handleDownload} className="mt-4">
            Descargar Informe
          </Button>
        </>
      ) : (
        <p>No hay resultados disponibles.</p>
      )}
    </div>
  )
}

