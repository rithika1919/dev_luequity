import { type Page } from '../App'

interface Props { onNavigate: (page: Page) => void }

const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" }

export default function Dashboard({ onNavigate }: Props) {
  return (
    <div className="dashboard">
      <div className="dash-bg" />

      <header className="dash-header">
        <div className="dash-wordmark">
          <div className="dash-wordmark-dot pulse" />
          LU Equity · Platform Docs
        </div>
        <div className="dash-status-pill">
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 6px var(--green)' }} />
          Live · 2026
        </div>
      </header>

      <section className="dash-hero">
        <div className="hero-eyebrow fade-up fade-up-1">
          <span style={{ color: 'var(--green)' }}>●</span>
          Architecture Reference
        </div>
        <h1 className="hero-title fade-up fade-up-2">
          SaaS Platform<br />
          <span className="grad">Architecture Docs</span>
        </h1>
        <p className="hero-sub fade-up fade-up-3">
          Interactive diagrams for the data platform and frontend stack.<br />
          EN / DE toggle · hover tooltips · cost analysis.
        </p>
      </section>

      <div className="dash-cards fade-up fade-up-3">

        {/* ── DATA ARCHITECTURE ── */}
        <div
          className="tile tile-data"
          onClick={() => onNavigate('data-architecture')}
          role="button" tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && onNavigate('data-architecture')}
        >
          <div className="tile-accent" />
          <div className="tile-inner">

            {/* Chips */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
              <span className="tile-chip chip-cyan">Medallion</span>
              <span className="tile-chip chip-pink">GDPR</span>
              <span className="tile-chip chip-dim">EN · DE</span>
            </div>

            {/* Vertical layer list — no overflow */}
            <div style={{
              borderRadius: 10, border: '1px solid var(--border)',
              background: 'rgba(0,0,0,0.3)', overflow: 'hidden', marginBottom: 22
            }}>
              {[
                { label: 'Sources',      detail: 'Simplisan ERP · Crawler · App events',          color: '#6b7fa0' },
                { label: 'Ingestion',    detail: 'Redpanda · Schema Registry · Dead Letter',       color: '#8b5cf6' },
                { label: 'Bronze',       detail: 'MinIO · Iceberg tables · PII tagging',           color: '#d97706' },
                { label: 'Silver',       detail: 'dbt models · pseudonymization · contracts',      color: '#94a3b8' },
                { label: 'Gold',         detail: 'Postgres (Ubicloud) · schema-per-tenant',        color: '#eab308' },
                { label: 'Applications', detail: 'Patient portal · BI apps · PostHog analytics',  color: '#10b981' },
              ].map((layer, i, arr) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px',
                  borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.012)',
                }}>
                  <div style={{
                    width: 3, height: 30, borderRadius: 2, flexShrink: 0,
                    background: layer.color, boxShadow: `0 0 8px ${layer.color}55`,
                  }} />
                  <div>
                    <div style={{ ...mono, fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: layer.color, marginBottom: 2 }}>
                      {layer.label}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-dim)', lineHeight: 1.4 }}>{layer.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="tile-heading">Data Architecture</div>
            <div className="tile-desc">
              Medallion pipeline on Hetzner bare-metal. Bronze → Silver → Gold with real-time Redpanda streaming, hourly Dagster batch, and full GDPR deletion pipeline.
            </div>

            <ul className="tile-feature-list">
              <li><div className="feat-dot" style={{ background: 'var(--infra)' }} />Hetzner AX52 ×3 in Germany · €440–510/mo vs €2–4k AWS</li>
              <li><div className="feat-dot" style={{ background: 'var(--event)' }} />Redpanda + Schema Registry · Dead Letter Topic · auto-alerts</li>
              <li><div className="feat-dot" style={{ background: 'var(--quality)' }} />dbt + Soda quality gates at every layer boundary</li>
              <li><div className="feat-dot" style={{ background: 'var(--gdpr)' }} />GDPR deletion pipeline · PII tagging from Bronze onwards</li>
            </ul>

            <div className="tile-bottom">
              <div className="tile-stats">
                <div className="stat-item">
                  <span className="stat-num" style={{ color: 'var(--infra)' }}>6</span>
                  <span className="stat-label">Layers</span>
                </div>
                <div className="stat-item">
                  <span className="stat-num">20+</span>
                  <span className="stat-label">Nodes</span>
                </div>
                <div className="stat-item">
                  <span className="stat-num" style={{ color: 'var(--green)' }}>€510</span>
                  <span className="stat-label">Max/mo</span>
                </div>
              </div>
              <button className="tile-cta cta-data">Open →</button>
            </div>
          </div>
        </div>

        {/* ── FRONTEND PLANNING ── */}
        <div
          className="tile tile-fe"
          onClick={() => onNavigate('frontend-planning')}
          role="button" tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && onNavigate('frontend-planning')}
        >
          <div className="tile-accent" />
          <div className="tile-inner">

            {/* Chips */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
              <span className="tile-chip chip-green">SaaS Stack</span>
              <span className="tile-chip chip-purple">Alternatives</span>
              <span className="tile-chip chip-cyan">Email/SMS</span>
              <span className="tile-chip chip-dim">EN · DE</span>
            </div>

            {/* Vertical layer list — mirrors the Data Architecture tile */}
            <div style={{
              borderRadius: 10, border: '1px solid var(--border)',
              background: 'rgba(0,0,0,0.3)', overflow: 'hidden', marginBottom: 22
            }}>
              {[
                { label: 'Styling',    detail: 'Tailwind v4 · shadcn/ui · JetBrains Mono',          color: '#8b5cf6' },
                { label: 'Auth',       detail: 'Supabase Auth · Keycloak (SSO) · Clerk · Better Auth', color: '#ec4899' },
                { label: 'Email/SMS',  detail: 'Resend · Postmark · Brevo (EU) · Twilio',            color: '#d97706' },
                { label: 'State',      detail: 'TanStack Query v5 · Zustand · RHF + Zod v4',         color: '#eab308' },
                { label: 'Analytics',  detail: 'PostHog (self-host) · Metabase Pro · Plausible',     color: '#10b981' },
                { label: 'Hosting',    detail: 'Cloudflare Pages · Stripe · Cal.com self-hosted',    color: '#22c55e' },
              ].map((layer, i, arr) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px',
                  borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.012)',
                }}>
                  <div style={{
                    width: 3, height: 30, borderRadius: 2, flexShrink: 0,
                    background: layer.color, boxShadow: `0 0 8px ${layer.color}55`,
                  }} />
                  <div>
                    <div style={{ ...mono, fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: layer.color, marginBottom: 2 }}>
                      {layer.label}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-dim)', lineHeight: 1.4 }}>{layer.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="tile-heading">Frontend Planning</div>
            <div className="tile-desc">
              Full frontend tech stack with vetted alternatives. Auth options, email/SMS comms, BI tools, module boundaries, and CI/CD pipeline.
            </div>

            <ul className="tile-feature-list">
              <li><div className="feat-dot" style={{ background: 'var(--gdpr)' }} />Auth: Supabase Auth · Keycloak (SSO/SAML) · Clerk · Better Auth</li>
              <li><div className="feat-dot" style={{ background: 'var(--bronze)' }} />Email: Resend (React templates) · Postmark · Brevo EU · Twilio SMS</li>
              <li><div className="feat-dot" style={{ background: 'var(--gold)' }} />TanStack Query v5 + Zustand + RHF + Zod v4 state stack</li>
              <li><div className="feat-dot" style={{ background: 'var(--alert)' }} />5-gate CI pipeline · TDD with failing stubs first</li>
            </ul>

            <div className="tile-bottom">
              <div className="tile-stats">
                <div className="stat-item">
                  <span className="stat-num" style={{ color: 'var(--green)' }}>8</span>
                  <span className="stat-label">Layers</span>
                </div>
                <div className="stat-item">
                  <span className="stat-num">18+</span>
                  <span className="stat-label">Tools</span>
                </div>
                <div className="stat-item">
                  <span className="stat-num" style={{ color: 'var(--gold)' }}>4</span>
                  <span className="stat-label">Alt options</span>
                </div>
              </div>
              <button className="tile-cta cta-fe">Open →</button>
            </div>
          </div>
        </div>

      </div>

      <footer className="dash-footer">
        <span>Designed & Architected by <strong style={{ color: 'var(--text-muted)' }}>Lokesh Upputri & Team</strong></span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 6px var(--green)' }} className="pulse" />
          <span>LU EQUITY · 2026</span>
        </div>
      </footer>
    </div>
  )
}
