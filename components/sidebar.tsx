"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, BarChart2, Settings, HelpCircle, TrendingUp, Globe, ChevronDown, Clock } from "lucide-react"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Datos de ejemplo para el historial
const searchHistory = [
  {
    date: "2024-02-19",
    searches: [
      { id: 1, query: "mejores casinos online", time: "14:30", results: 245 },
      { id: 2, query: "casino bonus sin deposito", time: "16:15", results: 178 },
    ],
  },
  {
    date: "2024-02-18",
    searches: [
      { id: 3, query: "tragamonedas gratis", time: "11:20", results: 156 },
      { id: 4, query: "apuestas deportivas", time: "13:45", results: 203 },
    ],
  },
]

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <div className="h-16 flex items-center gap-4 border-b bg-white px-6">
            <SidebarTrigger />
            <div className="font-semibold">Buff Comply</div>
          </div>
          <div className="flex-1 p-6 bg-gray-50 overflow-auto">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white">BC</div>
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold">Buff Comply</span>
                  <span className="text-xs text-muted-foreground">Compliance Monitor</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/"}>
              <Link href="/">
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/scraper"}>
              <Link href="/scraper">
                <Search className="h-4 w-4" />
                <span>Site Scraper</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <Collapsible defaultOpen className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                  <Globe className="h-4 w-4" />
                  <span>Google Search</span>
                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild isActive={pathname === "/google-search"}>
                      <Link href="/google-search">Nueva Búsqueda</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  {searchHistory.map((day) => (
                    <SidebarMenuSubItem key={day.date}>
                      <Collapsible>
                        <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-accent">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(day.date).toLocaleDateString()}</span>
                          <ChevronDown className="ml-auto h-4 w-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          {day.searches.map((search) => (
                            <SidebarMenuSubButton
                              key={search.id}
                              asChild
                              isActive={pathname === `/google-search/results/${search.id}`}
                            >
                              <Link href={`/google-search/results/${search.id}`}>
                                <span className="truncate">{search.query}</span>
                                <span className="ml-auto text-xs text-muted-foreground">
                                  {search.results} resultados
                                </span>
                              </Link>
                            </SidebarMenuSubButton>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/results"}>
              <Link href="/results">
                <BarChart2 className="h-4 w-4" />
                <span>Results</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/rankings"}>
              <Link href="/rankings">
                <TrendingUp className="h-4 w-4" />
                <span>Rankings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/settings"}>
              <Link href="/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/help"}>
              <Link href="/help">
                <HelpCircle className="h-4 w-4" />
                <span>Help</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

