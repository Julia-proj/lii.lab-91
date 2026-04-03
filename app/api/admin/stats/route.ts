import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import { Booking, CourseBooking, User } from '@/models'
import GuideOrder from '@/models/GuideOrder'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    await dbConnect()

    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    const y = now.getFullYear(), m = now.getMonth()
    const monthStart = `${y}-${pad(m + 1)}-01`
    const monthEnd = `${y}-${pad(m + 1)}-${pad(new Date(y, m + 1, 0).getDate())}`
    const today = `${y}-${pad(m + 1)}-${pad(now.getDate())}`

    // Week: Monday → Sunday
    const dow = now.getDay() === 0 ? 6 : now.getDay() - 1 // 0=Mon
    const weekStart = new Date(now); weekStart.setDate(now.getDate() - dow)
    const weekEnd   = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6)
    const weekStartStr = `${weekStart.getFullYear()}-${pad(weekStart.getMonth()+1)}-${pad(weekStart.getDate())}`
    const weekEndStr   = `${weekEnd.getFullYear()}-${pad(weekEnd.getMonth()+1)}-${pad(weekEnd.getDate())}`

    const [
      totalBookings,
      bookingsThisMonth,
      bookingsThisWeek,
      bookingsToday,
      totalUsers,
      courseBookings,
      guidesSold,
      upcomingBookings,
      recentBookings,
      incomeTodayAgg,
      incomeThisWeekAgg,
      incomeThisMonthAgg,
    ] = await Promise.all([
      Booking.countDocuments({ status: { $ne: 'cancelada' } }),
      Booking.countDocuments({
        date: { $gte: monthStart, $lte: monthEnd },
        status: { $ne: 'cancelada' },
      }),
      Booking.countDocuments({
        date: { $gte: weekStartStr, $lte: weekEndStr },
        status: { $ne: 'cancelada' },
      }),
      Booking.countDocuments({
        date: today,
        status: { $ne: 'cancelada' },
      }),
      User.countDocuments(),
      CourseBooking.countDocuments({ status: { $ne: 'cancelada' } }),
      GuideOrder.countDocuments({ status: 'pagado' }),
      Booking.find({
        date: { $gte: today },
        status: { $in: ['confirmada', 'pendiente'] },
      })
        .populate('services', 'name')
        .populate('user', 'name')
        .sort({ date: 1, startTime: 1 })
        .limit(5)
        .lean(),
      Booking.find()
        .populate('services', 'name')
        .populate('user', 'name')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      Booking.aggregate([
        { $match: { date: today, status: { $ne: 'cancelada' } } },
        { $group: { _id: null, total: { $sum: { $ifNull: ['$paidAmount', 0] } } } },
      ]),
      Booking.aggregate([
        { $match: { date: { $gte: weekStartStr, $lte: weekEndStr }, status: { $ne: 'cancelada' } } },
        { $group: { _id: null, total: { $sum: { $ifNull: ['$paidAmount', 0] } } } },
      ]),
      Booking.aggregate([
        { $match: { date: { $gte: monthStart, $lte: monthEnd }, status: { $ne: 'cancelada' } } },
        { $group: { _id: null, total: { $sum: { $ifNull: ['$paidAmount', 0] } } } },
      ]),
    ])

    const incomeToday     = incomeTodayAgg[0]?.total     || 0
    const incomeThisWeek  = incomeThisWeekAgg[0]?.total  || 0
    const incomeThisMonth = incomeThisMonthAgg[0]?.total || 0

    return NextResponse.json({
      stats: {
        totalBookings,
        bookingsThisMonth,
        bookingsThisWeek,
        bookingsToday,
        totalUsers,
        totalCourseBookings: courseBookings,
        totalGuidesSold: guidesSold,
        incomeToday,
        incomeThisWeek,
        incomeThisMonth,
      },
      upcomingBookings,
      recentBookings,
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 })
  }
}
