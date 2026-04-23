/* global React, ACQUA_DATA */
const { useState, useEffect, useRef, useMemo } = React;

// ==================== SMALL UI PRIMITIVES ====================

// Animated price counter
function PriceCount({ value, delay = 0 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf, t0;
    const timeout = setTimeout(() => {
      const step = (t) => {
        if (!t0) t0 = t;
        const p = Math.min(1, (t - t0) / 600);
        const eased = 1 - Math.pow(1 - p, 3);
        setV(value * eased);
        if (p < 1) raf = requestAnimationFrame(step);
        else setV(value);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(timeout); cancelAnimationFrame(raf); };
  }, [value, delay]);
  const n = v.toFixed(2).replace('.', ',');
  return <span className="price-count">{n}</span>;
}

// Waves
function Waves({ top = false, colors = ['#00AEEF', '#0B8FC7'], style = {} }) {
  return (
    <div className="waves" style={{ ...(top ? { top: 0 } : { bottom: 0 }), ...style }}>
      <svg viewBox="0 0 2400 140" preserveAspectRatio="none">
        <path className="w3" d="M0,60 Q300,10 600,60 T1200,60 T1800,60 T2400,60 V140 H0 Z" fill={colors[0]} opacity="0.4"/>
        <path className="w2" d="M0,80 Q300,40 600,80 T1200,80 T1800,80 T2400,80 V140 H0 Z" fill={colors[1]} opacity="0.6"/>
        <path className="w1" d="M0,100 Q300,70 600,100 T1200,100 T1800,100 T2400,100 V140 H0 Z" fill={colors[0]}/>
      </svg>
    </div>
  );
}

// Palm leaves
function Palm({ side = 'left', top = 0 }) {
  const flip = side === 'right' ? { transform: 'scaleX(-1)' } : {};
  return (
    <svg className="palm" width="180" height="200" viewBox="0 0 180 200"
      style={{ [side]: -30, top, ...flip }}>
      <g fill="#0F7A3E">
        {[-35, -10, 15, 40, 65].map((r, i) => (
          <path key={i} transform={`rotate(${r} 30 30)`}
            d="M30,30 Q80,10 150,25 Q120,35 95,45 Q70,42 30,30 Z"/>
        ))}
      </g>
    </svg>
  );
}

// Sticker logo
function AcquaLogo({ size = 1 }) {
  return (
    <div style={{ textAlign: 'center', lineHeight: 0.85, position: 'relative' }}>
      <div className="sticker cyan" style={{ fontSize: 20 * size, letterSpacing: '0.04em' }}>Cardápio</div>
      <div className="sticker orange" style={{ fontSize: 52 * size, marginTop: 4, fontFamily: 'Bowlby One', letterSpacing: '0.02em' }}>
        Acqua☀️
      </div>
    </div>
  );
}

// Acquaville sun mark
function SunMark({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <defs>
        <linearGradient id="sunG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFC107"/>
          <stop offset="1" stopColor="#F39200"/>
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="9" fill="url(#sunG)"/>
      {[0,45,90,135,180,225,270,315].map(a => (
        <path key={a} d="M20 4 L21 8 L19 8 Z" fill="#F39200"
          transform={`rotate(${a} 20 20)`} />
      ))}
      <path d="M5 28 Q12 24 20 28 T36 28" stroke="#00AEEF" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

// ==================== HOME PAGE ====================
function HomePage({ onOpenStation, onGoSearch }) {
  const data = window.ACQUA_DATA;
  const [scrollY, setScrollY] = useState(0);
  const scrollerRef = useRef(null);

  const onScroll = (e) => setScrollY(e.target.scrollTop);

  // Hero shrink interpolation — 0 expanded, 1 fully collapsed
  const t = Math.min(1, Math.max(0, scrollY / 110));
  const bigLogoOpacity = Math.max(0, 1 - t * 1.6);
  const bigLogoScale = 1 - t * 0.25;
  const subtitleOpacity = Math.max(0, 1 - t * 2);
  const decorOpacity = 1 - t;
  const topLogoOpacity = Math.max(0, (t - 0.25) * 1.8);

  return (
    <div className="page page-enter" style={{ background: '#FFF7EC' }}>
      {/* Hero */}
      <div
        className="hero"
        style={{
          paddingTop: 'max(28px, calc(env(safe-area-inset-top) + 16px))',
          paddingBottom: 20 + (1 - t) * 30,
          position: 'relative',
          zIndex: 5,
        }}
      >
        <div className="sun-bg" style={{ opacity: 0.9 * decorOpacity }}/>
        <div style={{ opacity: decorOpacity }}>
          <Palm side="left" top={80}/>
          <Palm side="right" top={40}/>
        </div>

        {/* Top bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 3,
          minHeight: 44,
          gap: 12,
        }}>
          <img
            src="logo.png"
            alt=""
            className="hero-top-logo"
            style={{
              height: 40,
              width: 'auto',
              display: 'block',
              opacity: topLogoOpacity,
              filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))',
              pointerEvents: topLogoOpacity > 0.5 ? 'auto' : 'none',
            }}
          />
          <button style={pillBtn} onClick={onGoSearch}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          </button>
        </div>

        {/* Big logo */}
        <div
          className="hero-big-logo"
          style={{
            textAlign: 'center',
            marginTop: 16,
            position: 'relative',
            zIndex: 2,
            maxHeight: (1 - t) * 320,
            opacity: bigLogoOpacity,
            transform: `scale(${bigLogoScale})`,
            transformOrigin: 'center top',
            overflow: 'hidden',
            pointerEvents: bigLogoOpacity > 0.5 ? 'auto' : 'none',
          }}
        >
          <div className="pop-in" style={{ animationDelay: '0.1s' }}>
            <img
              src="logo.png"
              alt="Acquaville Park Show"
              style={{
                width: 'min(72%, 260px)',
                maxWidth: 320,
                height: 'auto',
                display: 'block',
                margin: '0 auto',
                filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.2))',
              }}
            />
          </div>
          <div
            className="hero-subtitle fade-up"
            style={{
              color: '#fff', fontSize: 13, fontWeight: 500,
              marginTop: 10, textShadow: '0 1px 2px rgba(0,0,0,0.25)',
              animationDelay: '0.3s',
              opacity: subtitleOpacity,
            }}
          >
            Escolha uma estação e bora matar a fome ✨
          </div>
        </div>
      </div>

      {/* Body */}
      <div ref={scrollerRef} onScroll={onScroll} className="scroll-y" style={{ flex: 1, position: 'relative' }}>
        {/* Featured strip */}
        <div style={{ padding: '18px 0 6px', background: '#FFF7EC' }}>
          <div className="content-wrap" style={{ marginBottom: 8, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div className="section-title" style={{ color: '#D97706', fontSize: 14 }}>
              🔥 MAIS PEDIDOS
            </div>
          </div>
          <div className="scroll-x content-wrap" style={{ padding: '4px 16px 16px' }}>
            {getTopFeatured(data).map((it, i) => (
              <div key={it.name + i} className="fade-up" style={{
                minWidth: 160, flex: '0 0 auto',
                background: '#fff',
                borderRadius: 18, padding: 12,
                boxShadow: '0 2px 0 rgba(10,37,64,0.08), 0 6px 14px rgba(10,37,64,0.08)',
                animationDelay: `${0.1 + i * 0.06}s`,
                cursor: 'pointer',
              }} onClick={() => onOpenStation(it.stationId)}>
                <div style={{
                  height: 76,
                  borderRadius: 12,
                  background: `linear-gradient(135deg, ${it.color}22, ${it.color}55)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 42,
                  marginBottom: 8,
                }}>
                  <span className="bob">{it.emoji}</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#4B5563', marginBottom: 2 }}>
                  {it.station}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0a2540', lineHeight: 1.2, minHeight: 32 }}>
                  {it.name}
                </div>
                <div className="price-tag" style={{ fontSize: 16, marginTop: 4 }}>
                  <span className="currency">R$</span><PriceCount value={it.price} delay={200 + i * 80}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stations header */}
        <div className="content-wrap" style={{ padding: '8px 0 12px' }}>
          <div className="section-title" style={{ fontSize: 14 }}>{data.stations.length} ESTAÇÕES · 1 CARDÁPIO</div>
        </div>

        {/* Stations grid */}
        <div className="content-wrap stations-grid" style={{ paddingBottom: 100 }}>
          {data.stations.map((s, i) => {
            const itemCount = s.sections.reduce((n, sec) => n + sec.items.length, 0);
            const p = scrollY * 0.02 * (i % 2 === 0 ? 1 : -1);
            return (
              <div key={s.id} className="station-card fade-up"
                style={{
                  background: `linear-gradient(180deg, ${s.color} 0%, ${shade(s.color, -15)} 100%)`,
                  transform: `translateY(${p}px)`,
                  animationDelay: `${0.2 + i * 0.05}s`,
                  aspectRatio: '1/1.05',
                }}
                onClick={() => onOpenStation(s.id)}>
                {/* wave accent inside card */}
                <svg viewBox="0 0 200 60" preserveAspectRatio="none"
                  style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height: 32, opacity: 0.35 }}>
                  <path d="M0,30 Q50,10 100,30 T200,30 V60 H0 Z" fill="#fff"/>
                </svg>
                <div style={{ position: 'absolute', top: 10, right: 12, fontSize: 10, fontWeight: 700, color: '#fff', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {itemCount} itens
                </div>
                <div className="card-emoji" style={{ marginTop: 8 }}>
                  <span className="bob" style={{ animationDelay: `${i * 0.2}s` }}>{s.emoji}</span>
                </div>
                <div style={{
                  marginTop: 'auto',
                  color: '#fff',
                  position: 'relative',
                }}>
                  <div style={{
                    fontFamily: 'Bowlby One', fontSize: 18, lineHeight: 0.95,
                    textShadow: '0 2px 0 rgba(0,0,0,0.18)',
                    letterSpacing: '0.01em',
                  }}>
                    {s.name.replace('Point do ', '').replace('Doces da ', '')}
                  </div>
                  {s.name.includes('Point do') && (
                    <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.85, marginTop: 2 }}>Point do</div>
                  )}
                  <div style={{ fontSize: 11, fontWeight: 500, opacity: 0.9, marginTop: 4 }}>
                    🕐 {s.hours}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer splash */}
        <div style={{ padding: '12px 20px 40px', textAlign: 'center', color: '#9CA3AF', fontSize: 11 }}>
          🏝️ Acquaville Park Show · Cardápio digital
        </div>
      </div>
    </div>
  );
}

const pillBtn = {
  width: 40, height: 40, borderRadius: 12,
  background: 'rgba(255,255,255,0.95)', color: '#F39200',
  border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
  boxShadow: '0 2px 0 rgba(10,37,64,0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
  cursor: 'pointer',
};

function shade(hex, percent) {
  const num = parseInt(hex.replace('#',''), 16);
  const amt = Math.round(2.55 * percent);
  const r = (num >> 16) + amt;
  const g = ((num >> 8) & 0xff) + amt;
  const b = (num & 0xff) + amt;
  const c = (x) => Math.max(0, Math.min(255, x));
  return '#' + (0x1000000 + (c(r) << 16) + (c(g) << 8) + c(b)).toString(16).slice(1);
}

function guessEmoji(name, fallback) {
  const n = name.toLowerCase();
  if (n.includes('morango')) return '🍓';
  if (n.includes('bolo')) return '🎂';
  if (n.includes('chocolate') || n.includes('torta')) return '🍰';
  if (n.includes('picolé') || n.includes('sundae')) return '🍦';
  if (n.includes('brigadeiro')) return '🍫';
  if (n.includes('açaí')) return '🍇';
  if (n.includes('algodão')) return '🍭';
  if (n.includes('churros')) return '🥯';
  if (n.includes('coxinha') || n.includes('frango')) return '🍗';
  if (n.includes('batata')) return '🍟';
  if (n.includes('caipirinha') || n.includes('mojito') || n.includes('drink')) return '🍹';
  if (n.includes('beach') || n.includes('lagoa')) return '🏖️';
  if (n.includes('heineken') || n.includes('amstel') || n.includes('chopp') || n.includes('cerveja')) return '🍺';
  if (n.includes('whisky') || n.includes('vodka') || n.includes('gin')) return '🥃';
  if (n.includes('acarajé') || n.includes('bolinho')) return '🥙';
  if (n.includes('espetinho') || n.includes('bovino') || n.includes('suíno') || n.includes('carneiro') || n.includes('coração') || n.includes('coalho') || n.includes('medalhão')) return '🍢';
  if (n.includes('pudim') || n.includes('doce de leite')) return '🍮';
  if (n.includes('maçã')) return '🍎';
  if (n.includes('salgado')) return '🥟';
  if (n.includes('unicórnio')) return '🦄';
  if (n.includes('milk shake')) return '🥤';
  return fallback;
}

function getTopFeatured(data) {
  const out = [];
  data.stations.forEach(st => {
    st.sections.forEach(sec => {
      sec.items.forEach(it => {
        if (it.featured) out.push({ ...it, station: st.name, stationId: st.id, color: st.color, emoji: guessEmoji(it.name, st.emoji) });
      });
    });
  });
  return out.slice(0, 8);
}

window.HomePage = HomePage;
window.Waves = Waves;
window.AcquaLogo = AcquaLogo;
window.SunMark = SunMark;
window.PriceCount = PriceCount;
window.shade = shade;
window.pillBtn = pillBtn;
