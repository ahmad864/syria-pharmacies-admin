# لوحة تحكم صيدليات سوريا — Admin Dashboard

واجهة إدارية (Frontend فقط) لمنصة صيدليات سوريا، مبنية بـ Next.js 14 (App Router) + TypeScript + Tailwind CSS.

> **مهم**: هذا المشروع **غير مربوط** بأي Backend حاليًا. كل البيانات المعروضة هي بيانات
> تجريبية (`src/mock/`) وكل عمليات الحفظ/الحذف/الموافقة هي عمليات وهمية (`src/services/`)
> تُحاكي زمن استجابة شبكة حقيقي فقط لإظهار حالات التحميل. لا يوجد أي اتصال فعلي بـ Laravel.

## التشغيل محليًا

```bash
npm install
npm run dev
```

افتح `http://localhost:3000` — سيُعاد توجيهك تلقائيًا إلى `/dashboard`.

```bash
npm run build   # بناء نسخة الإنتاج
npm run start   # تشغيل نسخة الإنتاج المبنية
npm run lint    # فحص الكود
npm run typecheck  # فحص TypeScript بدون بناء
```

> **ملاحظة بيئة العمل**: هذا المشروع كُتب في بيئة معزولة بدون اتصال إنترنت، لذلك لم يتم
> تشغيل `npm install` ولا التحقق من نجاح تثبيت الحزم أو تطابق إصداراتها فعليًا. راجع
> `package.json` وشغّل `npm install` على جهازك للتأكد.

## هيكل المشروع

```
src/
├── app/                    # صفحات Next.js App Router
│   ├── login/              # /login (خارج تخطيط لوحة التحكم)
│   ├── (dashboard)/        # مجموعة مسارات مشتركة بتخطيط Sidebar + Header
│   │   ├── dashboard/
│   │   ├── pharmacies/
│   │   │   ├── [id]/       # تفاصيل صيدلية
│   │   │   └── applications/
│   │   ├── pharmacists/
│   │   ├── users/
│   │   ├── duty-pharmacies/
│   │   ├── map/
│   │   ├── advertisements/
│   │   ├── notifications/
│   │   ├── reports/
│   │   ├── activity-log/
│   │   └── settings/
│   │       └── roles/
│   └── layout.tsx          # RTL + الخط + ThemeProvider + Toaster
├── components/
│   ├── ui/                 # Button, Input, Select, Textarea, Switch, Badge,
│   │                       # Card, Dialog, ConfirmDialog, Dropdown, Tabs,
│   │                       # Tooltip, Toaster
│   ├── layout/             # Sidebar, MobileSidebar, Header, PageHeader
│   ├── tables/              # DataTable (عام لكل الجداول), TablePagination, TableFilters
│   ├── charts/              # StatisticsCard, LineChart, BarChart, PieChart
│   ├── forms/               # SearchInput, DateRangePicker
│   ├── states/               # Skeleton, EmptyState, ErrorState
│   └── providers/            # ThemeProvider (next-themes)
├── features/                 # مكوّنات خاصة بدومين معيّن (badges الصيدلية، خريطة Leaflet)
├── hooks/                     # useMockQuery, useDebouncedValue, useDisclosure
├── lib/utils.ts                # cn()، تنسيق الأرقام/التواريخ/الوقت، mockDelay
├── types/                       # أنواع TypeScript لكل كيان (بدون أي any)
├── services/                     # طبقة الخدمات — راجع القسم أدناه
├── constants/                     # قوائم التنقل وتسميات الحالات
└── mock/                          # كل البيانات التجريبية، منفصلة تمامًا عن الـ UI
```

## طبقة البيانات الوهمية (Mock Data)

كل بيانات mock موجودة حصرًا في `src/mock/*.ts` — **لا توجد بيانات وهمية مكتوبة داخل أي
component**. كل ملف يُصدّر مصفوفة أو دالة توليد بيانات (مبنية بمولّد عشوائي ثابت البذرة
في `src/mock/seed.ts` لتفادي اختلاف البيانات بين تحميلات الصفحة). حذف مجلد `src/mock/`
بالكامل لاحقًا هو خطوة معزولة لا تكسر بنية المشروع، بشرط استبدال التنفيذ داخل `src/services/`
بنداءات API حقيقية.

## طبقة الخدمات (Services) — هنا سيتم الربط بـ Laravel لاحقًا

كل ملف في `src/services/*.service.ts` يحتوي دوال بتوقيعات (signatures) نهائية جاهزة —
فقط *تنفيذها* الداخلي وهمي حاليًا (`mockDelay()` + قراءة/تعديل مصفوفة mock). كل دالة
موسومة بتعليق `TODO(api): METHOD /path` يوضح ما يُفترض أن تستدعيه لاحقًا — **هذه المسارات
افتراضية وتوضيحية فقط، وليست مسارات API حقيقية أو مفترضة**؛ عدّلها لتطابق مسارات
Laravel API الفعلية عند الربط.

مثال من `pharmacy.service.ts`:

```ts
/** TODO(api): GET /api/v1/admin/pharmacies */
export async function listPharmacies(query: PharmacyListQuery = {}): Promise<PaginatedResult<Pharmacy>> {
  await mockDelay();
  return filterAndPaginate(MOCK_PHARMACIES, query);
}
```

عند الربط الفعلي، الاستبدال المطلوب هو فقط داخل الجسم:

```ts
export async function listPharmacies(query: PharmacyListQuery = {}): Promise<PaginatedResult<Pharmacy>> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/pharmacies?...`);
  return res.json();
}
```

لا شيء في أي صفحة أو component يحتاج تعديلًا — الصفحات تستدعي دالة الخدمة فقط عبر
`useMockQuery(() => listPharmacies(query), [...])`.

## أنواع TypeScript

كل الكيانات معرّفة في `src/types/*.ts` (`pharmacy.ts`, `pharmacist.ts`, `user.ts`, `duty.ts`,
`advertisement.ts`, `notification.ts`, `activity.ts`, `roles.ts`, `dashboard.ts`, `api.ts`).
لا يوجد استخدام لـ `any` في أي مكان في المشروع. الحقول تتبع تسمية `camelCase` في الواجهة
حتى لو كانت الـ API الحقيقية تستخدم `snake_case` (مثل Laravel) — التحويل بين الاثنين
يجب أن يحدث داخل طبقة `services/`، وليس بتغيير الأنواع نفسها.

## RTL والمظهر (Dark Mode)

- `<html lang="ar" dir="rtl">` مضبوطة في `src/app/layout.tsx`.
- كل الـ components تستخدم خصائص CSS منطقية (`start`/`end`، `ps-*`/`pe-*`) بدل
  `left`/`right`، لذا الانتقال لاحقًا لدعم الإنجليزية (LTR) لن يتطلب إعادة كتابة الأنماط.
- الوضع الليلي عبر `next-themes` (`class` strategy) — راجع `globals.css` لمتغيرات
  الألوان (`--surface`, `--ink`, ...) في الوضعين. يعمل على كل الصفحات فورًا دون إعداد إضافي.

## الخريطة

تستخدم `leaflet` + `react-leaflet` مع بلاطات OpenStreetMap المجانية (لا يوجد مفتاح API
مطلوب). المكوّن في `src/features/map/PharmacyMap.tsx` مُحمَّل ديناميكيًا بـ
`next/dynamic({ ssr: false })` لأن Leaflet يعتمد على `window` ولا يمكن أن يكون جزءًا من
الـ server bundle.

## الحزم المستخدمة

| الحزمة | الغرض |
|---|---|
| `next`, `react`, `react-dom` | الأساس |
| `next-themes` | الوضع الليلي |
| `lucide-react` | الأيقونات |
| `clsx` + `tailwind-merge` | دمج classes آمن (`cn()`) |
| `recharts` | كل الرسوم البيانية |
| `sonner` | Toast notifications |
| `leaflet` + `react-leaflet` | صفحة الخريطة |
| `date-fns` | (متاحة لأي تنسيق تواريخ إضافي يحتاجه الربط لاحقًا) |

## متغيرات البيئة

انسخ `.env.example` إلى `.env.local` عند الربط الفعلي بالـ API:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

غير مستخدم حاليًا في أي مكان من الكود — موجود فقط كتجهيز مسبق.

## كيف سيتم الربط بالـ API لاحقًا (خطوات مقترحة)

1. إنشاء `src/lib/api-client.ts` يشبه طبقة `ApiClient` المستخدمة في تطبيق Flutter
   (نفس الفكرة: base URL من `NEXT_PUBLIC_API_URL`، إرفاق `Authorization` تلقائيًا، تحويل
   استجابة Laravel الموحّدة `{success, message, data}` إلى نتيجة أو استثناء).
2. استبدال جسم كل دالة في `src/services/*.ts` بنداء حقيقي عبر ذلك الـ client، مع الإبقاء
   على نفس اسم الدالة وتوقيعها بالضبط.
3. حذف `src/mock/` بالكامل بعد التأكد أن لا شيء آخر يستورد منه (لا شيء يفعل ذلك حاليًا
   خارج `src/services/`).
4. ربط `/login` بمصادقة Laravel الحقيقية (Sanctum أو غيره) وتفعيل حماية المسارات
   (middleware يتحقق من الجلسة قبل عرض أي صفحة داخل `(dashboard)`).
5. تفعيل رفع الصور الحقيقي في صفحة الإعلانات (حاليًا رابط نصي فقط).

## الصفحات المُنفّذة

جميع الصفحات الخمسة عشر المطلوبة في البروميت الأصلي: تسجيل الدخول، لوحة التحكم،
الصيدليات (قائمة + تفاصيل)، طلبات الصيدليات، الصيادلة، المستخدمون، صيدليات المناوبة،
الخريطة، الإعلانات، الإشعارات، التقارير، سجل النشاط، الأدوار والصلاحيات، الإعدادات.

## ما لم يُنفَّذ / محدوديات معروفة (بصراحة كاملة)

- **لم يتم تشغيل `npm install` أو `npm run build` في بيئة كتابة هذا المشروع** — لا يوجد
  اتصال إنترنت في تلك البيئة (تحقق مباشر: طلبات إلى `registry.npmjs.org` مرفوضة).
  الكود روجع يدويًا سطرًا بسطر (كل الاستيرادات، كل استخدامات hooks، فحص "use client"،
  فحص التوافق مع `noUncheckedIndexedAccess` في `tsconfig.json`)، لكن هذا **ليس بديلاً**
  عن تشغيل فعلي. شغّل `npm install && npm run typecheck && npm run build` للتأكد.
  إذا ظهرت أخطاء بعد التثبيت، الأرجح أنها تعارضات إصدارات حزم بسيطة (راجع
  `package.json`)، وليست مشاكل بنيوية.
- تسجيل الدخول شكلي بالكامل — أي رقم هاتف وكلمة مرور غير فارغين سينجحان.
- لا يوجد أي حماية فعلية للمسارات (middleware) — الوصول لأي صفحة داخل `(dashboard)`
  ممكن دون تسجيل دخول.
- رفع صور الإعلانات هو حقل رابط نصي فقط (لا يوجد رفع ملفات فعلي).
- دعم اللغة الإنجليزية غير مُفعّل — فقط مكانه محجوز في `/settings` (تبويب اللغة).
