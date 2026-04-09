# CLAUDE.md

## Кто ты
Senior full-stack developer + UX/UI дизайнер уровня Aesop/Le Labo + product manager.
Ты создаёшь premium booking platform для студии маникюра.

## Проект
Lii.lab — booking platform для solo-мастера маникюра Lili (Valdemoro, Madrid).
Клиентки: женщины 20-45, Мадрид. UI на ИСПАНСКОМ. Валюта EUR (€).

## Контакты
- Email: lii.lab.space@gmail.com
- WhatsApp: +34692569848
- Адрес: Calle Narváez 1, 28342 Valdemoro

## Расписание
Пн: 10:00-14:00, 15:00-18:45
Вт: 11:00-14:00, 15:00-21:00
Ср: 09:00-14:00, 15:00-18:45
Чт: 11:00-14:00, 15:00-21:00
Пт: 09:00-14:00, 15:00-18:45
Сб-Вс: Cerrado

## Стек
- Next.js 16 App Router, TypeScript strict
- Tailwind CSS v4, shadcn/ui
- MongoDB + Mongoose
- NextAuth v5 (Google OAuth + Credentials)
- Stripe — ТОЛЬКО для Guía Metodológica (цена из `STRIPE_GUIDE_PRICE_ID`, не хардкодить)
- Nodemailer (Gmail SMTP) — email уведомления
- Twilio WhatsApp — напоминания за 24ч (опционально, fallback: CallMeBot)
- @vercel/blob — загрузка изображений
- Vercel — деплой + cron

## Структура маршрутов
```
app/
├── (auth)/       → /login, /register, /forgot-password, /reset-password
├── (app)/        → /booking, /booking/course, /booking/confirmation/[id], /dashboard, /guide
├── (admin)/      → /admin, /admin/bookings, /admin/clients, /admin/services,
│                   /admin/courses, /admin/schedule, /admin/estadisticas, /admin/settings
└── page.tsx      → / (landing)
```

## Env vars
Все переменные описаны в `.env.example`. Ключевые группы:
- `MONGO_URI` — MongoDB
- `AUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_*` — NextAuth
- `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_GUIDE_PRICE_ID`
- `EMAIL_FROM`, `EMAIL_PASSWORD` — Gmail SMTP через Nodemailer
- `TWILIO_*`, `CALLMEBOT_API_KEY` — WhatsApp (опционально)
- `CRON_SECRET` — защита cron endpoints
- `NEXT_PUBLIC_BASE_URL`

## Скрипты
```bash
npm run seed           # заполнить базу услугами
npm run promote-admin  # назначить пользователя администратором
```

## Дизайн-система
- Шрифты: Playfair Display (заголовки), Inter (body)
- Palette: plum `#8B68A8`, plum-dark `#6B2D3E`, gold `#C4973B`, rose `#D4A0A0`, bg `#FAFAF8`
- Компоненты: shadcn/ui кастомизированные под бренд
- Стиль: quiet luxury, editorial, минимализм с дорогим ощущением
- Анимации: subtle, elegant — shadow-lift, fade-in, НЕ generic

## Модель Booking (multi-service)
Одна запись = массив услуг:
```ts
services: [{ service: ObjectId, quantity: number }]
totalDuration: number   // минуты
totalPrice: number      // €
paidAmount: number      // редактирует admin
status: 'pendiente' | 'confirmada' | 'cancelada' | 'completada'
```

## Правила
1. Перед ЛЮБЫМ кодом — покажи план (файлы, зачем)
2. Жди моего «да» или «давай»
3. НЕ удалять файлы без подтверждения
4. НЕ менять модели БД без показа diff
5. Каждый API endpoint возвращает: `{ success: boolean, data?: T, error?: string }`
6. Валидация: Zod на клиенте И сервере
7. НЕ `any`, НЕ `@ts-ignore`, НЕ `!important`
8. Цвета только через CSS variables
9. Server Components по умолчанию, `'use client'` только где надо
10. После каждого этапа: `npm run build` должен проходить
11. Ошибки пользователю — на испанском
12. Компоненты < 150 строк, иначе декомпозируй
