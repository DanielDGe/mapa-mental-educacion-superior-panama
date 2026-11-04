import React from 'react';
import { metadata, sections } from './data.js';

const W = 1600;
const H = 1132;
const locations = {
  legal: { x: 54, y: 66, side: 'left' },
  principios: { x: 1091, y: 66, side: 'right' },
  fines: { x: 54, y: 634, side: 'left' },
  gestion: { x: 1091, y: 634, side: 'right' }
};
const relationships = [
  { lead: 'Las leyes', text: 'establecen el marco de actuación', color: '#3566c9' },
  { lead: 'Los principios', text: 'orientan la manera de actuar', color: '#138879' },
  { lead: 'Los fines', text: 'dan sentido a los resultados', color: '#d78b23' },
  { lead: 'La gestión', text: 'convierte todo en decisiones', color: '#8b5bc0' }
];

function Connection({ d, color }) {
  return <path d={d} fill="none" stroke={color} strokeWidth="5"
    strokeLinecap="round" opacity="0.74" />;
}

function Branch({ section, focus, selectedId, onSelect }) {
  const pos = locations[section.id];
  const width = 455;
  const faded = focus !== 'all' && focus !== section.id;
  return (
    <g opacity={faded ? 0.29 : 1} style={{ transition: 'opacity 180ms ease' }}>
      <rect x={pos.x} y={pos.y} width={width} height="380" rx="25"
        fill="#ffffff" stroke={section.color} strokeOpacity=".22" strokeWidth="2" />
      <rect x={pos.x} y={pos.y} width={width} height="61" rx="25"
        fill={section.color} />
      <rect x={pos.x} y={pos.y + 31} width={width} height="30"
        fill={section.color} />
      <circle cx={pos.x + 35} cy={pos.y + 30} r="19" fill="#ffffff" opacity=".20" />
      <text x={pos.x + 35} y={pos.y + 37} textAnchor="middle"
        fill="#ffffff" fontSize="24" fontWeight="700">{section.marker}</text>
      <text x={pos.x + 66} y={pos.y + 38} fill="#ffffff"
        fontSize={section.id === 'gestion' ? 22 : 24} fontWeight="750"
        letterSpacing="-0.4">{section.title}</text>
      {section.items.map((item, index) => {
        const itemY = pos.y + 72 + index * 49;
        const highlighted = selectedId === item.id;
        return (
          <g key={item.id} role="button" tabIndex={0}
            aria-label={item.title + ': ' + item.short}
            onClick={() => onSelect(item.id)}
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onSelect(item.id);
              }
            }}
            style={{ cursor: 'pointer', outline: 'none' }}>
            <rect x={pos.x + 14} y={itemY} width={width - 28} height="44" rx="12"
              fill={highlighted ? section.pale : '#f7f9fd'}
              stroke={highlighted ? section.color : '#e9edf5'}
              strokeWidth={highlighted ? 2.7 : 1} />
            <rect x={pos.x + 14} y={itemY + 6} width="4" height="32" rx="2"
              fill={section.color} />
            <circle cx={pos.x + 38} cy={itemY + 22} r="12"
              fill={section.pale} stroke={section.color} strokeOpacity=".35" />
            <text x={pos.x + 38} y={itemY + 27} textAnchor="middle"
              fontSize="13" fontWeight="800" fill={section.ink}>{index + 1}</text>
            <text x={pos.x + 61} y={itemY + 18}
              fontSize="17" fontWeight="700" fill="#1a2b47">{item.title}</text>
            <text x={pos.x + 61} y={itemY + 35}
              fontSize="12.5" fill="#5c6a81">{item.short}</text>
            <circle cx={pos.x + width - 31} cy={itemY + 22} r="10"
              fill={section.pale} />
            <text x={pos.x + width - 31} y={itemY + 27}
              textAnchor="middle" fill={section.ink} fontSize="14">+</text>
          </g>
        );
      })}
      <text x={pos.x + width - 14} y={pos.y + 409} textAnchor="end"
        fontSize="12.5" fill={section.ink} opacity=".8">{section.items.length} conceptos</text>
    </g>
  );
}

export default function MindMap({ selectedId, focus, onSelect }) {
  return (
    <svg id="mental-map-svg" xmlns="http://www.w3.org/2000/svg"
      viewBox={'0 0 ' + W + ' ' + H}
      width={W} height={H}
      role="img" aria-label={metadata.title + '. Cuatro ramas: fundamentos legales, principios, fines y administración universitaria.'}
      style={{ width: '100%', height: 'auto', display: 'block', background: '#f5f7fc' }}>
      <defs>
        <linearGradient id="center-gradient" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#162b52" />
          <stop offset="100%" stopColor="#263c64" />
        </linearGradient>
        <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.4" fill="#cfd7e6" opacity=".5" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="#f5f7fc" />
      <rect width={W} height={H} fill="url(#dots)" />
      <rect x="22" y="20" width={W - 44} height={H - 40} rx="30"
        fill="none" stroke="#dbe2ee" strokeWidth="2" />
      <text x="64" y="42" fontSize="13.5" fill="#77869e"
        letterSpacing="2.1" fontWeight="750">MAPA MENTAL DIGITAL · UNIDAD DIDÁCTICA II</text>
      <text x={W - 66} y="42" fontSize="13.5" fill="#77869e"
        textAnchor="end">{metadata.author} · Docencia Superior</text>

      <g>
        <Connection color="#3566c9" d="M548 470 C526 457 537 318 509 252" />
        <Connection color="#138879" d="M1052 470 C1077 442 1054 319 1092 252" />
        <Connection color="#d78b23" d="M548 589 C526 624 539 807 509 841" />
        <Connection color="#8b5bc0" d="M1052 589 C1078 632 1059 813 1092 841" />
        <circle cx="548" cy="470" r="10" fill="#3566c9" />
        <circle cx="1052" cy="470" r="10" fill="#138879" />
        <circle cx="548" cy="589" r="10" fill="#d78b23" />
        <circle cx="1052" cy="589" r="10" fill="#8b5bc0" />
      </g>

      {sections.map(section => (
        <Branch key={section.id} section={section}
          focus={focus} selectedId={selectedId} onSelect={onSelect} />
      ))}

      <g>
        <rect x="548" y="425" width="504" height="212" rx="32"
          fill="url(#center-gradient)" />
        <rect x="560" y="437" width="480" height="188" rx="26"
          fill="none" stroke="#ffffff" strokeOpacity=".20" strokeWidth="2" />
        <text x="800" y="474" textAnchor="middle" fill="#bcd2ff"
          fontSize="15" fontWeight="700" letterSpacing="3.4">CONCEPTO CENTRAL</text>
        <text x="800" y="524" textAnchor="middle" fill="#ffffff"
          fontSize="31" fontWeight="800" letterSpacing="-.6">ADMINISTRACIÓN DE LA</text>
        <text x="800" y="563" textAnchor="middle" fill="#ffffff"
          fontSize="35" fontWeight="800" letterSpacing="-1">EDUCACIÓN SUPERIOR</text>
        <text x="800" y="604" textAnchor="middle" fill="#ffffff"
          fontSize="29" fontWeight="750" letterSpacing=".1">EN PANAMÁ</text>
      </g>

      <g>
        <text x="800" y="697" textAnchor="middle" fill="#384b69"
          fontSize="22" fontWeight="750">¿Cómo se relacionan?</text>
        {relationships.map((link, i) => {
          const y = 715 + i * 62;
          return (
            <g key={link.lead}>
              <rect x="573" y={y} width="454" height="52" rx="13"
                fill="#ffffff" stroke="#dce3ef" strokeWidth="1.6" />
              <rect x="573" y={y} width="8" height="52" rx="4" fill={link.color} />
              <circle cx="606" cy={y + 26} r="10" fill={link.color} opacity=".14" />
              <circle cx="606" cy={y + 26} r="4" fill={link.color} />
              <text x="626" y={y + 22} fill="#1d304f" fontSize="15.2"
                fontWeight="750">{link.lead}</text>
              <text x="626" y={y + 39} fill="#5f6d82" fontSize="13.6">{link.text}</text>
              {i < 3 && <text x="800" y={y + 63} textAnchor="middle"
                fontSize="15" fill="#8594ad">↓</text>}
            </g>
          );
        })}
      </g>

      <rect x="53" y="1066" width="1494" height="43" rx="12"
        fill="#e9eef8" />
      <text x="76" y="1084" fill="#263951" fontSize="13.3" fontWeight="700">
        Fuentes: Ley Orgánica de Educación y sus Reformas; Fundamentos Legales, Principios y Fines de la Educación Superior en Panamá.
      </text>
      <text x="76" y="1100" fill="#65748b" fontSize="12.2">
        Síntesis académica de materiales de la Unidad II. Las relaciones administrativas son interpretaciones aplicadas.
      </text>
    </svg>
  );
}
