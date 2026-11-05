import { sections } from '../src/data.js';

function wrapWords(text, limit = 42) {
  const lines = [];
  let current = '';
  for (const word of text.trim().split(/\s+/)) {
    const candidate = current ? current + ' ' + word : word;
    if (candidate.length > limit && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

const counts = new Map([
  ['legal', 6],
  ['principios', 5],
  ['fines', 7],
  ['gestion', 6]
]);
const ids = new Set();
let all = 0;
let compact = 0;
const failures = [];

for (const section of sections) {
  if (!counts.has(section.id)) failures.push('Rama desconocida: ' + section.id);
  if (section.items.length !== counts.get(section.id))
    failures.push('Cantidad incorrecta en ' + section.id);
  for (const item of section.items) {
    all++;
    if (ids.has(item.id)) failures.push('ID duplicado: ' + item.id);
    ids.add(item.id);
    if (!item.mapText || !/[.!?]$/.test(item.mapText.trim()))
      failures.push('Explicación incompleta: ' + item.id);
    else {
      const approximateLines = wrapWords(
        item.mapText,
        item.id === 'compromiso' ? 36 : 41
      ).length;
      if (approximateLines > 3)
        failures.push('La explicación supera tres líneas aproximadas: ' + item.id);
      if (approximateLines <= 2) compact++;
    }
    if (!item.detail || !item.relation || !item.source)
      failures.push('Faltan notas de estudio o fuentes en: ' + item.id);
  }
}
// Referencias del material de la Unidad II y aplicaciones prácticas de los fines.
const byId = Object.fromEntries(sections.flatMap(section => section.items.map(item => [item.id, item])));
const expected = {
  constitucion: ['91', '92', '93', '96'],
  ley47: ['47', '1946', '34', '1995'],
  regimen: ['art. 6'],
  articulos: ['59', '62'],
  privadas: ['16', '1963'],
  complementarias: ['161', '1996', '50', '1999', '1139', '1141', '1998'],
  excelencia: ['evaluación', 'mejora'],
  derechos: ['apoyo estudiantil', 'trato justo'],
  innovacion: ['actualización curricular']
};
for (const [id, fragments] of Object.entries(expected)) {
  for (const fragment of fragments) {
    if (!byId[id]?.mapText.includes(fragment))
      failures.push('Falta una referencia o aplicación en ' + id + ': ' + fragment);
  }
}
if (all !== 24) failures.push('Se esperaban 24 conceptos, se encontraron ' + all);
if (compact < 20) failures.push('Menos de 20 conceptos tienen texto compacto (2 líneas).');
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('Contenido validado: 4 ramas, 24 conceptos, ' + compact + ' textos compactos y fuentes completas.');
