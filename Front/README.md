# Club Manager - Frontend

## Descripción

Este proyecto es un panel administrativo moderno para la gestión de clubes deportivos (Ligas, Equipos y Jugadores). Está diseñado como una SPA (Single Page Application) y se integra con un backend desarrollado en Spring Boot para persistir la información.

---

## Tecnologías Utilizadas

- **React 19** - Librería para la interfaz de usuario.
- **Vite** - Bundler y servidor de desarrollo ultra rápido.
- **pnpm** - Gestor de dependencias rápido y eficiente con almacenamiento direccionable.
- **Fetch API nativo** - Cliente HTTP nativo para la comunicación con la API (sin dependencias externas pesadas).

---

## Requisitos Previos

- Tener instalado **Node.js** (versión 18 o superior recomendada).

---

## Instalación y Ejecución

Sigue estos sencillos pasos para levantar el entorno de desarrollo:

1. **Instalar dependencias**:

   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

El proyecto estará disponible para su visualización en tu navegador en `http://localhost:5173`.

---

## Conexión con el Backend

El frontend está configurado por defecto para comunicarse con la API de Spring Boot en:

- **Base URL**: `http://localhost:8080/api`

> [!IMPORTANT]
> El backend de Spring Boot debe estar activo en el puerto `8080` y contar con la configuración de **CORS** habilitada para permitir peticiones originadas desde el puerto del frontend (típicamente `http://localhost:5173`).
