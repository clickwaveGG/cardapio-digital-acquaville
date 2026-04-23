/* global React */
const { useState: useStateA } = React;

function App() {
  const [route, setRoute] = useStateA({ name: 'home' });
  const [history, setHistory] = useStateA([]);

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
    <div className="app-shell">
      {page}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
