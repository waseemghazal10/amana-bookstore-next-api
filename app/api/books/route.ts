import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Load data
const booksPath = path.join(process.cwd(), 'app', 'data', 'books.json')
const booksData = JSON.parse(fs.readFileSync(booksPath, 'utf8'))

// GET - Return all books
export async function GET() {
  return NextResponse.json(booksData.books)
}

// POST - Add a new book (with authentication)
export async function POST(request: NextRequest) {
  // Check authentication
  const authToken = request.headers.get('authorization')
  const authenticatedUsers = ['admin123', 'editor456', 'manager789']
  
  if (!authToken || !authenticatedUsers.includes(authToken)) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid or missing authentication token' },
      { status: 401 }
    )
  }
  
  try {
    const newBook = await request.json()
    
    // Validate required fields
    if (!newBook.title || !newBook.author || !newBook.price) {
      return NextResponse.json(
        { error: 'Missing required fields: title, author, and price are required' },
        { status: 400 }
      )
    }
    
    // Generate new ID
    const maxId = Math.max(...booksData.books.map((b: any) => parseInt(b.id)))
    newBook.id = String(maxId + 1)
    
    // Set defaults for optional fields
    newBook.rating = newBook.rating || 0
    newBook.reviewCount = newBook.reviewCount || 0
    newBook.inStock = newBook.inStock !== undefined ? newBook.inStock : true
    newBook.featured = newBook.featured !== undefined ? newBook.featured : false
    newBook.datePublished = newBook.datePublished || new Date().toISOString().split('T')[0]
    
    // Add book to array
    booksData.books.push(newBook)
    
    // Save to file
    fs.writeFileSync(booksPath, JSON.stringify(booksData, null, 2), 'utf8')
    
    return NextResponse.json(
      { message: 'Book added successfully', book: newBook },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
