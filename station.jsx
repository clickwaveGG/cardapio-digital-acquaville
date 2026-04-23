/* global React, ACQUA_DATA */
const { useState: useStateS, useEffect: useEffectS, useRef: useRefS, useMemo: useMemoS } = React;

// ==================== STATION PAGE ====================
function StationPage({ stationId, onBack }) {
  const data = window.ACQUA_DATA;
  const station = data.stations.find(s => s.id === stationId);
  const [filter, setFilter] = useStateS('tudo');
  const [scrollY, setScrollY] = useStateS(0);
  const scrollerRef = useRefS(null);
  const [activeSection, setActiveSection] = useStateS(station.sections[0].name);
  const sectionRefs = useRefS({});

  const onScroll = (e) => {
    setScrollY(e.target.scrollTop);
    // find visible section
    const top = e.target.scrollTop + 120;
    let curr = station.sections[0].name;
    for (const s of station.sections) {
      const el = sectionRefs.current[s.name];
      if (el && el.offsetTop <= top) curr = s.name;
    }
    setActiveSection(curr);
  };

  const filteredSections = useMemoS(() => {
    return station.sections.map(sec => {
      const items = sec.items.filter(it => {
        if (filter === 'tudo') return true;
        if (filter === 'featured') return it.featured;
        return (it.tags || []).includes(filter);
      });
      return { ...sec, items };
    }).filter(sec => sec.items.length > 0);
  }, [station, filter]);

  const hasAlcohol = station.sections.some(sec => sec.items.some(it => (it.tags||[]).includes('com-alcool')));
  const hasBeverage = station.sections.some(sec => sec.items.some(it => (it.tags||[]).includes('bebida')));
  const hasSweet = station.sections.some(sec => sec.items.some(it => (it.tags||[]).includes('doce')));
  const hasSavory = station.sections.some(sec => sec.items.some(it => (it.tags||[]).includes('salgado')));

  const featured = [];
  station.sections.forEach(sec => sec.items.forEach(it => { if (it.featured) featured.push({ ...it, section: sec.name }); }));

  const scrollToSection = (name) => {
    const el = sectionRefs.current[name];
    if (el && scrollerRef.current) {
      scrollerRef.current.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
    }
  };

  return (
    <div className="page page-enter" style={{ background: '#FFFDF9' }}>
      {/* Hero banner */}
      <div style={{
        position: 'relative',
        background: `linear-gradient(180deg, ${station.color} 0%, ${window.shade(station.color, -18)} 100%)`,
        paddingTop: 60,
        paddingBottom: 50,
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }}/>
        <div style={{ position: 'absolute', bottom: -40, left: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}/>

        {/* Back */}
        <div style={{ padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 3 }}>
          <button onClick={onBack} style={{
            ...window.pillBtn, width: 40, height: 40,
            color: station.color,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', opacity: 0.9 }}>
            🕐 {station.hours}
          </div>
        </div>

        {/* Emoji + title */}
        <div style={{ textAlign: 'center', padding: '20px 20px 0', position: 'relative', zIndex: 2 }}>
          <div className="pop-in" style={{ fontSize: 72, lineHeight: 1, filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.25))' }}>
            <span className="bob">{station.emoji}</span>
          </div>
          <div className="fade-up" style={{ animationDelay: '0.1s', marginTop: 6 }}>
            {station.subtitle && (
              <div style={{ fontFamily: 'Bowlby One', fontSize: 14, color: '#fff', opacity: 0.85, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {station.subtitle}
              </div>
            )}
            <div style={{
              fontFamily: 'Bowlby One', fontSize: 36, color: '#fff',
              letterSpacing: '0.01em',
              textShadow: '0 3px 0 rgba(0,0,0,0.2), 0 6px 10px rgba(0,0,0,0.15)',
              lineHeight: 1,
            }}>
              {station.name.replace(station.subtitle ? ' ' : '', '').replace('Point do ', '')}
            </div>
            <div style={{ fontSize: 13, color: '#fff', opacity: 0.9, marginTop: 8, fontWeight: 500 }}>
              {station.tagline}
            </div>
          </div>
        </div>

        {/* wave at bottom */}
        <svg viewBox="0 0 400 40" preserveAspectRatio="none" style={{ position: 'absolute', bottom: -1, left: 0, right: 0, width: '100%', height: 32 }}>
          <path d="M0,20 Q50,0 100,20 T200,20 T300,20 T400,20 V40 H0 Z" fill="#FFFDF9"/>
        </svg>
      </div>

      {/* Sticky section tabs */}
      <div style={{
        position: 'sticky', top: 0,
        background: '#FFFDF9',
        zIndex: 10,
        borderBottom: '1px solid rgba(10,37,64,0.06)',
      }}>
        <div className="scroll-x" style={{ padding: '10px 16px' }}>
          {station.sections.map(sec => (
            <button key={sec.name}
              onClick={() => scrollToSection(sec.name)}
              className="chip" style={{
                borderColor: activeSection === sec.name ? station.color : 'rgba(10,37,64,0.15)',
                background: activeSection === sec.name ? station.color : '#fff',
                color: activeSection === sec.name ? '#fff' : '#4B5563',
                boxShadow: activeSection === sec.name ? `0 2px 0 ${window.shade(station.color, -15)}` : 'none',
              }}>
              {sec.name}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="scroll-x" style={{ padding: '0 16px 10px' }}>
          <button className={'chip ' + (filter === 'tudo' ? 'active' : '')} onClick={() => setFilter('tudo')}>Tudo</button>
          {featured.length > 0 && (
            <button className={'chip ' + (filter === 'featured' ? 'active' : '')} onClick={() => setFilter('featured')}>🔥 Mais pedidos</button>
          )}
          {hasSweet && <button className={'chip ' + (filter === 'doce' ? 'active' : '')} onClick={() => setFilter('doce')}>🍭 Doce</button>}
          {hasSavory && <button className={'chip ' + (filter === 'salgado' ? 'active' : '')} onClick={() => setFilter('salgado')}>🍟 Salgado</button>}
          {hasBeverage && <button className={'chip ' + (filter === 'sem-alcool' ? 'active' : '')} onClick={() => setFilter('sem-alcool')}>💧 Sem álcool</button>}
          {hasAlcohol && <button className={'chip ' + (filter === 'com-alcool' ? 'active' : '')} onClick={() => setFilter('com-alcool')}>🍸 Com álcool</button>}
        </div>
      </div>

      {/* Content */}
      <div ref={scrollerRef} onScroll={onScroll} className="scroll-y" style={{ flex: 1 }}>
        {/* Featured row if present */}
        {featured.length > 0 && filter === 'tudo' && (
          <div style={{ padding: '14px 0 4px' }}>
            <div style={{ padding: '0 20px', marginBottom: 8 }}>
              <div className="section-title" style={{ color: window.shade(station.color, -20), fontSize: 13 }}>
                🔥 DESTAQUES DESTA ESTAÇÃO
              </div>
            </div>
            <div className="scroll-x" style={{ padding: '4px 20px 12px' }}>
              {featured.map((it, i) => (
                <div key={it.name} className="fade-up" style={{
                  minWidth: 160, padding: 12,
                  background: station.colorSoft,
                  borderRadius: 16,
                  animationDelay: `${i * 0.06}s`,
                  border: `1.5px solid ${station.color}33`,
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: station.color, letterSpacing: '0.05em', opacity: 0.8 }}>
                    {it.section}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#0a2540', marginTop: 4, lineHeight: 1.2, minHeight: 36 }}>
                    {it.name}
                  </div>
                  <div className="price-tag" style={{ fontSize: 18, marginTop: 6, color: window.shade(station.color, -20) }}>
                    <span className="currency">R$</span><window.PriceCount value={it.price} delay={i * 80}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All sections */}
        {filteredSections.map((sec, si) => (
          <div key={sec.name}
            ref={el => sectionRefs.current[sec.name] = el}
            style={{ padding: '18px 20px 12px' }}>
            <div className="section-title" style={{ color: window.shade(station.color, -20), marginBottom: 12 }}>
              {sec.name}
            </div>
            <div>
              {sec.items.map((it, i) => (
                <div key={it.name + i} className="item-row fade-up" style={{ animationDelay: `${Math.min(i * 0.03, 0.3)}s` }}>
                  <div style={{ flex: '0 1 auto', maxWidth: '60%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#0a2540', lineHeight: 1.2 }}>
                        {it.name}
                      </div>
                      {it.featured && <span className="badge-fire">🔥 TOP</span>}
                      {(it.tags||[]).includes('com-alcool') && <span style={{ fontSize: 10, color: '#9CA3AF' }}>+18</span>}
                    </div>
                    {it.desc && (
                      <div style={{ fontSize: 12, color: '#6B7280', marginTop: 3, lineHeight: 1.3 }}>{it.desc}</div>
                    )}
                  </div>
                  <div className="item-dots"/>
                  <div className="price-tag" style={{ fontSize: 16, color: window.shade(station.color, -20), flexShrink: 0 }}>
                    <span className="currency">R$</span><window.PriceCount value={it.price} delay={Math.min(i * 40, 500)}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredSections.length === 0 && (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#9CA3AF' }}>
            <div style={{ fontSize: 48, marginBottom: 8, opacity: 0.5 }}>🔍</div>
            <div style={{ fontWeight: 600 }}>Nenhum item com esse filtro</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Tente outra opção acima</div>
          </div>
        )}

        <div style={{ padding: '20px 0 60px', textAlign: 'center', color: '#9CA3AF', fontSize: 11 }}>
          🏝️ {station.name}
        </div>
      </div>
    </div>
  );
}

// ==================== SEARCH PAGE ====================
function SearchPage({ onBack, onOpenStation, initialQuery = '' }) {
  const data = window.ACQUA_DATA;
  const [q, setQ] = useStateS(initialQuery);
  const inputRef = useRefS(null);
  useEffectS(() => { setTimeout(() => inputRef.current?.focus(), 100); }, []);

  const results = useMemoS(() => {
    if (!q.trim()) return [];
    const query = q.toLowerCase();
    const out = [];
    data.stations.forEach(st => {
      st.sections.forEach(sec => {
        sec.items.forEach(it => {
          if (it.name.toLowerCase().includes(query) ||
              (it.desc && it.desc.toLowerCase().includes(query))) {
            out.push({ ...it, station: st, section: sec.name });
          }
        });
      });
    });
    return out;
  }, [q]);

  const suggestions = ['morango', 'brigadeiro', 'coxinha', 'açaí', 'drink', 'picolé'];

  return (
    <div className="page page-enter" style={{ background: '#FFFDF9' }}>
      {/* Header */}
      <div style={{
        padding: '60px 16px 14px',
        background: 'linear-gradient(180deg, #00AEEF 0%, #0284C7 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.3 }}>
          <window.Waves colors={['#0284C7', '#075985']}/>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', position: 'relative', zIndex: 2 }}>
          <button onClick={onBack} style={{ ...window.pillBtn, width: 40, height: 40, color: '#0284C7' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div className="search" style={{ flex: 1 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
            <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} placeholder="buscar item do cardápio…"/>
            {q && <button onClick={() => setQ('')} style={{ border: 'none', background: 'transparent', color: '#9CA3AF', cursor: 'pointer', fontSize: 18 }}>×</button>}
          </div>
        </div>
        <div style={{ fontSize: 12, color: '#fff', marginTop: 10, fontWeight: 500, position: 'relative', zIndex: 2 }}>
          {q.trim() ? `${results.length} resultado${results.length === 1 ? '' : 's'}` : 'Busque entre +100 itens'}
        </div>
      </div>

      {/* Content */}
      <div className="scroll-y" style={{ flex: 1 }}>
        {!q.trim() && (
          <div style={{ padding: '20px' }}>
            <div className="section-title" style={{ marginBottom: 12 }}>SUGESTÕES</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {suggestions.map(s => (
                <button key={s} className="chip" onClick={() => setQ(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {q.trim() && results.length === 0 && (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#9CA3AF' }}>
            <div style={{ fontSize: 48, marginBottom: 8, opacity: 0.5 }}>🔍</div>
            <div style={{ fontWeight: 600 }}>Nada encontrado pra "{q}"</div>
          </div>
        )}
        <div style={{ padding: '4px 16px 60px' }}>
          {results.map((r, i) => (
            <div key={r.name + i + r.station.id} className="fade-up"
              onClick={() => onOpenStation(r.station.id)}
              style={{
                display: 'flex', gap: 12, alignItems: 'center',
                padding: 12, marginTop: 8,
                background: '#fff',
                borderRadius: 14,
                boxShadow: '0 1px 3px rgba(10,37,64,0.05), 0 2px 8px rgba(10,37,64,0.04)',
                cursor: 'pointer',
                animationDelay: `${Math.min(i * 0.03, 0.25)}s`,
                border: '1px solid rgba(10,37,64,0.06)',
              }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: r.station.colorSoft,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, flexShrink: 0,
              }}>{r.station.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0a2540', lineHeight: 1.2 }}>{r.name}</div>
                <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
                  <span style={{ color: r.station.color, fontWeight: 600 }}>{r.station.name}</span> · {r.section}
                </div>
              </div>
              <div className="price-tag" style={{ fontSize: 16 }}>
                <span className="currency">R$</span>{r.price.toFixed(2).replace('.', ',')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.StationPage = StationPage;
window.SearchPage = SearchPage;
