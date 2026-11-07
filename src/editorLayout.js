import { geometry } from './mapConnections.js';

// Layout editing never mutates the academic content or the source geometry.
export const EDITOR_STORAGE_KEY = 'panama-higher-ed-mindmap-layout:v1';
export const EDITOR_LAYOUT_VERSION = 1;

// El fondo forma parte del diseño exportable, sin modificar las coordenadas.
export const MAP_BACKGROUNDS = Object.freeze({
  paper: '#fcfaf5',
  white: '#ffffff'
});
export const DEFAULT_MAP_BACKGROUND = 'paper';

export function setLayoutBackground(layout, background) {
  if (!Object.hasOwn(MAP_BACKGROUNDS, background)) {
    throw new Error('Fondo de mapa no reconocido.');
  }
  return { ...layout, background };
}

export function defaultLayout() {
  return {
    version: EDITOR_LAYOUT_VERSION,
    background: DEFAULT_MAP_BACKGROUND,
    hubs: Object.fromEntries(Object.entries(geometry).map(([id, g]) => [id, [...g.hub]])),
    nodes: Object.fromEntries(Object.entries(geometry).map(([id, g]) => [
      id, g.nodes.map(point => [...point])
    ])),
    bends: {},
    trunks: {}
  };
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function safePoint(value, fallback, minX, maxX, minY, maxY) {
  if (!Array.isArray(value) || value.length !== 2 ||
      !value.every(n => typeof n === 'number' && Number.isFinite(n))) {
    return [...fallback];
  }
  return [
    clamp(Math.round(value[0] * 10) / 10, minX, maxX),
    clamp(Math.round(value[1] * 10) / 10, minY, maxY)
  ];
}

export function normalizeLayout(value) {
  const base = defaultLayout();
  if (!value || typeof value !== 'object' || value.version !== EDITOR_LAYOUT_VERSION) {
    return base;
  }
  base.background = Object.hasOwn(MAP_BACKGROUNDS, value.background)
    ? value.background
    : DEFAULT_MAP_BACKGROUND;
  for (const [id, geo] of Object.entries(geometry)) {
    base.hubs[id] = safePoint(value.hubs?.[id], geo.hub, 275, 1725, 220, 1150);
    base.nodes[id] = geo.nodes.map((point, index) =>
      safePoint(value.nodes?.[id]?.[index], point, 56, 1640, 137, 1270));
    const rawBends = value.bends?.[id];
    if (rawBends && typeof rawBends === 'object') {
      base.bends[id] = {};
      for (const index of Object.keys(rawBends)) {
        const i = Number(index);
        if (!Number.isInteger(i) || i < 0 || i >= geo.nodes.length) continue;
        const p = rawBends[index];
        if (Array.isArray(p) && p.length === 2 && p.every(Number.isFinite)) {
          base.bends[id][index] = safePoint(p, p, 25, 1975, 110, 1320);
        }
      }
    }
    if (Array.isArray(value.trunks?.[id])) {
      const p = value.trunks[id];
      if (p.length === 2 && p.every(Number.isFinite)) {
        base.trunks[id] = safePoint(p, p, 200, 1800, 220, 1190);
      }
    }
  }
  return base;
}

export function layoutGeometry(layout, sectionId) {
  const src = geometry[sectionId];
  return { ...src, hub: layout.hubs[sectionId], nodes: layout.nodes[sectionId] };
}

export function moveLayoutPoint(layout, target, dx, dy) {
  const next = structuredClone(layout);
  const { type, sectionId, index } = target;
  const moved = (p, limits) => safePoint(
    [p[0] + dx, p[1] + dy], p, ...limits
  );

  if (type === 'node') {
    const prev = layout.nodes[sectionId][index];
    next.nodes[sectionId][index] = moved(prev, [56, 1640, 137, 1270]);
  } else if (type === 'hub') {
    next.hubs[sectionId] = moved(layout.hubs[sectionId], [275, 1725, 220, 1150]);
  } else if (type === 'bend') {
    if (!next.bends[sectionId]) next.bends[sectionId] = {};
    const start = target.startPoint;
    next.bends[sectionId][index] = moved(start, [25, 1975, 110, 1320]);
  } else if (type === 'trunk') {
    const start = target.startPoint;
    next.trunks[sectionId] = moved(start, [200, 1800, 220, 1190]);
  }
  return next;
}

export function readSavedLayout() {
  try {
    const text = localStorage.getItem(EDITOR_STORAGE_KEY);
    return text ? normalizeLayout(JSON.parse(text)) : defaultLayout();
  } catch {
    return defaultLayout();
  }
}

export function writeSavedLayout(layout) {
  try {
    localStorage.setItem(EDITOR_STORAGE_KEY, JSON.stringify(normalizeLayout(layout)));
    return true;
  } catch {
    return false;
  }
}

export function exportLayoutFile(layout) {
  return JSON.stringify(normalizeLayout(layout), null, 2) + '\n';
}

export function importLayoutFile(text) {
  const obj = JSON.parse(text);
  if (obj?.version !== EDITOR_LAYOUT_VERSION || !obj.nodes || !obj.hubs ||
    typeof obj.nodes !== 'object' || typeof obj.hubs !== 'object') {
    throw new Error('El archivo no contiene una distribución compatible.');
  }
  return normalizeLayout(obj);
}
