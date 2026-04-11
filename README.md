# diplom

### clone hiihiig horiglno suhee sankii ganaa!!!!

## Domain deploy checklist

Backend `.env` дээр:

```env
DJANGO_DEBUG=0
DJANGO_SECRET_KEY=change-me-to-a-long-random-secret
DJANGO_ALLOWED_HOSTS=example.com,www.example.com,api.example.com
CORS_ALLOWED_ORIGINS=https://example.com,https://www.example.com
CSRF_TRUSTED_ORIGINS=https://example.com,https://www.example.com
SESSION_COOKIE_SECURE=1
CSRF_COOKIE_SECURE=1
SECURE_SSL_REDIRECT=1
SECURE_HSTS_SECONDS=31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS=1
SECURE_HSTS_PRELOAD=0
GEMINI_API_KEY=your-real-key
RUN_CODE_ENABLED=0
```

Frontend build хийхдээ:

```env
VITE_API_BASE_URL=https://api.example.com/api
```

Domain холбох хүртэл local дээр ажиллуулах бол `DJANGO_DEBUG=1`, `VITE_API_BASE_URL=http://localhost:8000/api` гэж тавина.
