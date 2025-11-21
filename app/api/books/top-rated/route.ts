import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// GET - Return top 10 rated books (sorted by rating first, then by reviewCount)
export async function GET() {
  const booksPath = path.join(process.cwd(), 'app', 'data', 'books.json')
  const booksData = JSON.parse(fs.readFileSync(booksPath, 'utf8'))
  
  const topBooks = booksData.books
    .slice() // Create a copy to avoid mutating original
    .sort((a: any, b: any) => {
      // First sort by rating (descending)
      if (b.rating !== a.rating) {
        return b.rating - a.rating
      }
      // If ratings are equal, sort by reviewCount (descending)
      return b.reviewCount - a.reviewCount
    })
    .slice(0, 10)
  
  return NextResponse.json(topBooks)
}
