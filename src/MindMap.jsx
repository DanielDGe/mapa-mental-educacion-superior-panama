import React from 'react';
import { metadata, sections } from './data.js';
import { getConnectionPath } from './mapConnections.js';

// SVG autónomo: todo el contenido permanece visible al descargar PNG o PDF.
// Cada idea lleva una frase natural y suficiente para comprenderla sin el panel lateral.
const WIDTH = 2000;
const HEIGHT = 1414;
const CENTER = [1000, 706];

const geometry = {
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
    nodes: [[84, 933], [480, 933], [84, 1060], [480, 1060], [84, 1164], [480, 1164], [805, 1253]]
  },
  gestion: {
    hub: [1450, 838], quadrant: 'bottom-right',
    nodes: [[1160, 933], [1570, 933], [1160, 1060], [1570, 1060], [1160, 1164], [1570, 1164]]
  }
};

const headings = {
  legal: ['Fundamentos', 'legales'],
  principios: ['Principios', 'educativos'],
  fines: ['Fines de la', 'educación'],
  gestion: ['Administración', 'universitaria']
};

// El ancho estimado admite unas 48 letras por línea; la división se realiza
// por palabras, de modo que no se corta ni se reemplaza el texto original.
function wrapSentence(text, fontSize = 16.2, maxWidth = 343) {
  const words = text.trim().split(/\s+/);
  const context = typeof document === 'undefined'
    ? null
    : document.createElement('canvas').getContext('2d');
  if (context) context.font = fontSize + 'px Arial';
  const measure = value => context
    ? context.measureText(value).width
    : value.length * fontSize * .52;
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? line + ' ' + word : word;
    if (line && measure(next) > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function SectionSymbol({ id, x, y, section }) {
  const common = { fill: 'none', stroke: section.ink, strokeWidth: 2.7,
    strokeLinecap: 'round', strokeLinejoin: 'round' };
  const art = {
    legal: <><path d="M-23-5 0-19 23-5M-20 18H20M-16 0V14M-5 0V14M6 0V14M17 0V14M-24 23H24"/></>,
    principios: <><path d="M-13-7a13 13 0 0 1 26 0c0 7-8 12-8 17h-10c0-5-8-10-8-17M-7 16H7M-5 21H5"/></>,
    fines: <><circle r="19"/><circle r="11"/><circle r="3" fill={section.ink} stroke="none"/><path d="M0-28V-19M0 19V28M-28 0h9M19 0h9"/></>,
    gestion: <><rect x="-8" y="-22" width="16" height="12" rx="2"/><rect x="-25" y="10" width="15" height="13" rx="2"/><rect x="10" y="10" width="15" height="13" rx="2"/><path d="M0-10V2M-18 10V2H18V10"/></>
  };
  return (
    <g transform={'translate(' + x + ' ' + y + ')'} {...common}>
      <circle r="39" fill={section.pale} stroke={section.color} strokeWidth="2.1"/>
      {art[id]}
    </g>
  );
}

function Trunk({ section, dim }) {
  const { hub, quadrant } = geometry[section.id];
  const upper = quadrant.startsWith('top');
  const left = quadrant.endsWith('left');
  const fromX = CENTER[0] + (left ? -208 : 208);
  const fromY = CENTER[1] + (upper ? -53 : 65);
  const endX = hub[0] + (left ? 176 : -176);
  const endY = hub[1] + (upper ? 13 : -9);
  const midpoint = (fromX + endX) / 2;
  const d = 'M' + fromX + ' ' + fromY +
    ' C' + midpoint + ' ' + fromY +
    ' ' + midpoint + ' ' + endY + ' ' + endX + ' ' + endY;
  return (
    <g data-filterable="true" opacity={dim ? '.20' : '1'}>
      <path d={d} stroke={section.pale} strokeWidth="17" fill="none" strokeLinecap="round"/>
      <path d={d} stroke={section.color} strokeWidth="7.2" fill="none" strokeLinecap="round"/>
    </g>
  );
}

function Twig({ section, index }) {
  const geo = geometry[section.id];
  // Las curvas atraviesan corredores vacíos y terminan en el mismo punto que
  // el círculo del concepto. No usamos máscaras que oculten su tramo final.
  const d = getConnectionPath(section, index, geo);
  return (
    <path d={d} fill="none" stroke={section.color}
      strokeWidth={section.id === 'fines' && index === 6 ? 2.1 : 1.65}
      opacity={section.id === 'fines' && index === 6 ? '.47' : '.32'}
      strokeLinecap="round" strokeLinejoin="round"/>
  );
}

function Concept({ item, section, coords, selectedId, onSelect }) {
  const [x, y] = coords;
  const small = item.id === 'compromiso';
  const boxWidth = small ? 310 : 345;
  const fontSize = small ? 16 : 16.8;
  const lines = wrapSentence(item.mapText || item.short, fontSize, small ? 298 : 343);
  const selected = selectedId === item.id;
  const boxHeight = lines.length > 2 ? 111 : 92;
  return (
    <g role="button" tabIndex={0}
      aria-label={item.title + '. ' + (item.mapText || item.short)}
      onClick={() => onSelect(item.id)}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); onSelect(item.id);
        }
      }}
      style={{ cursor: 'pointer' }}>
      <title>{item.title}. {item.mapText || item.short}</title>
      <rect x={x + 11} y={y - 25} width={boxWidth + 16}
        height={boxHeight} rx="13"
        fill={selected ? section.pale : '#fcfaf5'}
        stroke={selected ? section.color : 'none'}
        strokeWidth={selected ? 2.6 : 0} />
      <circle cx={x - 1} cy={y - 3} r="8.4"
        fill="#fcfaf5" stroke={section.color} strokeWidth="2.6"/>
      <circle cx={x - 1} cy={y - 3} r="2.7" fill={section.color}/>
      <text x={x + 16} y={y + 3} fontFamily="Arial, sans-serif" fontSize="20.5"
        fontWeight="730" fill="#233949"
        letterSpacing="-.42">{item.title}</text>
      <path d={'M' + (x + 16) + ' ' + (y + 12) + 'h' + (small ? 142 : 164)}
        stroke={section.color} opacity=".25" strokeWidth="1.5" />
      <text x={x + 16} y={y + 32} fontFamily="Arial, sans-serif" fontSize={fontSize}
        fontWeight="440" fill="#4e5e68" letterSpacing="-.04">
        {lines.map((line, i) =>
          <tspan key={i} x={x + 16} dy={i === 0 ? 0 : 22}>{line}</tspan>)}
      </text>
    </g>
  );
}

function Hub({ section }) {
  const [cx, cy] = geometry[section.id].hub;
  const [line1, line2] = headings[section.id];
  const rightTitle = section.id === 'gestion';
  const font = rightTitle ? 26.5 : 29;
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx="195" ry="58" fill={section.pale} opacity=".85"/>
      <ellipse cx={cx} cy={cy} rx="187" ry="52"
        fill="#fffefa" stroke={section.color} strokeWidth="2.4"/>
      <SectionSymbol section={section} id={section.id} x={cx - 133} y={cy}/>
      <text x={cx + 27} y={cy - 8} fontFamily="Georgia, 'Times New Roman', serif"
        fontSize={font} fontWeight="730" fill={section.ink}
        textAnchor="middle" letterSpacing="-.6">{line1}</text>
      <text x={cx + 27} y={cy + 25} fontFamily="Georgia, 'Times New Roman', serif"
        fontSize={font} fontWeight="730" fill={section.ink}
        textAnchor="middle" letterSpacing="-.6">{line2}</text>
    </g>
  );
}

function Section({ section, focus, selectedId, onSelect }) {
  const dim = focus !== 'all' && focus !== section.id;
  const geo = geometry[section.id];
  return (
    <g data-filterable="true" opacity={dim ? '.20' : '1'}>
      {section.items.map((_,i) =>
        <Twig section={section} index={i} key={i}/>)}
      <Hub section={section}/>
      {section.items.map((item,i) =>
        <Concept key={item.id} item={item} section={section}
          coords={geo.nodes[i]} selectedId={selectedId} onSelect={onSelect}/>)}
    </g>
  );
}

export default function MindMap({ selectedId, focus, onSelect }) {
  return (
    <svg id="mental-map-svg" xmlns="http://www.w3.org/2000/svg"
      width={WIDTH} height={HEIGHT} viewBox={'0 0 ' + WIDTH + ' ' + HEIGHT}
      role="img" aria-label="Administración de la educación superior en Panamá. Mapa mental con cuatro ramas y explicaciones resumidas en cada concepto."
      style={{ display: 'block', width: '100%', height: 'auto', background: '#fcfaf5' }}>
      <defs>
        <pattern id="paper-grain" width="34" height="34" patternUnits="userSpaceOnUse">
          <circle cx="1.1" cy="1.1" r=".75" fill="#c9c2b4" opacity=".22"/>
        </pattern>
      </defs>
      <rect width={WIDTH} height={HEIGHT} fill="#fcfaf5"/>
      <rect width={WIDTH} height={HEIGHT} fill="url(#paper-grain)"/>
      <text x="85" y="64" fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="23" fontWeight="700" fontStyle="italic"
        fill="#244356">Educación superior en Panamá</text>
      <text x={WIDTH - 85} y="64" textAnchor="end"
        fontSize="14" fontWeight="700" letterSpacing="2.1"
        fill="#788793">UNIDAD II · MAPA MENTAL DIGITAL</text>
      <text x="85" y="93" fontSize="12.7" letterSpacing="1.55"
        fill="#8b979e">LEGISLACIÓN · PRINCIPIOS · FINES · GESTIÓN UNIVERSITARIA</text>
      <path d="M84 113H1916" stroke="#dcd7cd" strokeWidth="2"/>

      {sections.map(s =>
        <Trunk key={'trunk-' + s.id} section={s}
          dim={focus !== 'all' && focus !== s.id}/>)}
      {sections.map(s =>
        <Section key={s.id} section={s} focus={focus}
          selectedId={selectedId} onSelect={onSelect}/>)}

      <g>
        <ellipse cx="1000" cy="710" rx="225" ry="142"
          fill="#fff1d9" stroke="#e5d2b4" strokeWidth="4"/>
        <ellipse cx="1000" cy="710" rx="211" ry="130" fill="#183d4e"/>
        <path d="M843 636Q1000 599 1157 636"
          fill="none" stroke="#7ea8ac" strokeWidth="2.1" opacity=".42"/>
        <text x="1000" y="651" textAnchor="middle" fill="#b9dcd3"
          fontSize="16.5" fontWeight="680" letterSpacing="2.4">CONCEPTO CENTRAL</text>
        <text x="1000" y="695" textAnchor="middle" fill="#fffaf0"
          fontFamily="Georgia, 'Times New Roman', serif" fontSize="30.5"
          fontWeight="700">Administración de la</text>
        <text x="1000" y="732" textAnchor="middle" fill="#fffaf0"
          fontFamily="Georgia, 'Times New Roman', serif" fontSize="33"
          fontWeight="700">Educación Superior</text>
        <text x="1000" y="769" textAnchor="middle" fill="#cde8d8"
          fontSize="23.5" fontWeight="650">en Panamá</text>
      </g>

      <g>
        <path d="M879 915Q1000 905 1121 915" fill="none"
          stroke="#c9c0ae" strokeWidth="1.6"/>
        <text x="1000" y="952" textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="19" fontStyle="italic" fill="#5a6763">
          La ley orienta; los principios guían.
        </text>
        <text x="1000" y="978" textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="19" fontStyle="italic" fill="#5a6763">
          Los fines inspiran; la gestión actúa.
        </text>
      </g>

      <path d="M84 1344H1916" stroke="#dcd7cd" strokeWidth="2"/>
      <text x="85" y="1370" fill="#3d5865" fontSize="14.5" fontWeight="680">
        Fuentes: Ley Orgánica de Educación y sus Reformas; Fundamentos Legales, Principios y Fines de la Educación Superior en Panamá.
      </text>
      <text x="85" y="1392" fill="#819092" fontSize="12.9">
        Síntesis basada en los materiales de clase. Los ejemplos de gestión son interpretaciones académicas.
      </text>
      <text x="1915" y="1390" textAnchor="end" fill="#536678" fontSize="14.5"
        fontFamily="Georgia, 'Times New Roman', serif" fontStyle="italic">{metadata.author}</text>
    </svg>
  );
}
