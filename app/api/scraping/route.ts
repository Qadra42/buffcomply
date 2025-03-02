import { NextResponse } from 'next/server'
import { connectToMongoDB } from '@/lib/mongodb'

// GET /api/scraping
export async function GET() {
  try {
    const db = await connectToMongoDB()
    const results = await db
      .collection('scrape_results')
      .find({})
      .sort({ created_at: -1 })
      .limit(100)
      .toArray()

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error fetching scraping results:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scraping results' },
      { status: 500 }
    )
  }
}

// POST /api/scraping
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { urls, keywords } = body

    // Llamar al microservicio de scraping
    const queryParams = new URLSearchParams({
      urls: urls.join(','),
      keywords: keywords.join(','),
      max_depth: '1'
    }).toString();

    const scrapingUrl = `http://api.buffcomply.com/api/v1/scrape/?${queryParams}`;

    const response = await fetch(scrapingUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error initiating scraping:', error)
    return NextResponse.json(
      { error: 'Failed to initiate scraping' },
      { status: 500 }
    )
  }
}