# 💪 Fitness Tracking App

## 📝 Descripción

Una aplicación completa de seguimiento de fitness construida con React y Node.js. La aplicación permite a los usuarios realizar un seguimiento de sus entrenamientos, nutrición y progreso físico, establecer objetivos y visualizar su evolución a lo largo del tiempo.

## 📸 Capturas de Pantalla

### 🏠 Dashboard

![Home](/screenshots/home.png)
_Vista general la página de inicio_

![Dashboard](/screenshots/dashboard.png)
_Vista general del dashboard con estadísticas y actividad reciente_

### 🏋️ Entrenamientos

![Entrenamientos](/screenshots/workouts.png)
_Gestión de rutinas y seguimiento de ejercicios_

### 🍎 Nutrición

![Nutrición](/screenshots/nutrition.png)
_Seguimiento de comidas y nutrientes_

### 📊 Progreso

![Progreso](/screenshots/progress.png)
_Visualización del progreso con gráficos y estadísticas_

## 🚀 Tecnologías Utilizadas

### Frontend

- ⚛️ React.js
- 🎨 React Bootstrap para la interfaz de usuario
- 🔄 Redux para el manejo del estado
- 📊 Chart.js para visualización de datos
- 🌐 Axios para las peticiones HTTP
- 🛣️ React Router para la navegación

### Backend

- 📦 Node.js con Express
- 🔥 Firebase para autenticación y base de datos
- 🔐 JWT para autenticación
- 🧠 TensorFlow.js para análisis de datos de fitness

### DevOps

- 🐳 Docker y Docker Compose para containerización
- 🔄 Hot-reload en desarrollo
- 🔒 Variables de entorno para configuración

## 🛠️ Requisitos Previos

- Docker y Docker Compose instalados
- Node.js (versión 14 o superior)
- npm o yarn
- Git

## ⚙️ Configuración del Proyecto

1. **Clonar el repositorio**

```bash
git clone https://github.com/MichaelVairoDev/Fitness_Tracking_App.git
cd Fitness_Tracking_App
```

2. **Configurar variables de entorno**

Frontend (.env):

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
PORT=3000
```

Backend (.env):

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY_ID=your_firebase_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_firebase_client_email@your_firebase_project_id.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_firebase_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your_firebase_client_email%40your_firebase_project_id.iam.gserviceaccount.com
```

## 🚀 Iniciar el Proyecto

### Con Docker (Recomendado)

1. **Construir y levantar los contenedores**

```bash
docker-compose up --build
```

Esto iniciará:

- Frontend en http://localhost:3000
- Backend en http://localhost:5000

### Sin Docker (Desarrollo local)

1. **Iniciar el Backend**

```bash
cd backend
npm install
npm run dev
```

2. **Iniciar el Frontend**

```bash
cd frontend
npm install
npm start
```

## 🔥 Configuración de Firebase

Esta aplicación utiliza Firebase para autenticación y almacenamiento de datos. Para configurar Firebase:

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Authentication con email/password y Google
3. Configura Firestore Database para almacenar datos de usuarios
4. Crea una cuenta de servicio y descarga el archivo de credenciales
5. Configura las variables de entorno en los archivos .env con los valores de tu proyecto Firebase

## 🔍 Características Principales

- 🏋️ Seguimiento de entrenamientos y ejercicios
- 🍎 Registro y análisis de nutrición
- 📊 Visualización de progreso con gráficos
- 🎯 Establecimiento y seguimiento de objetivos
- 👤 Perfiles de usuario personalizados
- 📱 Diseño responsive para móviles y escritorio
- 🔔 Recordatorios y notificaciones

## 🗂️ Estructura del Proyecto

```
Fitness_Tracking_App/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   └── App.js
│   ├── public/
│   ├── Dockerfile
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.js
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## 🔐 Seguridad

- Autenticación mediante Firebase y JWT
- Contraseñas encriptadas
- Variables de entorno para datos sensibles
- Validación de datos en frontend y backend

## 📝 API Endpoints

### Usuarios

- POST /api/users/register - Registro de usuario
- POST /api/users/login - Login de usuario
- GET /api/users/profile - Obtener perfil de usuario
- PUT /api/users/profile - Actualizar perfil de usuario

### Entrenamientos

- GET /api/workouts - Obtener todos los entrenamientos
- GET /api/workouts/:id - Obtener un entrenamiento específico
- POST /api/workouts - Crear un nuevo entrenamiento
- PUT /api/workouts/:id - Actualizar un entrenamiento
- DELETE /api/workouts/:id - Eliminar un entrenamiento

### Nutrición

- GET /api/nutrition - Obtener registros de nutrición
- POST /api/nutrition - Añadir nuevo registro de nutrición
- PUT /api/nutrition/:id - Actualizar registro de nutrición
- DELETE /api/nutrition/:id - Eliminar registro de nutrición

### Progreso

- GET /api/progress - Obtener datos de progreso
- POST /api/progress - Añadir nuevo registro de progreso
- GET /api/progress/stats - Obtener estadísticas de progreso

## 👥 Contribución

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 📞 Soporte

Para soporte o preguntas, por favor abre un issue en el repositorio.

---

⌨️ con ❤️ por [Michael Vairo]
