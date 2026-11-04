import React from 'react';
import { metadata, sections } from './data.js';

/*
 * Original, deliberately asymmetric composition.
 * The lines form four living branches and end in simple typographic leaves:
 * no dashboard cards, repeated boxes or externally loaded images.
 *
 * The SVG remains self-contained, so it can be exported without a dependency
 * on CSS, icon fonts or a canvas-rendering library.
 */
const WIDTH = 1800;
const HEIGHT = 1272;

const layout = {
  legal: {
    root: [410, 350], heading: [410, 350], side: 'left', tier: 'top',
    nodes: [
      [105, 175], [440, 175],
      [95, 270], [440, 270],
      [105, 465], [440, 465]
    ]
  },
  principios: {
    root: [1390, 350], heading: [1390, 350], side: 'right', tier: 'top',
    nodes: [
      [1205, 175], [1540, 175],
      [1205, 270], [1540, 270],
      [1205, 465], [1540, 465]
    ]
  },
  fines: {
    root: [410, 983], heading: [410, 983], side: 'left', tier: 'bottom',
    nodes: [
      [110, 800], [395, 800],
      [95, 895], [395, 895],
      [110, 1088], [395, 1088], [675, 1143]
    ]
  },
  gestion: {
    root: [1390, 983], heading: [1390, 983], side: 'right', tier: 'bottom',
    nodes: [
      [1200, 800], [1530, 800],
      [1200, 895], [1530, 895],
      [1200, 1088], [1530, 1088]
    ]
  }
};

const headingParts = {
  legal: ['Fundamentos', 'legales'],
  principios: ['Principios', 'educativos'],
  fines: ['Fines de la', 'educación'],
  gestion: ['Administración', 'universitaria']
};

function BranchSymbol({ section, x, y }) {
  const p = {
    legal: <><path d="M-19 -2L0 -15 19 -2M-17 16H17M-13 2V13M-4 2V13M5 2V13M14 2V13M-20 20H20" /></>,
    principios: <><path d="M-11 -3a11 11 0 0 1 22 0c0 6-7 9-7 15H-4c0-6-7-9-7-15M-6 17H6M-4 21H4M0-22v-5M-17-16l-5-5M17-16l5-5" /></>,
    fines: <><circle cx="0" cy="0" r="16"/><circle cx="0" cy="0" r="8"/><circle cx="0" cy="0" r="2" fill="currentColor" stroke="none"/><path d="M0-23v10M0 13v10M-23 0h10M13 0h10" /></>,
    gestion: <><rect x="-6" y="-20" width="12" height="10" rx="2"/><rect x="-23" y="10" width="12" height="10" rx="2"/><rect x="11" y="10" width="12" height="10" rx="2"/><path d="M0-10V2M-17 10V2H17V10" /></>
  };
  return (
    <g transform={'translate(' + x + ' ' + y + ')'}
      color={section.ink} fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round">
      <circle r="34" fill={section.pale} stroke={section.color} strokeWidth="1.6" />
      {p[section.id]}
    </g>
  );
}

function MainCurve({ section, focus }) {
  const paths = {
    legal: 'M749 557 C692 535 637 462 544 402 S460 355 410 350',
    principios: 'M1051 557 C1108 535 1164 461 1258 404 S1340 355 1390 350',
    fines: 'M749 729 C707 758 703 842 685 914 S540 1015 410 983',
    gestion: 'M1051 729 C1093 758 1097 842 1115 914 S1260 1015 1390 983'
  };
  const faded = focus !== 'all' && focus !== section.id;
  return (
    <g data-filterable="true" opacity={faded ? .18 : 1} style={{ transition: 'opacity 200ms ease' }}>
      <path d={paths[section.id]} stroke={section.pale} strokeWidth="26"
        strokeLinecap="round" fill="none"/>
      <path d={paths[section.id]} stroke={section.color} strokeWidth="9"
        strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx={layout[section.id].root[0]} cy={layout[section.id].root[1]}
        r="11" fill={section.color}/>
      <circle cx={layout[section.id].root[0]} cy={layout[section.id].root[1]}
        r="4" fill="#fff" opacity=".85"/>
    </g>
  );
}

function ThinCurve({ from, to, side, color, index }) {
  const distance = side === 'left' ? 1 : -1;
  const bend = index % 2 === 0 ? -14 : 14;
  const midX = (from[0] + to[0]) / 2;
  const path = 'M' + from[0] + ' ' + from[1] +
    ' C' + (from[0] - distance * 68) + ' ' + (from[1] + bend) +
    ' ' + (midX + bend) + ' ' + (to[1] - 13) +
    ' ' + to[0] + ' ' + (to[1] - 13);
  return <path d={path} fill="none" stroke={color} strokeWidth={index % 3 === 1 ? 3 : 2.5}
    opacity=".47" strokeLinecap="round" />;
}

function Leaf({ item, section, xy, index, selectedId, onSelect }) {
  const [x, y] = xy;
  const important = [0, 2, 4].includes(index);
  const textColor = '#25374a';
  return (
    <g role="button" tabIndex={0} aria-label={item.title + ': ' + item.short}
      onClick={() => onSelect(item.id)}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(item.id);
        }
      }}
      style={{ cursor: 'pointer', outline: 'none' }}>
      <title>{item.title}: {item.short}. Seleccionar para leer su explicación.</title>
      <rect x={x - 32} y={y - 42} width="258" height="72" rx="20"
        fill="#fff" opacity={selectedId === item.id ? '.95' : '0'}
        stroke={section.color} strokeWidth={selectedId === item.id ? 2 : 0}/>
      <circle cx={x - 17} cy={y - 15} r={important ? 10 : 8.5} fill={section.pale}
        stroke={section.color} strokeWidth="2" />
      <circle cx={x - 17} cy={y - 15} r="3" fill={section.color} />
      <text x={x} y={y - 9} fontSize={important ? 21 : 19.5}
        fontWeight={important ? 730 : 630} fill={textColor}
        letterSpacing="-.45">{item.title}</text>
      <text x={x} y={y + 14} fontSize="14.2" fill="#667080"
        fontWeight="450" letterSpacing="-.08">{item.short}</text>
      <path d={'M' + x + ' ' + (y + 23) + 'q37 4 88 0'}
        stroke={section.color} strokeWidth="2" strokeLinecap="round"
        fill="none" opacity={important ? .35 : .18}/>
    </g>
  );
}

function Branch({ section, selectedId, focus, onSelect }) {
  const position = layout[section.id];
  const faded = focus !== 'all' && focus !== section.id;
  const [headingX, headingY] = position.heading;
  return (
    <g data-filterable="true" opacity={faded ? .18 : 1}
      style={{ transition: 'opacity 200ms ease' }}>
      {section.items.map((item, index) =>
        <ThinCurve key={'stroke-' + item.id} from={position.root}
          to={[position.nodes[index][0] - 20, position.nodes[index][1]]}
          side={position.side} index={index} color={section.color} />
      )}
      {/* One labeled hub per branch keeps the connecting curves clear of text,
          without turning the 24 concepts into uniform cards. */}
      <g>
        <ellipse cx={headingX} cy={headingY} rx="191" ry="65"
          fill={section.pale} opacity=".9" />
        <ellipse cx={headingX} cy={headingY} rx="183" ry="57"
          fill="#fffdfa" stroke={section.color} strokeOpacity=".82"
          strokeWidth="2.6" />
        <BranchSymbol section={section} x={headingX - 127} y={headingY} />
        <text x={headingX + 17} y={headingY - 8} textAnchor="middle"
          fontSize="28.5" fontWeight="730"
          fontFamily="Georgia, 'Times New Roman', serif"
          letterSpacing="-.7" fill={section.ink}>{headingParts[section.id][0]}</text>
        <text x={headingX + 17} y={headingY + 24} textAnchor="middle"
          fontSize="28.5" fontWeight="730"
          fontFamily="Georgia, 'Times New Roman', serif"
          letterSpacing="-.7" fill={section.ink}>{headingParts[section.id][1]}</text>
      </g>
      {section.items.map((item, index) => (
        <Leaf key={item.id} item={item} section={section}
          xy={position.nodes[index]} index={index}
          selectedId={selectedId} onSelect={onSelect} />
      ))}
    </g>
  );
}

export default function MindMap({ selectedId, focus, onSelect }) {
  return (
    <svg id="mental-map-svg" xmlns="http://www.w3.org/2000/svg"
      viewBox={'0 0 ' + WIDTH + ' ' + HEIGHT}
      width={WIDTH} height={HEIGHT}
      role="img" aria-label={metadata.title + '. Mapa radial: fundamentos legales, principios, fines y administración universitaria.'}
      style={{ display: 'block', width: '100%', height: 'auto', background: '#fcfaf5' }}>
      <defs>
        <pattern id="paper-dots" width="39" height="39" patternUnits="userSpaceOnUse">
          <circle cx="1.1" cy="1.1" r=".75" fill="#bfbaa9" opacity=".25"/>
        </pattern>
        <radialGradient id="center-glow">
          <stop offset="0" stopColor="#fff1cb" stopOpacity=".7"/>
          <stop offset="1" stopColor="#fff1cb" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width={WIDTH} height={HEIGHT} fill="#fcfaf5" />
      <rect width={WIDTH} height={HEIGHT} fill="url(#paper-dots)" />
      <circle cx="900" cy="639" r="310" fill="url(#center-glow)" />
      <path d="M65 104Q860 91 1735 104" stroke="#d6cfc3" strokeWidth="2"
        fill="none" opacity=".55" />
      <text x="84" y="58" fontSize="19" fontFamily="Georgia, 'Times New Roman', serif"
        fontStyle="italic" fontWeight="600" fill="#183650">Educación superior en Panamá</text>
      <text x="1718" y="58" textAnchor="end" fontSize="15.5" letterSpacing="1.8"
        fontWeight="650" fill="#87909b">UNIDAD II · MAPA MENTAL DIGITAL</text>
      <text x="84" y="89" fontSize="12.5" letterSpacing="1.2" fill="#89929c">
        FUNDAMENTOS · PRINCIPIOS · FINES · ADMINISTRACIÓN
      </text>


      {sections.map(s => <MainCurve key={'main-' + s.id} section={s} focus={focus} />)}
      {sections.map(s => <Branch key={s.id} section={s}
        selectedId={selectedId} focus={focus} onSelect={onSelect} />)}

      <g>
        <path d="M739 522C798 491 1007 481 1071 532S1129 705 1067 745 802 799 746 746 688 577 739 522Z"
          fill="#fff4df" stroke="#eedec1" strokeWidth="5"/>
        <path d="M763 529C839 502 1007 503 1055 540S1094 694 1048 729 805 771 759 723 710 572 763 529Z"
          fill="#193c4d"/>
        <path d="M775 546C837 521 1000 519 1038 552"
          fill="none" stroke="#d9e6d4" opacity=".35" strokeWidth="2" />
        <text x="900" y="578" textAnchor="middle" fontSize="15.5"
          fill="#bfded0" letterSpacing="2.5" fontWeight="700">CONCEPTO CENTRAL</text>
        <text x="900" y="628" textAnchor="middle" fontSize="29.5"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontWeight="700" fill="#fffaf0" letterSpacing="-.7">Administración de la</text>
        <text x="900" y="672" textAnchor="middle" fontSize="32"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontWeight="700" fill="#fffaf0" letterSpacing="-.95">Educación Superior</text>
        <text x="900" y="710" textAnchor="middle" fontSize="25"
          fontWeight="630" fill="#c9e3d4">en Panamá</text>
      </g>

      <g>
        <path d="M759 825Q899 810 1034 823" fill="none"
          stroke="#a9a18f" strokeWidth="1.5" opacity=".55"/>
        <text x="900" y="855" textAnchor="middle" fontSize="19"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontStyle="italic" fill="#5b625d">De las normas a las decisiones;</text>
        <text x="900" y="883" textAnchor="middle" fontSize="19"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontStyle="italic" fill="#5b625d">de la formación al bienestar social.</text>
      </g>

      <g>
        <path d="M63 1191Q900 1178 1735 1191" stroke="#d6cfc3"
          strokeWidth="2" fill="none" opacity=".6"/>
        <text x="81" y="1220" fontSize="14.2" fill="#43576b" fontWeight="650">
          Fuentes: Ley Orgánica de Educación y sus Reformas; Fundamentos Legales, Principios y Fines de la Educación Superior en Panamá.
        </text>
        <text x="81" y="1243" fontSize="13.2" fill="#7b868b">
          Síntesis de materiales de la asignatura · Las conexiones con la administración universitaria son interpretaciones académicas.
        </text>
        <text x="1718" y="1243" fontSize="14.5" fontFamily="Georgia, 'Times New Roman', serif"
          fontStyle="italic" textAnchor="end" fill="#495a69">{metadata.author}</text>
      </g>
    </svg>
  );
}
