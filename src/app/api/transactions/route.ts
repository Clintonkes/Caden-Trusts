import { NextResponse } from 'next/server'

// Mock transactions data
const transactions = [
  { id: '1', type: 'deposit', amount: 5000, description: 'Salary Deposit', date: '2024-03-20', status: 'completed' },
  { id: '2', type: 'transfer', amount: -1500, description: 'Transfer to John Doe', date: '2024-03-18', status: 'completed' },
  { id: '3', type: 'bill', amount: -500, description: 'Electricity Bill', date: '2024-03-15', status: 'completed' },
  { id: '4', type: 'withdrawal', amount: -1000, description: 'ATM Withdrawal', date: '2024-03-10', status: 'completed' },
  { id: '5', type: 'deposit', amount: 2500, description: 'Freelance Payment', date: '2024-03-05', status: 'completed' },
]

export async function GET() {
  return NextResponse.json({
    success: true,
    transactions,
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, amount, description } = body

    const newTransaction = {
      id: Date.now().toString(),
      type,
      amount: Number(amount),
      description,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
    }

    return NextResponse.json({
      success: true,
      transaction: newTransaction,
    })
  } catch {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
