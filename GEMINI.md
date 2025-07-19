Stack Tecnológico

Frontend: React Native con Expo
Backend: Firebase (Authentication + Firestore)
Pagos: Mercado Pago SDK
Navegación: React Navigation (Bottom Tabs)
Notificaciones: Expo Notifications
Storage Local: AsyncStorage
Chatbot: OpenAI Assistant API
Estado: Context API o Redux Toolkit

Estructura de la Aplicación
Autenticación

Login/Registro con email y contraseña usando Firebase Auth
Persistencia de sesión con AsyncStorage
Pantallas: Login, Registro, Recuperar Contraseña

Navegación Principal (Bottom Tabs)

Home - Pantalla principal con resumen
Reservar - Sistema de reservas de turnos
Mis Turnos - Turnos pendientes
Puntos - Sistema de fidelización y premios
Asistente - Chatbot con OpenAI

Funcionalidades Detalladas
Sistema de Turnos

Selección de local: 3 opciones (Mitre, Gerli, Lavalle)
Selección de peluquero: Lista por local con fotos de perfil
Calendario: Disponibilidad en tiempo real
Horarios: Turnos cada 40 minutos de 10:00 a 18:00 (Lun-Vie)
Validaciones:

No permitir turnos ocupados
Mínimo 2 horas de anticipación
Solo turnos futuros


Pago obligatorio: 100% del servicio via Mercado Pago
Confirmación: Push notification de confirmación

Sistema de Fidelización

Puntos por turno: 20 puntos automáticos al completar cita
Pantalla de premios: Catálogo de recompensas canjeables
Ejemplos de premios:

50 puntos = 20% descuento
100 puntos = Corte gratis
150 puntos = Tratamiento capilar


Canje: Los puntos se descuentan al usar premios
Balance: Visualización de puntos actuales

Sistema de Rating

Post-servicio: Rating de 1-5 estrellas para peluquero
Obligatorio: Para recibir los 20 puntos de fidelización
Historial: Promedio visible en perfil de peluquero

Integración Mercado Pago

SDK oficial: Implementación nativa
Métodos: Tarjetas de crédito/débito
Flow: Selección turno → Pago → Confirmación
Estados: Pendiente, Aprobado, Rechazado

Chatbot Asistente

Integración OpenAI: Assistant API
Funciones:

Información general de locales
Recomendaciones de servicios
Consultas sobre puntos y premios
FAQ general


UI: Chat interfaz moderna

Notificaciones Push

Recordatorios: 2 horas antes del turno
Confirmaciones: Reserva exitosa, pago procesado
Promociones: Ofertas especiales (opcional)

Estructura de Datos (Firestore)
Colección users
javascript{
  uid: "firebase_uid",
  email: "user@email.com",
  name: "Nombre Usuario",
  phone: "1234567890",
  points: 120,
  createdAt: timestamp,
  lastLogin: timestamp
}
Colección locations
javascript{
  id: "location_id",
  name: "Peluquería Mitre",
  address: "Mitre 123, Buenos Aires",
  phone: "+54911234567",
  photo: "url_to_photo",
  isOpen: true,
  workingHours: {
    monday: { start: "10:00", end: "18:00" },
    tuesday: { start: "10:00", end: "18:00" },
    // ... resto de días
    saturday: null, // cerrado
    sunday: null    // cerrado
  }
}
Colección barbers
javascript{
  id: "barber_id",
  name: "Lautaro",
  locationId: "location_id",
  photo: "url_to_photo",
  rating: 4.5,
  totalRatings: 127,
  isActive: true
}
Colección appointments
javascript{
  id: "appointment_id",
  userId: "user_id",
  locationId: "location_id",
  barberId: "barber_id",
  date: "2025-07-20",
  time: "14:00",
  duration: 40, // minutos
  status: "confirmed", // pending, confirmed, completed, cancelled
  paymentId: "mercadopago_payment_id",
  paymentStatus: "approved",
  amount: 5000,
  pointsEarned: 20,
  rating: null, // se llena después del servicio
  createdAt: timestamp
}
Colección rewards
javascript{
  id: "reward_id",
  title: "Corte Gratis",
  description: "Un corte de cabello sin costo",
  pointsCost: 100,
  discountPercent: 100,
  isActive: true,
  image: "url_to_image"
}
Colección pointsHistory
javascript{
  id: "history_id",
  userId: "user_id",
  appointmentId: "appointment_id", // si aplica
  rewardId: "reward_id", // si es canje
  points: 20, // positivo para ganancia, negativo para gasto
  type: "earned", // earned, redeemed
  description: "Turno completado en Peluquería Mitre",
  createdAt: timestamp
}
Pantallas Principales
1. Splash Screen

Logo de Glam Design
Verificación de autenticación

2. Auth Stack

Login: Email, contraseña, "Recordarme"
Register: Email, contraseña, nombre, teléfono
ForgotPassword: Reset por email

3. Home Tab

Saludo personalizado
Resumen de puntos actuales
Próximo turno (si existe)
Accesos rápidos: "Reservar Turno", "Ver Premios"

4. Reservar Tab

Paso 1: Selección de local (3 cards con info)
Paso 2: Selección de peluquero (grid con fotos y ratings)
Paso 3: Calendario con disponibilidad
Paso 4: Confirmación y pago (Mercado Pago)
Paso 5: Confirmación exitosa

5. Mis Turnos Tab

Lista de turnos pendientes
Información: fecha, hora, local, peluquero
Opción cancelar (hasta 2 horas antes)
Estado del pago

6. Puntos Tab

Balance actual de puntos
Catálogo de premios canjeables
Botón "Canjear" por premio
Mini historial reciente

7. Asistente Tab

Interfaz de chat
Input de mensaje
Historial de conversación
Sugerencias rápidas

8. Modal de Rating (Post-servicio)

Aparece automáticamente después del turno
5 estrellas seleccionables
Botón "Enviar Rating"
Confirmación de puntos ganados

Configuración Inicial (Script)
Archivo: initData.js
javascriptconst initialData = {
  locations: [
    {
      name: "Peluquería Mitre",
      address: "Mitre 123, Buenos Aires",
      phone: "+54911111111",
      photo: "https://example.com/mitre.jpg"
    },
    {
      name: "Peluquería Gerli",
      address: "Gerli 456, Buenos Aires", 
      phone: "+54922222222",
      photo: "https://example.com/gerli.jpg"
    },
    {
      name: "Peluquería Lavalle",
      address: "Lavalle 789, Buenos Aires",
      phone: "+54933333333", 
      photo: "https://example.com/lavalle.jpg"
    }
  ],
  barbers: [
    // Peluquería Mitre
    { name: "Lautaro", locationName: "Peluquería Mitre", photo: "url" },
    { name: "Carlos", locationName: "Peluquería Mitre", photo: "url" },
    { name: "Juan", locationName: "Peluquería Mitre", photo: "url" },
    // Peluquería Gerli  
    { name: "Nicolas", locationName: "Peluquería Gerli", photo: "url" },
    { name: "Pedro", locationName: "Peluquería Gerli", photo: "url" },
    { name: "Luis", locationName: "Peluquería Gerli", photo: "url" },
    // Peluquería Lavalle
    { name: "Franco", locationName: "Peluquería Lavalle", photo: "url" },
    { name: "Toto", locationName: "Peluquería Lavalle", photo: "url" },
    { name: "Matias", locationName: "Peluquería Lavalle", photo: "url" }
  ],
  rewards: [
    { title: "20% Descuento", pointsCost: 50, discountPercent: 20 },
    { title: "Corte Gratis", pointsCost: 100, discountPercent: 100 },
    { title: "Tratamiento Capilar", pointsCost: 150, discountPercent: 100 }
  ],
  workingHours: {
    monday: { start: "10:00", end: "18:00" },
    tuesday: { start: "10:00", end: "18:00" },
    wednesday: { start: "10:00", end: "18:00" },
    thursday: { start: "10:00", end: "18:00" },
    friday: { start: "10:00", end: "18:00" },
    saturday: null,
    sunday: null
  }
};
Configuraciones Requeridas
Firebase

Crear proyecto en Firebase Console
Habilitar Authentication (Email/Password)
Crear base de datos Firestore
Configurar reglas de seguridad
Agregar configuración en firebase.config.js

Mercado Pago

Crear cuenta de desarrollador
Obtener Access Token y Public Key
Configurar webhook para confirmaciones de pago
Implementar SDK en payment.service.js

OpenAI

Crear Assistant en OpenAI Platform
Configurar knowledge base con info de la peluquería
Obtener API Key y Assistant ID
Implementar cliente en chatbot.service.js

Expo/React Native

Configurar notificaciones push
Configurar AsyncStorage para persistencia
Configurar navegación con React Navigation
Configurar manejo de imágenes

Diseño y UI
Paleta de Colores

Principal: Negro (#000000)
Secundario: Blanco (#FFFFFF)
Acentos: Gris claro (#F5F5F5), Gris oscuro (#333333)
Success: Verde (#4CAF50)
Warning: Amarillo (#FFC107)
Error: Rojo (#F44336)

Componentes Reutilizables

Button: Botón principal con variantes
Card: Tarjeta para locales, peluqueros, turnos
Input: Campo de entrada con validación
Loading: Indicadores de carga
Modal: Modales para confirmaciones
Rating: Componente de estrellas

Fuentes

Principal: System default (San Francisco/Roboto)
Títulos: Bold
Cuerpo: Regular
Captions: Light

Validaciones y Reglas de Negocio
Reservas

Usuario autenticado requerido
Local y peluquero válidos y activos
Fecha/hora disponible (no ocupada)
Mínimo 2 horas de anticipación
Horario dentro del rango laboral
Pago exitoso requerido para confirmar

Puntos

Solo se otorgan después de completar el servicio
Solo se otorgan después de calificar al peluquero
Los puntos no se pueden transferir
Los premios solo se canjean con puntos suficientes

Pagos

Integración con Mercado Pago obligatoria
Validación de estado de pago antes de confirmar turno
Manejo de errores de pago
No hay reembolsos automáticos (manejar por backoffice)

Estructura de Archivos Sugerida
src/
├── components/          # Componentes reutilizables
├── screens/            # Pantallas principales
├── navigation/         # Configuración de navegación
├── services/           # APIs y servicios (Firebase, MercadoPago, OpenAI)
├── context/            # Context providers
├── utils/              # Utilidades y helpers
├── constants/          # Colores, medidas, configuraciones
├── hooks/              # Custom hooks
└── assets/             # Imágenes, iconos, etc.
Variables de Entorno Requeridas
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=

MERCADOPAGO_PUBLIC_KEY=
MERCADOPAGO_ACCESS_TOKEN=

OPENAI_API_KEY=
OPENAI_ASSISTANT_ID=

EXPO_NOTIFICATIONS_ANDROID_MODE=
EXPO_NOTIFICATIONS_ICON_COLOR=
Scripts de Desarrollo

expo start - Iniciar servidor de desarrollo
expo build:android - Build para Android
expo build:ios - Build para iOS
npm run init-data - Ejecutar script de carga inicial
npm run test - Ejecutar tests

Consideraciones de Performance

Lazy loading para imágenes
Paginación en listas largas
Cache de datos frecuentes
Optimización de consultas Firestore
Debounce en búsquedas

Pruebas Sugeridas

Tests unitarios para servicios
Tests de integración para flujo de reservas
Tests E2E para flujo completo de usuario
Tests de componentes UI críticos