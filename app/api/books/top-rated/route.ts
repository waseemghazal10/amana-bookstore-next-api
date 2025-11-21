import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// GET - Return top 10 rated books
export async function GET() {
  const booksPath = path.join(process.cwd(), 'app', 'data', 'books.json')
  const booksData = JSON.parse(fs.readFileSync(booksPath, 'utf8'))
  
  const booksWithScore = booksData.books.map((book: any) => ({
    ...book,
    score: book.rating * book.reviewCount
  }))
  
  const topBooks = booksWithScore
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 10)
  
  return NextResponse.json(topBooks)
}
