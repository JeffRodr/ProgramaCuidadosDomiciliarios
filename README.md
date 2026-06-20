# 🏥 Evaluador Sociosanitario - Programa de Cuidados Domiciliarios

Sistema web de preevaluación y derivación automatizada para optimizar los procesos de ingreso a los programas de apoyo y cuidados de la municipalidad.

## 📖 Acerca del Proyecto

Este proyecto nace como una solución tecnológica desarrollada para evaluar y optimizar los procesos de atención domiciliaria municipal, sirviendo simultáneamente como un proyecto final de índole académica y una herramienta operativa real. 

Su objetivo principal es reducir los tiempos de espera y descongestionar los canales de atención telefónica y presencial, realizando un primer filtro socioeconómico y sanitario de forma digital. El algoritmo clasifica a los candidatos basándose en los lineamientos institucionales y los deriva al programa adecuado (Cuidados Domiciliarios, PRLAC, DIDECO, u Oficina del Adulto Mayor).

## ✨ Características Principales

* **Lógica de Cascada Dinámica:** Evaluación en tiempo real basada en Edad, Nivel de Dependencia, Registro Social de Hogares (RSH) y Red de Apoyo.
* **Derivación Inteligente:** Redirección automática a los distintos anexos y programas municipales según el perfil del usuario.
* **Integración sin Fricción:** Generación de enlaces con parámetros prerrellenados (Pre-filled URLs) hacia Google Forms, evitando que el usuario deba ingresar la misma información dos veces.
* **Privacidad por Diseño (Stateless):** El sistema procesa la lógica en el lado del cliente (Navegador) sin almacenar datos personales en servidores intermedios, cumpliendo con los estándares de protección de datos sociosanitarios.
* **Gestión Visual (Back-Office):** Integración con Google Sheets mediante reglas de formato condicional automático para alertar a las funcionarias sobre casos prioritarios (ej. usuarios sin conocimiento de su tramo de RSH).

## 🛠️ Tecnologías Utilizadas

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+).
* **Integración de Datos:** Google Forms API (Pre-filled URLs).
* **Gestión de Base de Datos:** Google Sheets.
* **Despliegue / Hosting:** GitHub Pages.

## 🚀 Flujo Operativo del Sistema

1. **Captura de Datos:** El ciudadano completa un formulario rápido e intuitivo en la plataforma web.
2. **Procesamiento Lógico:** El script `evaluacion.js` cruza las variables (Ej: *Dependencia Moderada + Menor de 60 años + Con cuidador = Derivación directa a PRLAC*).
3. **Respuesta Institucional:** Se despliega un modal o *pop-up* informando al ciudadano el resultado de su evaluación con las instrucciones de contacto correspondientes.
4. **Postulación Formal:** Si el candidato cumple con el perfil ideal para Cuidados Domiciliarios, el sistema inyecta sus respuestas en un enlace dinámico hacia el Formulario Oficial de Google para completar sus datos personales.
