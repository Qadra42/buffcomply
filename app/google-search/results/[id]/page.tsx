import { GoogleSearchResults } from "@/components/google-search-results"

export default function GoogleSearchResultsPage({ params }: { params: { id: string } }) {
  return (
    <main className="p-6">
      <GoogleSearchResults searchId={params.id} />
    </main>
  )
}

