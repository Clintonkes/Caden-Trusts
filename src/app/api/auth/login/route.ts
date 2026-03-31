import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Simulate authentication
    if (email && password.length >= 6) {
      return NextResponse.json({
        success: true,
        message: 'Login successful',
        user: {
          id: '1',
          name: 'John Doe',
          email: email,
          role: email.includes('admin') ? 'admin' : 'customer',
        },
      })
    }

    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    )
  } catch {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
