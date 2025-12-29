# ClinicFlow - Laravel Backend

<div align="center">

![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php&logoColor=white)
![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)

**نظام إدارة عيادات طبية شامل**

</div>

---

## 🚀 التثبيت السريع

```bash
# تثبيت Dependencies
composer install

# إعداد .env
cp .env.example .env
php artisan key:generate

# إنشاء Database
php artisan migrate

# ملء بيانات تجريبية
php ar artisan db:seed

# تشغيل Server
php artisan serve
```

API متاح على: `http://localhost:8000/api`

---

## ✨ المميزات

- 🔐 Authentication (Sanctum)
- 📊 70+ API Endpoints
- 🔔 3 Notification Channels (DB, Email, WhatsApp)
- 📁 File Management
- 🧪 13 Tests
- 🌐 Bilingual Support (AR/EN)

---

## 🗄️ Database

10 جداول: users, doctors, patients, clinics, services, appointments, inventory, invoices, notifications, device_tokens

---

## 🔗 API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
```

### Dashboard (26 endpoints)
```
GET    /api/dashboard/statistics
CRUD   /api/dashboard/appointments
CRUD   /api/dashboard/patients
```

### Mobile (14 endpoints)
```
GET    /api/mobile/doctor/appointments
GET    /api/mobile/patient/appointments
```

**المجموع**: 70+ endpoints

---

## 🧪 Testing

```bash
php artisan test
```

13 tests ✅

---

## 👥 الحسابات التجريبية

```
Admin: admin@clinicflow.com / password
Doctor: ahmed@clinicflow.com / password
```

---

## 📚 التوثيق

راجع مجلد `artifacts/` للتفاصيل الكاملة.

---

**Production Ready** ✅ | بنيت بـ ❤️ باستخدام Laravel
