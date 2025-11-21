import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// GET - Return books published between a date range
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const start = searchParams.get('start')
  const end = searchParams.get('end')
  
  if (!start || !end) {
    return NextResponse.json(
      { error: 'Please provide both start and end dates' },
      { status: 400 }
    )
  }
  
  const booksPath = path.join(process.cwd(), 'app', 'data', 'books.json')
  const booksData = JSON.parse(fs.readFileSync(booksPath, 'utf8'))
  
  const startDate = new Date(start)
  const endDate = new Date(end)
  
  const filteredBooks = booksData.books.filter((book: any) => {
    const publishDate = new Date(book.datePublished)
    return publishDate >= startDate && publishDate <= endDate
  })
  
  return NextResponse.json(filteredBooks)
}
