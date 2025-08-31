# ShortURL - Сервис сокращения ссылок | URL Shortening Service
## О проекте || About the Project

**ShortURL** — это полнофункциональный сервис для сокращения длинных URL-адресов, разработанный как мой первый React-проект для портфолио. Он позволяет пользователям сокращать ссылки, генерировать QR-коды для них, а также управлять своими сокращенными URL-адресами, устанавливая срок жизни и лимиты по кликам. Проект демонстрирует мои навыки работы с React, маршрутизацией, управлением состоянием, международной локализацией, интеграцией с API и тестированием.

**ShortURL** project is a full-featured URL shortening service developed as my first React portfolio project. It allows users to shorten URLs, generate QR codes for them, and manage their shortened URLs by setting lifetimes and click limits. This project showcases my skills in React, routing, state management, internationalization, API integration, and testing.

## Возможности || Features

*   **Сокращение URL | URL Shortening:** Быстрое преобразование длинных ссылок в короткие и удобные для обмена. | Quickly transform long links into short, shareable ones.
*   **Настраиваемые URL | Customizable URLs:** Установка срока жизни и лимита кликов для сокращенных ссылок. | Set a lifetime and click limit for shortened links.
*   **Генерация QR-кодов | QR Code Generation:** Автоматическое создание QR-кодов для сокращенных URL с возможностью их скачивания. | Automatically create QR codes for shortened URLs with download capability.
*   **Регистрация и Авторизация | Registration and Authorization:** Система управления пользователями с защищенными маршрутами для зарегистрированных пользователей. | User management system with protected routes for registered users.
*   **Список моих URL | My URLs List:** Просмотр, копирование и управление всеми сокращенными ссылками для авторизованных пользователей. | View, copy, and manage all shortened links for authorized users.
*   **Мультиязычность (i18n) | Multilingual Support (i18n):** Поддержка нескольких языков (русский и английский) для удобства пользователей. | Support for multiple languages (Russian and English) for user convenience.
*   **Адаптивный дизайн | Responsive Design:** Оптимизированный интерфейс для различных устройств (мобильные, планшеты, десктопы) с использованием Tailwind CSS. | Optimized interface for various devices (mobile, tablets, desktops) using Tailwind CSS.
*   **Мокирование API | API Mocking:** Использование Mock Service Worker (MSW) для имитации бэкенд-запросов в режиме разработки и тестирования. | Use of Mock Service Worker (MSW) to simulate backend requests in development and testing modes.
## Технологии || Technologies
*   **Frontend:**
    *   [React](https://react.dev/) - Библиотека для создания пользовательских интерфейсов. | A library for building user interfaces.
    *   [Vite](https://vitejs.dev/) - Инструмент для быстрой сборки и разработки. | A fast build tool and development server.
    *   [React Router DOM](https://reactrouter.com/web/guides/quick-start) - Для маршрутизации в приложении. | For routing within the application.
    *   [Tailwind CSS](https://tailwindcss.com/) - CSS-фреймворк для быстрого стилизования. | A CSS framework for rapid styling.
    *   [i18next & react-i18next](https://react.i18next.com/) - Для международной локализации. | For internationalization.
    *   [react-qr-code](https://www.npmjs.com/package/react-qr-code) - Для генерации QR-кодов. | For generating QR codes.
*   **Тестирование и Разработка | Testing and Development:**
    *   [Vitest](https://vitest.dev/) - Быстрый фреймворк для тестирования. | A fast testing framework.
    *   [Mock Service Worker (MSW)](https://mswjs.io/) - Для мокирования API в браузере. | For mocking API in the browser.

## Структура проекта || Project Structure

```
shorturl
├─ .continue
│  └─ prompts
│     └─ new-prompt.yaml
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ public                    # Статические ресурсы (изображения, service worker) | Static assets (images, service worker)
│  └─ mockServiceWorker.js
├─ README.md
├─ src
│  ├─ assets                # Изображения и иконки | Images and icons
│  │  ├─ burger-cross.svg
│  │  ├─ burger.svg
│  │  ├─ cross.svg
│  │  ├─ Flag_of_Kemerovo_Oblast.svg.png
│  │  └─ home-page.png
│  ├─ elements              # Компоненты React (разбиты по функционалу) | React components (categorized by functionality)
│  │  ├─ App.jsx            # Корневой компонент приложения | Root application component
│  │  ├─ footer.jsx
│  │  ├─ header_bar.jsx
│  │  ├─ Homepage           # Компоненты главной страницы (форма сокращения, кнопки, QR) | Homepage components (shortening form, buttons, QR)
│  │  │  ├─ !Homepage.jsx
│  │  │  ├─ copy_button.jsx
│  │  │  ├─ h1.jsx
│  │  │  ├─ loadQR_Button.jsx
│  │  │  ├─ main_form.jsx
│  │  │  ├─ qr_gen.jsx
│  │  │  ├─ submit_button.jsx
│  │  │  └─ wrapper_home.jsx
│  │  ├─ lang_chekbox.jsx
│  │  ├─ messagewindow.jsx
│  │  ├─ Myurls             # Компоненты страницы "Мои URL" | "My URLs" page components
│  │  │  ├─ !Myurlspage.jsx
│  │  │  ├─ logout.jsx
│  │  │  └─ myurlslist.jsx
│  │  ├─ PrivateRoute.jsx   # Защита маршрутов для авторизованных пользователей | Protected routes for authenticated users
│  │  └─ Registration       # Компоненты страниц регистрации/авторизации | Registration/Authorization page components
│  │     ├─ !Registrpage.jsx
│  │     ├─ registr_form.jsx
│  │     ├─ registr_h1.jsx
│  │     ├─ registr_submit.jsx
│  │     └─ registr_wrapper.jsx
│  ├─ fonts                 # Пользовательские шрифты | Custom fonts
│  │  └─ amazdoomleft.ttf
│  ├─ main.jsx              # Точка входа в приложение | Application entry point
│  ├─ mocks                 # Конфигурация Mock Service Worker | Mock Service Worker configuration
│  │  ├─ browser.js
│  │  └─ handlers.js
│  │
│  ├─ style.css             # Глобальные стили Tailwind CSS | Global Tailwind CSS styles
│  └─ translation           # Файлы локализации (i18n) | Localization files (i18n)
│     ├─ i18n.js
│     └─ languages
│        ├─ en_lang.json
│        └─ ru_lang.json
├─ tailwind.config.js      # Конфигурация Tailwind CSS | Tailwind CSS configuration
└─ vite.config.js          # Конфигурация Vite | Vite configuration
```

## Установка и Запуск | Installation and Run

Для локального запуска проекта выполните следующие шаги: | To run the project locally, follow these steps:

1.  **Клонируйте репозиторий | Clone the repository:**
    
2.  **Установите зависимости | Install dependencies:**
    ```bash
    npm install
    ```
3.  **Создайте файл `.env` | Create an `.env` file:**
    Скопируйте `.env.example` в `.env` и при необходимости настройте переменные окружения. | Copy `.env.example` to `.env` and configure environment variables as needed.
    Для локальной разработки API обычно настроен на `https://devmode`, который перехватывает msw. В продакшене `VITE_API_BASE_URL` должен указывать на URL вашего реального бэкенда.
    | For local development, the API is usually set to `https://devmode`, which is intercepted by MSW. In production, `VITE_API_BASE_URL` should point to the URL of your actual backend.

    **Пример `.env.example` | Example `.env.example`:**
    ```
    VITE_API_BASE_URL=https://localhost:7206 # Or 'https://devmode' if you exclusively use MSW for local dev
    ```

4.  **Запустите проект в режиме разработки | Run the project in development mode:**
    ```bash
    npm run dev
    ```
    Приложение будет доступно по адресу `http://localhost:5173` (или другому порту, указанному Vite). | The application will be available at `http://localhost:5173` (or another port specified by Vite).


