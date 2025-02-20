import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type ResultEntry = [string, Record<string, boolean>]

export function ScrapingResultsTable({ results, baseUrl }: { results: ResultEntry[]; baseUrl: string }) {
  const keywords = Object.keys(results[0][1])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/3">URL</TableHead>
          {keywords.map((keyword) => (
            <TableHead key={keyword} className="text-center">
              {keyword}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.map(([url, keywordResults]) => (
          <TableRow key={url}>
            <TableCell className="font-medium">
              {url === baseUrl ? (
                <Badge variant="outline" className="mr-2">
                  Base
                </Badge>
              ) : null}
              {url.replace(baseUrl, "")}
            </TableCell>
            {keywords.map((keyword) => (
              <TableCell key={keyword} className="text-center">
                {keywordResults[keyword] ? (
                  <Badge variant="success">Encontrado</Badge>
                ) : (
                  <Badge variant="secondary">No encontrado</Badge>
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

