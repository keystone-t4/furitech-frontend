# Furitech Frontend

Текущий репозиторий представляет собой **Frontend** для проекта Furitech.

## Связанные ссылки

* Backend: [https://github.com/keystone-t4/furitech-backend](https://github.com/keystone-t4/furitech-backend)
* Прод: [https://furitechsl.com/](https://furitechsl.com/)
* Админка: [https://furitechsl.com/admin/](https://furitechsl.com/admin/)

## Стек

* **Nuxt 4**
* **Vue 3**
* **TypeScript**
* **SCSS** + **BEM**: базовые и общие стили подключаются из `main.css`
* **Nginx**
* **systemd**
* **GitHub Actions**
* **SSH / SCP**
* **nvm** для управления версиями Node.js

## Быстрый старт (локально)

### Требования

* Node.js / npm
* `nvm` (рекомендуется)
* `.env`

### 1. Установка зависимостей

```bash
npm ci
```

### 2. Инициализация окружения (`.env`)

```bash
npm run setup:env
```

Команда создаёт `.env` на основе `.env.example`.

Основные переменные окружения:

* `NUXT_PUBLIC_STRAPI_URL` — URL Strapi
* `NUXT_PUBLIC_SITE_URL` — URL сайта

### 3. Запуск в режиме разработки

```bash
npm run dev
```

### 4. Сборка проекта

```bash
npm run build
```

### 5. Проверка production-сборки локально

```bash
npm run preview
```

## Как устроен CI/CD

В проекте используется **двухветочная схема**:

* `develop` — рабочая ветка для разработки;
* `main` — ветка продакшена.

### Логика работы

* Любой обычный кодовый коммит делается в `develop`.
* На `develop` запускается только **CI**: установка зависимостей и сборка.
* В `main` изменения попадают только через merge из `develop`.
* При push в `main` запускается **CD**: архивирование проекта, отправка на сервер, деплой новой версии и перезапуск сервиса.
* Изменения только в `README.md` и `docs/**` не должны запускать деплой, если они не сопровождаются релизом в `main`.

### Workflow 1: CI (`.github/workflows/ci.yaml`)

CI запускается:

* при push в `develop`;
* при открытии или обновлении Pull Request в `main` или `develop`.

Что делает CI:

1. checkout репозитория;
2. установка Node.js;
3. `npm ci`;
4. `npm run build`.

Задача CI — проверить, что проект собирается и изменения не ломают production-сборку.

### Workflow 2: CD (`.github/workflows/deploy.yaml`)

CD запускается только при push в `main`.

Что делает CD:

1. checkout репозитория;
2. создание архива проекта через `git archive`;
3. копирование архива на сервер по SCP;
4. подключение по SSH;
5. распаковка новой версии в отдельную папку релиза;
6. установка зависимостей и сборка на сервере;
7. переключение symlink `current` на новый релиз;
8. перезапуск `systemd`-сервиса;
9. удаление старых релизов, если их становится больше пяти.

## Как работать с ветками

### Ежедневная схема

```bash
# Работаем в develop
git checkout develop
git pull origin develop
# вносим изменения
git add .
git commit -m "..."
git push origin develop
```

После push в `develop` GitHub Actions запускает CI.

Если CI зелёный и изменения готовы к релизу:

```bash
git checkout main
git pull origin main
git merge develop
git push origin main
```

После push в `main` запускается деплой на сервер.

## Серверная структура

На сервере используется следующая структура:

```text
/var/www/furitech/frontend/
├── current -> /var/www/furitech/frontend/releases/<timestamp>
├── releases/
│   ├── 20260101120000/
│   ├── 20260102143000/
│   └── ...
└── shared/
    └── .env
```

### Что где лежит

* `current` — текущая активная версия проекта, на которую смотрит `systemd`-сервис.
* `releases/` — папка с историей релизов.
* `shared/.env` — общие переменные окружения.

### Логика rollback

Rollback делается переключением symlink `current` на предыдущий релиз:

```bash
sudo ln -sfn /var/www/furitech/frontend/releases/<previous_release> /var/www/furitech/frontend/current
sudo systemctl restart furitech-frontend
```

## Прод-окружение

### Что настроено на VPS

* деплой через GitHub Actions;
* запуск проекта через `systemd`;
* reverse proxy через `nginx`;
* доступ по SSH только под пользователем `developer`;
* включён firewall;
* структура `releases / current / shared`;
* `npm ci` и `npm run build` проходят на сервере;
* `npm audit` выдаёт `0` уязвимостей.

### Nginx

`nginx` используется как reverse proxy:

* запросы к Nuxt идут на `127.0.0.1:3000`;
* запросы Strapi (`/admin`, `/api`, `/uploads` и связанные маршруты) идут на `127.0.0.1:1337`;
* HTTPS включён через Certbot;
* HTTP перенаправляется на HTTPS;
* включён HTTP/2;
* кэширование статики настроено только там, где это не ломает SSR-рендеринг.

### Важно про кеширование

Так как frontend работает как SSR-приложение через `nuxt`-сервер, `nginx` не должен пытаться отдавать Nuxt-статику или Strapi uploads как файлы с диска без `root`. Для этого проекта `nginx` должен проксировать запросы, а не подменять их static-serving логикой.

## Полезные команды

### Проверка состояния зависимостей

```bash
npm ls
npm audit
```

### Проверка конфигурации Nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Проверка состояния сервиса

```bash
sudo systemctl status furitech-frontend
```

### Просмотр логов

```bash
journalctl -u furitech-frontend -f
```

## Замечания для следующего разработчика

* Не обновлять зависимости вслепую: сначала проверять `npm ls`, `npm audit`, затем `npm ci` и `npm run build`.
* `package-lock.json` должен быть синхронизирован с `package.json` и коммититься вместе с изменениями зависимостей.
* SSH на VPS работает только через отдельный пользовательский доступ и настроенные ключи.
* При работе с релизами не трогать `current` вручную, если деплой уже управляется скриптом/пайплайном.
* Для отката использовать переключение symlink на предыдущий релиз и рестарт `systemd`-сервиса.
* Если меняется Nginx-конфиг, обязательно проверять `nginx -t` перед reload.
