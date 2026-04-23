/* global React */
const { useState, useRef, useEffect } = React;

// ============================================================
// Sketchy primitives — lo-fi wireframe vocabulary
// ============================================================

// Squiggly-border box using SVG filter for a hand-drawn feel via CSS
const Sketch = ({ children, style, className = '', as: Tag = 'div', ...rest }) => (
  <Tag className={`sketch-box ${className}`} style={style} {...rest}>{children}</Tag>
);

// Handwritten label
const Scribble = ({ children, size = 14, color = '#111', weight = 400, style = {}, ...rest }) => (
  <span
    style={{
      fontFamily: "'Caveat', 'Kalam', cursive",
      fontSize: size,
      color,
      fontWeight: weight,
      lineHeight: 1.1,
      ...style,
    }}
    {...rest}
  >{children}</span>
);

// "Real" label (still sketchy but more readable)
const Hand = ({ children, size = 12, color = '#222', weight = 500, style = {}, ...rest }) => (
  <span
    style={{
      fontFamily: "'Kalam', 'Caveat', cursive",
      fontSize: size,
      color,
      fontWeight: weight,
      lineHeight: 1.2,
      ...style,
    }}
    {...rest}
  >{children}</span>
);

// An "image placeholder" box with an X through it
const ImgBox = ({ w = '100%', h = 60, label, style = {}, dense = false }) => (
  <div style={{
    width: w, height: h, position: 'relative',
    border: '1.5px solid #333',
    borderRadius: 6,
    background: 'repeating-linear-gradient(135deg, #f0f0f0 0 6px, #fafafa 6px 12px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
    ...style,
  }}>
    {!dense && (
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="#bbb" strokeWidth="1" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="#bbb" strokeWidth="1" />
      </svg>
    )}
    {label && <Hand size={11} color="#666" style={{ position: 'relative', zIndex: 1, background: '#fafafa', padding: '1px 4px' }}>{label}</Hand>}
  </div>
);

// Horizontal "text line" placeholder
const Line = ({ w = '70%', h = 6, style = {} }) => (
  <div style={{ width: w, height: h, background: '#222', borderRadius: 2, ...style }} />
);

// Phone frame (sketch of a phone)
const Phone = ({ children, label, w = 280, h = 560 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
    <div style={{
      width: w + 24, height: h + 44, padding: '28px 12px 16px',
      border: '2.5px solid #111',
      borderRadius: 32,
      background: '#fff',
      position: 'relative',
      boxShadow: '3px 3px 0 #111',
    }}>
      {/* speaker notch */}
      <div style={{
        position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
        width: 50, height: 6, borderRadius: 3, border: '1.5px solid #111',
      }} />
      <div style={{
        width: w, height: h,
        border: '1.5px solid #111',
        borderRadius: 14,
        overflow: 'hidden',
        position: 'relative',
        background: '#fff',
      }}>
        {children}
      </div>
    </div>
    {label && <Hand size={14} color="#444" weight={600}>{label}</Hand>}
  </div>
);

// Arrow annotation
const Arrow = ({ from, to, label, curve = 0 }) => {
  // from/to are {x,y} in canvas coords
  const mx = (from.x + to.x) / 2 + curve;
  const my = (from.y + to.y) / 2 - 20;
  return (
    <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}>
      <path
        d={`M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`}
        stroke="#d94b1f" strokeWidth="2" fill="none" strokeDasharray="4 3"
        markerEnd="url(#arrowhead)"
      />
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill="#d94b1f" />
        </marker>
      </defs>
      {label && (
        <text x={mx} y={my - 6} textAnchor="middle" fontFamily="Caveat, cursive" fontSize="16" fill="#d94b1f">{label}</text>
      )}
    </svg>
  );
};

// Status bar sketch
const StatusBar = () => (
  <div style={{ height: 18, padding: '0 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #ccc' }}>
    <Hand size={10} color="#666">9:41</Hand>
    <div style={{ display: 'flex', gap: 3 }}>
      <div style={{ width: 14, height: 7, border: '1px solid #888', borderRadius: 2 }} />
    </div>
  </div>
);

// The 8 stations
const STATIONS = [
  { name: 'Restaurante', icon: '🍽️', color: '#ffb547' },
  { name: 'Lanchonete', icon: '🍦', color: '#4fc3f7' },
  { name: 'Doces da Mara', icon: '🍭', color: '#ef5b5b' },
  { name: 'Point do Petisco', icon: '🍟', color: '#ffb547' },
  { name: 'Point do Acquarajé', icon: '🥙', color: '#ff7043' },
  { name: 'Point do Açaí', icon: '🍇', color: '#e57cc5' },
  { name: 'Bar Molhado', icon: '🍹', color: '#ffd54f' },
  { name: 'Espetinho', icon: '🍢', color: '#d94b1f' },
];

// ============================================================
// DIRECTION A — Cards grid home
// ============================================================
const DirA_Home = () => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <StatusBar />
    {/* top bar */}
    <div style={{ padding: '10px 12px', borderBottom: '1px solid #ddd' }}>
      <Scribble size={22} weight={700} color="#d94b1f">Cardápio</Scribble>
      <Scribble size={22} weight={700} color="#2c95c8" style={{ marginLeft: 6 }}>Acqua</Scribble>
      <div style={{ marginTop: 8, border: '1.5px solid #333', borderRadius: 18, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
        <Hand size={11} color="#999">🔍</Hand>
        <Hand size={11} color="#999">buscar item…</Hand>
      </div>
    </div>
    {/* filters chip row */}
    <div style={{ padding: '8px 12px', display: 'flex', gap: 6, borderBottom: '1px dashed #ddd' }}>
      {['Tudo', 'Salg.', 'Doce', 'Bebida', 'Álcool'].map((t, i) => (
        <div key={t} style={{
          padding: '2px 8px', borderRadius: 10,
          border: '1px solid ' + (i === 0 ? '#d94b1f' : '#888'),
          background: i === 0 ? '#fff4ee' : '#fff',
        }}>
          <Hand size={10} color={i === 0 ? '#d94b1f' : '#555'}>{t}</Hand>
        </div>
      ))}
    </div>
    {/* grid */}
    <div style={{ flex: 1, overflow: 'hidden', padding: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      {STATIONS.slice(0, 6).map((s, i) => (
        <div key={s.name} style={{
          border: '1.5px solid #333', borderRadius: 10, padding: 8,
          background: '#fff',
          boxShadow: '2px 2px 0 #333',
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          <ImgBox h={50} label="foto" />
          <Hand size={11} weight={700} color="#222">{s.name}</Hand>
          <Hand size={9} color="#777">{['4 sucos','picolés','brigadeiros','batatas','acarajé','açaí'][i]}…</Hand>
        </div>
      ))}
    </div>
    {/* bottom nav */}
    <div style={{ borderTop: '1.5px solid #111', padding: '8px 0', display: 'flex', justifyContent: 'space-around' }}>
      {['🏠','⭐','🕐','ℹ️'].map((x, i) => <Hand key={i} size={14}>{x}</Hand>)}
    </div>
  </div>
);

const DirA_Station = () => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <StatusBar />
    {/* hero */}
    <div style={{ height: 70, background: '#fff4ee', borderBottom: '1.5px solid #333', position: 'relative', padding: 8 }}>
      <Hand size={10} color="#666">← voltar</Hand>
      <Scribble size={20} weight={700} color="#d94b1f" style={{ display: 'block', marginTop: 4 }}>Restaurante</Scribble>
      <Hand size={9} color="#888">abre 10h • fecha 18h</Hand>
    </div>
    {/* section */}
    <div style={{ flex: 1, overflow: 'hidden', padding: 10 }}>
      <Hand size={12} weight={700} color="#2c95c8" style={{ display: 'block', marginBottom: 6 }}>SUCOS</Hand>
      {['Manga','Morango','Abacaxi','Maracujá'].map((n, i) => (
        <div key={n} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '6px 0', borderBottom: '1px dashed #ccc',
        }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <ImgBox w={30} h={30} dense />
            <Hand size={11}>{n}</Hand>
          </div>
          <Hand size={11} weight={700} color="#d94b1f">R$ 6,50</Hand>
        </div>
      ))}
      <Hand size={12} weight={700} color="#2c95c8" style={{ display: 'block', margin: '10px 0 6px' }}>SOBREMESAS</Hand>
      {['Pudim','Doce de leite','Bolo de pote'].map((n) => (
        <div key={n} style={{
          display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px dashed #ccc',
        }}>
          <Hand size={11}>{n}</Hand>
          <Hand size={11} weight={700} color="#d94b1f">R$ 8,00</Hand>
        </div>
      ))}
    </div>
  </div>
);

// ============================================================
// DIRECTION B — Mapa do parque
// ============================================================
const DirB_Home = () => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <StatusBar />
    <div style={{ padding: '10px 12px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Scribble size={20} weight={700} color="#2c95c8">Mapa do parque</Scribble>
      <Hand size={11} color="#666">🔍</Hand>
    </div>
    {/* map area */}
    <div style={{ flex: 1, position: 'relative', background: '#eef7fb' }}>
      {/* pool squiggles */}
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }} viewBox="0 0 280 420" preserveAspectRatio="none">
        <path d="M 30 80 Q 90 60 140 100 T 250 120 L 260 200 Q 180 220 140 190 T 20 220 Z" fill="#b3e0f2" stroke="#2c95c8" strokeWidth="1.5" />
        <path d="M 40 260 Q 130 240 200 280 T 260 340 L 250 380 L 30 380 Z" fill="#c7ecd9" stroke="#2ba775" strokeWidth="1.5" />
        {/* paths */}
        <path d="M 20 100 Q 100 140 180 120 T 260 180" stroke="#bbb" strokeWidth="1" fill="none" strokeDasharray="3 3" />
        <path d="M 40 300 Q 130 280 220 320" stroke="#bbb" strokeWidth="1" fill="none" strokeDasharray="3 3" />
      </svg>
      {/* pins */}
      {[
        { x: 40, y: 50, s: STATIONS[0] },
        { x: 200, y: 40, s: STATIONS[1] },
        { x: 110, y: 140, s: STATIONS[2] },
        { x: 230, y: 170, s: STATIONS[3] },
        { x: 60, y: 210, s: STATIONS[4] },
        { x: 170, y: 260, s: STATIONS[5] },
        { x: 50, y: 330, s: STATIONS[6] },
        { x: 220, y: 370, s: STATIONS[7] },
      ].map((p, i) => (
        <div key={i} style={{
          position: 'absolute', left: p.x, top: p.y,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50% 50% 50% 0',
            transform: 'rotate(-45deg)',
            background: p.s.color, border: '2px solid #111',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '1px 1px 0 #111',
          }}>
            <div style={{ transform: 'rotate(45deg)', fontSize: 13 }}>{p.s.icon}</div>
          </div>
          <Hand size={8} color="#111" weight={700} style={{ marginTop: 2, background: '#fff', padding: '1px 3px', borderRadius: 3, border: '1px solid #333', whiteSpace: 'nowrap' }}>
            {p.s.name.replace('Point do ','').replace(' do Acquaville','')}
          </Hand>
        </div>
      ))}
    </div>
    {/* bottom list peek */}
    <div style={{ borderTop: '2px solid #111', padding: 8, background: '#fff' }}>
      <Hand size={10} color="#666">↕ arraste pra ver lista</Hand>
      <div style={{ display: 'flex', gap: 6, marginTop: 4, overflow: 'hidden' }}>
        {STATIONS.slice(0, 4).map(s => (
          <div key={s.name} style={{ minWidth: 60, border: '1px solid #333', borderRadius: 6, padding: 4, background: '#fff' }}>
            <div style={{ textAlign: 'center', fontSize: 14 }}>{s.icon}</div>
            <Hand size={8} color="#444" style={{ display: 'block', textAlign: 'center' }}>{s.name.split(' ')[0]}</Hand>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const DirB_Station = () => (
  <div style={{ height: '100%', position: 'relative' }}>
    {/* backdrop — blurred map */}
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #b3e0f2 0%, #c7ecd9 100%)', opacity: 0.5 }} />
    {/* sheet */}
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      height: '78%',
      background: '#fff', borderTop: '2px solid #111',
      borderRadius: '16px 16px 0 0', padding: 12,
      boxShadow: '0 -3px 0 #111',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ width: 40, height: 4, background: '#333', margin: '0 auto 8px', borderRadius: 2 }} />
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
        <div style={{ fontSize: 22 }}>🍹</div>
        <Scribble size={20} weight={700} color="#d94b1f">Bar Molhado</Scribble>
      </div>
      <Hand size={10} color="#888">drinks · bebidas · combos · abre 11h</Hand>
      <div style={{ display: 'flex', gap: 4, margin: '8px 0' }}>
        {['Com álcool','Sem álcool','Geladas','Destilados','Combos'].map((t, i) => (
          <div key={t} style={{
            padding: '2px 6px', borderRadius: 10,
            border: '1px solid ' + (i === 0 ? '#d94b1f' : '#888'),
            background: i === 0 ? '#fff4ee' : '#fff',
          }}>
            <Hand size={9} color={i === 0 ? '#d94b1f' : '#555'}>{t}</Hand>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {[
          ['Caipirinha', 'Limão, açúcar, cachaça e gelo.', '18,00'],
          ['Mojito', 'Hortelã, limão, rum, gás.', '25,00'],
          ['Sex on the Beach', 'Vodka, pêssego, vermelhas…', '28,00'],
          ['Acqua Old Bale', 'Whisky, hortelã, açúcar…', '30,00'],
        ].map(([n, d, p]) => (
          <div key={n} style={{ padding: '6px 0', borderBottom: '1px dashed #ccc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Hand size={11} weight={700}>{n}</Hand>
              <Hand size={11} weight={700} color="#d94b1f">R$ {p}</Hand>
            </div>
            <Hand size={9} color="#777">{d}</Hand>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ============================================================
// DIRECTION C — Feed único com sticky tabs
// ============================================================
const DirC_Home = () => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <StatusBar />
    <div style={{ padding: '8px 10px', borderBottom: '1px solid #ddd' }}>
      <Scribble size={18} weight={700} color="#d94b1f">Cardápio Acquaville</Scribble>
      <div style={{ marginTop: 6, border: '1.5px solid #333', borderRadius: 16, padding: '3px 8px' }}>
        <Hand size={10} color="#999">🔍 buscar item…</Hand>
      </div>
    </div>
    {/* sticky tabs */}
    <div style={{
      display: 'flex', gap: 4, padding: '6px 8px',
      borderBottom: '2px solid #111',
      overflow: 'hidden',
      background: '#fffbe8',
    }}>
      {['Restaur.', 'Lanch.', 'Doces', 'Petisco', 'Acqua.', 'Açaí', 'Bar', 'Esp.'].map((t, i) => (
        <div key={t} style={{
          padding: '3px 6px', borderRadius: 6,
          border: '1.5px solid ' + (i === 2 ? '#d94b1f' : '#888'),
          background: i === 2 ? '#d94b1f' : '#fff',
          whiteSpace: 'nowrap',
        }}>
          <Hand size={9} color={i === 2 ? '#fff' : '#555'} weight={600}>{t}</Hand>
        </div>
      ))}
    </div>
    {/* feed */}
    <div style={{ flex: 1, overflow: 'hidden', padding: '10px 12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <div style={{ fontSize: 16 }}>🍭</div>
        <Scribble size={16} weight={700} color="#ef5b5b">Doces da Mara</Scribble>
      </div>
      {[
        ['Algodão doce no palito','8,00'],
        ['Bala baiana','6,00'],
        ['Brigadeiros','3,00'],
        ['Churros','8,00'],
        ['Maçã do amor','10,00'],
        ['Morango do amor','15,00'],
      ].map(([n, p]) => (
        <div key={n} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: '1px dashed #ddd' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <ImgBox w={24} h={24} dense />
            <Hand size={10}>{n}</Hand>
          </div>
          <Hand size={10} weight={700} color="#d94b1f">R$ {p}</Hand>
        </div>
      ))}
      <Hand size={9} color="#aaa" style={{ display: 'block', textAlign: 'center', marginTop: 10 }}>
        ↓ próxima estação: Point do Petisco
      </Hand>
    </div>
  </div>
);

const DirC_Search = () => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <StatusBar />
    <div style={{ padding: '8px 10px', borderBottom: '2px solid #111' }}>
      <div style={{ border: '1.5px solid #d94b1f', borderRadius: 16, padding: '4px 10px', background: '#fff4ee', display: 'flex', gap: 6 }}>
        <Hand size={11} color="#d94b1f">🔍</Hand>
        <Hand size={11} color="#222" weight={700}>morango</Hand>
        <Hand size={11} color="#666" style={{ marginLeft: 'auto' }}>✕</Hand>
      </div>
      <Hand size={9} color="#888" style={{ marginTop: 4, display: 'block' }}>7 resultados em 3 estações</Hand>
    </div>
    <div style={{ flex: 1, overflow: 'hidden', padding: 10 }}>
      {[
        ['Suco de morango','Restaurante','6,50'],
        ['Delícia de morango','Restaurante','10,00'],
        ['Picolé morango','Lanchonete','4,00'],
        ['Quy Frutti morango','Lanchonete','5,00'],
        ['Fondue de morango','Doces da Mara','10,00'],
        ['Morango do amor','Doces da Mara','15,00'],
        ['Morango refrescante','Bar Molhado','18,00'],
      ].map(([n, st, p]) => (
        <div key={n} style={{ padding: '6px 0', borderBottom: '1px dashed #ccc', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Hand size={10} weight={700}>{n}</Hand>
            <Hand size={8} color="#888" style={{ display: 'block' }}>em {st}</Hand>
          </div>
          <Hand size={10} weight={700} color="#d94b1f">R$ {p}</Hand>
        </div>
      ))}
    </div>
  </div>
);

// ============================================================
// DIRECTION D — Carrossel stories
// ============================================================
const DirD_Home = () => (
  <div style={{ height: '100%', position: 'relative', background: '#fff4ee' }}>
    <StatusBar />
    {/* progress segments */}
    <div style={{ display: 'flex', gap: 3, padding: '6px 10px' }}>
      {STATIONS.map((s, i) => (
        <div key={i} style={{
          flex: 1, height: 3, borderRadius: 2,
          background: i < 2 ? '#d94b1f' : (i === 2 ? '#ff8855' : '#ddd'),
        }} />
      ))}
    </div>
    {/* station hero */}
    <div style={{ padding: '14px 14px 8px' }}>
      <Hand size={10} color="#888">3 de 8</Hand>
      <Scribble size={28} weight={700} color="#ef5b5b" style={{ display: 'block', marginTop: 4 }}>
        Doces da Mara
      </Scribble>
      <Hand size={10} color="#888">21 itens · algodão · brigadeiros · bolos</Hand>
    </div>
    <ImgBox h={120} label="banner da estação" style={{ margin: '0 14px' }} />
    {/* featured */}
    <div style={{ padding: 10, marginTop: 6 }}>
      <Hand size={10} weight={700} color="#2c95c8" style={{ display: 'block', marginBottom: 4 }}>🔥 MAIS PEDIDOS</Hand>
      <div style={{ display: 'flex', gap: 6, overflow: 'hidden' }}>
        {[['Brigad.','3'],['Churros','8'],['Maçã amor','10'],['Torta choc.','15']].map(([n,p]) => (
          <div key={n} style={{ minWidth: 70, border: '1.5px solid #333', borderRadius: 6, padding: 4, background: '#fff' }}>
            <ImgBox h={34} dense />
            <Hand size={9} weight={700} style={{ display: 'block', marginTop: 2 }}>{n}</Hand>
            <Hand size={9} color="#d94b1f" weight={700}>R${p}</Hand>
          </div>
        ))}
      </div>
    </div>
    <div style={{ padding: '0 14px', marginTop: 10 }}>
      <Hand size={10} color="#444">↓ ver cardápio completo</Hand>
    </div>
    {/* swipe hints on sides */}
    <div style={{ position: 'absolute', left: 2, top: '50%', opacity: 0.5 }}><Hand size={18}>‹</Hand></div>
    <div style={{ position: 'absolute', right: 2, top: '50%', opacity: 0.8 }}><Hand size={18}>›</Hand></div>
    {/* station dots preview */}
    <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 4 }}>
      {STATIONS.map((s, i) => (
        <div key={i} style={{
          width: 18, height: 18, borderRadius: '50%',
          border: '1.5px solid ' + (i === 2 ? '#d94b1f' : '#888'),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: i === 2 ? '#ffe1d4' : '#fff', fontSize: 9,
        }}>{s.icon}</div>
      ))}
    </div>
  </div>
);

const DirD_Detail = () => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <StatusBar />
    <div style={{ padding: '6px 10px', display: 'flex', gap: 3 }}>
      {STATIONS.map((s, i) => (
        <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < 2 ? '#d94b1f' : (i === 2 ? '#ff8855' : '#ddd') }} />
      ))}
    </div>
    <div style={{ padding: '8px 14px', background: '#fff4ee', borderBottom: '1.5px solid #333' }}>
      <Scribble size={20} weight={700} color="#ef5b5b">Doces da Mara</Scribble>
      <Hand size={9} color="#888" style={{ display: 'block' }}>21 itens</Hand>
    </div>
    <div style={{ flex: 1, overflow: 'hidden', padding: 10 }}>
      {[
        ['Algodão doce no palito','8,00'],
        ['Algodão doce no pote','10,00'],
        ['Amendoim torrado','6,00'],
        ['Bala baiana','6,00'],
        ['Brigadeiros','3,00'],
        ['Bolo no pote','12,00'],
        ['Chiclete','1,00'],
        ['Churros','8,00'],
        ['Doce de leite','10,00'],
        ['Donut','6,00'],
        ['Fondue de morango','10,00'],
      ].map(([n, p]) => (
        <div key={n} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px dashed #ddd' }}>
          <Hand size={10}>{n}</Hand>
          <Hand size={10} weight={700} color="#d94b1f">R$ {p}</Hand>
        </div>
      ))}
    </div>
  </div>
);

// ============================================================
// Notes panel
// ============================================================
const Notes = ({ title, pros, cons, best }) => (
  <div style={{
    width: 260, padding: 14,
    border: '1.5px dashed #333', borderRadius: 10,
    background: '#fffbe8',
    boxShadow: '2px 2px 0 #333',
    display: 'flex', flexDirection: 'column', gap: 8,
  }}>
    <Scribble size={20} weight={700} color="#d94b1f">{title}</Scribble>
    <div>
      <Hand size={11} weight={700} color="#2ba775">+ PRÓS</Hand>
      <ul style={{ margin: '2px 0 0 14px', padding: 0 }}>
        {pros.map((p, i) => <li key={i}><Hand size={11} color="#222">{p}</Hand></li>)}
      </ul>
    </div>
    <div>
      <Hand size={11} weight={700} color="#d94b1f">− CONTRAS</Hand>
      <ul style={{ margin: '2px 0 0 14px', padding: 0 }}>
        {cons.map((p, i) => <li key={i}><Hand size={11} color="#222">{p}</Hand></li>)}
      </ul>
    </div>
    <div style={{ borderTop: '1px dashed #888', paddingTop: 6 }}>
      <Hand size={11} weight={700} color="#2c95c8">★ MELHOR PRA</Hand>
      <Hand size={11} color="#222" style={{ display: 'block', marginTop: 2 }}>{best}</Hand>
    </div>
  </div>
);

// ============================================================
// Flow row — shows 2 phones side by side + arrow + notes
// ============================================================
const FlowRow = ({ title, summary, screens, notes }) => (
  <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', padding: '30px 20px', flexWrap: 'nowrap' }}>
    <div style={{ display: 'flex', gap: 40, alignItems: 'center', position: 'relative' }}>
      {screens.map((sc, i) => (
        <React.Fragment key={i}>
          <Phone label={sc.label}>{sc.content}</Phone>
          {i < screens.length - 1 && (
            <svg width="60" height="80" style={{ marginTop: 0 }} viewBox="0 0 60 80">
              <path d="M 5 40 Q 25 20 55 40" stroke="#d94b1f" strokeWidth="2.5" fill="none" strokeDasharray="5 4" />
              <path d="M 55 40 L 48 35 M 55 40 L 48 45" stroke="#d94b1f" strokeWidth="2.5" fill="none" />
              <text x="30" y="14" textAnchor="middle" fontFamily="Caveat, cursive" fontSize="18" fill="#d94b1f">tap</text>
            </svg>
          )}
        </React.Fragment>
      ))}
    </div>
    <Notes {...notes} />
  </div>
);

// ============================================================
// Direction artboards
// ============================================================
const DirectionA = () => (
  <FlowRow
    title="A — Grid de cards"
    screens={[
      { label: 'home · grid 2-col', content: <DirA_Home /> },
      { label: 'estação aberta', content: <DirA_Station /> },
    ]}
    notes={{
      title: 'A · Grid',
      pros: ['Familiar — tipo iFood/Uber Eats', 'Fotos em destaque vendem os pratos', 'Bem claro: cada estação é um card'],
      cons: ['Genérico — pouco "parque aquático"', 'Precisa tap extra pra ver itens'],
      best: 'Rapidez e clareza — cliente sabe o que quer.',
    }}
  />
);

const DirectionB = () => (
  <FlowRow
    title="B — Mapa do parque"
    screens={[
      { label: 'mapa pictórico com pins', content: <DirB_Home /> },
      { label: 'bottom-sheet da estação', content: <DirB_Station /> },
    ]}
    notes={{
      title: 'B · Mapa',
      pros: ['Imersivo — liga o cardápio ao parque', 'Ajuda achar a estação fisicamente', 'Memorável, "fala sobre"'],
      cons: ['Exige ilustração do mapa', 'Menos eficiente pra busca pura', 'Pins podem virar confuso'],
      best: 'Primeira vez no parque — explorar.',
    }}
  />
);

const DirectionC = () => (
  <FlowRow
    title="C — Feed único + sticky tabs"
    screens={[
      { label: 'feed unificado', content: <DirC_Home /> },
      { label: 'busca ativa', content: <DirC_Search /> },
    ]}
    notes={{
      title: 'C · Feed',
      pros: ['Tudo em uma tela só — zero navegação', 'Busca e filtros brilham', 'Scroll infinito é viciante'],
      cons: ['Lista longa pode cansar', 'Perde identidade única de cada estação'],
      best: 'Quem já conhece e quer achar rápido.',
    }}
  />
);

const DirectionD = () => (
  <FlowRow
    title="D — Stories swipe"
    screens={[
      { label: 'estação atual (swipe)', content: <DirD_Home /> },
      { label: 'lista completa', content: <DirD_Detail /> },
    ]}
    notes={{
      title: 'D · Stories',
      pros: ['Cada estação tem sua cara', 'Gesture nativo de mobile (swipe)', 'Destaques em primeiro plano'],
      cons: ['Navegar pra uma estação específica é chato', 'Pode frustrar quem tem pressa'],
      best: 'Experiência "passeio" — descobrir novidades.',
    }}
  />
);

// Summary artboard (first)
const Summary = () => (
  <div style={{
    width: 800, padding: 30,
    background: 'linear-gradient(135deg, #fff9f0 0%, #f0f7fb 100%)',
    border: '1.5px solid #333', borderRadius: 12,
    boxShadow: '3px 3px 0 #333',
  }}>
    <Scribble size={42} weight={700} color="#d94b1f">Cardápio Acquaville</Scribble>
    <Scribble size={24} weight={400} color="#2c95c8" style={{ display: 'block', marginTop: 4 }}>
      4 direções de wireframe — qual seguimos?
    </Scribble>
    <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      {[
        ['A · Grid', 'Home com 8 cards → tap abre a estação. O mais direto e familiar.'],
        ['B · Mapa', 'Mapa pictórico do parque com pins. Imersivo — liga comida ao lugar.'],
        ['C · Feed', 'Uma lista só, abas sticky pra pular. Busca/filtro brilham aqui.'],
        ['D · Stories', 'Swipe estação por estação, como stories. Cada uma com sua cara.'],
      ].map(([t, d]) => (
        <div key={t} style={{ padding: 10, background: '#fff', border: '1.5px dashed #888', borderRadius: 8 }}>
          <Hand size={16} weight={700} color="#d94b1f">{t}</Hand>
          <Hand size={13} color="#333" style={{ display: 'block', marginTop: 4 }}>{d}</Hand>
        </div>
      ))}
    </div>
    <div style={{ marginTop: 20, padding: 12, background: '#fffbe8', border: '1.5px dashed #333', borderRadius: 8 }}>
      <Hand size={13} weight={700} color="#2c95c8">Base comum em TODAS</Hand>
      <Hand size={13} color="#222" style={{ display: 'block', marginTop: 4 }}>
        busca de itens • filtros (com/sem álcool, salgado/doce, faixa de preço) • destaques "mais pedidos" • horário de cada estação • 8 pontos de venda (Restaurante, Lanchonete, Doces da Mara, Point do Petisco, Acquarajé, Açaí, Bar Molhado, Espetinho)
      </Hand>
    </div>
    <Hand size={13} color="#888" style={{ display: 'block', marginTop: 14 }}>
      ↓ arraste pra explorar cada direção. me diz qual (ou quais) gostou que eu levo pra alta fidelidade com cores, fotos e animações.
    </Hand>
  </div>
);

// ============================================================
// Root — wraps everything in DesignCanvas
// ============================================================
const App = () => {
  const { DesignCanvas, DCSection, DCArtboard } = window;
  return (
    <DesignCanvas title="Cardápio Acquaville · Wireframes" subtitle="4 direções pra navegação mobile — escolha uma">
      <DCSection id="overview" title="Overview">
        <DCArtboard id="summary" label="resumo" width={860} height={540}>
          <Summary />
        </DCArtboard>
      </DCSection>
      <DCSection id="directions" title="4 direções">
        <DCArtboard id="A" label="A · Grid de cards" width={1020} height={720}>
          <DirectionA />
        </DCArtboard>
        <DCArtboard id="B" label="B · Mapa do parque" width={1020} height={720}>
          <DirectionB />
        </DCArtboard>
        <DCArtboard id="C" label="C · Feed + tabs" width={1020} height={720}>
          <DirectionC />
        </DCArtboard>
        <DCArtboard id="D" label="D · Stories swipe" width={1020} height={720}>
          <DirectionD />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
