"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, ExternalLink, CheckCircle2, XCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TreeViewProps {
  results: Record<string, Record<string, boolean>>
  baseUrl: string
  searchTerm: string
}

interface TreeNode {
  name: string
  fullPath: string
  children: Record<string, TreeNode>
  keywords?: Record<string, boolean>
}

export function TreeView({ results, baseUrl, searchTerm }: TreeViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([baseUrl]))

  // Construir árbol de URLs
  const buildTree = () => {
    const root: TreeNode = {
      name: baseUrl,
      fullPath: baseUrl,
      children: {},
    }

    Object.entries(results).forEach(([url, keywords]) => {
      const path = url.replace(baseUrl, "").split("/").filter(Boolean)
      let current = root

      path.forEach((segment, index) => {
        const fullPath = `${baseUrl}${path.slice(0, index + 1).join("/")}`
        if (!current.children[segment]) {
          current.children[segment] = {
            name: segment,
            fullPath: fullPath,
            children: {},
          }
        }
        current = current.children[segment]
        if (index === path.length - 1) {
          current.keywords = keywords
        }
      })
    })

    return root
  }

  const toggleNode = (path: string) => {
    const newExpanded = new Set(expandedNodes)
    if (expandedNodes.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedNodes(newExpanded)
  }

  const renderNode = (node: TreeNode, level = 0): JSX.Element => {
    const isExpanded = expandedNodes.has(node.fullPath)
    const hasChildren = Object.keys(node.children).length > 0
    const matches = node.keywords ? Object.values(node.keywords).some((v) => v) : false
    const matchesSearch = node.fullPath.toLowerCase().includes(searchTerm.toLowerCase())

    //If searchTerm is provided and the node doesn't match the searchTerm, don't render it.
    if (searchTerm && !matchesSearch) {
      return <></>
    }

    return (
      <div key={node.fullPath}>
        <div
          className={`
            flex items-center py-2 px-2 rounded-lg
            ${matches ? "bg-green-50" : ""}
            ${level === 0 ? "bg-blue-50" : ""}
            hover:bg-gray-100 cursor-pointer
          `}
          style={{ marginLeft: `${level * 20}px` }}
          onClick={() => toggleNode(node.fullPath)}
        >
          {hasChildren &&
            (isExpanded ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />)}
          <span className="flex-1 font-medium">{level === 0 ? node.name : node.name || "/"}</span>

          {node.keywords && (
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex space-x-1">
                      {Object.entries(node.keywords).map(([keyword, found]) =>
                        found ? (
                          <CheckCircle2 key={keyword} className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle key={keyword} className="h-4 w-4 text-gray-300" />
                        ),
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1">
                      {Object.entries(node.keywords).map(([keyword, found]) => (
                        <div key={keyword} className="flex items-center space-x-2">
                          {found ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-gray-300" />
                          )}
                          <span>{keyword}</span>
                        </div>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <a
                href={node.fullPath}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-blue-500 hover:text-blue-700"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
        {isExpanded && hasChildren && (
          <div>{Object.values(node.children).map((child) => renderNode(child, level + 1))}</div>
        )}
      </div>
    )
  }

  const tree = buildTree()

  return <ScrollArea className="h-[600px] rounded-md border p-4">{renderNode(tree)}</ScrollArea>
}

