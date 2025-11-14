# AlatBerat - Landing Page & Admin Dashboard

Landing page modern untuk menampilkan katalog alat berat dengan admin dashboard untuk mengelola data. Dibangun dengan Next.js 15, Supabase, dan shadcn/ui.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **UI Components**: shadcn/ui + Tailwind CSS
- **Authentication**: Supabase Auth
- **TypeScript**: Type-safe development

## Fitur

### Landing Page
- Hero section yang menarik
- Katalog alat berat dengan filter kategori
- Card responsif dengan informasi lengkap
- Section tentang perusahaan
- Contact section dengan WhatsApp & telepon
- Fully responsive design

### Admin Dashboard
- Authentication dengan Supabase Auth
- CRUD operations untuk alat berat
- Form dengan validasi
- Table dengan sort & filter
- Upload spesifikasi dalam format JSON
- Status ketersediaan alat

## Setup Project

### 1. Clone & Install Dependencies

```bash
cd alat-berat-app
npm install
```

### 2. Setup Supabase

1. Buat project baru di [Supabase](https://supabase.com)
2. Jalankan SQL schema yang ada di `supabase/schema.sql` di SQL Editor
3. Copy URL dan keys dari Settings > API

### 3. Environment Variables

Edit file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Setup Admin User

Di Supabase Dashboard:
1. Go to Authentication > Users
2. Add new user dengan email & password
3. User ini akan bisa login ke `/admin/login`

### 5. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## Struktur Folder

```
alat-berat-app/
├── app/
│   ├── admin/              # Admin dashboard pages
│   │   ├── login/          # Login page
│   │   └── page.tsx        # Dashboard utama
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── landing/            # Landing page components
│   │   ├── hero-section.tsx
│   │   ├── equipment-card.tsx
│   │   └── equipment-list.tsx
│   ├── dashboard/          # Admin dashboard components
│   │   ├── equipment-form.tsx
│   │   └── equipment-table.tsx
│   └── shared/             # Shared components
│       ├── navbar.tsx
│       └── footer.tsx
├── lib/
│   └── supabase/           # Supabase client configs
│       ├── client.ts       # Client-side
│       ├── server.ts       # Server-side
│       └── middleware.ts   # Middleware
├── hooks/
│   └── use-equipment.ts    # Custom hooks
├── types/
│   ├── database.types.ts   # Database types
│   └── index.ts            # Shared types
└── supabase/
    └── schema.sql          # Database schema
```

## Database Schema

### Table: heavy_equipment
- `id` (UUID, Primary Key)
- `name` (VARCHAR) - Nama alat berat
- `category` (VARCHAR) - Kategori (excavator, bulldozer, dll)
- `description` (TEXT) - Deskripsi lengkap
- `specifications` (JSONB) - Spesifikasi teknis
- `price_per_day` (DECIMAL) - Harga sewa per hari
- `price_per_month` (DECIMAL) - Harga sewa per bulan
- `image_url` (TEXT) - URL gambar utama
- `is_available` (BOOLEAN) - Status ketersediaan
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Table: equipment_images
- `id` (UUID, Primary Key)
- `equipment_id` (UUID, Foreign Key)
- `image_url` (TEXT)
- `is_primary` (BOOLEAN)
- `created_at` (TIMESTAMP)

## Deployment

### Vercel (Recommended)

```bash
npm run build
vercel --prod
```

Jangan lupa set environment variables di Vercel dashboard.

### Other Platforms

Project ini bisa di-deploy ke platform apapun yang support Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Customization

### Warna & Styling
Edit `app/globals.css` untuk mengubah color scheme:

```css
@layer base {
  :root {
    --primary: ...;
    --secondary: ...;
  }
}
```

### Kategori Alat Berat
Edit `types/index.ts` untuk menambah/edit kategori:

```typescript
export const EQUIPMENT_CATEGORIES = [
  { value: 'excavator', label: 'Excavator' },
  // tambah kategori baru di sini
]
```

### Contact Info
Edit `components/shared/footer.tsx` dan `app/page.tsx` untuk mengubah nomor telepon, email, dll.

## Best Practices

1. **Type Safety**: Selalu gunakan TypeScript types yang sudah didefinisikan
2. **Error Handling**: Implementasi try-catch untuk semua async operations
3. **Loading States**: Tampilkan loading state untuk UX yang lebih baik
4. **Validation**: Validasi input di client dan server side
5. **Security**: Gunakan RLS (Row Level Security) di Supabase
6. **Image Optimization**: Gunakan Next.js Image component
7. **SEO**: Tambahkan metadata di setiap page

## Troubleshooting

### Build Error
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Supabase Connection Error
- Cek environment variables
- Pastikan Supabase project aktif
- Verify API keys

### Authentication Issues
- Clear browser cache & cookies
- Check Supabase Auth settings
- Verify user exists di database

## Contributing

Silakan buat pull request untuk improvements. Pastikan:
1. Code mengikuti style guide
2. Tambahkan tests jika perlu
3. Update dokumentasi

## License

MIT License - bebas digunakan untuk project komersial maupun personal.

## Support

Untuk pertanyaan atau bantuan:
- Email: info@alatberat.com
- WhatsApp: +62 812 3456 7890

---

Dibuat dengan ❤️ menggunakan Next.js & Supabase
