import React, { useMemo, useState } from 'react';
import MindMap from './MindMap.jsx';
import { metadata, sections, byId } from './data.js';

const fileBase = 'Mapa_mental_educacion_superior_Panama';
const sectionNames = { all: 'Todas las ramas' };

function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function vectorMarkup() {
  const svg = document.getElementById('mental-map-svg');
  if (!svg) throw new Error('No fue posible encontrar el mapa.');
  const clone = svg.cloneNode(true);
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', '1600');
  clone.setAttribute('height', '1132');
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    new XMLSerializer().serializeToString(clone);
}

function exportSVG() {
  download(new Blob([vectorMarkup()], { type: 'image/svg+xml;charset=utf-8' }), fileBase + '.svg');
}

async function exportPNG() {
  const svgData = new Blob([vectorMarkup()], { type: 'image/svg+xml;charset=utf-8' });
  const objectUrl = URL.createObjectURL(svgData);
  try {
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error('No se pudo cargar el SVG para convertirlo a PNG.'));
      img.src = objectUrl;
    });
    const canvas = document.createElement('canvas');
    canvas.width = 3200;
    canvas.height = 2264;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Tu navegador no permite crear imágenes PNG.');
    context.fillStyle = '#f5f7fc';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('No se pudo guardar el PNG.');
    download(blob, fileBase + '.png');
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function ToolbarIcon({ kind }) {
  const common = { width: 17, height: 17, viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor', strokeWidth: 1.9,
    strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  const paths = {
    zoomin: <><circle cx="10.8" cy="10.8" r="7.7"/><path d="m16.7 16.7 4.3 4.3M10.8 7.8v6m-3-3h6"/></>,
    zoomout: <><circle cx="10.8" cy="10.8" r="7.7"/><path d="m16.7 16.7 4.3 4.3M7.8 10.8h6"/></>,
    reset: <><path d="M3 11a9 9 0 1 1 3 7M3 4v7h7"/></>,
    download: <><path d="M12 3v12m-4-4 4 4 4-4M5 17v4h14v-4"/></>,
    book: <><path d="M12 6a15 15 0 0 0-9-2v16a15 15 0 0 1 9 2m0-16a15 15 0 0 1 9-2v16a15 15 0 0 0-9 2M12 6v16"/></>,
    printer: <><path d="M6 8V3h12v5M6 18H4a2 2 0 0 1-2-2v-4a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v4a2 2 0 0 1-2 2h-2M6 15h12v6H6z"/></>,
    search: <><circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5"/></>,
    close: <path d="M5 5l14 14M19 5 5 19"/>,
    chevron: <path d="m9 18 6-6-6-6"/>
  };
  return <svg {...common}>{paths[kind]}</svg>;
}

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [focus, setFocus] = useState('all');
  const [zoom, setZoom] = useState(100);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [infoOpen, setInfoOpen] = useState(false);
  const selected = selectedId ? byId[selectedId] : null;
  const selectedSection = selected ? sections.find(s => s.id === selected.sectionId) : null;
  const found = useMemo(() => {
    const q = search.trim().toLocaleLowerCase('es');
    if (!q) return [];
    return sections.flatMap(s => s.items
      .filter(i => (i.title + ' ' + i.short + ' ' + i.detail).toLocaleLowerCase('es').includes(q))
      .map(i => ({ ...i, sectionTitle: s.title }))).slice(0, 12);
  }, [search]);

  const toggleFocus = id => setFocus(prev => prev === id ? 'all' : id);

  const handlePDF = () => {
    setFocus('all');
    setSelectedId(null);
    setStatus('En la ventana de impresión selecciona Guardar como PDF, A3 horizontal y sin márgenes.');
    window.setTimeout(() => window.print(), 180);
  };

  const handleExportPNG = async () => {
    try {
      setStatus('Preparando el archivo PNG…');
      await exportPNG();
      setStatus('PNG generado en alta resolución.');
    } catch (error) {
      setStatus(error.message);
    }
  };

  const handleExportSVG = () => {
    try {
      exportSVG();
      setStatus('SVG vectorial descargado.');
    } catch (error) {
      setStatus(error.message);
    }
  };

  const handleSelect = id => {
    setSelectedId(id);
    setSearch('');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">✳</div>
          <div>
            <div className="brand-overline">MAESTRÍA EN DOCENCIA SUPERIOR</div>
            <strong>Mapa mental digital</strong>
          </div>
        </div>
        <div className="topbar-right">
          <span className="meta-chip">Unidad Didáctica II</span>
          <span className="meta-chip subdued">Actividad Individual N.º 2</span>
        </div>
      </header>

      <main className="workspace">
        <section className="workspace-main">
          <div className="intro">
            <div>
              <p className="eyebrow">PROYECTO ACADÉMICO · PANAMÁ</p>
              <h1>{metadata.title}</h1>
              <p className="lead">{metadata.subtitle}. Selecciona un concepto del mapa para explorar su significado y cómo se relaciona con la gestión universitaria.</p>
            </div>
            <span className="ready-mark">24 conceptos · 4 ramas</span>
          </div>

          <div className="filters" aria-label="Filtrar categorías">
            <button type="button" className={'filter-btn ' + (focus === 'all' ? 'active' : '')}
              onClick={() => setFocus('all')}>{sectionNames.all}</button>
            {sections.map(s => (
              <button key={s.id} type="button" onClick={() => toggleFocus(s.id)}
                className={'filter-btn ' + (focus === s.id ? 'active' : '')}
                style={{ '--accent': s.color, '--pale': s.pale }}>
                <span className="filter-dot" style={{ backgroundColor: s.color }} />
                {s.title}
              </button>
            ))}
          </div>

          <div className="map-card">
            <div className="map-toolbar">
              <div className="toolbar-info"><span className="live-dot" /> Vista del mapa · 1 página A3 horizontal</div>
              <div className="toolbar-actions">
                <button type="button" title="Reducir zoom" aria-label="Reducir zoom"
                  onClick={() => setZoom(z => Math.max(65, z - 10))}><ToolbarIcon kind="zoomout" /></button>
                <span className="zoom-value">{zoom}%</span>
                <button type="button" title="Ampliar zoom" aria-label="Ampliar zoom"
                  onClick={() => setZoom(z => Math.min(160, z + 10))}><ToolbarIcon kind="zoomin" /></button>
                <button type="button" title="Restablecer vista" aria-label="Restablecer vista"
                  onClick={() => { setZoom(100); setFocus('all'); }}><ToolbarIcon kind="reset" /></button>
              </div>
            </div>
            <div className="map-viewport">
              <div className="map-print-sheet" style={{ width: zoom + '%' }}>
                <MindMap selectedId={selectedId} focus={focus} onSelect={handleSelect} />
              </div>
            </div>
            <div className="map-foot">
              <span>Haz clic en cada concepto para consultar el análisis.</span>
              <span>Vectorial · Legible al ampliar</span>
            </div>
          </div>

          <div className="export-row">
            <div className="export-label">
              <strong>Exportar el trabajo</strong>
              <span>El PDF es el formato solicitado para entregar en Canvas.</span>
            </div>
            <div className="export-actions">
              <button type="button" className="btn secondary" onClick={handleExportSVG}>
                <ToolbarIcon kind="download" /> SVG
              </button>
              <button type="button" className="btn secondary" onClick={handleExportPNG}>
                <ToolbarIcon kind="download" /> PNG
              </button>
              <button type="button" className="btn primary" onClick={handlePDF}>
                <ToolbarIcon kind="printer" /> PDF / Imprimir
              </button>
            </div>
          </div>
          {status && <p className="message" role="status">{status}</p>}
        </section>

        <aside className="sidebar">
          <div className="sidebar-top">
            <span className="side-eyebrow">EXPLORAR CONTENIDO</span>
            <h2>Guía conceptual</h2>
            <p>24 ideas conectadas con los fundamentos de la educación superior panameña.</p>
            <label className="searchbox">
              <ToolbarIcon kind="search" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar conceptos..." aria-label="Buscar conceptos" />
              {search && <button type="button" title="Limpiar búsqueda"
                onClick={() => setSearch('')}><ToolbarIcon kind="close" /></button>}
            </label>
            {search && (
              <div className="search-results">
                {found.length ? found.map(item =>
                  <button key={item.id} type="button" onClick={() => handleSelect(item.id)}>
                    <b>{item.title}</b><small>{item.sectionTitle}</small>
                  </button>
                ) : <p>No se encontraron conceptos.</p>}
              </div>
            )}
          </div>

          {selected && selectedSection ? (
            <article className="detail-card" style={{ '--detail-accent': selectedSection.color, '--detail-pale': selectedSection.pale }}>
              <div className="detail-header">
                <span className="detail-category">{selectedSection.title}</span>
                <button type="button" className="close-btn" title="Cerrar detalle"
                  onClick={() => setSelectedId(null)}><ToolbarIcon kind="close" /></button>
              </div>
              <h3>{selected.title}</h3>
              <p className="detail-short">{selected.short}</p>
              <h4>¿Qué significa?</h4>
              <p>{selected.detail}</p>
              <h4>Relación con la administración</h4>
              <p>{selected.relation}</p>
              <div className="detail-source"><ToolbarIcon kind="book" /> {selected.source}</div>
            </article>
          ) : (
            <div className="empty-detail">
              <div className="empty-graphic">◎</div>
              <h3>El mapa se explica por sí mismo</h3>
              <p>Selecciona cualquiera de los 24 conceptos para conocer su contexto y aplicación en la administración universitaria.</p>
              <div className="hint"><ToolbarIcon kind="chevron" /> Cada rama utiliza un color y una jerarquía propios.</div>
            </div>
          )}

          <div className="side-section">
            <div className="side-section-heading">
              <h3>Las cuatro ramas</h3>
              <span>4/4</span>
            </div>
            {sections.map(section => (
              <button type="button" key={section.id} className="side-section-item"
                onClick={() => toggleFocus(section.id)}>
                <span className="side-number" style={{ background: section.pale, color: section.ink }}>{section.order}</span>
                <span><strong>{section.title}</strong><small>{section.items.length} conceptos clave</small></span>
                <ToolbarIcon kind="chevron" />
              </button>
            ))}
          </div>
          <div className="source-panel">
            <button type="button" onClick={() => setInfoOpen(s => !s)} aria-expanded={infoOpen}>
              <ToolbarIcon kind="book" /> Materiales consultados
              <span>{infoOpen ? '−' : '+'}</span>
            </button>
            {infoOpen && <div className="source-body">
              {metadata.sources.map(source => <p key={source}>{source}</p>)}
              <p><em>{metadata.note}</em></p>
            </div>}
          </div>
        </aside>
      </main>
      <footer className="app-footer">
        <span>{metadata.activity} · Elaborado por {metadata.author}</span>
        <span>Mapa elaborado con React y SVG · Exportación a PDF</span>
      </footer>
    </div>
  );
}
