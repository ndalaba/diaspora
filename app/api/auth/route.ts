import { NextRequest } from 'next/server'

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query') // e.g. `/api/search?query=hello`

  return new Response(JSON.stringify({ result: `You searched for: ${query}` }), {
    headers: { 'Content-Type': 'application/json' }
  })
}

export async function POST(request: NextRequest) {
  // Parse the request body
  const body = await request.json()
  const { name } = body

  // e.g. Insert new user into your DB
  const newUser = { id: Date.now(), name }

  return new Response(JSON.stringify(newUser), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  })
}
