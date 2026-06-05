export const docsBrand = {
  color: {
    canvas: 'var(--docs-canvas)',
    canvasGrid: 'var(--docs-canvas-grid)',
    surface: 'var(--docs-surface)',
    surfaceRaised: 'var(--docs-surface-raised)',
    rail: 'var(--docs-rail)',
    ink: 'var(--docs-ink)',
    inkSoft: 'var(--docs-ink-soft)',
    muted: 'var(--docs-muted)',
    border: 'var(--docs-border)',
    borderStrong: 'var(--docs-border-strong)',
    accent: 'var(--docs-accent)',
    accentDeep: 'var(--docs-accent-deep)',
    cyan: 'var(--docs-cyan)',
    lime: 'var(--docs-lime)',
    yellow: 'var(--docs-yellow)',
    code: 'var(--docs-code)',
    codeText: 'var(--docs-code-text)',
    topbar: 'var(--docs-topbar)',
  },
  font: {
    sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"SF Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  },
  radius: {
    xs: '0.25rem',
    sm: '0.375rem',
    md: '0.5rem',
  },
  space: {
    nav: '4rem',
    pageX: 'clamp(1rem, 4vw, 4rem)',
  },
  shadow: {
    raised: '0 24px 60px rgb(11 16 32 / 0.14)',
    hard: '6px 6px 0 var(--docs-border-strong)',
    logoNav: 'drop-shadow(3px 3px 0 rgb(11 16 32 / 0.18))',
    logoHero: 'drop-shadow(8px 8px 0 rgb(11 16 32 / 0.2))',
  },
}

export const docsGridBackground =
  `linear-gradient(${docsBrand.color.canvasGrid} 1px, transparent 1px), ` +
  `linear-gradient(90deg, ${docsBrand.color.canvasGrid} 1px, transparent 1px)`

export const docsThemeStyles = `:root,
[data-radcn-theme="light"] {
  --docs-canvas: #fbfcfe;
  --docs-canvas-grid: #e6ebf2;
  --docs-surface: #ffffff;
  --docs-surface-raised: #f8fafc;
  --docs-rail: #f1f5f9;
  --docs-ink: #0b1020;
  --docs-ink-soft: #334155;
  --docs-muted: #64748b;
  --docs-border: #d8dee8;
  --docs-border-strong: #0b1020;
  --docs-accent: #ff2d20;
  --docs-accent-deep: #b91512;
  --docs-cyan: #00c8ff;
  --docs-lime: #b6ff00;
  --docs-yellow: #ffd84d;
  --docs-code: #080d1a;
  --docs-code-text: #e8f0ff;
  --docs-topbar: rgb(251 252 254 / 0.94);
}

[data-radcn-theme="dark"] {
  --docs-canvas: #090b12;
  --docs-canvas-grid: #1b2230;
  --docs-surface: #10131c;
  --docs-surface-raised: #161b26;
  --docs-rail: #111722;
  --docs-ink: #f8fafc;
  --docs-ink-soft: #cbd5e1;
  --docs-muted: #94a3b8;
  --docs-border: #293244;
  --docs-border-strong: #e2e8f0;
  --docs-accent: #ff4a3d;
  --docs-accent-deep: #ff8a80;
  --docs-cyan: #39d7ff;
  --docs-lime: #c9ff2f;
  --docs-yellow: #ffe169;
  --docs-code: #05070d;
  --docs-code-text: #eef4ff;
  --docs-topbar: rgb(9 11 18 / 0.94);
}`
