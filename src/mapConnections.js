export const geometry = {
  legal: {
    hub: [550, 597], quadrant: 'top-left',
    nodes: [[84, 163], [480, 163], [84, 296], [480, 296], [84, 429], [480, 429]]
  },
  principios: {
    hub: [1450, 597], quadrant: 'top-right',
    nodes: [[1160, 163], [1570, 163], [1160, 296], [1570, 296], [1160, 429]]
  },
  fines: {
    hub: [550, 838], quadrant: 'bottom-left',
    nodes: [[84, 933], [480, 933], [84, 1060], [480, 1060], [84, 1164], [480, 1164], [728, 1253]]
  },
  gestion: {
    hub: [1450, 838], quadrant: 'bottom-right',
    nodes: [[1160, 933], [1570, 933], [1160, 1060], [1570, 1060], [1160, 1164], [1570, 1164]]
  }
};


/**
 * Rutas SVG del mapa mental.
 *
 * Cada conexión termina exactamente en el centro del pequeño nodo circular,
 * sin pasar por encima del texto. Las líneas utilizan corredores libres a los
 * lados de los conceptos para evitar recortes y cruces de etiquetas.
 */
const lanes = {
  legal: [45, 461],
  principios: [1128, 1552],
  fines: [45, 461],
  gestion: [1128, 1552]
};

export function nodePin([x, y]) {
  return [x - 1, y - 3];
}

/**
 * Curvas Bézier continuas: sin segmentos rectos ni esquinas de 90 grados.
 * La aproximación lateral llega hasta el centro del punto de cada concepto.
 */
export function getConnectionPath(section, index, geo, bend = null) {
  const point = geo.nodes[index];
  if (!point) {
    throw new Error('No hay posición definida para ' + section.id + '/' + index);
  }
  const [endX, endY] = nodePin(point);

  if (bend) {
    // Manual editing changes the shape, not either endpoint.
    const special = section.id === 'fines' && index === 6;
    const leftColumn = index % 2 === 0;
    const [startX, startY] = special
      ? nodePin(geo.nodes[5])
      : [geo.hub[0] + (leftColumn ? -114 : 114),
         geo.hub[1] + (geo.quadrant.startsWith('top') ? -40 : 40)];
    const [bx, by] = bend;
    const dx = endX - startX;
    const handle = Math.max(28, Math.min(100, Math.abs(dx) / 4));
    const t = dx < 0 ? -handle : handle;
    return 'M' + startX + ' ' + startY +
      ' C' + (startX + t) + ' ' + startY +
      ' ' + (bx - t) + ' ' + by +
      ' ' + bx + ' ' + by +
      ' C' + (bx + t) + ' ' + by +
      ' ' + (endX - t) + ' ' + endY +
      ' ' + endX + ' ' + endY;
  }

  // «Compromiso social» surge de «Conocimiento para servir». El inicio de
  // la curva queda detrás del fondo de la idea de origen; el tramo visible
  // emerge suavemente bajo ella y llega al nuevo nodo sin cruzar el texto.
  if (section.id === 'fines' && index === 6) {
    const [startX, startY] = nodePin(geo.nodes[5]);
    return 'M' + startX + ' ' + startY +
      ' C' + (startX + 12) + ' ' + (startY + 74) +
      ' ' + (endX - 116) + ' ' + (endY - 12) +
      ' ' + endX + ' ' + endY;
  }

  const top = geo.quadrant.startsWith('top');
  const leftColumn = index % 2 === 0;
  const laneX = lanes[section.id]?.[leftColumn ? 0 : 1];
  if (laneX == null) throw new Error('Rama desconocida: ' + section.id);

  const [hubX, hubY] = geo.hub;
  const startX = hubX + (leftColumn ? -114 : 114);
  const startY = hubY + (top ? -40 : 40);

  // Mantenemos las dos columnas de cada cuadrante, pero suavizamos su
  // recorrido mediante tres curvas que comparten una tangente vertical.
  // Se acercan al círculo por un costado, sin atravesar títulos o párrafos.
  const direction = top ? -1 : 1;
  const distance = Math.abs(endY - startY);
  const firstY = startY + direction * Math.min(56, distance * .29);
  const lastY = endY - direction * Math.min(37, distance * .25);
  const midY = (firstY + lastY) / 2;
  const turn = Math.min(18, Math.abs(lastY - midY) * .45);
  const entry = Math.min(20, Math.abs(endY - lastY) * .75);
  const nearX = endX - 27;

  return 'M' + startX + ' ' + startY +
    ' C' + (startX + laneX) / 2 + ' ' + firstY +
    ' ' + laneX + ' ' + (firstY + direction * 6) +
    ' ' + laneX + ' ' + midY +
    ' C' + laneX + ' ' + (midY + direction * turn) +
    ' ' + laneX + ' ' + (lastY - direction * turn) +
    ' ' + laneX + ' ' + lastY +
    ' C' + laneX + ' ' + (lastY + direction * entry) +
    ' ' + nearX + ' ' + endY +
    ' ' + endX + ' ' + endY;
}


export function getConnectionHandle(section, index, geo, custom = null) {
  if (custom) return [...custom];
  if (section.id === 'fines' && index === 6) {
    const source = nodePin(geo.nodes[5]);
    const end = nodePin(geo.nodes[6]);
    return [Math.round((source[0] + end[0]) / 2),
      Math.round((source[1] + end[1]) / 2 + 14)];
  }
  const point = nodePin(geo.nodes[index]);
  const left = index % 2 === 0;
  const laneX = lanes[section.id]?.[left ? 0 : 1];
  return [laneX ?? point[0], Math.round((geo.hub[1] + point[1]) / 2)];
}

export function getTrunkAnchors(geo) {
  const upper = geo.quadrant.startsWith('top');
  const left = geo.quadrant.endsWith('left');
  const from = [1000 + (left ? -208 : 208), 706 + (upper ? -53 : 65)];
  const to = [geo.hub[0] + (left ? 176 : -176),
    geo.hub[1] + (upper ? 13 : -9)];
  return [from, to];
}

export function getTrunkHandle(geo, custom = null) {
  if (custom) return [...custom];
  const [from, to] = getTrunkAnchors(geo);
  return [Math.round((from[0] + to[0]) / 2), Math.round((from[1] + to[1]) / 2)];
}

export function getTrunkPath(geo, custom = null) {
  const [from, to] = getTrunkAnchors(geo);
  const [sx, sy] = from, [ex, ey] = to;
  if (!custom) {
    const mx = (sx + ex) / 2;
    return 'M' + sx + ' ' + sy +
      ' C' + mx + ' ' + sy + ' ' + mx + ' ' + ey + ' ' + ex + ' ' + ey;
  }
  const [bx, by] = custom;
  return 'M' + sx + ' ' + sy +
    ' C' + ((sx + bx) / 2) + ' ' + sy +
    ' ' + bx + ' ' + ((sy + by) / 2) +
    ' ' + bx + ' ' + by +
    ' C' + bx + ' ' + ((by + ey) / 2) +
    ' ' + ((ex + bx) / 2) + ' ' + ey +
    ' ' + ex + ' ' + ey;
}
