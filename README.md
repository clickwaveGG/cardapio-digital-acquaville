# Cardápio Digital — Acquaville Park Show

Protótipo interativo do cardápio digital do parque aquático Acquaville.

## Estrutura

- `index.html` — app principal (tela do cardápio em frame iOS)
- `wireframes.html` — canvas de wireframes / design system
- `menu-data.js` — base de dados do cardápio (estações, pratos, preços)
- `home.jsx` / `station.jsx` / `app.jsx` — telas React
- `styles.css` — estilos globais
- `uploads/` — PDF original e páginas renderizadas
- `screenshots/` — capturas de referência

## Stack

React 18 + Babel Standalone (CDN). Site estático — não requer build.

## Rodar local

Basta servir a pasta com qualquer servidor HTTP:

```bash
npx serve .
```

## Deploy

Vercel (estático). Push na `main` dispara deploy automático.
