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
    root: [552, 340], heading: [418, 336], side: 'left', tier: 'top',
    nodes: [
      [118, 158], [375, 174],
      [100, 265], [380, 277],
      [132, 439], [384, 443]
    ]
  },
  principios: {
    root: [1248, 340], heading: [1304, 336], side: 'right', tier: 'top',
    nodes: [
      [1218, 163], [1502, 174],
      [1230, 267], [1501, 265],
      [1220, 434], [1507, 441]
    ]
  },
  fines: {
    root: [551, 952], heading: [426, 962], side: 'left', tier: 'bottom',
    nodes: [
      [114, 820], [368, 828],
      [96, 883], [378, 878],
      [122, 1096], [393, 1090], [604, 1131]
    ]
  },
  gestion: {
    root: [1246, 952], heading: [1302, 962], side: 'right', tier: 'bottom',
    nodes: [
      [1210, 820], [1508, 824],
      [1221, 881], [1511, 877],
      [1218, 1098], [1505, 1090]
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
    legal: 'M749 557 C696 534 665 431 591 372 S552 344 552 340',
    principios: 'M1051 557 C1106 525 1133 435 1208 371 S1245 347 1248 340',
    fines: 'M749 729 C687 767 660 882 580 931 S551 953 551 952',
    gestion: 'M1051 729 C1116 769 1143 877 1215 930 S1245 951 1246 952'
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
  const s = layout[section.id];
  const faded = focus !== 'all' && focus !== section.id;
  const [hx, hy] = s.heading;
  const headingX = hx + (s.side === 'left' ? -10 : 38);
  const symbolX = hx + (s.side === 'left' ? -66 : -18);
  const sy = hy - 12;
  return (
    <g data-filterable="true" opacity={faded ? .18 : 1} style={{ transition: 'opacity 200ms ease' }}>
      {section.items.map((item, index) =>
        <ThinCurve key={'stroke-' + item.id} from={s.root}
          to={[s.nodes[index][0] - 20, s.nodes[index][1]]}
          side={s.side} index={index} color={section.color} />
      )}
      <g>
        <BranchSymbol section={section} x={symbolX} y={sy - 3} />
        <text x={headingX} y={sy - 9} textAnchor="start" fontSize="31"
          fontWeight="760" fontFamily="Georgia, 'Times New Roman', serif"
          letterSpacing="-.75" fill={section.ink}>{headingParts[section.id][0]}</text>
        <text x={headingX} y={sy + 23} textAnchor="start" fontSize="31"
          fontWeight="760" fontFamily="Georgia, 'Times New Roman', serif"
          letterSpacing="-.75" fill={section.ink}>{headingParts[section.id][1]}</text>
        <path d={'M' + headingX + ' ' + (sy + 32) +
          'q82 7 172 -1'}
          stroke={section.color} strokeWidth="6" strokeLinecap="round"
          fill="none" opacity=".45" />
      </g>
      {section.items.map((item, index) => (
        <Leaf key={item.id} item={item} section={section}
          xy={s.nodes[index]} index={index}
          selectedId={selectedId} onSelect={onSelect}/>
      ))}
    </g>
  );
}

function Doodle({ x, y, kind, color }) {
  const curves = kind === 'star'
    ? <path d="M0-22 5-6 23 0 5 6 0 23-5 6-23 0-5-6Z" />
    : kind === 'rays'
      ? <><circle r="9"/><path d="M0-25v7M0 18v7M-25 0h7M18 0h7M-18-18l6 6M12 12l6 6M18-18l-6 6M-12 12l-6 6"/></>
      : <><path d="M-24 0c13-22 34-16 38 0S3 19-14 7"/><path d="M-18-13c4 8 18 9 24 1"/></>;
  return <g transform={'translate(' + x + ' ' + y + ')'}
    fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"
    strokeLinejoin="round" opacity=".36">{curves}</g>;
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

      <Doodle x={729} y={172} color="#3566c9" kind="star"/>
      <Doodle x={1089} y={212} color="#138879" kind="rays"/>
      <Doodle x={765} y={1038} color="#d78b23" kind="leaves"/>
      <Doodle x={1062} y={1088} color="#8b5bc0" kind="star"/>

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
        <text x="900" y="628" textAnchor="middle" fontSize="35"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontWeight="700" fill="#fffaf0" letterSpacing="-.7">Administración de la</text>
        <text x="900" y="672" textAnchor="middle" fontSize="39"
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
