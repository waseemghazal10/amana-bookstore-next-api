import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// GET - Return all reviews for a specific book
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const booksPath = path.join(process.cwd(), 'app', 'data', 'books.json')
  const reviewsPath = path.join(process.cwd(), 'app', 'data', 'reviews.json')
  
  const booksData = JSON.parse(fs.readFileSync(booksPath, 'utf8'))
  const reviewsData = JSON.parse(fs.readFileSync(reviewsPath, 'utf8'))
  
  // Check if book exists
  const book = booksData.books.find((b: any) => b.id === id)
  if (!book) {
    return NextResponse.json(
      { error: 'Book not found' },
      { status: 404 }
    )
  }
  
  // Get all reviews for this book
  const bookReviews = reviewsData.reviews.filter((review: any) => review.bookId === id)
  
  return NextResponse.json({
    bookId: id,
    bookTitle: book.title,
    totalReviews: bookReviews.length,
    reviews: bookReviews
  })
}
