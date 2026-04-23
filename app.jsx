/* global React */
const { useState: useStateA, useEffect: useEffectA } = React;

function App() {
  const [route, setRoute] = useStateA({ name: 'home' });
  const [history, setHistory] = useStateA([]);
  const [scale, setScale] = useStateA(1);

  useEffectA(() => {
    const fit = () => {
      const margin = 60;
      const s = Math.min(1, (window.innerHeight - margin) / 844, (window.innerWidth - margin) / 390);
      setScale(s);
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  const go = (r) => {
    setHistory(h => [...h, route]);
    setRoute(r);
  };
  const back = () => {
    setHistory(h => {
      if (h.length === 0) { setRoute({ name: 'home' }); return []; }
      const prev = h[h.length - 1];
      setRoute(prev);
      return h.slice(0, -1);
    });
  };

  let page = null;
  if (route.name === 'home') {
    page = <window.HomePage
      onOpenStation={(id) => go({ name: 'station', id })}
      onGoSearch={() => go({ name: 'search' })} />;
  } else if (route.name === 'station') {
    page = <window.StationPage key={route.id} stationId={route.id} onBack={back}/>;
  } else if (route.name === 'search') {
    page = <window.SearchPage onBack={back}
      onOpenStation={(id) => go({ name: 'station', id })}/>;
  }

  return (
    <div style={{
      width: '100vw', height: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #00AEEF 0%, #0284C7 50%, #F39200 100%)',
      backgroundSize: '200% 200%',
      animation: 'bgShift 20s ease infinite',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes bgShift {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>

      {/* Floating decoration outside phone */}
      <div style={{ position: 'absolute', top: '8%', left: '8%', fontSize: 60, opacity: 0.25, animation: 'bob 4s ease-in-out infinite' }}>🏝️</div>
      <div style={{ position: 'absolute', bottom: '12%', right: '8%', fontSize: 50, opacity: 0.25, animation: 'bob 5s ease-in-out infinite' }}>🌊</div>
      <div style={{ position: 'absolute', top: '18%', right: '12%', fontSize: 44, opacity: 0.2, animation: 'bob 6s ease-in-out infinite' }}>☀️</div>
      <div style={{ position: 'absolute', bottom: '18%', left: '10%', fontSize: 40, opacity: 0.22, animation: 'bob 7s ease-in-out infinite' }}>🍹</div>

      <div className="phone-shell" style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
        <div className="phone-notch"/>
        <div className="phone-screen">
          {/* iOS status bar */}
          <div className="ios-status on-color" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50, pointerEvents: 'none' }}>
            <div>9:41</div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="0.8"/><rect x="5" y="5" width="3" height="7" rx="0.8"/><rect x="10" y="2" width="3" height="10" rx="0.8"/><rect x="15" y="0" width="3" height="12" rx="0.8"/></svg>
              <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor"><path d="M8 4Q11 4 13 6L15 4Q11 0 8 0Q5 0 1 4L3 6Q5 4 8 4Z"/><circle cx="8" cy="9" r="1.3"/></svg>
              <svg width="26" height="12" viewBox="0 0 26 12" fill="none"><rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke="currentColor" strokeOpacity="0.5"/><rect x="2" y="2" width="19" height="8" rx="1.5" fill="currentColor"/><rect x="24" y="4" width="1.5" height="4" rx="0.75" fill="currentColor" fillOpacity="0.5"/></svg>
            </div>
          </div>
          {page}
          <div className="phone-home-indicator"/>
        </div>
      </div>

      {/* Hint */}
      <div style={{
        position: 'fixed', bottom: 20, left: 0, right: 0,
        textAlign: 'center', color: '#fff', fontSize: 12, fontWeight: 500,
        textShadow: '0 1px 2px rgba(0,0,0,0.3)', opacity: 0.85,
        pointerEvents: 'none',
      }}>
        Toque nas estações • Use a busca • Experimente os filtros
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
