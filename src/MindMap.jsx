import React from 'react';
import { metadata, sections } from './data.js';
import { getConnectionPath, getConnectionHandle, getTrunkPath, getTrunkHandle } from './mapConnections.js';
import { layoutGeometry, moveLayoutPoint } from './editorLayout.js';

// SVG autónomo: todo el contenido permanece visible al descargar PNG o PDF.
// Cada idea lleva una frase natural y suficiente para comprenderla sin el panel lateral.
const WIDTH = 2000;
const HEIGHT = 1414;

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

function Trunk({ section, geo, dim, editMode, activeEdit, onStartDrag, bend }) {
  const d = getTrunkPath(geo, bend);
  const selected = activeEdit?.type === 'trunk' && activeEdit.sectionId === section.id;
  const [hx, hy] = getTrunkHandle(geo, bend);
  return (
    <g data-filterable="true" opacity={dim ? '.20' : '1'}>
      <path d={d} stroke={section.pale} strokeWidth="17"
        fill="none" strokeLinecap="round"/>
      <path d={d} stroke={section.color} strokeWidth="7.2"
        fill="none" strokeLinecap="round"/>
      {editMode && <>
        <path data-editor-only="true" d={d} stroke="transparent"
          strokeWidth="32" fill="none"
          style={{ cursor: 'move' }}
          onPointerDown={e => onStartDrag(e, { type: 'trunk', sectionId: section.id })}/>
        {selected && <g data-editor-only="true"
          onPointerDown={e => onStartDrag(e, { type: 'trunk', sectionId: section.id })}
          style={{ cursor: 'move' }}>
          <circle cx={hx} cy={hy} r="17" fill="#fff"
            stroke={section.color} strokeWidth="3"/>
          <circle cx={hx} cy={hy} r="5" fill={section.color}/>
        </g>}
      </>}
    </g>
  );
}

function Twig({ section, index, geo, editMode, activeEdit, onStartDrag, bend }) {
  const d = getConnectionPath(section, index, geo, bend);
  const selected = activeEdit?.type === 'bend' &&
    activeEdit.sectionId === section.id && activeEdit.index === index;
  const [hx, hy] = getConnectionHandle(section, index, geo, bend);
  return (
    <g>
      <path d={d} fill="none" stroke={section.color}
        strokeWidth={section.id === 'fines' && index === 6 ? 2.1 : 1.65}
        opacity={section.id === 'fines' && index === 6 ? '.47' : '.32'}
        strokeLinecap="round" strokeLinejoin="round"/>
      {editMode && <>
        <path data-editor-only="true" d={d} stroke="transparent" strokeWidth="26"
          fill="none" style={{ cursor: 'move' }}
          onPointerDown={e => onStartDrag(e, {
            type: 'bend', sectionId: section.id, index
          })}/>
        {selected && <g data-editor-only="true"
          style={{ cursor: 'move' }}
          onPointerDown={e => onStartDrag(e, {
            type: 'bend', sectionId: section.id, index
          })}>
          <circle cx={hx} cy={hy} r="15" fill="#fff"
            stroke={section.color} strokeWidth="2.5"/>
          <circle cx={hx} cy={hy} r="4.5" fill={section.color}/>
        </g>}
      </>}
    </g>
  );
}

function Concept({ item, section, coords, selectedId, onSelect, editMode, activeEdit, onStartDrag, index }) {
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
      onClick={() => { if (!editMode) onSelect(item.id); }}
      onKeyDown={e => {
        if (!editMode && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault(); onSelect(item.id);
        }
      }}
      onPointerDown={editMode ? e => onStartDrag(e, { type: 'node', sectionId: section.id, index }) : undefined}
      style={{ cursor: editMode ? 'grab' : 'pointer' }}>
      <title>{item.title}. {item.mapText || item.short}</title>
      {editMode && activeEdit?.type === 'node' &&
        activeEdit.sectionId === section.id && activeEdit.index === index &&
        <rect data-editor-only="true" x={x - 22} y={y - 32}
          width={boxWidth + 57} height={boxHeight + 18}
          rx="15" fill="none" stroke={section.color}
          strokeDasharray="7 5" strokeWidth="2.2" pointerEvents="none"/>}
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

function Hub({ section, geo, editMode, activeEdit, onStartDrag }) {
  const [cx, cy] = geo.hub;
  const [line1, line2] = headings[section.id];
  const rightTitle = section.id === 'gestion';
  const font = rightTitle ? 26.5 : 29;
  return (
    <g onPointerDown={editMode ? e => onStartDrag(e, { type: 'hub', sectionId: section.id }) : undefined}
      style={{ cursor: editMode ? 'grab' : 'default' }}>
      <ellipse cx={cx} cy={cy} rx="195" ry="58" fill={section.pale} opacity=".85"/>
      {editMode && activeEdit?.type === 'hub' && activeEdit.sectionId === section.id &&
        <ellipse data-editor-only="true" cx={cx} cy={cy} rx="203" ry="67"
          fill="none" stroke={section.color} strokeDasharray="8 5"
          strokeWidth="2.5" pointerEvents="none"/>}
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

function Section({ section, geo, focus, selectedId, onSelect, editMode, activeEdit, onStartDrag, layout }) {
  const dim = focus !== 'all' && focus !== section.id;
  return (
    <g data-filterable="true" opacity={dim ? '.20' : '1'}>
      {section.items.map((_,i) =>
        <Twig section={section} index={i} key={i} geo={geo}
          bend={layout.bends?.[section.id]?.[i]} editMode={editMode}
          activeEdit={activeEdit} onStartDrag={onStartDrag}/>)}
      <Hub section={section} geo={geo} editMode={editMode}
        activeEdit={activeEdit} onStartDrag={onStartDrag}/>
      {section.items.map((item,i) =>
        <Concept key={item.id} item={item} section={section}
          coords={geo.nodes[i]} selectedId={selectedId} onSelect={onSelect}
          editMode={editMode} activeEdit={activeEdit} onStartDrag={onStartDrag} index={i}/>)}
    </g>
  );
}

export default function MindMap({
  selectedId, focus, onSelect, editMode = false, layout,
  activeEdit, onEditSelect, onLayoutChange, onEditCommit
}) {
  const svgRef = React.useRef(null);
  const dragRef = React.useRef(null);

  const svgPoint = event => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return null;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    return point.matrixTransform(ctm.inverse());
  };

  const startDrag = (event, target) => {
    if (!editMode || event.button !== 0) return;
    const position = svgPoint(event);
    if (!position) return;
    event.preventDefault();
    event.stopPropagation();
    const svg = svgRef.current;
    const geo = layoutGeometry(layout, target.sectionId);
    const section = sections.find(s => s.id === target.sectionId);
    const startPoint = target.type === 'bend'
      ? getConnectionHandle(section, target.index, geo,
          layout.bends?.[target.sectionId]?.[target.index])
      : target.type === 'trunk'
        ? getTrunkHandle(geo, layout.trunks?.[target.sectionId])
        : null;
    dragRef.current = {
      pointerId: event.pointerId,
      start: [position.x, position.y],
      layout,
      target: { ...target, startPoint },
      changed: false
    };
    svg.setPointerCapture(event.pointerId);
    onEditSelect(target);
  };

  const pointerMove = event => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const position = svgPoint(event);
    if (!position) return;
    const dx = position.x - drag.start[0];
    const dy = position.y - drag.start[1];
    if (Math.hypot(dx, dy) < 1 && !drag.changed) return;
    drag.changed = true;
    onLayoutChange(moveLayoutPoint(drag.layout, drag.target, dx, dy));
  };

  const finishDrag = event => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (drag.changed) onEditCommit(drag.layout);
    dragRef.current = null;
    if (svgRef.current?.hasPointerCapture(event.pointerId)) {
      svgRef.current.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <svg ref={svgRef} id="mental-map-svg" xmlns="http://www.w3.org/2000/svg"
      width={WIDTH} height={HEIGHT} viewBox={'0 0 ' + WIDTH + ' ' + HEIGHT}
      role="img" aria-label="Administración de la educación superior en Panamá. Mapa mental con cuatro ramas y explicaciones resumidas en cada concepto."
      onPointerMove={pointerMove} onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      style={{
        display: 'block', width: '100%', height: 'auto',
        background: '#fcfaf5', touchAction: editMode ? 'none' : 'auto'
      }}>
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
          geo={layoutGeometry(layout, s.id)}
          dim={focus !== 'all' && focus !== s.id}
          bend={layout.trunks?.[s.id]} editMode={editMode}
          activeEdit={activeEdit} onStartDrag={startDrag}/>)}
      {sections.map(s =>
        <Section key={s.id} section={s}
          geo={layoutGeometry(layout, s.id)} layout={layout}
          focus={focus} selectedId={selectedId} onSelect={onSelect}
          editMode={editMode} activeEdit={activeEdit}
          onStartDrag={startDrag}/>)}

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
        {/* La síntesis ocupa únicamente el corredor central: ninguna línea
            invade la zona de Planificación académica ni sus conexiones. */}
        <path d="M916 898Q1000 891 1084 898" fill="none"
          stroke="#c9c0ae" strokeWidth="1.4"/>
        <text x="1000" y="929" textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="18.5" fontStyle="italic" fill="#5a6763">
          La ley orienta;
        </text>
        <text x="1000" y="954" textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="18.5" fontStyle="italic" fill="#5a6763">
          los principios guían.
        </text>
        <text x="1000" y="986" textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="18.5" fontStyle="italic" fill="#5a6763">
          Los fines inspiran;
        </text>
        <text x="1000" y="1011" textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="18.5" fontStyle="italic" fill="#5a6763">
          la gestión actúa.
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
