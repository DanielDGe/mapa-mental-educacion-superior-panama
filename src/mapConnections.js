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
export function getConnectionPath(section, index, geo) {
  const point = geo.nodes[index];
  if (!point) {
    throw new Error('No hay posición definida para ' + section.id + '/' + index);
  }
  const [endX, endY] = nodePin(point);

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
  const nearX = endX + (leftColumn ? -28 : -25);

  return 'M' + startX + ' ' + startY +
    ' C' + (startX + laneX) / 2 + ' ' + firstY +
    ' ' + laneX + ' ' + (firstY + direction * 6) +
    ' ' + laneX + ' ' + midY +
    ' C' + laneX + ' ' + (midY + direction * 28) +
    ' ' + laneX + ' ' + (lastY - direction * 28) +
    ' ' + laneX + ' ' + lastY +
    ' C' + laneX + ' ' + (lastY + direction * 21) +
    ' ' + nearX + ' ' + endY +
    ' ' + endX + ' ' + endY;
}
