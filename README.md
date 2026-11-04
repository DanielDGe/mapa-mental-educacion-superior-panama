# Administración de la Educación Superior en Panamá

Mapa mental digital e interactivo para la **Actividad Individual N.º 2, Unidad Didáctica II**, de la Maestría en Docencia Superior.

## Tecnologías
- React 18 + Vite
- SVG vectorial para el mapa y sus conexiones
- Exportación a SVG, PNG y PDF (impresión del navegador en A3 horizontal)
- Sin backend ni claves de API

## Ejecutar localmente
Requisitos: Node.js 18+ y npm.

~~~bash
git clone https://github.com/DanielDGe/mapa-mental-educacion-superior-panama.git
cd mapa-mental-educacion-superior-panama
npm install
npm run dev
~~~

Abre la dirección local que muestre Vite (habitualmente http://localhost:5173).

## Generar la versión de producción
~~~bash
npm run build
npm run preview
~~~

## Exportar para entregar
1. Abre el mapa en la aplicación.
2. Usa **PDF / Imprimir** y selecciona **Guardar como PDF**.
3. Configura papel **A3**, orientación **horizontal**, escala **100 %**, márgenes **ninguno**, gráficos de fondo activados.
4. Confirma que todo el mapa esté en una página antes de presentar el PDF.

También puedes exportar un SVG editable o PNG de alta resolución desde la interfaz.

## Organización
- src/data.js: contenido académico, subramas, referencias y relaciones con la gestión.
- src/MindMap.jsx: diagrama SVG y tarjetas interactivas.
- src/App.jsx: barra de herramientas, filtrado, detalle y exportaciones.
- src/styles.css: diseño responsive y estilos para impresión.

## Alcance académico
La información sintetiza dos materiales entregados por la docente: *Ley Orgánica de Educación y sus Reformas* y *Fundamentos Legales, Principios y Fines de la Educación Superior en Panamá*. La rama de administración universitaria presenta conexiones interpretativas entre principios, fines y decisiones de gestión. Este trabajo **no verifica independientemente la vigencia actual** de todas las disposiciones citadas.

> El producto para Canvas es el PDF de una sola página; el proyecto web es el medio de elaboración y revisión.
