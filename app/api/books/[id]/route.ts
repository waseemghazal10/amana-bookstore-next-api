import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// GET - Return a single book by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const booksPath = path.join(process.cwd(), 'app', 'data', 'books.json')
  const booksData = JSON.parse(fs.readFileSync(booksPath, 'utf8'))
  
  const book = booksData.books.find((b: any) => b.id === id)
  
  if (!book) {
    return NextResponse.json(
      { error: 'Book not found' },
      { status: 404 }
    )
  }
  
  return NextResponse.json(book)
}
