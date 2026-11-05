import assert from 'node:assert/strict';
import { sections } from '../src/data.js';
import { geometry, getConnectionPath, nodePin } from '../src/mapConnections.js';

let checked = 0;
const seen = new Set();

for (const section of sections) {
  const positions = geometry[section.id];
  assert.ok(positions, 'Faltan coordenadas para ' + section.id);
  assert.equal(section.items.length, positions.nodes.length,
    'Número de nodos inconsistente en ' + section.id);

  for (let i = 0; i < section.items.length; i++) {
    const item = section.items[i];
    const coordinates = positions.nodes[i];
    const [x, y] = nodePin(coordinates);
    const d = getConnectionPath(section, i, positions);

    assert.ok(!seen.has(item.id), 'Identificador duplicado: ' + item.id);
    seen.add(item.id);
    assert.ok(Number.isFinite(x) && Number.isFinite(y), 'Coordenadas no válidas: ' + item.id);
    assert.ok(x > 0 && x < 2000 && y > 0 && y < 1344,
      'Nodo fuera de la lámina o sobre las referencias: ' + item.id);
    assert.ok(d.startsWith('M') && !d.includes('NaN') && !d.includes('undefined'),
      'Trazado SVG incorrecto para ' + item.id);

    // La ruta termina en el centro del círculo que dibuja MindMap.jsx:
    // esa correspondencia evita que la línea parezca cortada.
    assert.ok(d.endsWith(x + ' ' + y),
      'El conector no llega al nodo de ' + item.id);

    checked++;
  }
}

const fines = geometry.fines;
const compromiso = fines.nodes[6];
const conocimiento = fines.nodes[5];
const specialPath = getConnectionPath(sections.find(s => s.id === 'fines'), 6, fines);
const [sourceX, sourceY] = nodePin(conocimiento);
assert.ok(specialPath.startsWith('M' + sourceX + ' ' + sourceY),
  'Compromiso social debe surgir de Conocimiento para servir');
assert.ok(compromiso[1] < 1270,
  'Compromiso social debe acercarse al resto de la rama');
assert.ok(compromiso[1] + 62 < 1344,
  'Debe quedar espacio para las referencias al pie');
assert.equal(checked, 24);
console.log('Conectores validados: 24/24 anclados al círculo; compromiso social integrado.');
