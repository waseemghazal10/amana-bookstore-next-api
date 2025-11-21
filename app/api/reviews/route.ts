import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// POST - Add a new review (with authentication)
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
    const newReview = await request.json()
    
    // Validate required fields
    if (!newReview.bookId || !newReview.author || !newReview.rating || !newReview.comment) {
      return NextResponse.json(
        { error: 'Missing required fields: bookId, author, rating, and comment are required' },
        { status: 400 }
      )
    }
    
    const booksPath = path.join(process.cwd(), 'app', 'data', 'books.json')
    const reviewsPath = path.join(process.cwd(), 'app', 'data', 'reviews.json')
    
    const booksData = JSON.parse(fs.readFileSync(booksPath, 'utf8'))
    const reviewsData = JSON.parse(fs.readFileSync(reviewsPath, 'utf8'))
    
    // Check if book exists
    const book = booksData.books.find((b: any) => b.id === newReview.bookId)
    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }
    
    // Validate rating
    if (newReview.rating < 1 || newReview.rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }
    
    // Generate new review ID
    const maxId = Math.max(...reviewsData.reviews.map((r: any) => {
      const id = r.id.split('-')[1]
      return parseInt(id)
    }))
    newReview.id = `review-${maxId + 1}`
    
    // Set defaults
    newReview.timestamp = newReview.timestamp || new Date().toISOString()
    newReview.verified = newReview.verified !== undefined ? newReview.verified : false
    
    // Add review to array
    reviewsData.reviews.push(newReview)
    
    // Update book's review count and rating
    const bookReviews = reviewsData.reviews.filter((r: any) => r.bookId === newReview.bookId)
    book.reviewCount = bookReviews.length
    book.rating = bookReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / bookReviews.length
    book.rating = Math.round(book.rating * 10) / 10 // Round to 1 decimal
    
    // Save both files
    fs.writeFileSync(reviewsPath, JSON.stringify(reviewsData, null, 2), 'utf8')
    fs.writeFileSync(booksPath, JSON.stringify(booksData, null, 2), 'utf8')
    
    return NextResponse.json(
      {
        message: 'Review added successfully',
        review: newReview,
        updatedBookRating: book.rating,
        updatedReviewCount: book.reviewCount
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
