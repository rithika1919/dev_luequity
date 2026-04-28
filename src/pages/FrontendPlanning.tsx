import { useState, useCallback, useRef } from 'react'

interface TooltipState {
  visible: boolean; x: number; y: number; title: string; content: string
}

interface NodeProps {
  variant: string; title: string; desc: string
  tag?: string; tagVariant?: string
  tags?: { text: string; variant: string }[]
  tipTitle?: string; tip?: string
  dashed?: boolean; mt?: boolean
  onTip: (e: React.MouseEvent, title: string, content: string) => void
  onHide: () => void
  style?: React.CSSProperties
}

function Node({ variant, title, desc, tag, tagVariant, tags, tipTitle, tip, dashed, mt, onTip, onHide, style }: NodeProps) {
  return (
    <div
      className={`node node-${variant}${dashed ? ' dashed-border' : ''}${mt ? ' mt-lg' : ''}`}
      style={style}
      onMouseEnter={tip ? e => onTip(e, tipTitle || title, tip) : undefined}
      onMouseLeave={tip ? onHide : undefined}
      onMouseMove={tip ? e => onTip(e, tipTitle || title, tip) : undefined}
    >
      <div className="node-title">{title}</div>
      <div className="node-desc" dangerouslySetInnerHTML={{ __html: desc }} />
      {tag && <div className={`node-tag tag-${tagVariant || 'dim'}`}>{tag}</div>}
      {tags && (
        <div className="node-badges">
          {tags.map((t, i) => <span key={i} className={`node-tag tag-${t.variant}`}>{t.text}</span>)}
        </div>
      )}
    </div>
  )
}

type LangKey = 'en' | 'de'

export default function FrontendPlanning() {
  const [lang, setLang] = useState<LangKey>('en')
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, title: '', content: '' })
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showTip = useCallback((e: React.MouseEvent, title: string, content: string) => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    const x = Math.min(e.clientX + 16, window.innerWidth - 290)
    const y = Math.min(e.clientY + 12, window.innerHeight - 200)
    setTooltip({ visible: true, x, y, title, content })
  }, [])

  const hideTip = useCallback(() => {
    hideTimer.current = setTimeout(() => setTooltip(s => ({ ...s, visible: false })), 80)
  }, [])

  const isEn = lang === 'en'

  const n = (props: Omit<NodeProps, 'onTip' | 'onHide'>) =>
    <Node {...props} onTip={showTip} onHide={hideTip} />

  return (
    <div className="arch-page">
      {/* Tooltip */}
      <div
        className={`global-tooltip${tooltip.visible ? ' visible' : ''}`}
        style={{ left: tooltip.x, top: tooltip.y }}
      >
        <strong>{tooltip.title}</strong>
        {tooltip.content}
      </div>

      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <div className="header-title">{isEn ? 'Frontend Tech Architecture' : 'Frontend-Technologie-Architektur'}</div>
          <div className="header-subtitle">{isEn ? 'React 19 · Tailwind v4 · SaaS Stack · Multi-Option · EU Deployable' : 'React 19 · Tailwind v4 · SaaS-Stack · Multi-Option · EU einsetzbar'}</div>
        </div>
        <div className="header-right">
          <div className="header-badge header-badge-green">{isEn ? '● RECOMMENDED STACK' : '● EMPFOHLENER STACK'}</div>
          <div className="lang-toggle">
            <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
            <button className={lang === 'de' ? 'active' : ''} onClick={() => setLang('de')}>DE</button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="legend">
        {[
          { label: isEn ? 'App Core' : 'App-Kern', color: 'var(--infra)' },
          { label: isEn ? 'Styling' : 'Styling', color: 'var(--event)' },
          { label: isEn ? 'Auth' : 'Authentifizierung', color: 'var(--gdpr)' },
          { label: isEn ? 'Email & SMS' : 'E-Mail & SMS', color: 'var(--bronze)' },
          { label: isEn ? 'State' : 'Zustand', color: 'var(--gold)' },
          { label: isEn ? 'Forms & Tables' : 'Formulare & Tabellen', color: 'var(--silver)' },
          { label: isEn ? 'Analytics & BI' : 'Analytik & BI', color: 'var(--quality)' },
          { label: isEn ? 'Hosting & Billing' : 'Hosting & Abrechnung', color: 'var(--green)' },
          { label: isEn ? 'Testing & CI' : 'Tests & CI', color: 'var(--alert)' },
        ].map((item, i) => (
          <div key={i} className="legend-item">
            <div className="legend-dot" style={{ background: item.color }} />
            {item.label}
          </div>
        ))}
        <div className="legend-sep" />
        <div className="legend-item" style={{ color: 'var(--green)', fontSize: 10 }}>● = Recommended</div>
        <div className="legend-item" style={{ color: 'var(--gold)', fontSize: 10 }}>▲ = Alternative</div>
      </div>

      {/* Body: sidebar + content */}
      <div className="arch-body">
        <nav className="arch-sidebar">
          <span className="sidebar-section-label">Layers</span>
          <button className="sidebar-link" onClick={() => document.getElementById('layer-core')?.scrollIntoView({ behavior: 'smooth' })}>App Core</button>
          <button className="sidebar-link" onClick={() => document.getElementById('layer-styling')?.scrollIntoView({ behavior: 'smooth' })}>Styling</button>
          <button className="sidebar-link" onClick={() => document.getElementById('layer-auth')?.scrollIntoView({ behavior: 'smooth' })}>Auth</button>
          <button className="sidebar-link" onClick={() => document.getElementById('layer-email')?.scrollIntoView({ behavior: 'smooth' })}>Email & SMS</button>
          <button className="sidebar-link" onClick={() => document.getElementById('layer-state')?.scrollIntoView({ behavior: 'smooth' })}>State & Forms</button>
          <button className="sidebar-link" onClick={() => document.getElementById('layer-bi')?.scrollIntoView({ behavior: 'smooth' })}>Analytics & BI</button>
          <button className="sidebar-link" onClick={() => document.getElementById('layer-hosting')?.scrollIntoView({ behavior: 'smooth' })}>Hosting</button>
          <button className="sidebar-link" onClick={() => document.getElementById('layer-testing')?.scrollIntoView({ behavior: 'smooth' })}>Testing & CI</button>
          <span className="sidebar-section-label">Sections</span>
          <button className="sidebar-link" onClick={() => document.getElementById('sec-modules')?.scrollIntoView({ behavior: 'smooth' })}>Module Rules</button>
          <button className="sidebar-link" onClick={() => document.getElementById('sec-compare')?.scrollIntoView({ behavior: 'smooth' })}>Comparisons</button>
          <button className="sidebar-link" onClick={() => document.getElementById('sec-devtools')?.scrollIntoView({ behavior: 'smooth' })}>Dev Tooling</button>
          <button className="sidebar-link" onClick={() => document.getElementById('sec-cost')?.scrollIntoView({ behavior: 'smooth' })}>Cost Breakdown</button>
        </nav>
        <div className="arch-content">

      {/* Canvas */}
      <div className="canvas">
        <div className="layers">

          {/* App Core */}
          <div id="layer-core" className="layer">
            <div className="layer-label label-infra">{isEn ? 'App Core' : 'App-Kern'}</div>
            {n({ variant: 'infra', title: 'React 19', desc: isEn ? 'Concurrent rendering, React Compiler (auto-memoize), Server Components support. Foundation of the entire frontend.' : 'Concurrent Rendering, React Compiler (Auto-Memoize), Server Components. Grundlage des gesamten Frontends.', tags: [{ text: isEn ? 'STABLE' : 'STABIL', variant: 'rec' }, { text: isEn ? 'RECOMMENDED' : 'EMPFOHLEN', variant: 'app' }], tipTitle: isEn ? 'Why React 19?' : 'Warum React 19?', tip: isEn ? 'React 19 brings the React Compiler which auto-memoizes components — no more manual useMemo/useCallback in 90% of cases. Concurrent features (Suspense, transitions) enable non-blocking UI updates. The largest ecosystem of any frontend framework.' : 'React 19 bringt den React Compiler, der Komponenten automatisch memoiert. Concurrent Features (Suspense, Transitions) ermöglichen nicht-blockierende UI-Updates. Das größte Ökosystem aller Frontend-Frameworks.' })}
            {n({ variant: 'infra', title: 'React Router v7', desc: isEn ? 'File-based routing, nested layouts, data loaders, server rendering ready. Replaces router + data-fetching boilerplate.' : 'Dateibasiertes Routing, verschachtelte Layouts, Data Loader, SSR-bereit. Ersetzt Router + Datenabruf-Boilerplate.', tag: isEn ? 'FILE-BASED ROUTING' : 'DATEIBASIERTES ROUTING', tagVariant: 'infra', tipTitle: isEn ? 'Why React Router v7?' : 'Warum React Router v7?', tip: isEn ? 'v7 supports nested layouts with automatic data pre-fetching via loader functions. Routes become co-located with their data requirements. Full SSR support if needed later. Flat config in react-router.config.ts.' : 'v7 unterstützt verschachtelte Layouts mit automatischem Datenpre-Fetching über Loader-Funktionen. Routen werden mit ihren Datenanforderungen zusammengelegt. Volle SSR-Unterstützung bei Bedarf.' })}
            {n({ variant: 'infra', title: 'Vite 6', desc: isEn ? 'Lightning-fast dev server with HMR <50ms. Native ESM, Rollup bundler. Near-zero config. 10x faster than Webpack.' : 'Blitzschneller Dev-Server mit HMR <50ms. Native ESM, Rollup-Bundler. Nahezu keine Konfiguration. 10x schneller als Webpack.', tag: 'DEV · BUILD', tagVariant: 'infra', tipTitle: isEn ? 'Why Vite 6?' : 'Warum Vite 6?', tip: isEn ? "Vite's HMR is state-preserving — you see changes in <50ms without losing component state. Configure with vite.config.ts. Vite 6 adds Environment API for SSR. Use @vitejs/plugin-react for React Fast Refresh." : "Vites HMR ist zustandserhaltend — Änderungen in <50ms ohne Verlust des Komponentenzustands. Mit vite.config.ts konfigurieren. Vite 6 fügt Environment API für SSR hinzu." })}
            {n({ variant: 'infra', title: 'TypeScript 5.7', desc: isEn ? 'Strict mode. Auto-generated DB types from Supabase. Path aliases via tsconfig. All queries fully typed end-to-end.' : 'Strict-Modus. Auto-generierte DB-Typen von Supabase. Pfad-Aliase via tsconfig. Alle Abfragen durchgängig typsicher.', tag: 'STRICT MODE', tagVariant: 'infra', tipTitle: isEn ? 'Why TypeScript strict mode?' : 'Warum TypeScript Strict-Modus?', tip: isEn ? 'Run `npx supabase gen types typescript` to auto-generate database.types.ts. All DB queries are fully typed. Strict mode catches null-safety issues at compile time — not at 3am in production. Path aliases (e.g. @/modules/auth) via tsconfig paths.' : 'Führen Sie `npx supabase gen types typescript` aus, um database.types.ts auto-zu-generieren. Strict-Modus erkennt Null-Sicherheitsprobleme zur Kompilierzeit.' })}
          </div>

          <div className="section-divider" data-label={isEn ? 'style' : 'stil'} />

          {/* Styling */}
          <div id="layer-styling" className="layer">
            <div className="layer-label label-event">{isEn ? 'Styling' : 'Styling'}</div>
            {n({ variant: 'event', title: 'Tailwind CSS v4', desc: isEn ? 'CSS-first config — no tailwind.config.js needed. 2× faster builds via Lightning CSS (Rust). @theme directive in CSS.' : 'CSS-first Konfiguration — kein tailwind.config.js benötigt. 2× schnellere Builds via Lightning CSS (Rust). @theme-Direktive in CSS.', tags: [{ text: 'v4 · CSS-FIRST', variant: 'event' }, { text: isEn ? 'NO CONFIG FILE' : 'KEINE KONFIG', variant: 'dim' }], tipTitle: isEn ? 'Tailwind v4 breaking change' : 'Tailwind v4 Breaking Change', tip: isEn ? 'v4 breaking change: configuration moves into CSS with @theme. No more tailwind.config.js. Use @import "tailwindcss" in your CSS entry. Lightning CSS engine replaces PostCSS — 2× faster. Use the tailwind-v4-shadcn skill to avoid setup errors.' : 'v4 Breaking Change: Konfiguration zieht in CSS mit @theme um. Kein tailwind.config.js mehr. Verwenden Sie @import "tailwindcss" in Ihrem CSS-Einstieg. Lightning CSS ersetzt PostCSS — 2× schneller.' })}
            {n({ variant: 'event', title: 'shadcn/ui', desc: isEn ? 'Copy-paste component library on Radix UI + Tailwind. You own the code — no black-box npm package. CLI-driven.' : 'Copy-Paste-Komponentenbibliothek auf Radix UI + Tailwind. Sie besitzen den Code — kein Black-Box-npm-Paket. CLI-gesteuert.', tag: isEn ? 'OWNED CODE · RADIX UI' : 'EIGENER CODE · RADIX UI', tagVariant: 'event', tipTitle: isEn ? 'Why shadcn/ui?' : 'Warum shadcn/ui?', tip: isEn ? 'Use the CLI: `npx shadcn@latest add button`. Components are added directly to src/components/ui/. Customize freely — it\'s your code. Built on Radix UI primitives for accessibility. Pairs perfectly with Tailwind v4.' : 'CLI verwenden: `npx shadcn@latest add button`. Komponenten werden direkt in src/components/ui/ hinzugefügt. Frei anpassbar — es ist Ihr Code. Basiert auf Radix UI-Primitiven für Barrierefreiheit.' })}
            {n({ variant: 'event', title: isEn ? 'JetBrains Mono + Inter' : 'JetBrains Mono + Inter', desc: isEn ? 'JetBrains Mono for code/mono elements. Inter for body text. Self-hostable via @fontsource for GDPR compliance — no Google CDN calls.' : 'JetBrains Mono für Code/Mono-Elemente. Inter für Fließtext. Selbst-hostbar via @fontsource für DSGVO-Konformität — keine Google CDN-Aufrufe.', tag: isEn ? 'TYPOGRAPHY · GDPR' : 'TYPOGRAFIE · DSGVO', tagVariant: 'gdpr', tipTitle: isEn ? 'Self-host fonts for GDPR' : 'Schriften für DSGVO selbst hosten', tip: isEn ? 'For GDPR compliance, self-host fonts instead of loading from Google CDN: `npm install @fontsource/jetbrains-mono @fontsource/inter`. Import in main.css. No external requests, no GDPR consent needed.' : 'Für DSGVO-Konformität, Schriften statt von Google CDN laden: `npm install @fontsource/jetbrains-mono @fontsource/inter`. In main.css importieren. Keine externen Anfragen, keine DSGVO-Einwilligung erforderlich.' })}
          </div>

          <div className="section-divider" data-label={isEn ? 'auth' : 'auth'} />

          {/* Auth */}
          <div id="layer-auth" className="layer">
            <div className="layer-label label-gdpr">{isEn ? 'Auth Options' : 'Auth-Optionen'}</div>
            {n({ variant: 'gdpr', title: isEn ? '✦ Keycloak' : '✦ Keycloak', desc: isEn ? 'Self-hosted identity provider on Hetzner. SAML, OIDC, LDAP, Active Directory, SSO federation. EU data residency, multi-realm isolation per tenant — full enterprise auth ownership.' : 'Selbst-gehosteter Identity Provider auf Hetzner. SAML, OIDC, LDAP, Active Directory, SSO-Federation. EU-Datenresidenz, Multi-Realm-Isolation pro Mandant — vollständige Enterprise-Auth-Eigentümerschaft.', tags: [{ text: isEn ? 'RECOMMENDED' : 'EMPFOHLEN', variant: 'rec' }, { text: 'SELF-HOSTED · GDPR', variant: 'gdpr' }], tipTitle: isEn ? 'Why Keycloak is the default?' : 'Warum Keycloak der Standard ist?', tip: isEn ? 'Keycloak runs on existing Hetzner infrastructure (~300MB Docker container) — full EU data residency, no vendor lock-in, no per-user pricing. Supports SAML/OIDC/LDAP out of the box for enterprise SSO. Multi-realm isolation gives each tenant their own auth namespace. Use keycloak-js or oidc-client-ts on the React side. Battle-tested by Red Hat with broad ecosystem.' : 'Keycloak läuft auf vorhandener Hetzner-Infrastruktur (~300MB Docker-Container) — vollständige EU-Datenresidenz, kein Vendor-Lock-in, keine Pro-Nutzer-Preise. Unterstützt SAML/OIDC/LDAP out of the box für Enterprise SSO. Multi-Realm-Isolation gibt jedem Mandanten seinen eigenen Auth-Namespace.' })}
            {n({ variant: 'gdpr', title: isEn ? '▲ Supabase Auth' : '▲ Supabase Auth', desc: isEn ? 'Built into Supabase. Email/password, OAuth, magic links, MFA. RLS policies auto-apply to auth.uid() — zero extra middleware. Easiest path if already using Supabase.' : 'In Supabase integriert. E-Mail/Passwort, OAuth, Magic Links, MFA. RLS-Richtlinien gelten automatisch für auth.uid() — keine extra Middleware. Einfachster Weg, wenn Supabase bereits verwendet wird.', tags: [{ text: isEn ? 'ALT' : 'ALT', variant: 'alt' }, { text: 'BUILT-IN RLS', variant: 'gdpr' }], tipTitle: isEn ? 'When to choose Supabase Auth?' : 'Wann Supabase Auth wählen?', tip: isEn ? 'Choose Supabase Auth if you don\'t need enterprise SSO/SAML and the project already lives on Supabase. Direct RLS integration via auth.uid() in Postgres policies. Handles OAuth, magic links, MFA, session refresh. Trade-off: less flexibility than Keycloak; locked into Supabase ecosystem.' : 'Supabase Auth wählen, wenn kein Enterprise SSO/SAML benötigt wird und das Projekt bereits auf Supabase läuft. Direkte RLS-Integration über auth.uid(). Kompromiss: weniger Flexibilität als Keycloak; an Supabase-Ökosystem gebunden.' })}
            {n({ variant: 'gdpr', title: isEn ? '▲ Clerk' : '▲ Clerk', desc: isEn ? 'Managed auth with pre-built React components. Fastest to implement (<1 hour). Multi-tenant support via organizations. No self-hosting required.' : 'Verwaltete Auth mit vorgefertigten React-Komponenten. Schnellste Implementierung (<1 Stunde). Multi-Mandanten-Unterstützung via Organisationen. Kein Selbst-Hosting erforderlich.', tags: [{ text: isEn ? 'MANAGED' : 'VERWALTET', variant: 'alt' }, { text: isEn ? 'FASTEST' : 'SCHNELLSTE', variant: 'app' }], tipTitle: isEn ? 'When to choose Clerk?' : 'Wann Clerk wählen?', tip: isEn ? 'Best when speed-to-launch beats EU data residency. Clerk handles MFA, device sessions, and has ready-made UI components. Pricing: free tier → $25/mo (MAU-based). Note: EU data residency is a paid add-on — default is US servers. Use ClerkProvider in React.' : 'Beste Wahl wenn Time-to-Market wichtiger als EU-Datenresidenz ist. Clerk verwaltet MFA, Gerätesessions und bietet fertige UI-Komponenten. Preise: kostenlos → $25/Monat. Hinweis: EU-Datenresidenz ist ein kostenpflichtiges Add-on.' })}
            {n({ variant: 'gdpr', title: isEn ? '▲ Better Auth (OSS)' : '▲ Better Auth (OSS)', desc: isEn ? 'New open-source TypeScript auth library. Framework-agnostic, any database, self-hosted. Full ownership, no vendor lock-in.' : 'Neue Open-Source TypeScript Auth-Bibliothek. Framework-agnostisch, beliebige Datenbank, selbst-gehostet. Vollständige Eigentümerschaft, kein Vendor-Lock-in.', tags: [{ text: 'OSS · NEW', variant: 'quality' }, { text: isEn ? 'SELF-HOSTED' : 'SELBST-GEHOSTET', variant: 'infra' }], tipTitle: isEn ? 'When to choose Better Auth?' : 'Wann Better Auth wählen?', tip: isEn ? 'Lighter-weight alternative to Keycloak when you don\'t need SAML/LDAP. Type-safe plugins for 2FA, passkeys, organizations. Works with any database. Still maturing — smaller ecosystem and less battle-tested than Keycloak. Good fit for pure greenfield TypeScript-only setups.' : 'Leichtere Alternative zu Keycloak, wenn kein SAML/LDAP benötigt wird. Type-Safe Plugins für 2FA, Passkeys, Organisationen. Funktioniert mit beliebigen DBs. Noch reifend — kleineres Ökosystem als Keycloak.' })}
          </div>

          <div className="section-divider" data-label={isEn ? 'email & sms' : 'e-mail & sms'} />

          {/* Messaging & Comms */}
          <div id="layer-email" className="layer">
            <div className="layer-label label-bronze">{isEn ? 'Email & Messaging' : 'E-Mail & Messaging'}</div>
            {n({ variant: 'bronze', title: isEn ? '✦ Resend' : '✦ Resend', desc: isEn ? 'Modern transactional email API. Write templates as React components with react-email — hot reload in dev, no string interpolation. EU region (Frankfurt). Sub-second delivery.' : 'Modernes transaktionales E-Mail-API. Templates als React-Komponenten mit react-email — Hot Reload in der Entwicklung. EU-Region (Frankfurt). Sub-Sekunden-Zustellung.', tags: [{ text: isEn ? 'RECOMMENDED' : 'EMPFOHLEN', variant: 'rec' }, { text: 'REACT EMAIL', variant: 'app' }], tipTitle: isEn ? 'Why Resend?' : 'Warum Resend?', tip: isEn ? 'Best DX for transactional email. Templates are React components: `resend.emails.send({ from, to, subject, react: <InvoiceEmail /> })`. EU data region in Frankfurt. 100 emails/day free, then $20/mo for 50k. Pair with the react-email library for template development with live preview.' : 'Beste DX für transaktionale E-Mails. Templates sind React-Komponenten: resend.emails.send({ from, to, react: <InvoiceEmail /> }). EU-Datenregion in Frankfurt. 100 E-Mails/Tag kostenlos, dann $20/Monat für 50k.' })}
            {n({ variant: 'bronze', title: isEn ? '▲ Postmark' : '▲ Postmark', desc: isEn ? 'High-deliverability transactional email (~99.99% inbox rate). Separate streams for transactional vs bulk — protects sender reputation. GDPR-compliant EU servers. Best for invoices, password resets.' : 'Hohe Zustellbarkeit (~99.99% Posteingangsrate). Getrennte Streams für transaktional vs. Bulk — schützt Absender-Reputation. DSGVO-konforme EU-Server. Ideal für Rechnungen, Passwort-Resets.', tags: [{ text: 'HIGH DELIVERABILITY', variant: 'quality' }, { text: 'GDPR · EU', variant: 'gdpr' }], tipTitle: isEn ? 'Postmark vs Resend' : 'Postmark vs Resend', tip: isEn ? 'Choose Postmark when deliverability is critical (healthcare, finance). Postmark\'s message streams separate transactional from marketing to protect IP reputation. EU-based sending. Free: 100/mo. Paid: from $15/mo for 10k. Handlebars templates (not React). More mature than Resend for compliance-heavy industries.' : 'Postmark wählen wenn Zustellbarkeit kritisch ist (Gesundheit, Finanzen). Postmarks Nachrichtenstreams trennen transaktional von Marketing um IP-Reputation zu schützen. EU-basiertes Senden.' })}
            {n({ variant: 'bronze', title: isEn ? '▲ Brevo (Sendinblue)' : '▲ Brevo (Sendinblue)', desc: isEn ? 'EU-native email + SMS + WhatsApp in one API. Paris HQ — data stays in EU by default, no Schrems II issues. Transactional + marketing in one platform. 300 emails/day free.' : 'EU-native E-Mail + SMS + WhatsApp in einer API. Paris HQ — Daten bleiben standardmäßig in der EU, keine Schrems II-Probleme. Transaktional + Marketing auf einer Plattform. 300 E-Mails/Tag kostenlos.', tags: [{ text: 'EU-NATIVE', variant: 'gdpr' }, { text: 'EMAIL + SMS', variant: 'event' }], tipTitle: isEn ? 'Why Brevo for EU SaaS?' : 'Warum Brevo für EU SaaS?', tip: isEn ? 'Brevo (formerly Sendinblue) is Paris-based — all data stays in EU by default, no Standard Contractual Clauses needed. Single API covers email, SMS, and WhatsApp. Free: 300 emails/day. Choose Brevo when you want email + SMS on one bill and need air-tight GDPR compliance without legal overhead.' : 'Brevo (früher Sendinblue) hat Paris-Sitz — alle Daten bleiben standardmäßig in der EU, keine Standardvertragsklauseln erforderlich. Eine API für E-Mail, SMS und WhatsApp.' })}
            {n({ variant: 'bronze', title: isEn ? '▲ Twilio' : '▲ Twilio', desc: isEn ? 'SMS, WhatsApp Business, and Voice APIs. Best for OTP 2FA, appointment reminders, urgent notifications. ~€0.04/SMS to EU numbers. WhatsApp Business API included.' : 'SMS-, WhatsApp Business- und Voice-APIs. Ideal für OTP 2FA, Terminerinnerungen, dringende Benachrichtigungen. ~€0,04/SMS an EU-Nummern. WhatsApp Business API inklusive.', tags: [{ text: 'SMS · WHATSAPP', variant: 'alt' }, { text: 'PAY-PER-MSG', variant: 'dim' }], tipTitle: isEn ? 'Twilio for SMS & 2FA' : 'Twilio für SMS & 2FA', tip: isEn ? 'Use Twilio when you need SMS (not email): OTP 2FA delivery, appointment reminders, WhatsApp notifications. Pair Resend (email) + Twilio (SMS) for full coverage. ~€0.04/SMS to EU numbers. WhatsApp Business requires Meta approval (1–2 weeks). Vonage/Nexmo is a cheaper EU alternative. Twilio has best coverage and reliability.' : 'Twilio verwenden wenn SMS benötigt (nicht E-Mail): OTP 2FA, Terminerinnerungen, WhatsApp-Benachrichtigungen. Resend (E-Mail) + Twilio (SMS) für vollständige Abdeckung kombinieren. ~€0,04/SMS an EU-Nummern.' })}
          </div>

          <div className="section-divider" data-label={isEn ? 'state' : 'zustand'} />

          {/* State + Forms */}
          <div id="layer-state" className="layer">
            <div className="layer-label label-gold">{isEn ? 'State & Forms' : 'Zustand & Formulare'}</div>
            {n({ variant: 'gold', title: 'TanStack Query v5', desc: isEn ? 'Server state: caching, background refetch, optimistic updates, pagination. Replaces all raw useEffect fetching. All Supabase calls go through queryFn.' : 'Server-Zustand: Caching, Hintergrund-Refetch, optimistische Updates, Paginierung. Ersetzt alle rohen useEffect-Abrufe. Alle Supabase-Aufrufe gehen durch queryFn.', tags: [{ text: 'SERVER STATE', variant: 'gold' }, { text: 'v5 API', variant: 'dim' }], tipTitle: isEn ? 'TanStack Query v5 gotchas' : 'TanStack Query v5 Fallstricke', tip: isEn ? 'v5 API change: useMutation returns `mutateAsync` (not `mutate`) for awaitable calls. Always put Supabase queries in queryFn, never in components. Use queryClient.invalidateQueries() after mutations. Default stale time: 0 — set to 60s for stable data.' : 'v5 API-Änderung: useMutation gibt `mutateAsync` (nicht `mutate`) für awaitable Aufrufe zurück. Supabase-Abfragen immer in queryFn, niemals in Komponenten. queryClient.invalidateQueries() nach Mutationen verwenden.' })}
            {n({ variant: 'gold', title: 'Zustand', desc: isEn ? 'Client-only global state: sidebar open/closed, theme, user preferences, temp UI selections. Never for server data — that\'s TanStack Query.' : 'Client-only globaler Zustand: Sidebar offen/geschlossen, Theme, Benutzereinstellungen, temporäre UI-Auswahlen. Niemals für Server-Daten — das ist TanStack Query.', tag: isEn ? 'CLIENT STATE ONLY' : 'NUR CLIENT-ZUSTAND', tagVariant: 'gold', tipTitle: isEn ? 'Zustand vs TanStack Query' : 'Zustand vs TanStack Query', tip: isEn ? 'Rule: if it comes from a server → TanStack Query. If it\'s UI-only (sidebar, theme, temp selections) → Zustand. Avoid mixing the two. With devtools middleware, all Zustand stores are visible in Redux DevTools. With persist middleware, state survives page reloads.' : 'Regel: Wenn es vom Server kommt → TanStack Query. Wenn es UI-only ist (Sidebar, Theme, temporäre Auswahlen) → Zustand. Die beiden nie mischen.' })}
            {n({ variant: 'silver', title: isEn ? 'RHF + Zod v4' : 'RHF + Zod v4', desc: isEn ? 'React Hook Form handles form state. Zod provides schema-first validation. zodResolver adapter bridges both. Define schemas in module schemas/ folder.' : 'React Hook Form verwaltet den Formular-Zustand. Zod bietet Schema-first-Validierung. zodResolver-Adapter verbindet beide. Schemata im module schemas/-Ordner definieren.', tags: [{ text: 'FORMS', variant: 'silver' }, { text: 'ZOD v4', variant: 'dim' }], tipTitle: isEn ? 'Zod v4 breaking changes' : 'Zod v4 Breaking Changes', tip: isEn ? 'Zod v4 breaking change: z.string().email() is stricter (RFC-compliant). Use @hookform/resolvers/zod and zodResolver(schema). Always define schemas in module schemas/ — never inline in components. Schema types: use z.infer<typeof schema> for TypeScript types.' : 'Zod v4 Breaking Change: z.string().email() ist strenger (RFC-konform). @hookform/resolvers/zod und zodResolver(schema) verwenden. Schemata immer in module schemas/ definieren — niemals inline in Komponenten.' })}
            {n({ variant: 'silver', title: 'TanStack Table v8', desc: isEn ? 'Headless table logic: sorting, filtering, pagination, column visibility, virtual scrolling. Style with shadcn/ui DataTable. Supports 100k+ rows.' : 'Headless-Tabellen-Logik: Sortierung, Filterung, Paginierung, Spaltensichtbarkeit, virtuelles Scrollen. Mit shadcn/ui DataTable gestalten. Unterstützt 100k+ Zeilen.', tag: isEn ? 'HEADLESS · COMPOSABLE' : 'HEADLESS · KOMPOSIERBAR', tagVariant: 'silver', tipTitle: isEn ? 'Why headless tables?' : 'Warum Headless-Tabellen?', tip: isEn ? 'Headless means TanStack Table handles logic; you handle rendering. Use with shadcn/ui\'s DataTable component as the base. Supports 100k+ rows with virtual scrolling via TanStack Virtual. Column definitions live in module components/ — never in routes.' : 'Headless bedeutet TanStack Table verwaltet die Logik; Sie die Darstellung. Mit shadcn/ui DataTable als Basis verwenden. Unterstützt 100k+ Zeilen mit virtuellem Scrollen via TanStack Virtual.' })}
          </div>

          <div className="section-divider" data-label={isEn ? 'bi' : 'bi'} />

          {/* Analytics & BI */}
          <div id="layer-bi" className="layer">
            <div className="layer-label label-quality">{isEn ? 'Analytics & BI' : 'Analytik & BI'}</div>
            {n({ variant: 'quality', title: isEn ? '✦ PostHog (Self-Hosted)' : '✦ PostHog (Selbst-Gehostet)', desc: isEn ? 'Product analytics on Hetzner AX52 #3. ClickHouse + Kafka internally. Feature flags, session replay, funnels, A/B testing. All EU data.' : 'Produktanalytik auf Hetzner AX52 #3. Intern ClickHouse + Kafka. Feature Flags, Session Replay, Funnels, A/B-Testing. Alle EU-Daten.', tags: [{ text: isEn ? 'PRIMARY' : 'PRIMÄR', variant: 'rec' }, { text: 'SELF-HOSTED · GDPR', variant: 'gdpr' }], tipTitle: isEn ? 'Why PostHog self-hosted?' : 'Warum PostHog selbst hosten?', tip: isEn ? 'Self-hosting PostHog on AX52 #3 keeps all user behavior data in Germany. Supports feature flags for staged rollouts and A/B testing. Use the posthog-js React provider. Session replay for UX debugging. Event tracking with tenant_id ensures per-tenant analytics.' : 'Selbst-Hosting von PostHog auf AX52 #3 hält alle Nutzerverhaltensdaten in Deutschland. Unterstützt Feature Flags für Staged Rollouts und A/B-Testing. posthog-js React-Provider verwenden.' })}
            {n({ variant: 'quality', title: isEn ? '▲ Metabase Pro' : '▲ Metabase Pro', desc: isEn ? 'SQL-based BI with embeddable dashboards. Pro enables tenant-scoped embedding via signed JWT. Connects to Gold Postgres layer. Self-host or cloud.' : 'SQL-basiertes BI mit einbettbaren Dashboards. Pro ermöglicht Mandanten-scoped Einbettung via signiertem JWT. Verbindet sich mit Gold Postgres-Schicht. Selbst-Host oder Cloud.', tags: [{ text: 'BI DASHBOARDS', variant: 'quality' }, { text: 'EMBED · JWT', variant: 'gold' }], tipTitle: isEn ? 'Metabase Pro embedding' : 'Metabase Pro Einbettung', tip: isEn ? 'Metabase Pro embedding: generate a signed JWT with tenant_id → renders a tenant-scoped dashboard inside tennent_bi_application. Connects directly to gold_bi_tennent Postgres schema. ~$500/mo for Pro tier. Self-host on Hetzner to reduce costs. Best for non-technical tenant users who need ready-made dashboards.' : 'Metabase Pro Einbettung: signiertes JWT mit tenant_id generieren → rendert mandantenspezifisches Dashboard in tennent_bi_application. Verbindet sich direkt mit gold_bi_tennent Postgres-Schema. ~$500/Monat für Pro.' })}
            {n({ variant: 'quality', title: isEn ? '▲ Apache Superset (OSS)' : '▲ Apache Superset (OSS)', desc: isEn ? 'Open-source BI platform. Self-hosted. Connects to Postgres, ClickHouse. More setup than Metabase but €0/mo license. SQL Lab for ad-hoc queries.' : 'Open-Source BI-Plattform. Selbst-gehostet. Verbindet sich mit Postgres, ClickHouse. Mehr Setup als Metabase aber €0/Monat Lizenz. SQL Lab für Ad-hoc-Abfragen.', tags: [{ text: 'OSS · €0', variant: 'alt' }, { text: isEn ? 'SELF-HOSTED' : 'SELBST-GEHOSTET', variant: 'infra' }], tipTitle: isEn ? 'Superset vs Metabase Pro' : 'Superset vs Metabase Pro', tip: isEn ? 'Choose Superset over Metabase Pro if: (1) budget is tight, (2) your team has SQL expertise, (3) you need ClickHouse support for PostHog data. Warning: embedding is harder than Metabase Pro. Budget 2-3 days for initial setup. Runs well on a small Hetzner VM.' : 'Superset über Metabase Pro wählen wenn: (1) Budget knapp, (2) Team hat SQL-Expertise, (3) ClickHouse-Unterstützung für PostHog-Daten benötigt. Warnung: Einbettung schwieriger als Metabase Pro. 2-3 Tage für Ersteinrichtung einplanen.' })}
            {n({ variant: 'quality', title: isEn ? '▲ Plausible Analytics' : '▲ Plausible Analytics', desc: isEn ? 'Privacy-first GDPR-compliant page analytics. <1KB script, no cookies, no consent banner needed. Self-host or cloud (€9/mo). No individual tracking.' : 'Privacy-first DSGVO-konforme Seitenanalytik. <1KB Skript, keine Cookies, kein Einwilligungsbanner benötigt. Selbst-Host oder Cloud (€9/Monat). Kein Einzel-Tracking.', tags: [{ text: 'PRIVACY-FIRST', variant: 'gdpr' }, { text: isEn ? 'LIGHTWEIGHT' : 'LEICHTGEWICHTIG', variant: 'dim' }], tipTitle: isEn ? 'Plausible for GDPR-safe analytics' : 'Plausible für DSGVO-sichere Analytik', tip: isEn ? 'Replace Google Analytics with Plausible for GDPR-compliant page analytics. No cookies = no consent banner required under GDPR. Self-host on any VM for €0 license. Doesn\'t track individual users — aggregate only. Good complement to PostHog (Plausible = pages, PostHog = behavior + features).' : 'Google Analytics durch Plausible für DSGVO-konforme Seitenanalytik ersetzen. Keine Cookies = kein Einwilligungsbanner unter DSGVO erforderlich. Selbst-Host auf beliebiger VM für €0 Lizenz.' })}
          </div>

          <div className="section-divider" data-label={isEn ? 'infra' : 'infra'} />

          {/* Hosting & Billing & Scheduling */}
          <div id="layer-hosting" className="layer">
            <div className="layer-label label-app">{isEn ? 'Hosting & Services' : 'Hosting & Dienste'}</div>
            {n({ variant: 'app', title: isEn ? '✦ Cloudflare Pages' : '✦ Cloudflare Pages', desc: isEn ? 'Global CDN deployment for frontend. Free tier: unlimited projects, 500 builds/mo. PR previews automatic. Edge Functions via Workers.' : 'Globale CDN-Bereitstellung für Frontend. Kostenlos: unbegrenzte Projekte, 500 Builds/Monat. PR-Vorschauen automatisch. Edge Functions via Workers.', tags: [{ text: 'CDN · FREE', variant: 'rec' }, { text: 'CLOUDFLARE WORKERS', variant: 'infra' }], tipTitle: isEn ? 'Why Cloudflare Pages?' : 'Warum Cloudflare Pages?', tip: isEn ? 'Deploy with: `npx wrangler pages deploy dist`. PR previews are automatic. Edge cache is global — first byte in <50ms worldwide. wrangler.toml is the config file. Cloudflare Workers for edge functions (rate limiting, auth middleware). Free tier is very generous.' : 'Bereitstellen mit: `npx wrangler pages deploy dist`. PR-Vorschauen automatisch. Edge-Cache global — erster Byte in <50ms weltweit. wrangler.toml ist die Konfigurationsdatei.' })}
            {n({ variant: 'infra', title: isEn ? '▲ Hetzner + Nginx/Caddy' : '▲ Hetzner + Nginx/Caddy', desc: isEn ? 'Self-hosted frontend on Hetzner. Full EU control. Caddy for automatic SSL. Shared with other workloads on existing AX52.' : 'Selbst-gehostetes Frontend auf Hetzner. Volle EU-Kontrolle. Caddy für automatisches SSL. Geteilt mit anderen Workloads auf vorhandenem AX52.', tags: [{ text: isEn ? 'EU SELF-HOSTED' : 'EU SELBST-GEHOSTET', variant: 'gdpr' }, { text: isEn ? 'ALT' : 'ALT', variant: 'alt' }], tipTitle: isEn ? 'When to use Hetzner self-host?' : 'Wann Hetzner selbst hosten?', tip: isEn ? 'If Cloudflare Pages doesn\'t meet data residency requirements or you need full control. Deploy to existing AX52, serve via Nginx/Caddy (Caddy handles SSL automatically). No CDN, but all data stays in EU. Cost: ~€0 extra (shared with existing servers).' : 'Wenn Cloudflare Pages Datenanforderungen nicht erfüllt oder volle Kontrolle benötigt wird. Auf vorhandenem AX52 bereitstellen, via Nginx/Caddy servieren (Caddy verwaltet SSL automatisch). Kein CDN, aber alle Daten bleiben in der EU.' })}
            <div className="node-group" style={{ marginTop: 12 }}>
              <div className="node-group-label">{isEn ? 'Billing' : 'Abrechnung'}</div>
              {n({ variant: 'bronze', title: isEn ? '✦ Stripe' : '✦ Stripe', desc: isEn ? 'Subscriptions, billing portal, webhooks via Edge Functions. PCI-compliant. Customer Portal for self-service.' : 'Abonnements, Abrechnungsportal, Webhooks via Edge Functions. PCI-konform. Customer Portal für Self-Service.', tag: isEn ? 'PRIMARY · PCI' : 'PRIMÄR · PCI', tagVariant: 'rec', tipTitle: isEn ? 'Stripe webhook setup' : 'Stripe Webhook-Setup', tip: isEn ? 'Listen to Stripe webhooks in supabase/functions/stripe-webhook/. Sync subscription status to Postgres. Use Stripe\'s Customer Portal for self-service billing — no custom UI needed. Test webhooks locally with `stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook`.' : 'Stripe-Webhooks in supabase/functions/stripe-webhook/ verarbeiten. Abo-Status in Postgres synchronisieren. Stripe Customer Portal für Self-Service-Abrechnung verwenden — keine eigene Benutzeroberfläche benötigt.' })}
              {n({ variant: 'bronze', title: isEn ? '▲ Lemon Squeezy' : '▲ Lemon Squeezy', desc: isEn ? 'Merchant of Record — handles EU VAT compliance automatically. Simpler than Stripe for EU SaaS tax. 5% + $0.50 per transaction.' : 'Merchant of Record — verwaltet EU-MwSt-Compliance automatisch. Einfacher als Stripe für EU SaaS-Steuern. 5% + $0,50 pro Transaktion.', tag: isEn ? 'MOR · EU VAT AUTO' : 'MOR · EU MWST AUTO', tagVariant: 'alt', tipTitle: isEn ? 'Lemon Squeezy for EU compliance' : 'Lemon Squeezy für EU-Compliance', tip: isEn ? 'Lemon Squeezy acts as Merchant of Record — they collect and remit EU VAT automatically across all 27 EU countries. Simpler than Stripe for EU-focused SaaS where VAT compliance is complex. Higher per-transaction cost (5% + $0.50) but saves significant accounting overhead.' : 'Lemon Squeezy handelt als Merchant of Record — sie erheben und zahlen EU-MwSt automatisch in allen 27 EU-Ländern. Einfacher als Stripe für EU-fokussiertes SaaS wo MwSt-Compliance komplex ist.' })}
            </div>
            {n({ variant: 'gold', title: isEn ? '✦ Cal.com (Self-Hosted)' : '✦ Cal.com (Selbst-Gehostet)', desc: isEn ? 'Open-source scheduling embedded via @calcom/embed-react. Per-tenant appointment types, availability, calendar sync. Self-hosted on Hetzner.' : 'Open-Source-Terminplanung eingebettet via @calcom/embed-react. Mandantenspezifische Termintypen, Verfügbarkeit, Kalender-Sync. Selbst-gehostet auf Hetzner.', tag: isEn ? 'EMBED · MULTI-TENANT' : 'EINBETTUNG · MULTI-MANDANT', tagVariant: 'gold', mt: true, tipTitle: isEn ? 'Cal.com self-hosted setup' : 'Cal.com Selbst-Hosting Setup', tip: isEn ? 'Cal.com can be self-hosted on your Hetzner infrastructure. Use @calcom/embed-react for React embedding. Supports multi-tenant: different availability per tenant workspace. Syncs with Google Calendar, Outlook. Run on a small VM (2 vCPU / 4GB RAM).' : 'Cal.com kann auf der Hetzner-Infrastruktur selbst gehostet werden. @calcom/embed-react für React-Einbettung verwenden. Unterstützt Multi-Mandanten: unterschiedliche Verfügbarkeit pro Mandanten-Workspace.' })}
          </div>

          <div className="section-divider" data-label={isEn ? 'test' : 'test'} />

          {/* Testing & CI */}
          <div id="layer-testing" className="layer">
            <div className="layer-label label-alert">{isEn ? 'Testing & CI' : 'Tests & CI'}</div>
            {n({ variant: 'alert', title: isEn ? 'Vitest + RTL' : 'Vitest + RTL', desc: isEn ? 'Vitest for unit + integration tests (Jest-compatible, faster). React Testing Library for component tests. Co-located in module __tests__/unit/ and __tests__/integration/.' : 'Vitest für Unit- + Integrationstests (Jest-kompatibel, schneller). React Testing Library für KomponentenTests. Co-lokalisiert in module __tests__/unit/ und __tests__/integration/.', tag: isEn ? 'UNIT · INTEGRATION' : 'UNIT · INTEGRATION', tagVariant: 'alert', tipTitle: isEn ? 'Vitest setup' : 'Vitest Setup', tip: isEn ? 'Vitest is Jest-compatible but runs on Vite — 10x faster cold start. Configure in vitest.config.ts. Use `renderWithProviders()` helper from src/test/helpers/ to wrap components with QueryClient, Supabase, and other providers. Co-locate tests with modules, not in a separate test/ folder.' : 'Vitest ist Jest-kompatibel läuft aber auf Vite — 10x schnellerer Kaltstart. In vitest.config.ts konfigurieren. `renderWithProviders()` Helper aus src/test/helpers/ verwenden.' })}
            {n({ variant: 'alert', title: 'Playwright', desc: isEn ? 'E2E tests in e2e/ at project root. Covers full user flows: signup → dashboard → feature. Runs after unit tests pass in CI.' : 'E2E-Tests in e2e/ im Projektstamm. Deckt vollständige Benutzerflüsse ab: Registrierung → Dashboard → Feature. Läuft nach Unit-Tests in CI.', tag: 'E2E · BROWSER', tagVariant: 'alert', tipTitle: isEn ? 'Playwright test strategy' : 'Playwright Teststrategie', tip: isEn ? 'E2E tests live in e2e/ at project root (not in modules). Each epic needs at least 1 E2E test for the happy path. Run with `npx playwright test`. In CI, E2E runs only after unit + integration tests pass (dependency in ci.yml). Use `playwright.config.ts` for base URL and browser config.' : 'E2E-Tests leben in e2e/ im Projektstamm (nicht in Modulen). Jedes Epic benötigt mindestens 1 E2E-Test für den Happy Path. Mit `npx playwright test` ausführen.' })}
            {n({ variant: 'quality', title: 'GitHub Actions CI', desc: isEn ? '5-gate pipeline: TypeScript → Lint → Unit tests → E2E → DB migrations. All must pass. PR merge blocked until green.' : '5-Gate-Pipeline: TypeScript → Lint → Unit-Tests → E2E → DB-Migrationen. Alle müssen grün sein. PR-Merge blockiert bis grün.', tag: isEn ? '5 GATES · NO BYPASS' : '5 GATES · KEIN BYPASS', tagVariant: 'quality', tipTitle: isEn ? 'CI gate pipeline' : 'CI-Gate-Pipeline', tip: isEn ? 'Gate order: tsc --noEmit → eslint --max-warnings 0 → vitest run --coverage → playwright test (only if prior 3 pass) → supabase db lint. E2E runs last and only on success of previous gates. This prevents slow E2E tests from blocking fast feedback. No manual override — all gates must pass.' : 'Gate-Reihenfolge: tsc --noEmit → eslint --max-warnings 0 → vitest run --coverage → playwright test (nur wenn vorherige 3 bestehen) → supabase db lint. E2E läuft zuletzt und nur bei Erfolg der vorherigen Gates.' })}
            {n({ variant: 'infra', title: isEn ? 'ESLint + Prettier' : 'ESLint + Prettier', desc: isEn ? 'ESLint with zero warnings policy. Prettier for formatting. Husky pre-commit hooks ensure no violations reach CI.' : 'ESLint mit Zero-Warnings-Policy. Prettier für Formatierung. Husky Pre-Commit-Hooks stellen sicher, dass keine Verstöße CI erreichen.', tag: isEn ? 'ZERO WARNINGS' : 'ZERO WARNINGS', tagVariant: 'infra', tipTitle: isEn ? 'Lint setup' : 'Lint-Setup', tip: isEn ? '`eslint --max-warnings 0` in CI means any warning blocks merge. Use Husky + lint-staged to run ESLint + Prettier on staged files before commit. This catches issues locally before they reach CI. Configure ESLint with @typescript-eslint for type-aware rules.' : '`eslint --max-warnings 0` in CI bedeutet, dass jede Warnung den Merge blockiert. Husky + lint-staged verwenden, um ESLint + Prettier auf gestagten Dateien vor dem Commit auszuführen.' })}
          </div>
        </div>
      </div>

      {/* Module Architecture Rules */}
      <div id="sec-modules" className="section">
        <div className="section-header">
          <div className="section-title">{isEn ? 'Module Architecture Rules' : 'Modul-Architektur-Regeln'}</div>
          <div className="section-subtitle">{isEn ? 'from SAAS-FRAMEWORK.md' : 'aus SAAS-FRAMEWORK.md'}</div>
        </div>
        <div className="cross-grid">
          {n({ variant: 'infra', title: isEn ? 'Import Boundaries' : 'Import-Grenzen', desc: isEn ? 'Modules NEVER import from other modules directly. Cross-module data flows through shared hooks or the Supabase query layer only. Violation = hidden coupling.' : 'Module importieren NIE direkt aus anderen Modulen. Modulübergreifende Daten fließen nur durch gemeinsame Hooks oder die Supabase-Abfrageschicht. Verstoß = versteckte Kopplung.', tag: isEn ? 'NEVER CROSS-IMPORT' : 'NIE KREUZ-IMPORT', tagVariant: 'alert', tipTitle: isEn ? 'Why no cross-module imports?' : 'Warum keine modulübergreifenden Imports?', tip: isEn ? 'If billing imports from auth, you\'ve created an invisible dependency. Now auth changes break billing tests. Keeping modules isolated means each can be developed, tested, and potentially extracted independently. Shared code earns its place in shared/ after 2+ modules need it.' : 'Wenn Billing aus Auth importiert, haben Sie eine unsichtbare Abhängigkeit erstellt. Nun können Auth-Änderungen Billing-Tests brechen. Module isoliert zu halten bedeutet, dass jedes unabhängig entwickelt, getestet und potenziell extrahiert werden kann.' })}
          {n({ variant: 'gold', title: isEn ? 'Barrel Exports' : 'Barrel-Exporte', desc: isEn ? 'Every module has index.ts as its public API. Internal paths are private. External code imports from @/modules/billing — never from @/modules/billing/utils/calc.' : 'Jedes Modul hat index.ts als seine öffentliche API. Interne Pfade sind privat. Externer Code importiert aus @/modules/billing — niemals aus @/modules/billing/utils/calc.', tag: isEn ? 'PUBLIC API VIA INDEX.TS' : 'ÖFFENTLICHE API VIA INDEX.TS', tagVariant: 'gold', tipTitle: isEn ? 'Why barrel exports?' : 'Warum Barrel-Exporte?', tip: isEn ? 'The barrel export (index.ts) is the contract between modules. It says: "here is what I expose, everything else is private." This lets you refactor internals without breaking consumers. Only things exported from index.ts are part of the public API.' : 'Der Barrel-Export (index.ts) ist der Vertrag zwischen Modulen. Er sagt: "Hier ist was ich exponiere, alles andere ist privat." Dies ermöglicht das Refactoring von Interna ohne Verbraucher zu brechen.' })}
          {n({ variant: 'silver', title: isEn ? 'Shared Code Promotion' : 'Shared Code Beförderung', desc: isEn ? 'shared/ starts empty. Code moves there ONLY after 2+ modules consume it. When promoting: remove from origin, place in shared/, update both consumers.' : 'shared/ startet leer. Code zieht nur dorthin um, wenn 2+ Module es verwenden. Beim Befördern: aus Ursprung entfernen, in shared/ platzieren, beide Verbraucher aktualisieren.', tag: isEn ? '2+ MODULES RULE' : '2+ MODULE REGEL', tagVariant: 'silver', tipTitle: isEn ? 'Why not pre-populate shared/?' : 'Warum shared/ nicht vorab befüllen?', tip: isEn ? 'Pre-populating shared/ creates premature abstractions — code that "might be useful" but isn\'t yet. This adds indirection without benefit. The 2+ modules rule ensures shared code actually has multiple consumers before it gets the overhead of a shared location.' : 'shared/ vorab zu befüllen erstellt vorzeitige Abstraktionen — Code der "nützlich sein könnte" aber noch nicht ist. Dies fügt Indirektion ohne Nutzen hinzu. Die 2+ Module Regel stellt sicher, dass gemeinsamer Code tatsächlich mehrere Verbraucher hat.' })}
          {n({ variant: 'event', title: isEn ? 'Routes → Modules' : 'Routen → Module', desc: isEn ? 'Route files compose modules. Modules never reference routes, route params, or navigation. One-way dependency: routes → modules, never modules → routes.' : 'Route-Dateien komponieren Module. Module referenzieren niemals Routen, Route-Parameter oder Navigation. Einwegabhängigkeit: Routen → Module, niemals Module → Routen.', tag: isEn ? 'ONE-WAY DEPENDENCY' : 'EINWEGABHÄNGIGKEIT', tagVariant: 'event', tipTitle: isEn ? 'Why route-agnostic modules?' : 'Warum routenagnostische Module?', tip: isEn ? 'If a module knows about routes, it can only be used in that routing context. Route-agnostic modules can be used in stories, tests, or different route structures without modification. Route files in src/app/routes/ orchestrate modules — they\'re the glue, not the logic.' : 'Wenn ein Modul über Routen weiß, kann es nur in diesem Routing-Kontext verwendet werden. Routenagnostische Module können in Stories, Tests oder verschiedenen Routenstrukturen ohne Änderung verwendet werden.' })}
        </div>
      </div>

      {/* Auth & BI Cost Comparison */}
      <div id="sec-compare" className="section" style={{ background: 'var(--bg)' }}>
        <div className="section-header">
          <div className="section-title">{isEn ? 'Tool Comparison Tables' : 'Werkzeug-Vergleichstabellen'}</div>
        </div>
        <div className="three-col-grid">
          {/* Auth Comparison */}
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-dim)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
              {isEn ? 'Auth Options Comparison' : 'Auth-Optionen Vergleich'}
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{isEn ? 'Tool' : 'Werkzeug'}</th>
                  <th>{isEn ? 'Model' : 'Modell'}</th>
                  <th>{isEn ? 'EU Data' : 'EU-Daten'}</th>
                  <th>{isEn ? 'Cost/mo' : 'Kosten/Mon'}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { tool: 'Keycloak', model: isEn ? 'Self-hosted' : 'Selbst-gehostet', eu: '✓', cost: '€0–75', note: isEn ? 'Primary · Enterprise SSO / SAML' : 'Primär · Enterprise SSO / SAML', color: 'var(--green)' },
                  { tool: 'Supabase Auth', model: isEn ? 'Built-in' : 'Integriert', eu: '✓', cost: '€0', note: isEn ? 'Alt · Best with Supabase RLS' : 'Alt · Beste mit Supabase RLS', color: 'var(--gold)' },
                  { tool: 'Clerk', model: isEn ? 'Managed' : 'Verwaltet', eu: '±', cost: '€25+', note: isEn ? 'Alt · EU residency paid tier' : 'Alt · EU-Residenz kostenpflichtig', color: 'var(--gold)' },
                  { tool: 'Better Auth', model: isEn ? 'OSS / Self-hosted' : 'OSS / Selbst-gehostet', eu: '✓', cost: '€0', note: isEn ? 'Alt · Any DB, new library' : 'Alt · Beliebige DB, neue Bibliothek', color: 'var(--quality)' },
                ].map((row, i) => (
                  <tr key={i}>
                    <td style={{ color: row.color, fontWeight: 600 }}>
                      {row.tool}
                      <div className="td-source">{row.note}</div>
                    </td>
                    <td className="td-muted">{row.model}</td>
                    <td style={{ color: row.eu === '✓' ? 'var(--green)' : 'var(--gold)', textAlign: 'center' }}>{row.eu}</td>
                    <td style={{ color: 'var(--text)', textAlign: 'right' }}>{row.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Email/SMS Comparison */}
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-dim)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
              {isEn ? 'Email & SMS Comparison' : 'E-Mail & SMS Vergleich'}
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{isEn ? 'Tool' : 'Werkzeug'}</th>
                  <th>{isEn ? 'Channels' : 'Kanäle'}</th>
                  <th>{isEn ? 'EU Data' : 'EU-Daten'}</th>
                  <th>{isEn ? 'Free Tier' : 'Gratis'}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { tool: 'Resend', channels: 'Email', eu: '✓', free: '100/day', note: isEn ? 'React Email templates' : 'React Email Templates', color: 'var(--bronze)' },
                  { tool: 'Postmark', channels: 'Email', eu: '✓', free: '100/mo', note: isEn ? 'Best deliverability' : 'Beste Zustellbarkeit', color: 'var(--quality)' },
                  { tool: 'Brevo', channels: 'Email + SMS', eu: '✓✓', free: '300/day', note: isEn ? 'Paris HQ, Schrems II safe' : 'Paris, Schrems II sicher', color: 'var(--gdpr)' },
                  { tool: 'Twilio', channels: 'SMS · WA', eu: '±', free: '✗', note: isEn ? '€0.04/SMS EU' : '€0,04/SMS EU', color: 'var(--gold)' },
                ].map((row, i) => (
                  <tr key={i}>
                    <td style={{ color: row.color, fontWeight: 600 }}>
                      {row.tool}
                      <div className="td-source">{row.note}</div>
                    </td>
                    <td className="td-muted" style={{ fontSize: 12 }}>{row.channels}</td>
                    <td style={{ color: row.eu.startsWith('✓') ? 'var(--green)' : 'var(--gold)', textAlign: 'center' }}>{row.eu}</td>
                    <td style={{ color: 'var(--text)', textAlign: 'right' }}>{row.free}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* BI Comparison */}
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-dim)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
              {isEn ? 'BI & Analytics Comparison' : 'BI & Analytik Vergleich'}
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{isEn ? 'Tool' : 'Werkzeug'}</th>
                  <th>{isEn ? 'Best For' : 'Beste Für'}</th>
                  <th>{isEn ? 'Embed?' : 'Einbettbar?'}</th>
                  <th>{isEn ? 'Cost/mo' : 'Kosten/Mon'}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { tool: 'PostHog OSS', best: isEn ? 'Product analytics, feature flags' : 'Produktanalytik, Feature Flags', embed: '✓', cost: '€0 + server', color: 'var(--quality)' },
                  { tool: 'Metabase Pro', best: isEn ? 'Tenant BI dashboards, embedding' : 'Mandanten-BI-Dashboards, Einbettung', embed: '✓ JWT', cost: '~€500+', color: 'var(--gold)' },
                  { tool: 'Apache Superset', best: isEn ? 'SQL power users, OSS BI' : 'SQL Power User, OSS BI', embed: '±', cost: '€0 + server', color: 'var(--bronze)' },
                  { tool: 'Plausible', best: isEn ? 'Simple page analytics, GDPR' : 'Einfache Seitenanalytik, DSGVO', embed: '✗', cost: '€0–19', color: 'var(--green)' },
                  { tool: 'Grafana', best: isEn ? 'Infrastructure monitoring' : 'Infrastruktur-Monitoring', embed: '✓', cost: '€0', color: 'var(--infra)' },
                ].map((row, i) => (
                  <tr key={i}>
                    <td style={{ color: row.color, fontWeight: 600 }}>{row.tool}</td>
                    <td className="td-muted" style={{ fontSize: 12 }}>{row.best}</td>
                    <td style={{ color: row.embed.startsWith('✓') ? 'var(--green)' : row.embed === '±' ? 'var(--gold)' : 'var(--alert)', textAlign: 'center' }}>{row.embed}</td>
                    <td style={{ color: 'var(--text)', textAlign: 'right' }}>{row.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Dev Tooling */}
      <div id="sec-devtools" className="section">
        <div className="section-header">
          <div className="section-title">{isEn ? 'Developer Tooling & Conventions' : 'Entwickler-Tools & Konventionen'}</div>
        </div>
        <div className="cross-grid">
          {n({ variant: 'infra', title: isEn ? 'Claude Code (AI-Assisted Dev)' : 'Claude Code (KI-gestützte Entwicklung)', desc: isEn ? 'CLAUDE.md loaded at every session — project context, tech stack, architecture rules. Skills for Supabase, Tailwind v4, TanStack, shadcn/ui, Cloudflare. /new-module and /new-epic slash commands.' : 'CLAUDE.md bei jeder Sitzung geladen — Projektkontext, Tech-Stack, Architekturregeln. Skills für Supabase, Tailwind v4, TanStack, shadcn/ui, Cloudflare. /new-module und /new-epic Slash-Commands.', tag: isEn ? 'SESSION CONTEXT' : 'SITZUNGSKONTEXT', tagVariant: 'infra', tipTitle: isEn ? 'How Claude Code improves consistency' : 'Wie Claude Code Konsistenz verbessert', tip: isEn ? 'CLAUDE.md persists project context across sessions. Skills enforce tool-specific patterns (TanStack Query v5 not v4, shadcn CLI not manual copy). /new-module scaffolds correct structure. /new-epic writes failing test stubs first (TDD). No more "which pattern do we use?" debates.' : 'CLAUDE.md speichert Projektkontext über Sitzungen hinweg. Skills erzwingen werkzeugspezifische Muster. /new-module erstellt korrekte Struktur. /new-epic schreibt zunächst fehlende Test-Stubs (TDD).' })}
          {n({ variant: 'quality', title: isEn ? 'Supabase CLI + Migrations' : 'Supabase CLI + Migrationen', desc: isEn ? 'All DB changes via timestamped migrations (YYYYMMDDHHmmss_description.sql). Never edit prod DB directly. RLS on every table. Auto-generate types with `supabase gen types typescript`.' : 'Alle DB-Änderungen via timestamped Migrationen (YYYYMMDDHHmmss_Beschreibung.sql). Niemals prod DB direkt bearbeiten. RLS auf jeder Tabelle. Typen auto-generieren mit `supabase gen types typescript`.', tag: isEn ? 'MIGRATION-FIRST' : 'MIGRATION-FIRST', tagVariant: 'quality', tipTitle: isEn ? 'Supabase migration workflow' : 'Supabase Migrations-Workflow', tip: isEn ? 'Create a migration: `supabase migration new description`. Edit the SQL. Apply locally: `supabase db reset`. Apply to prod: `supabase db push --linked`. Lint migrations before push: `supabase db lint`. All tables must have RLS enabled — no exceptions per CLAUDE.md.' : 'Migration erstellen: `supabase migration new Beschreibung`. SQL bearbeiten. Lokal anwenden: `supabase db reset`. Auf Prod anwenden: `supabase db push --linked`. Migrationen vor Push linten: `supabase db lint`.' })}
          {n({ variant: 'event', title: isEn ? 'TDD Epic Workflow' : 'TDD Epic Workflow', desc: isEn ? 'Every epic: spec → tests written (RED) → migration → API layer → components → all tests GREEN → PR. Tests exist before implementation — no exceptions.' : 'Jedes Epic: Spezifikation → Tests geschrieben (ROT) → Migration → API-Schicht → Komponenten → alle Tests GRÜN → PR. Tests existieren vor der Implementierung — keine Ausnahmen.', tag: isEn ? 'TESTS FIRST' : 'TESTS ZUERST', tagVariant: 'event', tipTitle: isEn ? 'Why TDD for epics?' : 'Warum TDD für Epics?', tip: isEn ? 'Writing tests first forces you to define the API and component interface before implementation. This catches design flaws early. The /new-epic command generates failing test stubs automatically. CI blocks merge without green tests — so the only path to merge is green tests.' : 'Tests zuerst zu schreiben zwingt Sie, die API und Komponentenschnittstelle vor der Implementierung zu definieren. Dies erkennt Designfehler früh. Der /new-epic Befehl generiert automatisch fehlende Test-Stubs.' })}
          {n({ variant: 'gdpr', title: isEn ? 'Sentry (Error Monitoring)' : 'Sentry (Fehlerüberwachung)', desc: isEn ? 'Frontend + backend error tracking. Session replay on errors. PII scrubbing before sending. Source maps for readable stack traces in prod.' : 'Frontend + Backend-Fehlerverfolgung. Session Replay bei Fehlern. PII-Bereinigung vor dem Senden. Source Maps für lesbare Stack Traces in Prod.', tag: isEn ? 'ERROR TRACKING · GDPR' : 'FEHLERVERFOLGUNG · DSGVO', tagVariant: 'gdpr', tipTitle: isEn ? 'Sentry GDPR configuration' : 'Sentry DSGVO-Konfiguration', tip: isEn ? 'Configure Sentry with `beforeSend` hook to scrub PII before uploading. Use Sentry\'s EU data region (sentry.io/eu) to keep errors in Europe. Set `tracesSampleRate: 0.1` for 10% performance monitoring. Source maps: upload during CI build with `SENTRY_AUTH_TOKEN`.' : 'Sentry mit `beforeSend` Hook konfigurieren, um PII vor dem Hochladen zu bereinigen. Sentries EU-Datenregion (sentry.io/eu) verwenden, um Fehler in Europa zu halten.' })}
        </div>
      </div>

      {/* Cost Breakdown */}
      <div id="sec-cost" className="section" style={{ background: 'var(--bg)' }}>
        <div className="section-header">
          <div className="section-title">{isEn ? 'Monthly Stack Cost Breakdown' : 'Monatliche Stack-Kosten'}</div>
          <div className="section-subtitle">{isEn ? '~€0–5/mo base · transaction fees excluded' : '~€0–5/Monat Basis · Transaktionsgebühren nicht enthalten'}</div>
        </div>
        <div className="two-col-grid">

          {/* Left — recommended stack table */}
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-dim)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
              {isEn ? 'Recommended Stack (OSS + free tiers)' : 'Empfohlener Stack (OSS + kostenlose Stufen)'}
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{isEn ? 'Tool' : 'Werkzeug'}</th>
                  <th>{isEn ? 'Tier' : 'Stufe'}</th>
                  <th>{isEn ? 'Cost/mo' : 'Kosten/Mon'}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { tool: 'React 19 + Vite 6 + TypeScript', role: isEn ? 'Core framework' : 'Kern-Framework', v: '€0', color: 'var(--infra)' },
                  { tool: 'Tailwind v4 + shadcn/ui + Fonts', role: isEn ? 'Styling layer (OSS)' : 'Styling-Schicht (OSS)', v: '€0', color: 'var(--event)' },
                  { tool: isEn ? 'Keycloak (self-hosted)' : 'Keycloak (selbst-gehostet)', role: isEn ? 'Auth — runs on shared Hetzner VM' : 'Auth — läuft auf geteilter Hetzner-VM', v: '~€0', color: 'var(--gdpr)' },
                  { tool: 'Resend', role: isEn ? 'Email — 100 emails/day free' : 'E-Mail — 100/Tag kostenlos', v: '€0', color: 'var(--bronze)' },
                  { tool: 'TanStack + Zustand + RHF + Zod', role: isEn ? 'State & forms (OSS)' : 'Zustand & Formulare (OSS)', v: '€0', color: 'var(--gold)' },
                  { tool: 'Vitest + Playwright + ESLint', role: isEn ? 'Testing & CI (OSS)' : 'Tests & CI (OSS)', v: '€0', color: 'var(--alert)' },
                  { tool: isEn ? 'PostHog (self-hosted on AX52 #3)' : 'PostHog (AX52 #3, keine Grenzkosten)', role: isEn ? 'Analytics — no extra cost' : 'Analytik — keine Zusatzkosten', v: '€0', color: 'var(--quality)' },
                  { tool: 'Cloudflare Pages', role: isEn ? 'Hosting — unlimited requests free' : 'Hosting — unbegrenzt kostenlos', v: '€0', color: 'var(--green)' },
                  { tool: isEn ? 'Cal.com (self-hosted)' : 'Cal.com (selbst-gehostet)', role: isEn ? 'Scheduling — small Hetzner VM' : 'Terminplanung — kleine VM', v: '~€5', color: 'var(--gold)' },
                  { tool: 'Stripe', role: isEn ? 'Billing — 1.4% + €0.25/txn EU' : 'Abrechnung — 1,4% + €0,25/Txn EU', v: isEn ? '€0 base' : '€0 Basis', color: 'var(--bronze)' },
                  { tool: 'GitHub Actions CI', role: isEn ? '2,000 min/mo free (public)' : '2.000 Min/Mon kostenlos (öffentlich)', v: '€0', color: 'var(--quality)' },
                ].map((row, i) => (
                  <tr key={i}>
                    <td style={{ color: row.color, fontWeight: 600 }}>{row.tool}</td>
                    <td className="td-muted" style={{ fontSize: 12 }}>{row.role}</td>
                    <td style={{ color: row.v === '€0' ? 'var(--green)' : 'var(--gold)', textAlign: 'right' }}>{row.v}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2} style={{ color: 'var(--text)', fontWeight: 700 }}>{isEn ? 'Total Base Cost' : 'Gesamte Basiskosten'}</td>
                  <td className="grad-green" style={{ fontSize: 15 }}>~€0–5</td>
                </tr>
              </tfoot>
            </table>
            <div className="table-note">
              {isEn
                ? 'Stripe/Lemon Squeezy transaction fees apply per sale — not a fixed monthly cost.\nPostHog runs on the existing AX52 #3 (counted in data architecture cost).'
                : 'Stripe/Lemon Squeezy Transaktionsgebühren gelten pro Verkauf — keine fixen Monatskosten.\nPostHog läuft auf dem bestehenden AX52 #3 (in den Datenarchitekturkosten enthalten).'}
            </div>
          </div>

          {/* Right — optional upgrades + SaaS comparison */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-dim)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
                {isEn ? 'Optional Upgrades' : 'Optionale Upgrades'}
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{isEn ? 'Upgrade' : 'Upgrade'}</th>
                    <th>{isEn ? 'When' : 'Wann'}</th>
                    <th>{isEn ? 'Adds/mo' : '+/Mon'}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { u: isEn ? 'Resend 50k emails/mo' : 'Resend 50k E-Mails/Mon', when: isEn ? 'Transactional volume grows' : 'E-Mail-Volumen wächst', v: '+€20', color: 'var(--bronze)' },
                    { u: isEn ? 'Postmark 10k emails/mo' : 'Postmark 10k E-Mails/Mon', when: isEn ? 'Need max deliverability' : 'Max. Zustellbarkeit nötig', v: '+€15', color: 'var(--quality)' },
                    { u: isEn ? 'Brevo email + SMS bundle' : 'Brevo E-Mail + SMS Paket', when: isEn ? 'Need SMS on one bill' : 'SMS auf einer Rechnung', v: '+€25+', color: 'var(--gdpr)' },
                    { u: isEn ? 'Clerk (managed auth)' : 'Clerk (verwaltete Auth)', when: isEn ? 'No Supabase, need fast setup' : 'Kein Supabase, schnelles Setup', v: '+€25+', color: 'var(--gdpr)' },
                    { u: isEn ? 'Plausible cloud (page analytics)' : 'Plausible Cloud (Seitenanalytik)', when: isEn ? 'Lightweight GDPR page stats' : 'Leichte DSGVO-Seitenstatistiken', v: '+€9–19', color: 'var(--quality)' },
                    { u: isEn ? 'Sentry cloud EU (error tracking)' : 'Sentry Cloud EU (Fehler-Tracking)', when: isEn ? 'Don\'t want to self-host Sentry' : 'Kein Sentry-Selbst-Hosting', v: '+€26+', color: 'var(--alert)' },
                    { u: isEn ? 'Metabase Pro (tenant BI)' : 'Metabase Pro (Mandanten-BI)', when: isEn ? 'Need embeddable dashboards' : 'Einbettbare Dashboards nötig', v: '+€500+', color: 'var(--gold)' },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td style={{ color: row.color, fontWeight: 600 }}>{row.u}</td>
                      <td className="td-muted" style={{ fontSize: 11 }}>{row.when}</td>
                      <td style={{ color: 'var(--gold)', textAlign: 'right' }}>{row.v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {n({
              variant: 'infra',
              title: isEn ? 'Managed SaaS Alternative: €300–1,500/mo' : 'Verwaltete SaaS-Alternative: €300–1.500/Monat',
              desc: isEn
                ? 'Auth0 (~€70) + SendGrid (~€30) + Mixpanel (~€100) + Vercel Pro (~€40) + Amplitude (~€300+) + Intercom (~€100) adds up fast — for the same stack you\'re getting at ~€5/mo base.'
                : 'Auth0 (~€70) + SendGrid (~€30) + Mixpanel (~€100) + Vercel Pro (~€40) + Amplitude (~€300+) + Intercom (~€100) summiert sich schnell — für denselben Stack den Sie für ~€5/Monat bekommen.',
              tag: isEn ? 'UP TO 300× SAVINGS' : 'BIS ZU 300× EINSPARUNGEN',
              tagVariant: 'app',
              style: { borderLeftColor: 'var(--green)' },
              tipTitle: isEn ? 'Why is the stack so cheap?' : 'Warum ist der Stack so günstig?',
              tip: isEn
                ? 'Every layer uses OSS or generous free tiers: React, Vite, Tailwind, shadcn, TanStack, Zustand, Zod, Vitest, Playwright, ESLint — all €0. Cloudflare Pages free tier handles 500 builds/mo and unlimited requests. Supabase free tier covers 50k MAU. PostHog runs on your existing AX52 #3. The only fixed expense is Cal.com\'s ~€5 VM.'
                : 'Jede Schicht verwendet OSS oder großzügige kostenlose Stufen: React, Vite, Tailwind, shadcn, TanStack, Zustand, Zod, Vitest, Playwright, ESLint — alle €0. Cloudflare Pages verarbeitet 500 Builds/Monat und unbegrenzte Anfragen. Supabase deckt 50k MAU kostenlos ab.',
            })}
          </div>
        </div>
      </div>

        </div>{/* arch-content */}
      </div>{/* arch-body */}

      {/* Footer */}
      <div className="page-footer">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{isEn ? 'Designed & Architected with' : 'Entworfen & Architekturiert mit'}</span>
            <span style={{ fontSize: 14, color: 'var(--alert)', margin: '0 5px' }}>♥</span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{isEn ? 'by' : 'von'}</span>
            <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600, marginLeft: 6, fontFamily: "'JetBrains Mono', monospace" }}>Upputri Lokesh, Upputuri Tanuj & Paidala Rithika</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)' }} className="pulse" />
            <span style={{ fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' }}>LU Equity Holding UG · 2026</span>
          </div>
        </div>
      </div>
    </div>
  )
}
