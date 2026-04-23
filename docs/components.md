# Documentación de Componentes (Frontend)

Esta documentación detalla los componentes reutilizables creados para la interfaz de **Iron Pace**, diseñados con React, TypeScript y Tailwind CSS.

## Componentes de Interfaz (UI)

### 1. `NavItem`
Componente utilizado en la barra de navegación superior para representar cada enlace.

**Props:**
| Prop | Tipo | Descripción |
| :--- | :--- | :--- |
| `icon` | `React.ReactNode` | Icono a renderizar (ej. desde `lucide-react`). |
| `label` | `string` | Texto descriptivo del enlace. |
| `isActive` | `boolean` (opcional) | Si es `true`, aplica estilos de resaltado. |

### 2. `DashboardCard`
Contenedor principal con bordes punteados que agrupa distintas secciones del panel. Utiliza composición (`children`) para renderizar su contenido dinámicamente.

**Props:**
| Prop | Tipo | Descripción |
| :--- | :--- | :--- |
| `title` | `string` | Título principal de la tarjeta. |
| `subtitle` | `string` (opcional) | Texto secundario descriptivo. |
| `children`| `React.ReactNode` | Contenido interno de la tarjeta. |

### 3. `ActionIconCard`
Tarjeta interactiva pequeña diseñada para seleccionar tipos de ejercicios o categorías (ej. Gym, Cardio).

**Props:**
| Prop | Tipo | Descripción |
| :--- | :--- | :--- |
| `icon` | `React.ReactNode` | Icono central de la acción. |
| `label` | `string` | Nombre de la acción o categoría. |

## Componentes Funcionales (Conexión a API)

### 4. `AddWorkoutForm`
Formulario para registrar un nuevo entrenamiento. Se conecta mediante peticiones `POST` al backend (`/api/workouts`).
*No recibe props externas, consume el estado global de `AuthContext`.*

### 5. `WorkoutList`
Componente encargado de realizar una petición `GET` al backend para obtener y listar el historial de entrenamientos del usuario actual.
*No recibe props externas, consume el estado global de `AuthContext`.*