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

### 4. `Modal`
Ventana flotante reutilizable que se superpone a la interfaz principal para mostrar contenido temporal (formularios, alertas, etc.).

**Props:**
| Prop | Tipo | Descripción |
| :--- | :--- | :--- |
| `isOpen` | `boolean` | Controla si el modal es visible o no. |
| `onClose` | `() => void` | Función que se ejecuta para cerrar el modal. |
| `children`| `React.ReactNode` | El contenido a mostrar dentro del modal. |

---

## Componentes Funcionales (Conexión a API)

### 5. `GymExerciseForm`
Formulario específico para registrar ejercicios de fuerza/gimnasio. Envía datos como series, repeticiones y peso al backend bajo la categoría "Gym".
*No recibe props externas, consume el estado global de `AuthContext`.*

### 6. `CardioSessionForm`
Formulario específico para registrar sesiones aeróbicas (correr o andar). Permite registrar distancia de forma obligatoria, y duración/ritmo de forma opcional bajo la categoría "Cardio".
*No recibe props externas, consume el estado global de `AuthContext`.*

### 7. `WorkoutList`
Componente encargado de realizar una petición `GET` al backend para obtener y listar el historial completo de entrenamientos del usuario actual.
*No recibe props externas, consume el estado global de `AuthContext`.*