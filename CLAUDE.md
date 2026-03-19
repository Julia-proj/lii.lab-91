## Стек
- Next.js 16 (App Router) — dev: `npm run dev` (порт 3001)
- React 19, TypeScript 5
- MongoDB + Mongoose 9
- NextAuth v5 beta (beta.30) — Google OAuth + credentials
- Tailwind CSS v4
- shadcn/ui (Radix UI)
- Stripe — оплата Guía Metodológica
- Nodemailer — email уведомления
- Zod + react-hook-form — валидация
- date-fns 4, react-day-picker 9
- Sonner — toast
- Recharts — графики admin

## Команды
```bash
npm run dev          # Запуск dev (порт 3001)
npm run build        # Сборка
npm run lint         # Линтер
```

## Деплой
- Frontend: Vercel
- Backend: Render

## Структура

### App роуты
```
app/
├── (admin)/admin/
│   ├── page.tsx              # Dashboard статистика
│   ├── bookings/page.tsx     # Управление бронями
│   ├── schedule/page.tsx     # Расписание / блокировка дат
│   └── services/page.tsx     # Услуги
├── (app)/
│   ├── booking/page.tsx      # Booking wizard
│   ├── booking/course/page.tsx
│   ├── booking/confirmation/[id]/page.tsx
│   ├── dashboard/page.tsx    # Личный кабинет
│   ├── dashboard/profile/page.tsx
│   └── guide/success|cancel  # После Stripe
├── (auth)/login, register
└── api/
    ├── bookings/[id]
    ├── course-bookings/[id]
    ├── services/[id]
    ├── available-slots/
    ├── blocked-dates/[id]
    ├── blocked-hours/[id]
    ├── course-availability/
    ├── stripe/checkout|webhook
    ├── admin/stats/
    ├── auth/register|profile
    └── cron/reminders/
```

### MongoDB модели
```
models/
├── index.ts          # Реэкспорт — ВСЕГДА импортируй из models/index.ts
├── Booking.ts        # services: [{ service, duration, price }], paidAmount
├── CourseBooking.ts
├── GuideOrder.ts     # Stripe заказы
├── Service.ts
├── User.ts
├── BlockedDate.ts
├── BlockedHour.ts
```

### Ключевые lib файлы
```
lib/
├── auth.ts, auth.config.ts   # NextAuth v5 — API отличается от v4!
├── db.ts                      # connectDB() — вызывай в каждом API route
├── email.ts                   # sendEmail()
├── email-templates/           # booking-confirmation, cancellation, reminder
├── stripe.ts
├── whatsapp.ts
├── notifications.ts           # sendBookingNotifications() — email + whatsapp
├── slots.ts                   # generateSlots(), isSlotAvailable()
├── schedule.ts
├── course-availability.ts
├── validators.ts              # Zod-схемы
└── utils.ts                   # cn()
```

## Паттерны кода

### API route (пример)
```typescript
import { dbConnect } from "@/lib/db";
import { Booking } from "@/models";        // всегда из models/index.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await dbConnect();
  const bookings = await Booking.find({}).lean();
  return NextResponse.json(bookings);
}
```

### Импорт моделей — ВСЕГДА через index.ts
```typescript
// ✅ Правильно
import { Booking, Service, User } from "@/models";

// ❌ Неправильно
import Booking from "@/models/Booking";
```

### Компоненты — shadcn/ui
```typescript
// ✅ Используй существующие из components/ui/
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// ❌ Не создавай свои базовые компоненты
```

### Toast — Sonner
```typescript
// ✅
import { toast } from "sonner";
toast.success("Reserva confirmada");

// ❌ Не используй react-hot-toast
```

## Booking — модель данных
```typescript
// Booking.services — МАССИВ, не один сервис
{
  services: [
    { service: ObjectId, serviceName: string, duration: number, price: number }
  ],
  totalDuration: number,
  totalPrice: number,
  paidAmount: number,      // админ может редактировать
  status: "pending" | "confirmed" | "cancelled"
}
```

## Дизайн
- Текущий стиль: минималистичный, светлый, чёрный текст, фиолетовые акценты
- CTA: фиолетовый для бронирования, золотой для покупок
- Шрифты: следуй текущим из tailwind.config
- Анимации: framer-motion для переходов, не CSS transitions
- Мобильная версия — ПРИОРИТЕТ (клиентки бронируют с телефона)

## НЕ ДЕЛАЙ
- Не меняй auth конфигурацию без явного запроса
- Не путай NextAuth v5 API с v4 (нет getServerSession, есть auth())
- Не создавай новые UI компоненты если есть shadcn/ui аналог
- Не используй react-hot-toast (только sonner)
- Не импортируй модели напрямую из файлов (только через models/index.ts)
- Не меняй порт dev сервера (3001)
- Не добавляй зависимости без явного запроса
- Не трогай файлы вне задачи
- Не удаляй существующие данные/тесты