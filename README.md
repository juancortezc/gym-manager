# 🏋️‍♂️ Gym Manager - Sistema de Gestión de Gimnasio

Sistema completo para la gestión de gimnasios desarrollado con Next.js, TypeScript, Prisma y Neon Database.

## 🚀 Características

### 👥 Control de Miembros
- Registro y gestión de miembros
- Administración de planes y membresías
- Control de visitas y clases utilizadas
- Sistema de notificaciones para membresías próximas a vencer
- Historial completo de cada miembro

### 👨‍🏫 Control de Entrenadores
- Registro de entrenadores con tarifas por hora
- Control de sesiones de trabajo (inicio/fin)
- Cálculo automático de horas trabajadas
- Reportes para pagos mensuales

### 🧹 Control de Personal de Limpieza
- Gestión similar a entrenadores
- Control de horarios de trabajo
- Cálculo de pagos por horas trabajadas

### 💰 Control de Caja Chica
- Registro de ingresos y gastos
- Control de saldo disponible
- Filtros por tipo de transacción y fechas
- Reportes mensuales para cuadres de caja

### 🔐 Seguridad
- Sistema de autenticación con PIN de 4 dígitos
- Middleware de protección de rutas
- Encriptación de datos sensibles

### 📱 Progressive Web App (PWA)
- Instalable como aplicación móvil
- Funcionalidad offline básica
- Interfaz responsive optimizada para móviles

## 🛠️ Tecnologías

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Base de Datos:** Neon Database (PostgreSQL)
- **ORM:** Prisma
- **Deployment:** Vercel
- **PWA:** Service Workers, Web App Manifest

## 📦 Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   Editar `.env` con tus configuraciones:
   ```env
   DATABASE_URL="postgresql://username:password@ep-example.us-east-1.aws.neon.tech/neondb?sslmode=require"
   NEXTAUTH_SECRET="your-secret-key-here"
   DEFAULT_PIN="1234"
   ```

3. **Configurar la base de datos:**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. **Ejecutar en desarrollo:**
   ```bash
   npm run dev
   ```

## 🚀 Deployment en Vercel

1. **Conectar repositorio en Vercel:**
   - Crear cuenta en [Vercel](https://vercel.com)
   - Importar proyecto desde GitHub

2. **Configurar variables de entorno en Vercel:**
   - `DATABASE_URL`: URL de tu base de datos Neon
   - `NEXTAUTH_SECRET`: Clave secreta para autenticación
   - `DEFAULT_PIN`: PIN por defecto para el primer usuario

3. **Deploy automático:**
   - Vercel desplegará automáticamente en cada push

## 🗄️ Base de Datos (Neon)

1. **Crear cuenta en Neon:**
   - Ir a [neon.tech](https://neon.tech)
   - Crear nuevo proyecto

2. **Obtener URL de conexión:**
   - Copiar la cadena de conexión de PostgreSQL
   - Agregar a las variables de entorno

3. **Ejecutar migraciones:**
   ```bash
   npx prisma migrate deploy
   ```

## 📱 Uso de la Aplicación

### Primer Acceso
1. Abrir la aplicación en el navegador
2. Usar el PIN por defecto configurado en `.env`
3. Cambiar el PIN desde Configuración > Seguridad

### Funcionalidades Principales

#### Gestión de Miembros
- **Crear miembro:** Registrar datos personales
- **Crear plan:** Definir duración, clases y precio
- **Asignar membresía:** Vincular miembro con plan
- **Registrar visita:** Marcar asistencia y descontar clases

#### Control de Entrenadores
- **Registrar entrenador:** Nombre y tarifa por hora
- **Iniciar sesión:** Marcar hora de inicio de trabajo
- **Finalizar sesión:** Calcular horas trabajadas automáticamente

#### Caja Chica
- **Registrar ingreso/gasto:** Con descripción y responsable
- **Ver balance:** Saldo actual y movimientos del mes
- **Reportes:** Filtrar por fecha y tipo de transacción

## 🔧 Estructura del Proyecto

```
gym-manager/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── api/               # API Routes
│   │   ├── dashboard/         # Página principal
│   │   ├── members/           # Gestión de miembros
│   │   ├── trainers/          # Control de entrenadores
│   │   ├── cleaning/          # Personal de limpieza
│   │   ├── cash/              # Caja chica
│   │   └── settings/          # Configuración
│   ├── components/            # Componentes reutilizables
│   ├── lib/                   # Utilidades y configuración
│   └── generated/             # Cliente de Prisma
├── prisma/                    # Esquema de base de datos
├── public/                    # Archivos estáticos y PWA
└── package.json
```

## 🎯 Próximas Características

- [ ] Reportes avanzados con gráficos
- [ ] Sistema de notificaciones push
- [ ] Integración con pasarelas de pago
- [ ] Exportación de datos a Excel/PDF
- [ ] Sistema de roles y permisos
- [ ] Chat o sistema de mensajería
- [ ] Gestión de inventario de equipos

---

Desarrollado con ❤️ para la gestión eficiente de gimnasios
