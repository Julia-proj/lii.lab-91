import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { User, Booking } from '@/models'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 })
    }

    await dbConnect()

    const users = await User.find({ role: 'user' })
      .select('name email phone createdAt')
      .sort({ createdAt: -1 })
      .lean()

    // Get booking counts per user
    const userIds = users.map((u) => u._id)
    const bookingAgg = await Booking.aggregate([
      { $match: { user: { $in: userIds }, status: { $ne: 'cancelada' } } },
      {
        $group: {
          _id: '$user',
          count: { $sum: 1 },
          lastDate: { $max: '$date' },
          totalPaid: { $sum: { $ifNull: ['$paidAmount', 0] } },
        },
      },
    ])

    const bookingMap = new Map(bookingAgg.map((b) => [String(b._id), b]))

    const clients = users.map((u) => {
      const bData = bookingMap.get(String(u._id))
      return {
        ...u,
        bookingCount: bData?.count ?? 0,
        lastVisit: bData?.lastDate ?? null,
        totalSpent: bData?.totalPaid ?? 0,
      }
    })

    return NextResponse.json({ success: true, data: clients })
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json({ success: false, error: 'Error al obtener clientes' }, { status: 500 })
  }
}
