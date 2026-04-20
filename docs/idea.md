# IronPace - Registro Integral de Actividad

## 📝 Visión General
**IronPace** es una aplicación web ligera y minimalista diseñada para centralizar el seguimiento del progreso físico. A diferencia de las aplicaciones convencionales que se especializan en una sola disciplina, IronPace ofrece un espacio unificado para el entrenamiento de fuerza (gimnasio) y de resistencia (running/walking), eliminando la fricción de usar múltiples plataformas.

---

## 🚀 Definición del Problema
El mercado actual de aplicaciones de fitness presenta tres obstáculos principales:
1. **Saturación y Complejidad:** Las apps más populares están llenas de publicidad, funciones sociales innecesarias y muros de pago.
2. **Fragmentación:** Los deportistas híbridos deben alternar entre diferentes aplicaciones para registrar pesas y carreras.
3. **Falta de sincronización:** Muchas apps o son locales (se pierden los datos si cambias de móvil) o son nubes lentas. IronPace resuelve esto mediante una arquitectura web moderna con base de datos NoSQL, garantizando acceso rápido, seguro y sincronizado desde cualquier dispositivo.

**IronPace** resuelve esto mediante una arquitectura local que prioriza la velocidad, la privacidad y la simplicidad "todo en uno".

---

## 👥 Usuario Objetivo
* **Atletas Híbridos:** Personas que integran el entrenamiento de fuerza y el cardio en su rutina semanal.
* **Principiantes:** Usuarios que buscan una herramienta sencilla para empezar a documentar su progreso sin abrumarse.
* **Entusiastas de la Privacidad:** Usuarios que prefieren gestionar sus datos de forma local en su dispositivo.

---

## ✨ Funcionalidades Principales (MVP)
- [ ] **Autenticación Segura:** Sistema de registro e inicio de sesión integrado con Firebase Auth, garantizando la privacidad y encriptación de las credenciales del usuario.
- [ ] **Gestión de Base de Datos:** Los datos biométricos y el historial de entrenamientos se almacenan de forma segura en MongoDB, vinculados al ID único de Firebase del usuario.
- [ ] **Módulo de Fuerza:** Interfaz para registrar ejercicios, series, repeticiones y peso.
- [ ] **Módulo de Cardio:** Registro específico para "Correr" o "Andar" (distancia en km y tiempo).
- [ ] **Sincronización en la nube:** Uso de `MongoDB` como base de datos principal para almacenar los perfiles y registros, permitiendo acceso multiplataforma en tiempo real.
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

> **Nota Técnica:** Este proyecto evoluciona hacia una arquitectura Full-Stack. El Frontend está desarrollado con React, mientras que el Backend utiliza Node.js y Express, conectados a una base de datos no relacional MongoDB. Esta estructura es el cimiento perfecto para soportar el futuro Marketplace y el análisis masivo de datos.