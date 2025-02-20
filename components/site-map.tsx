"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

interface SiteMapProps {
  results: Record<string, Record<string, boolean>>
  baseUrl: string
  searchTerm: string
}

interface Node {
  id: string
  name: string
  keywords?: Record<string, boolean>
}

interface Link {
  source: string
  target: string
}

export function SiteMap({ results, baseUrl, searchTerm }: SiteMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    // Limpiar SVG existente
    d3.select(svgRef.current).selectAll("*").remove()

    // Preparar datos
    const nodes: Node[] = []
    const links: Link[] = []
    
    Object.entries(results).forEach(([url, keywords]) => {
      const path = url.split('/').filter(Boolean)
      let parentUrl = ''
      
      path.forEach((segment, index) => {
        const currentUrl = index === 0 ? 
          `${path[0]}` : 
          `${parentUrl}/${segment}`
        
        if (!nodes.find(n => n.id === currentUrl)) {
          nodes.push({
            id: currentUrl,
            name: segment,
            keywords: index === path.length - 1 ? keywords : undefined
          })
          
          if (parentUrl) {
            links.push({
              source: parentUrl,
              target: currentUrl
            })
          }
        }
        
        parentUrl = currentUrl
      })
    })

    // Configurar visualización
    const width = 800
    const height = 600
    
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)

    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id))
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2))

    // Dibujar enlaces
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 1)

    // Dibujar nodos
    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', (d: Node) => d.keywords ? 8 : 5)
      .attr('fill', (d: Node) => {
        if (!d.keywords) return '#999'
        return Object.values(d.keywords).some(v => v) ? '#22c55e' : '#ef4444'
      })
      .call(drag(simulation) as any)

    // Agregar títulos
    node.append('title')
      .text((d: Node) => {
        if (d.keywords) {
          const matches = Object.entries(d.keywords)
            .filter(([_, found]) => found)
            .map(([keyword]) => keyword)
            .join(', ')
          return `${d.name}\nCoincidencias: ${matches || 'Ninguna'}`
        }
        return d.name
      })

    // Actualizar posiciones
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y)
    })

    // Función para arrastrar nodos
    function drag(simulation: any) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        event.subject.fx = event.subject.x
        event.subject.fy = event.subject.y
      }

      function dragged(event: any) {
        event.subject.fx = event.x
        event.subject.fy = event.y
      }

      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0)
        event.subject.fx = null
        event.subject.fy = null
      }

      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
    }
  }, [results]),
\
  return (
    <div className="border rounded-lg p-4 bg-white">
      <svg ref={svgRef} />
    </div>
  )
}

