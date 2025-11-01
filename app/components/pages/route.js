import { NextResponse } from 'next/server'
import { newsData } from '@/app/lib/initData'

export async function GET() {
  // In a real app, you would fetch this data from a database
  return NextResponse.json(newsData)
}