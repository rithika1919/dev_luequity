import { type Page } from '../App'

interface Props { onNavigate: (page: Page) => void }

export default function Dashboard({ onNavigate }: Props) {
  return (
    <div className="home">

      {/* ── HERO: 2-column ── */}
      <section className="home-hero">
        <div className="home-hero-text">
          <span className="home-eyebrow">
            <span className="home-eyebrow-dot" />
            LU Equity Holding UG · Platform Docs · 2026
          </span>
          <h1 className="home-title">
            SaaS Platform<br />
            <span className="grad">Architecture</span>
          </h1>
          <p className="home-sub">
            Interactive reference for the data pipeline and frontend tech stack.
            EN / DE toggle, hover tooltips, cost analysis.
          </p>
          <div className="home-actions">
            <button className="home-btn-primary" onClick={() => onNavigate('data-architecture')}>
              Data Architecture <span>→</span>
            </button>
            <button className="home-btn-secondary" onClick={() => onNavigate('frontend-planning')}>
              Frontend Planning <span>→</span>
            </button>
          </div>
        </div>

        <div className="home-stats-grid">
          {[
            { n: '6',    l: 'Pipeline Layers',  c: 'var(--infra)' },
            { n: '20+',  l: 'Data Nodes',        c: 'var(--event)' },
            { n: '€510', l: 'Max Infra / mo',    c: 'var(--green)' },
            { n: '8',    l: 'Frontend Layers',   c: 'var(--gdpr)' },
            { n: '18+',  l: 'Vetted Tools',      c: 'var(--bronze)' },
            { n: '~€5',  l: 'Frontend Base / mo', c: 'var(--gold)' },
          ].map((s, i) => (
            <div key={i} className="home-stat-card">
              <span className="home-stat-n" style={{ color: s.c }}>{s.n}</span>
              <span className="home-stat-l">{s.l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="home-section-label">Documentation</div>

      {/* ── DOC CARDS ── */}
      <section className="home-docs">

        {/* Data Architecture */}
        <article className="doc-card" onClick={() => onNavigate('data-architecture')} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && onNavigate('data-architecture')}>
          <div className="doc-card-accent doc-accent-data" />
          <div className="doc-card-inner">
            <div className="doc-chips">
              <span className="tile-chip chip-cyan">Medallion</span>
              <span className="tile-chip chip-pink">GDPR</span>
              <span className="tile-chip chip-dim">EN · DE</span>
            </div>
            <h2 className="doc-title">Data Architecture</h2>
            <p className="doc-desc">
              Medallion pipeline on Hetzner bare-metal. Bronze → Silver → Gold with real-time Redpanda streaming, hourly Dagster batch, and full GDPR deletion pipeline.
            </p>
            <div className="doc-layers">
              {[
                { label: 'Sources',      color: '#94a3b8' },
                { label: 'Ingestion',    color: '#7c3aed' },
                { label: 'Bronze (Raw)', color: '#b45309' },
                { label: 'Silver (Clean)', color: '#64748b' },
                { label: 'Gold (Business)', color: '#d97706' },
                { label: 'Applications', color: '#059669' },
              ].map((l, i) => (
                <div key={i} className="doc-layer-row">
                  <span className="doc-layer-pip" style={{ background: l.color }} />
                  <span className="doc-layer-name">{l.label}</span>
                </div>
              ))}
            </div>
            <div className="doc-card-footer">
              <div className="doc-meta">
                <span><strong>6</strong> layers</span>
                <span><strong>20+</strong> nodes</span>
                <span style={{ color: 'var(--green)' }}><strong>€510</strong> max / mo</span>
              </div>
              <button className="doc-cta doc-cta-data">Open →</button>
            </div>
          </div>
        </article>

        {/* Frontend Planning */}
        <article className="doc-card" onClick={() => onNavigate('frontend-planning')} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && onNavigate('frontend-planning')}>
          <div className="doc-card-accent doc-accent-fe" />
          <div className="doc-card-inner">
            <div className="doc-chips">
              <span className="tile-chip chip-green">SaaS Stack</span>
              <span className="tile-chip chip-purple">Alternatives</span>
              <span className="tile-chip chip-dim">EN · DE</span>
            </div>
            <h2 className="doc-title">Frontend Planning</h2>
            <p className="doc-desc">
              Full frontend tech stack with vetted alternatives. Auth options, email/SMS comms, BI tools, module boundaries, and CI/CD pipeline.
            </p>
            <div className="doc-layers">
              {[
                { label: 'Styling',    color: '#7c3aed' },
                { label: 'Auth',       color: '#db2777' },
                { label: 'Email / SMS', color: '#b45309' },
                { label: 'State & Forms', color: '#d97706' },
                { label: 'Analytics & BI', color: '#059669' },
                { label: 'Hosting & Services', color: '#0284c7' },
              ].map((l, i) => (
                <div key={i} className="doc-layer-row">
                  <span className="doc-layer-pip" style={{ background: l.color }} />
                  <span className="doc-layer-name">{l.label}</span>
                </div>
              ))}
            </div>
            <div className="doc-card-footer">
              <div className="doc-meta">
                <span><strong>8</strong> layers</span>
                <span><strong>18+</strong> tools</span>
                <span style={{ color: 'var(--gold)' }}><strong>~€5</strong> base / mo</span>
              </div>
              <button className="doc-cta doc-cta-fe">Open →</button>
            </div>
          </div>
        </article>

      </section>

      {/* ── FOOTER ── */}
      <footer className="home-footer">
        <span>Designed & Architected by <strong>Upputri Lokesh, Upputuri Tanuj & Paidala Rithika</strong></span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="pulse" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 4px var(--green)' }} />
          <span>LU Equity Holding UG · 2026</span>
        </div>
      </footer>
    </div>
  )
}
