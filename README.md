# Furitech Frontend
Текущий репозиторий представляет собой **Frontend** для проекта Furitech.


## Связанные ссылки:

- Backend: https://github.com/keystone-t4/furitech-backend
- Прод: https://furitechsl.com/
- Админка: https://furitechsl.com/admin/


## Стек

- **Nuxt 4**
- **TypeScript** (выключен, но частично используется)
- **SCSS** + **BEM**: базовые/общие стили подключаются из `main.css`

## Быстрый старт (локально)

### Требования
- Node.js / npm
- `.env`

### 1. Установка зависимостей
```bash
npm install
```

### 2. Инициализация окружения (.env)
```bash
npm run setup:env
```
Создаст `.env` на основе `.env.example`

`NUXT_PUBLIC_STRAPI_URL` — URL Strapi

`NUXT_PUBLIC_SITE_URL` — URL сайта

### 3. Запуск dev-сервера:
```bash
npm run dev
```
