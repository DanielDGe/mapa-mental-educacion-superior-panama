import assert from 'node:assert/strict';
import {
  defaultLayout, normalizeLayout, layoutGeometry, moveLayoutPoint,
  exportLayoutFile, importLayoutFile,
  MAP_BACKGROUNDS, DEFAULT_MAP_BACKGROUND, setLayoutBackground
} from '../src/editorLayout.js';
import {
  geometry, nodePin, getConnectionPath,
  getConnectionHandle, getTrunkPath, getTrunkHandle
} from '../src/mapConnections.js';
import { sections } from '../src/data.js';

const initial = defaultLayout();
assert.equal(initial.version, 1);
assert.equal(initial.background, DEFAULT_MAP_BACKGROUND);
assert.equal(MAP_BACKGROUNDS.white, '#ffffff');
assert.equal(MAP_BACKGROUNDS.paper, '#fcfaf5');

const whiteLayout = setLayoutBackground(initial, 'white');
assert.equal(whiteLayout.background, 'white');
assert.equal(initial.background, 'paper', 'Cambiar el fondo no debe mutar el estado original');
assert.deepEqual(whiteLayout.nodes, initial.nodes, 'Cambiar el fondo no mueve conceptos');
assert.deepEqual(whiteLayout.hubs, initial.hubs, 'Cambiar el fondo no mueve ramas');
assert.throws(() => setLayoutBackground(initial, 'pink'));
assert.equal(importLayoutFile(exportLayoutFile(whiteLayout)).background, 'white');
const legacy = structuredClone(initial);
delete legacy.background;
assert.equal(normalizeLayout(legacy).background, 'paper',
  'Los diseños JSON anteriores deben conservarse y usar fondo papel');
assert.equal(Object.keys(initial.nodes).length, 4);
assert.equal(sections.reduce((sum, s) => sum + initial.nodes[s.id].length, 0), 24);

for (const section of sections) {
  const before = layoutGeometry(initial, section.id);
  assert.deepEqual(before.nodes, geometry[section.id].nodes);
  assert.deepEqual(before.hub, geometry[section.id].hub);
}

const moved = moveLayoutPoint(initial,
  { type: 'node', sectionId: 'legal', index: 2 }, 30, 21);
assert.deepEqual(moved.nodes.legal[2],
  [initial.nodes.legal[2][0] + 30, initial.nodes.legal[2][1] + 21]);
assert.deepEqual(initial.nodes.legal[2], geometry.legal.nodes[2],
  'El layout original no debe mutar');

const movedHub = moveLayoutPoint(moved,
  { type: 'hub', sectionId: 'legal' }, -14, 18);
assert.deepEqual(movedHub.hubs.legal,
  [initial.hubs.legal[0] - 14, initial.hubs.legal[1] + 18]);

const fin = sections.find(s => s.id === 'fines');
const finesGeo = layoutGeometry(initial, 'fines');
const manualBend = [620, 1220];
const customPath = getConnectionPath(fin, 6, finesGeo, manualBend);
const [endX, endY] = nodePin(finesGeo.nodes[6]);
assert.ok(customPath.startsWith('M'));
assert.ok(customPath.endsWith(endX + ' ' + endY),
  'Mover el tirador no debe desconectar el nodo');
assert.equal((customPath.match(/ C/g) || []).length, 2);
assert.deepEqual(getConnectionHandle(fin, 6, finesGeo, manualBend), manualBend);

const bent = moveLayoutPoint(initial, {
  type: 'bend', sectionId: 'fines', index: 6,
  startPoint: getConnectionHandle(fin, 6, finesGeo)
}, 16, -20);
assert.equal(Object.keys(bent.bends.fines).length, 1);
const bendPath = getConnectionPath(fin, 6, finesGeo, bent.bends.fines[6]);
assert.ok(bendPath.endsWith(endX + ' ' + endY));

const geo = layoutGeometry(initial, 'gestion');
const trunk = moveLayoutPoint(initial, {
  type: 'trunk', sectionId: 'gestion',
  startPoint: getTrunkHandle(geo)
}, -25, 16);
assert.ok(trunk.trunks.gestion);
const customTrunk = getTrunkPath(geo, trunk.trunks.gestion);
assert.ok(customTrunk.includes(' C'));

const saved = exportLayoutFile(trunk);
assert.deepEqual(importLayoutFile(saved), normalizeLayout(trunk));
assert.throws(() => importLayoutFile('{"version":999}'));
assert.deepEqual(normalizeLayout({}), defaultLayout());
assert.equal(normalizeLayout({
  ...initial, nodes: { ...initial.nodes, legal: [[Infinity, NaN]] }
}).nodes.legal.length, 6);

console.log('Editor validado: 24 nodos, 4 ramas, fondos blanco/papel, curvas y respaldos JSON compatibles.');
