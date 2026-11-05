# Administración de la Educación Superior en Panamá

Mapa mental digital para la **Actividad Individual N.º 2 · Unidad Didáctica II**, Maestría en Docencia Superior.

Este repositorio contiene la aplicación React con dos propuestas de diseño:

- **main:** primera versión del mapa con esquema de cuatro paneles.
- **feature/editorial-organic-mindmap:** rediseño orgánico, radial y editorial para la entrega académica.

## Vista editorial (rama de trabajo)

La segunda propuesta da protagonismo al mapa y evita el aspecto de tablero administrativo:
- Ramas curvas dibujadas en SVG, con nodos de lectura libre y jerarquías visuales.
- Cuatro grupos interrelacionados y distribución asimétrica: 6 fundamentos, 5 principios, 7 fines y 6 elementos de gestión.
- Paleta inspirada en papel, tinta y acentos sobrios.
- Cada uno de los 24 conceptos incorpora una explicación natural de hasta tres líneas, legible sin abrir la **Guía de lectura**.
- La guía web amplía cada tema y muestra su relación con la administración universitaria.
- Navegación, filtrado por rama, zoom, búsqueda y exportación vectorial o raster.

**Nota:** el traslado de «Compromiso social» a la rama de fines es una decisión de organización conceptual; su explicación está fundamentada en los dos materiales de clase.

## Prueba local

Requiere Node.js 18 o superior y npm.

~~~powershell
git clone https://github.com/DanielDGe/mapa-mental-educacion-superior-panama.git
cd mapa-mental-educacion-superior-panama
git switch feature/editorial-organic-mindmap
npm install
npm run dev
~~~

Si ya tienes el repositorio descargado:

~~~powershell
git fetch origin
git switch feature/editorial-organic-mindmap
npm install
npm run dev
~~~

Vite muestra la dirección para abrir la aplicación (normalmente http://localhost:5173).

## Editor visual: ajustar la distribución a tu gusto

La aplicación dispone de **Editar mapa** encima de la lámina. Al activarlo:

1. **Mover conceptos:** arrastra el nombre de un concepto, el círculo o su párrafo. El título y su explicación se desplazan juntos, sin cambiar de categoría.
2. **Mover ramas:** arrastra los óvalos grandes de colores. Sus conexiones principales y secundarias se actualizan automáticamente.
3. **Mover y curvar líneas:** haz clic y arrastra una conexión. Aparecerá un pequeño círculo de control en la conexión seleccionada; también puedes arrastrar ese círculo para ajustar el recorrido. Las líneas siguen ancladas a sus conceptos.
4. **Deshacer:** recupera el estado anterior al último movimiento.
5. **Restaurar:** vuelve a la distribución original. Puedes deshacerlo.
6. **Guardar JSON:** descarga tu distribución actual como archivo para respaldo.
7. **Cargar JSON:** importa un diseño guardado anteriormente para seguir trabajando.
8. **Terminar edición:** regresa al modo lectura y conserva tus posiciones.

Los cambios **se guardan automáticamente en el almacenamiento local de ese navegador**, incluso al recargar la página. No se envían a un servidor ni a GitHub. Si deseas trabajar en otro equipo, guardar un respaldo o evitar perderlos al limpiar los datos del navegador, usa **Guardar JSON** y guárdalo fuera de la carpeta temporal.

El editor solo cambia **posiciones y curvas**. No altera los 24 conceptos, sus explicaciones, las fuentes ni los colores. Los tiradores de edición se omiten en SVG, PNG y PDF.

## PDF para entregar en Canvas

1. Abre la aplicación y revisa el mapa completo.
2. Haz clic en **Exportar PDF**.
3. En el diálogo de impresión del navegador, elige **Guardar como PDF**.
4. Configura tamaño **A3**, orientación **horizontal**, márgenes **ninguno**, escala **100 %** y **gráficos de fondo** activados.
5. Comprueba en la vista previa que el mapa ocupa **una sola página** y que el texto se ve legible.
6. Comprueba que se ven los títulos y las frases de todos los conceptos, sin necesidad de hacer clic.
7. Guarda el documento para subirlo a Canvas.

Desde los controles inferiores puedes descargar también **SVG** o **PNG** de alta resolución. Para la entrega, el formato solicitado por la profesora es PDF.

## Comandos

~~~bash
npm run dev
npm test
npm run build
npm run preview
~~~

## Estructura

- \`src/data.js\`: conceptos, textos de apoyo, relaciones administrativas y fuentes.
- \`src/MindMap.jsx\`: mapa SVG original, conexiones y nodos interactivos.
- \`src/App.jsx\`: experiencia de usuario, guía desplegable, búsqueda, zoom y exportación.
- \`src/styles.css\`: estilo editorial responsive y formato de impresión A3.

## Fuentes y límites

El contenido está basado en dos documentos suministrados en la asignatura:

1. *Ley Orgánica de Educación y sus Reformas*.
2. *Fundamentos Legales, Principios y Fines de la Educación Superior en Panamá*.

La rama de administración universitaria sintetiza **aplicaciones e interpretaciones didácticas** de esas fuentes. Este trabajo no pretende ser una comprobación jurídica independiente ni acreditar la vigencia actual de toda la normativa citada.

> El código es una herramienta para preparar la actividad; el producto entregable es el mapa mental en PDF.
