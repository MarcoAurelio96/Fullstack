# IronPace - Registro Integral de Actividad

## 📝 Visión General
**IronPace** es una aplicación web ligera y minimalista diseñada para centralizar el seguimiento del progreso físico. A diferencia de las aplicaciones convencionales que se especializan en una sola disciplina, IronPace ofrece un espacio unificado para el entrenamiento de fuerza (gimnasio) y de resistencia (running/walking), eliminando la fricción de usar múltiples plataformas.

---

## 🚀 Definición del Problema
El mercado actual de aplicaciones de fitness presenta tres obstáculos principales:
1. **Saturación y Complejidad:** Las apps más populares están llenas de publicidad, funciones sociales innecesarias y muros de pago.
2. **Fragmentación:** Los deportistas híbridos deben alternar entre diferentes aplicaciones para registrar pesas y carreras.
3. **Dependencia de Conexión:** Muchas herramientas fallan en entornos con mala cobertura al depender de bases de datos externas.

**IronPace** resuelve esto mediante una arquitectura local que prioriza la velocidad, la privacidad y la simplicidad "todo en uno".

---

## 👥 Usuario Objetivo
* **Atletas Híbridos:** Personas que integran el entrenamiento de fuerza y el cardio en su rutina semanal.
* **Principiantes:** Usuarios que buscan una herramienta sencilla para empezar a documentar su progreso sin abrumarse.
* **Entusiastas de la Privacidad:** Usuarios que prefieren gestionar sus datos de forma local en su dispositivo.

---

## ✨ Funcionalidades Principales (MVP)
- [ ] **Perfil de Usuario:** Registro de datos biométricos esenciales (Nombre, edad, peso y altura).
- [ ] **Módulo de Fuerza:** Interfaz para registrar ejercicios, series, repeticiones y peso.
- [ ] **Módulo de Cardio:** Registro específico para "Correr" o "Andar" (distancia en km y tiempo).
- [ ] **Persistencia Local:** Uso de `LocalStorage` para mantener los datos guardados en el navegador.
- [ ] **Historial de Actividad:** Vista cronológica de todos los entrenamientos realizados.

---

## 🛠️ Funcionalidades Opcionales
* **Calculadora de Salud:** Cálculo automático del Índice de Masa Corporal (IMC).
* **Sistema de Filtrado:** Visualización del historial filtrado por tipo de actividad.
* **Modo Demo:** Carga de datos de ejemplo (vía API o JSON) para probar la interfaz.
* **Cronómetro de Sesión:** Herramienta para medir descansos o duración de actividad.

---

## 📈 Posibles Mejoras Futuras (Roadmap)
### 1. Marketplace de Servicios (Monetización)
* **Directorio de Entrenadores:** Perfiles profesionales para contratación de asesorías.
* **Clases Especializadas:** Reserva de sesiones dirigidas (Spinning, Yoga, etc.).
* **Rutinas Premium:** Venta de planes de entrenamiento estructurados por expertos.
* **Sistema de Comisiones:** Cobro de un % por cada contratación externa realizada.

### 2. Análisis y Conectividad
* **Dashboard de Progreso:** Gráficas visuales de evolución de cargas y tiempos.
* **Integración con Wearables:** Sincronización con dispositivos externos (Garmin, Apple Watch).

---

> **Nota Técnica:** Este proyecto no requiere base de datos externa en su fase inicial; utiliza `LocalStorage` para la gestión de datos del lado del cliente.