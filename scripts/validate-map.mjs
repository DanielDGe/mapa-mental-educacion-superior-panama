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
if (all !== 24) failures.push('Se esperaban 24 conceptos, se encontraron ' + all);
if (compact < 20) failures.push('Menos de 20 conceptos tienen texto compacto (2 líneas).');
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('Contenido validado: 4 ramas, 24 conceptos, ' + compact + ' textos compactos y fuentes completas.');
