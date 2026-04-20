# Arquitectura de la Aplicación: IronPace

Este documento define las decisiones arquitectónicas y técnicas para el desarrollo de IronPace, asegurando escalabilidad, mantenibilidad y una separación clara de responsabilidades.

## 1. Estructura de Componentes Principales (Frontend)
La aplicación React seguirá una estructura jerárquica basada en páginas y componentes modulares:

* `App.tsx`: Raíz de la aplicación, inyecta los proveedores de contexto y el Router.
* `Layout/`:
    * `MainLayout.tsx`: Contiene el Navbar y el contenedor principal. Envolverá las rutas protegidas.
* `Pages/` (Vistas completas):
    * `Login.tsx` / `Register.tsx`: Vistas de autenticación.
    * `Dashboard.tsx`: Vista principal con el resumen y listado de actividades.
    * `AddWorkout.tsx`: Formulario para registrar nueva actividad.
    * `Profile.tsx`: Datos del usuario.
* `Components/` (Específicos del dominio):
    * `WorkoutList.tsx`: Muestra el historial.
    * `WorkoutCard.tsx`: Tarjeta individual de una actividad.
    * `StatsSummary.tsx`: Resumen visual (ej. total de km o kg levantados).

## 2. Componentes Reutilizables (UI Elements)
Para mantener consistencia visual (Tailwind) y no repetir código, se crearán estos componentes genéricos en `src/components/ui/`:
* `Button.tsx`: Botones primarios, secundarios y de peligro.
* `InputField.tsx`: Campos de texto con manejo de errores integrado.
* `SelectBox.tsx`: Selector desplegable (para elegir Fuerza o Cardio).
* `Spinner.tsx`: Indicador de carga para peticiones asíncronas.
* `Modal.tsx`: Ventana emergente (ej. para confirmar el borrado de un entreno).

## 3. Gestión del Estado
La aplicación utilizará una estrategia de estado dividida según el alcance de los datos:
* **Estado Global (Context API):** Se creará un `AuthContext` que almacenará la información del usuario actual autenticado por Firebase y su token de sesión. Al ser datos que cambian poco y se leen en toda la app, Context es ideal.
* **Estado Local (useState/useReducer):** Para el control de formularios (inputs de login, registro de entrenamientos) y estados de la interfaz gráfica (abrir/cerrar modales).
* **Estado de Servidor:** Se crearán *Custom Hooks* (ej. `useWorkouts`) para gestionar las peticiones HTTP (`fetch`), manejando internamente los estados de `loading`, `error` y `data`.

## 4. Diseño del Backend y API REST
El servidor Node.js expondrá una API REST bajo el prefijo `/api/v1`. Todas las rutas privadas requerirán que el cliente envíe el token JWT de Firebase en la cabecera `Authorization`.

### Recursos: Workouts (Entrenamientos)

* **GET /api/v1/workouts**
    * *Propósito:* Obtener el historial del usuario autenticado.
    * *Respuesta (200 OK):*
        ```json
        [
          {
            "_id": "60d5ec...",
            "firebaseUid": "user123...",
            "type": "cardio",
            "date": "2023-10-27T10:00:00Z",
            "cardioDetails": { "distanceKm": 5, "durationMin": 30 }
          }
        ]
        ```

* **POST /api/v1/workouts**
    * *Propósito:* Crear un nuevo registro.
    * *Cuerpo (Body):* Objeto JSON con los datos del entrenamiento.
    * *Respuesta (201 Created):* Devuelve el objeto guardado en MongoDB.

* **DELETE /api/v1/workouts/:id**
    * *Propósito:* Eliminar un registro específico.
    * *Respuesta (200 OK):* `{ "message": "Workout deleted successfully" }`

## 5. Estrategia de Persistencia de Datos
Se define una frontera clara entre cliente y servidor:
* **Servidor (MongoDB):** Es la fuente de la verdad. Almacenará los registros de entrenamientos (Workouts) y una copia del perfil básico del usuario vinculado a su `UID` de Firebase.
* **Cliente (Navegador):** * Firebase SDK gestiona la sesión (almacenando el token JWT de forma segura usando IndexedDB/LocalStorage de forma transparente).
    * *LocalStorage* se usará solo para preferencias menores de UI (ej. si el usuario prefirió el modo oscuro o filtros de visualización guardados).

## 6. Diagrama de Flujo de Datos
El siguiente esquema ilustra la interacción entre el Cliente, Firebase (Autenticación) y nuestro Servidor (Base de datos):

```text
[CLIENTE: React App]
       |
       | 1. El usuario se registra / Inicia sesión
       v
[FIREBASE AUTH] 
       | 
       | 2. Valida credenciales y devuelve un Token Seguro (JWT)
       v
[CLIENTE: React App] <--- (Guarda el Token en memoria)
       |
       | 3. El usuario guarda un entrenamiento 
       |    (Petición HTTP POST + Token en Cabecera)
       v
[SERVIDOR: Node.js / Express]
       |
       | 4. Middleware verifica que el Token de Firebase es válido
       | 5. Procesa los datos y los envía a la BD
       v
[BASE DE DATOS: MongoDB]
       |
       | 6. Confirma la escritura
       v
[SERVIDOR: Node.js / Express]
       |
       | 7. Devuelve respuesta de éxito (JSON 201 Created)
       v
[CLIENTE: React App] ---> (Actualiza la Interfaz de Usuario)