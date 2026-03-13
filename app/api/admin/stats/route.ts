import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import Booking from '@/models/Booking'
import CourseBooking from '@/models/CourseBooking'
import User from '@/models/User'
import GuideOrder from '@/models/GuideOrder'
import { auth } from '@/lib/auth'
import { startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns'

export async function GET() {
  try {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    await dbConnect()

    const now = new Date()
    const monthStart = startOfMonth(now).toISOString().split('T')[0]
    const monthEnd = endOfMonth(now).toISOString().split('T')[0]
    const today = now.toISOString().split('T')[0]

    // Aggregate ingresos (paidAmount) for today and this month
    const [
      totalBookings,
      bookingsThisMonth,
      bookingsToday,
      totalUsers,
      courseBookings,
      guidesSold,
      upcomingBookings,
      recentBookings,
      incomeTodayAgg,
      incomeThisMonthAgg,
    ] = await Promise.all([
      Booking.countDocuments({ status: { $ne: 'cancelada' } }),
      Booking.countDocuments({
        date: { $gte: monthStart, $lte: monthEnd },
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
        .populate('service', 'name')
        .populate('user', 'name')
        .sort({ date: 1, startTime: 1 })
        .limit(5)
        .lean(),
      Booking.find()
        .populate('service', 'name')
        .populate('user', 'name')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      // Sum paidAmount for today
      Booking.aggregate([
        { $match: { date: today, status: { $ne: 'cancelada' } } },
        { $group: { _id: null, total: { $sum: { $ifNull: ['$paidAmount', 0] } } } },
      ]),
      // Sum paidAmount for this month
      Booking.aggregate([
        { $match: { date: { $gte: monthStart, $lte: monthEnd }, status: { $ne: 'cancelada' } } },
        { $group: { _id: null, total: { $sum: { $ifNull: ['$paidAmount', 0] } } } },
      ]),
    ])

    const incomeToday = incomeTodayAgg[0]?.total || 0;
    const incomeThisMonth = incomeThisMonthAgg[0]?.total || 0;

    return NextResponse.json({
      stats: {
        totalBookings,
        bookingsThisMonth,
        bookingsToday,
        totalUsers,
        totalCourseBookings: courseBookings,
        totalGuidesSold: guidesSold,
        incomeToday,
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
