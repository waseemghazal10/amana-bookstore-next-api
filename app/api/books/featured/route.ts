import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// GET - Return featured books
export async function GET() {
  const booksPath = path.join(process.cwd(), 'app', 'data', 'books.json')
  const booksData = JSON.parse(fs.readFileSync(booksPath, 'utf8'))
  
  const featuredBooks = booksData.books.filter((book: any) => book.featured === true)
  
  return NextResponse.json(featuredBooks)
}
