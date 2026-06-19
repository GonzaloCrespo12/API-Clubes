# Fútbol Club Manager - Proyecto Completo (Full Stack)

Este es un proyecto completo (Full Stack) diseñado para la **Gestión y Simulación Táctica de Clubes de Fútbol (Modo Manager)**. El sistema permite administrar de manera integrada ligas, equipos y jugadores mediante un panel administrativo moderno.

La solución está dividida en dos componentes principales:
1. **[api-clubes](file:///c:/Proyectos_Java/ProyectoClubes/api-clubes)**: Backend desarrollado en Java con Spring Boot que expone una API REST robusta y segura.
2. **[Front](file:///c:/Proyectos_Java/ProyectoClubes/Front)**: Frontend moderno desarrollado en React y Vite como una SPA (Single Page Application).

---

## 📁 Estructura del Proyecto

* **`api-clubes/`** - Código fuente del backend (API REST con Spring Boot, lógica de negocio y persistencia).
* **`Front/`** - Código fuente del cliente frontend (React, Vite, componentes interactivos).
* **`.gitignore`** - Reglas de exclusión para evitar la carga de archivos temporales de editores o módulos pesados.

---

## 🚀 Stack Tecnológico

### Backend (api-clubes)
* **Java 21** (LTS)
* **Spring Boot 3.5**
* **Maven** (Gestor de dependencias)
* **MySQL / MariaDB** (vía XAMPP)
* **Lombok** (Reducción de código boilerplate)
* **MapStruct** (Mapeo automatizado de DTOs en tiempo de compilación)
* **Jakarta Validation** (Validación de datos de entrada)

### Frontend (Front)
* **React 19** (Librería para la interfaz de usuario)
* **Vite** (Servidor de desarrollo y compilador rápido)
* **pnpm / npm** (Gestor de dependencias eficiente)
* **Fetch API nativo** (Cliente HTTP nativo para la comunicación sin dependencias pesadas)

---

## 🏗️ Arquitectura y Patrón de Capas (Backend)

La aplicación backend sigue un patrón de diseño arquitectónico en capas para asegurar la separación de responsabilidades:
1. **Controller:** Capa de presentación encargada de recibir peticiones HTTP, validar los datos de entrada y estructurar las respuestas.
2. **Service:** Capa central que encapsula la lógica de negocio pura y coordina las transacciones e interacciones entre componentes.
3. **Repository / Model:** Capa encargada del mapeo objeto-relacional (ORM) y la persistencia directa en la base de datos relacional.

### 🛡️ Patrón DTO (Data Transfer Object)
Siguiendo las mejores prácticas de seguridad y desacoplamiento, las entidades JPA nunca se exponen directamente en los endpoints. Se utilizan DTOs independientes mapeados con MapStruct:
* **`RequestDTO`:** Captura y valida la información enviada por el cliente antes de ser procesada por el servicio.
* **`ResponseDTO`:** Estructura un JSON limpio y seguro hacia el exterior, evitando bucles de serialización infinita en relaciones bidireccionales.

### 📊 Modelo de Datos (DER)
El sistema gestiona tres entidades principales con relaciones Lazy de alto rendimiento para optimizar la memoria y el tráfico de red:
* **Liga:** Relación OneToMany hacia Equipos.
* **Equipo:** Relación ManyToOne con Liga y OneToMany hacia Jugadores.
* **Jugador:** Relación ManyToOne con Equipo.

*(El diagrama DER de la API se encuentra documentado en la carpeta del backend en `api-clubes/Clubes-API.png`)*

---

## 🔌 Endpoints de la API

### Ligas (`/api/ligas`)
* `POST /api/ligas` - Crea una nueva liga (Retorna `201 Created`).
* `GET /api/ligas` - Recupera el listado de todas las ligas (Retorna `200 OK`).
* `PUT /api/ligas/{id}` - Modifica el nombre o país de una liga existente (Retorna `200 OK`).
* `DELETE /api/ligas/{id}` - Elimina una liga y sus equipos en cascada (Retorna `204 No Content`).

### Equipos (`/api/equipos`)
* `POST /api/equipos` - Registra un equipo vinculándolo a una liga mediante `ligaId` (Retorna `201 Created`).
* `GET /api/equipos` - Lista todos los equipos y muestra el nombre de su liga correspondiente (Retorna `200 OK`).

### Jugadores (`/api/jugadores`)
* `POST /api/jugadores` - Inscribe un jugador con su posición táctica y valor de mercado en un club (`equipoId`) (Retorna `201 Created`).
* `GET /api/jugadores` - Obtiene el listado completo de los futbolistas registrados (Retorna `200 OK`).

---

## 🛠️ Instalación y Ejecución en Entorno Local

### 1. Requisitos Previos
* Tener instalado **Node.js** (versión 18 o superior recomendada).
* Panel de control **XAMPP** o un servidor compatible con MySQL/MariaDB.
* Java JDK 21.

### 2. Levantando el Backend (`api-clubes`)
1. Activa los módulos **Apache** y **MySQL** en tu panel de **XAMPP**.
2. Crea una base de datos vacía llamada `club_db` desde phpMyAdmin.
3. Dirígete a la carpeta `api-clubes` en tu terminal:
   ```bash
   cd api-clubes
   ```
4. Ejecuta el comando para compilar y levantar el servidor Spring Boot:
   ```bash
   .\mvnw clean spring-boot:run
   ```
5. El servidor estará activo en `http://localhost:8080`.
6. El archivo `api-clubes/api.http` contiene pruebas HTTP listas para realizar en entornos como Thunder Client o REST Client.

### 3. Levantando el Frontend (`Front`)
1. Abre una nueva terminal en la raíz del proyecto y dirígete a la carpeta `Front`:
   ```bash
   cd Front
   ```
2. Instala las dependencias necesarias:
   ```bash
   pnpm install
   ```
   *(o `npm install` si prefieres usar npm).*
3. Inicia el servidor de desarrollo en modo local:
   ```bash
   pnpm run dev
   ```
   *(o `npm run dev`)*
4. El frontend estará disponible para su visualización en tu navegador en `http://localhost:5173`.

---

## 🔌 Conexión entre Componentes

El frontend está configurado para comunicarse con la API de Spring Boot en:
* **Base URL**: `http://localhost:8080/api`

> [!IMPORTANT]
> El backend de Spring Boot está configurado para habilitar **CORS** en el puerto `8080` para permitir peticiones originadas desde el frontend (`http://localhost:5173`). Asegúrate de levantar ambos servidores de forma simultánea.
