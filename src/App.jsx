import React, { useEffect, useMemo, useRef, useState } from 'react';
import MindMap from './MindMap.jsx';
import { metadata, sections, byId } from './data.js';
import {
  defaultLayout, readSavedLayout, writeSavedLayout,
  exportLayoutFile, importLayoutFile
} from './editorLayout.js';

const fileBase = 'Mapa_mental_educacion_superior_Panama';
const total = sections.reduce((sum, section) => sum + section.items.length, 0);

function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1600);
}

function vectorMarkup() {
  const svg = document.getElementById('mental-map-svg');
  if (!svg) throw new Error('No se encontró el mapa mental.');
  const clone = svg.cloneNode(true);
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', '2000');
  clone.setAttribute('height', '1414');
  // El trabajo exportado siempre debe verse completo, aunque la pantalla tenga
  // una categoría filtrada.
  clone.querySelectorAll('[data-filterable]').forEach(element => {
    element.setAttribute('opacity', '1');
    element.removeAttribute('style');
  });
  // Los tiradores y contornos del editor nunca aparecen en el trabajo entregado.
  clone.querySelectorAll('[data-editor-only]').forEach(element => element.remove());
  // Quitar los controles de accesibilidad solo afecta la copia exportada;
  // no cambia la navegación interactiva en React.
  clone.querySelectorAll('[tabindex]').forEach(el => el.removeAttribute('tabindex'));
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    new XMLSerializer().serializeToString(clone);
}

function exportSVG() {
  download(
    new Blob([vectorMarkup()], { type: 'image/svg+xml;charset=utf-8' }),
    fileBase + '.svg'
  );
}

async function exportPNG() {
  const source = URL.createObjectURL(new Blob([vectorMarkup()], {
    type: 'image/svg+xml;charset=utf-8'
  }));
  try {
    const image = new Image();
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () => reject(new Error('No fue posible convertir el mapa en imagen.'));
      image.src = source;
    });
    const canvas = document.createElement('canvas');
    canvas.width = 4000;
    canvas.height = 2828;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('El navegador no admite exportación PNG.');
    context.fillStyle = '#fcfaf5';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('La imagen no pudo generarse.');
    download(blob, fileBase + '.png');
  } finally {
    URL.revokeObjectURL(source);
  }
}

function Icon({ name, size = 19 }) {
  const paths = {
    plus: <path d="M12 5v14M5 12h14"/>,
    minus: <path d="M5 12h14"/>,
    search: <><circle cx="10.7" cy="10.7" r="7.5"/><path d="m16.2 16.2 5 5"/></>,
    close: <path d="m5 5 14 14M19 5 5 19"/>,
    download: <><path d="M12 3v12m-4-4 4 4 4-4M4 18v3h16v-3"/></>,
    print: <><path d="M6 9V3h12v6M6 17H4a2 2 0 0 1-2-2v-3a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v3a2 2 0 0 1-2 2h-2"/><path d="M6 15h12v6H6z"/></>,
    book: <><path d="M12 6a16 16 0 0 0-9-2v16a16 16 0 0 1 9 2m0-16a16 16 0 0 1 9-2v16a16 16 0 0 0-9 2M12 6v16"/></>,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6"/>,
    reset: <><path d="M3 11a9 9 0 1 1 3 7M3 4v7h7"/></>,
    list: <><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></>,
    edit: <><path d="M12 20h9M6 16l10-10 3 3-10 10-4 1zM15 7l2-2a2 2 0 0 1 3 3l-2 2"/></>,
    save: <><path d="M4 4h14l3 3v14H3V4zM7 4v7h10V4M7 21v-7h10v7"/></>,
    undo: <><path d="M9 14 4 9l5-5M4 9h9a7 7 0 0 1 0 14"/></>,
    upload: <><path d="M12 16V3m-4 4 4-4 4 4M5 16v5h14v-5"/></>,
    move: <><path d="M12 2v20M2 12h20m-5-5 5 5-5 5M7 7l-5 5 5 5M7 7l5-5 5 5m0 10-5 5-5-5"/></>,
    trash: <><path d="M4 7h16M10 4h4M6 7l1 14h10l1-14M10 11v6M14 11v6"/></>

  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [focus, setFocus] = useState('all');
  const [zoom, setZoom] = useState(100);
  const [panelOpen, setPanelOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeList, setActiveList] = useState('legal');
  const [status, setStatus] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [layout, setLayout] = useState(readSavedLayout);
  const [activeEdit, setActiveEdit] = useState(null);
  const historyRef = useRef([]);
  const [undoCount, setUndoCount] = useState(0);
  const importFileRef = useRef(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!writeSavedLayout(layout)) {
        setStatus('El navegador no pudo guardar el diseño. Descarga una copia JSON.');
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [layout]);

  const recordHistory = previous => {
    historyRef.current.push(previous);
    if (historyRef.current.length > 35) historyRef.current.shift();
    setUndoCount(historyRef.current.length);
  };

  const onUndoLayout = () => {
    const last = historyRef.current.pop();
    if (!last) return;
    setLayout(last);
    setUndoCount(historyRef.current.length);
    setActiveEdit(null);
    setStatus('Se deshizo el último movimiento.');
  };

  const onResetLayout = () => {
    if (!window.confirm('¿Restaurar la distribución original? Puedes deshacer esta acción.')) return;
    recordHistory(layout);
    setLayout(defaultLayout());
    setActiveEdit(null);
    setStatus('Distribución original restaurada.');
  };

  const onExportLayout = () => {
    download(new Blob([exportLayoutFile(layout)],
      { type: 'application/json;charset=utf-8' }), 'Diseno_mapa_mental_Panama.json');
    setStatus('Copia del diseño descargada en JSON. Puedes cargarla en otro navegador.');
  };

  const onImportLayout = async event => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const value = importLayoutFile(await file.text());
      recordHistory(layout);
      setLayout(value);
      setActiveEdit(null);
      setFocus('all');
      setStatus('Distribución restaurada desde el archivo JSON.');
    } catch (error) {
      setStatus('No se pudo importar: ' + error.message);
    }
  };

  const toggleEditor = () => {
    setEditMode(v => !v);
    setPanelOpen(false);
    setSelectedId(null);
    setActiveEdit(null);
    setFocus('all');
    setStatus(editMode
      ? 'Modo lectura activado. La distribución editada se conserva.'
      : 'Modo edición activado: arrastra conceptos, óvalos y líneas. Los cambios se guardan automáticamente.');
  };

  const selected = selectedId ? byId[selectedId] : null;
  const selectedSection = selected ? sections.find(s => s.id === selected.sectionId) : null;
  const filtered = useMemo(() => {
    const q = search.trim().toLocaleLowerCase('es');
    if (!q) return [];
    return sections.flatMap(section => section.items.filter(item =>
      [item.title, item.short, item.detail, item.relation].join(' ')
        .toLocaleLowerCase('es').includes(q))
      .map(item => ({ ...item, sectionTitle: section.title }))
    ).slice(0, 16);
  }, [search]);

  useEffect(() => {
    if (!panelOpen) return;
    const onKey = event => {
      if (event.key === 'Escape') setPanelOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [panelOpen]);

  const selectConcept = id => {
    setSelectedId(id);
    setActiveList(byId[id].sectionId);
    setPanelOpen(true);
  };
  const onPDF = () => {
    setFocus('all');
    setSelectedId(null);
    setStatus('Para entregar: selecciona Guardar como PDF, tamaño A3, horizontal, sin márgenes y gráficos de fondo activados. El mapa incluye las explicaciones de sus 24 conceptos.');
    window.setTimeout(() => window.print(), 220);
  };
  const onSVG = () => {
    try {
      exportSVG();
      setStatus('SVG exportado correctamente.');
    } catch (error) {
      setStatus(error.message);
    }
  };
  const onPNG = async () => {
    try {
      setStatus('Generando imagen…');
      await exportPNG();
      setStatus('PNG generado en alta resolución.');
    } catch (error) {
      setStatus(error.message);
    }
  };

  return (
    <div className="page">
      <header className="site-header">
        <div className="identity">
          <div className="identity-seal" aria-hidden="true">D<span>G</span></div>
          <div className="identity-copy">
            <span>Maestría en Docencia Superior</span>
            <strong>Proyecto de aprendizaje · Unidad II</strong>
          </div>
        </div>
        <div className="header-actions">
          <span className="header-subtle">Actividad individual N.º 2</span>
          <button type="button" className="text-button" onClick={() => setPanelOpen(true)}>
            <Icon name="list" size={18}/> Guía de lectura
          </button>
          <button type="button" className="button primary header-pdf" onClick={onPDF}>
            <Icon name="download" size={17}/> Exportar PDF
          </button>
        </div>
      </header>

      <main className="page-main">
        <section className="introduction">
          <div className="introduction-copy">
            <p className="overline">MAPA MENTAL DIGITAL / PANAMÁ</p>
            <h1>{metadata.title}</h1>
            <p>Una mirada a las normas que orientan la educación superior, los principios que la guían,
              los fines que persigue y las decisiones que hacen posible su gestión.</p>
          </div>
          <div className="edition-note">
            <span className="note-rule"/>
            <span>Una idea central.</span>
            <strong>Cuatro perspectivas<br/>que se conectan.</strong>
            <small>{total} ideas para comprender el conjunto.</small>
          </div>
        </section>

        <section className="studio" aria-label="Mapa mental interactivo">
          <div className="studio-topline">
            <div className="studio-label"><span className="tiny-mark" /> LÁMINA 01 <i>/</i> ADMINISTRACIÓN UNIVERSITARIA</div>
            <div className="studio-tools">
              <button type="button" className={editMode ? 'studio-edit active' : 'studio-edit'}
                onClick={toggleEditor} aria-pressed={editMode} title="Editar distribución">
                <Icon name="edit" size={16}/>{editMode ? 'Terminar edición' : 'Editar mapa'}
              </button>
              <button type="button" onClick={() => setZoom(v => Math.max(70, v - 10))}
                title="Alejar" aria-label="Alejar"><Icon name="minus" size={17}/></button>
              <span className="scale">{zoom}%</span>
              <button type="button" onClick={() => setZoom(v => Math.min(175, v + 10))}
                title="Acercar" aria-label="Acercar"><Icon name="plus" size={17}/></button>
              <button type="button" onClick={() => setZoom(100)}
                title="Restablecer tamaño" aria-label="Restablecer tamaño"><Icon name="reset" size={17}/></button>
            </div>
          </div>
          <div className="map-viewport">
            <div className="map-print-sheet" style={{ width: zoom + '%' }}>
              <MindMap selectedId={selectedId} focus={focus} onSelect={selectConcept}
                editMode={editMode} layout={layout} activeEdit={activeEdit}
                onEditSelect={setActiveEdit} onLayoutChange={setLayout}
                onEditCommit={recordHistory}/>
            </div>
          </div>
          <div className="studio-bottomline">
            <span>{editMode
              ? 'Arrastra los conceptos y óvalos; toca una línea para mover su curvatura.'
              : 'Selecciona cualquier concepto para leer su explicación.'}</span>
            <button className="subtle-link" type="button" onClick={() => setPanelOpen(true)}>
              Explorar contenidos <Icon name="arrow" size={17}/>
            </button>
          </div>
        </section>

        {editMode && (
          <div className="editor-toolbar" aria-label="Herramientas del editor visual">
            <div className="editor-info">
              <strong><Icon name="move" size={17}/> Editor de distribución</strong>
              <span>{activeEdit
                ? activeEdit.type === 'node' ? 'Concepto seleccionado: arrástralo con su descripción.'
                  : activeEdit.type === 'hub' ? 'Rama seleccionada: mueve el óvalo completo.'
                  : 'Conexión seleccionada: arrastra el punto circular para darle forma.'
                : 'Selecciona un concepto, una rama o una línea para moverlos.'}</span>
              <small>Guardado automático en este navegador. Los puntos de edición no aparecen en el PDF.</small>
            </div>
            <div className="editor-buttons">
              <button type="button" disabled={!undoCount} onClick={onUndoLayout}
                title="Deshacer el último movimiento"><Icon name="undo" size={16}/> Deshacer</button>
              <button type="button" onClick={onExportLayout}
                title="Descargar una copia de tus posiciones"><Icon name="save" size={16}/> Guardar JSON</button>
              <button type="button" onClick={() => importFileRef.current?.click()}
                title="Recuperar una distribución previamente guardada">
                <Icon name="upload" size={16}/> Cargar JSON
              </button>
              <button type="button" className="editor-reset" onClick={onResetLayout}
                title="Restablecer el mapa original"><Icon name="reset" size={16}/> Restaurar
              </button>
              <input ref={importFileRef} type="file" accept=".json,application/json"
                onChange={onImportLayout} style={{ display: 'none' }}/>
            </div>
          </div>
        )}

        <div className="page-details">
          <div className="branch-filter" aria-label="Destacar una rama">
            <span>Explorar por rama</span>
            <button type="button" onClick={() => setFocus('all')}
              className={focus === 'all' ? 'chosen' : ''}>Mapa completo</button>
            {sections.map(s => (
              <button type="button" key={s.id}
                className={focus === s.id ? 'chosen' : ''}
                onClick={() => setFocus(focus === s.id ? 'all' : s.id)}>
                <span className="color-line" style={{ background: s.color }}/>
                {s.title}
              </button>
            ))}
          </div>
          <div className="file-tools">
            <span>Descargar</span>
            <button type="button" onClick={onSVG}><Icon name="download" size={16}/> SVG</button>
            <button type="button" onClick={onPNG}><Icon name="download" size={16}/> PNG</button>
            <button type="button" className="pdf-link" onClick={onPDF}><Icon name="print" size={16}/> PDF</button>
          </div>
        </div>

        {status && <div role="status" className="status-message">{status}</div>}

        <div className="editorial-footnote">
          <span className="footnote-rule" />
          <p><strong>Lectura del mapa.</strong> La legislación establece el marco de actuación; los principios orientan la
            formación; los fines expresan el propósito social; y la administración universitaria
            traduce estas ideas en planificación, calidad y mejora continua.</p>
          <p>Materiales de la Unidad Didáctica II. Las relaciones administrativas son una
            interpretación académica elaborada a partir de los documentos suministrados.</p>
        </div>
      </main>

      <footer className="site-footer">
        <span>{metadata.activity}</span>
        <span>{metadata.author} · Panamá</span>
      </footer>

      {panelOpen && (
        <>
          <div className="drawer-backdrop" onClick={() => setPanelOpen(false)}
            aria-hidden="true" />
          <aside className="inspector" role="dialog" aria-modal="true"
            aria-label="Guía conceptual del mapa mental">
            <div className="inspector-head">
              <div>
                <p className="overline">NOTAS DE ESTUDIO</p>
                <h2>Detrás de cada idea</h2>
                <p>Una explicación sencilla para entender el mapa, no para llenarlo de texto.</p>
              </div>
              <button type="button" aria-label="Cerrar guía"
                onClick={() => setPanelOpen(false)} className="drawer-close"><Icon name="close"/></button>
            </div>
            <div className="inspector-body">
              <label className="search-field">
                <Icon name="search" size={18}/>
                <input placeholder="Buscar una idea..." value={search}
                  onChange={e => setSearch(e.target.value)}
                  aria-label="Buscar una idea" />
              </label>
              {search.trim() ? (
                <div className="search-list">
                  <p className="inspector-kicker">RESULTADOS · {filtered.length}</p>
                  {filtered.length ? filtered.map(item => (
                    <button key={item.id} type="button" onClick={() => selectConcept(item.id)}>
                      <strong>{item.title}</strong><span>{item.sectionTitle}</span>
                    </button>
                  )) : <p>No encontré coincidencias. Prueba con otra palabra.</p>}
                </div>
              ) : selected && selectedSection ? (
                <article className="concept-detail">
                  <div className="concept-toolbar">
                    <span className="detail-category" style={{ color: selectedSection.ink }}>
                      <span style={{ backgroundColor: selectedSection.color }}/>
                      {selectedSection.title}
                    </span>
                    <button type="button" onClick={() => setSelectedId(null)}
                      aria-label="Regresar a los temas">Ver temas</button>
                  </div>
                  <h3>{selected.title}</h3>
                  <p className="detail-lead">{selected.short}</p>
                  <h4>¿De qué trata?</h4>
                  <p>{selected.detail}</p>
                  <h4>¿Cómo se aplica en la universidad?</h4>
                  <p className="application">{selected.relation}</p>
                  <p className="source-inline"><Icon name="book" size={16}/>{selected.source}</p>
                </article>
              ) : (
                <>
                  <p className="inspector-kicker">ÍNDICE DE CONTENIDOS · {total} CONCEPTOS</p>
                  {sections.map(s => (
                    <div className="chapter" key={s.id}>
                      <button className="chapter-head" type="button"
                        onClick={() => setActiveList(activeList === s.id ? '' : s.id)}
                        aria-expanded={activeList === s.id}>
                        <span className="chapter-number" style={{ color: s.color }}>{s.order}</span>
                        <strong>{s.title}</strong>
                        <span className="chapter-count">{s.items.length}</span>
                      </button>
                      {activeList === s.id &&
                        <div className="chapter-items">
                          {s.items.map(item =>
                            <button key={item.id} type="button" onClick={() => selectConcept(item.id)}>
                              <span>{item.title}</span><Icon name="arrow" size={15}/>
                            </button>
                          )}
                        </div>}
                    </div>
                  ))}
                </>
              )}
              <div className="references">
                <p className="inspector-kicker">FUENTES DE LA ASIGNATURA</p>
                {metadata.sources.map((item, i) => <p key={i}>0{i + 1} / {item}</p>)}
              </div>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
