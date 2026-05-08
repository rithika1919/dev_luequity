import { useState, useCallback, useRef } from 'react'

interface TooltipState {
  visible: boolean
  x: number
  y: number
  title: string
  content: string
}

interface NodeProps {
  variant: string
  title: string
  desc: string
  tag?: string
  tagVariant?: string
  tags?: { text: string; variant: string }[]
  tipTitle?: string
  tip?: string
  dashed?: boolean
  mt?: boolean
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

interface Lang { [key: string]: string }

const T: Record<'en' | 'de', Lang> = {
  en: {
    title: 'Data Platform Architecture',
    subtitle: 'Hetzner · Medallion Architecture · Multi-Tenant · EU Self-Hosted',
    badge: '● GDPR COMPLIANT',
    layerSources: 'Sources',
    layerIngestion: 'Ingestion',
    layerBronze: 'Bronze (Raw)',
    layerSilver: 'Silver (Clean)',
    layerGold: 'Gold (Business)',
    layerApps: 'Applications',
    divIngest: 'ingest',
    divStore: 'store',
    divTransform: 'transform',
    divServe: 'serve',
    divConsume: 'consume',
    legendSources: 'Sources',
    legendEvent: 'Event Stream',
    legendBronze: 'Bronze',
    legendSilver: 'Silver',
    legendGold: 'Gold',
    legendApps: 'Applications',
    legendInfra: 'Infrastructure',
    legendGdpr: 'GDPR / Security',
    legendAlert: 'Alerting',
    legendQuality: 'Data Quality',
    legendDashed: '- - - Dashed = Planned',
    flowBronzToSilver: 'quality gate',
    flowBronz: 'bronz',
    flowSilver: 'silver',
    flowGold: 'gold',
    groupAppGold: 'App-Serving Gold',
    groupBiGold: 'BI-Serving Gold',
    secInfra: 'Cross-Cutting Infrastructure',
    secFlow: 'Data Flow Paths',
    secCost: 'Monthly Cost Breakdown',
    secCostSub: '~€440–510/mo total',
    secTeam: 'Hypothetical: What If You Had to Hire This Team in Germany?',
    colComponent: 'Component',
    colService: 'Service',
    colCost: 'Cost/mo',
    colRole: 'Role',
    colSalary: 'Gross Salary/yr (incl. employer contrib.)',
    totalCost: 'Total Monthly Cost',
    totalTeam: '3-person team total',
    footerBy: 'Designed & Architected with',
    footerBy2: 'by',
    footerAuthor: 'Upputri Lokesh, Upputuri Tanuj & Paidala Rithika',
  },
  de: {
    title: 'Datenplattform-Architektur',
    subtitle: 'Hetzner · Medaillon-Architektur · Multi-Mandant · EU Selbst-gehostet',
    badge: '● DSGVO-KONFORM',
    layerSources: 'Quellen',
    layerIngestion: 'Aufnahme',
    layerBronze: 'Bronze (Roh)',
    layerSilver: 'Silber (Bereinigt)',
    layerGold: 'Gold (Geschäft)',
    layerApps: 'Anwendungen',
    divIngest: 'aufnahme',
    divStore: 'speicher',
    divTransform: 'transform',
    divServe: 'ausgabe',
    divConsume: 'konsum',
    legendSources: 'Quellen',
    legendEvent: 'Ereignis-Stream',
    legendBronze: 'Bronze',
    legendSilver: 'Silber',
    legendGold: 'Gold',
    legendApps: 'Anwendungen',
    legendInfra: 'Infrastruktur',
    legendGdpr: 'DSGVO / Sicherheit',
    legendAlert: 'Alarme',
    legendQuality: 'Datenqualität',
    legendDashed: '- - - Gestrichelt = Geplant',
    flowBronzToSilver: 'Qualitäts-Gate',
    flowBronz: 'bronz',
    flowSilver: 'silber',
    flowGold: 'gold',
    groupAppGold: 'App-Auslieferungs-Gold',
    groupBiGold: 'BI-Auslieferungs-Gold',
    secInfra: 'Übergreifende Infrastruktur',
    secFlow: 'Datenflusspfade',
    secCost: 'Monatliche Kostenaufschlüsselung',
    secCostSub: '~€440–510/Monat gesamt',
    secTeam: 'Hypothetisch: Was, wenn Sie dieses Team in Deutschland einstellen müssten?',
    colComponent: 'Komponente',
    colService: 'Dienst',
    colCost: 'Kosten/Monat',
    colRole: 'Rolle',
    colSalary: 'Bruttogehalt/Jahr (inkl. AG-Beiträge)',
    totalCost: 'Monatliche Gesamtkosten',
    totalTeam: '3-Personen-Team gesamt',
    footerBy: 'Entworfen & Architekturiert mit',
    footerBy2: 'von',
    footerAuthor: 'Upputri Lokesh, Upputuri Tanuj & Paidala Rithika',
  },
}

type LangKey = 'en' | 'de'

export default function DataArchitecture() {
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

  const t = T[lang]

  const n = (props: Omit<NodeProps, 'onTip' | 'onHide'>) =>
    <Node {...props} onTip={showTip} onHide={hideTip} />

  const isEn = lang === 'en'

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
          <div className="header-title">{t.title}</div>
          <div className="header-subtitle">{t.subtitle}</div>
        </div>
        <div className="header-right">
          <div className="header-badge">{t.badge}</div>
          <div className="lang-toggle">
            <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
            <button className={lang === 'de' ? 'active' : ''} onClick={() => setLang('de')}>DE</button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="legend">
        {[
          { label: t.legendSources, color: 'var(--text-muted)' },
          { label: t.legendEvent, color: 'var(--event)' },
          { label: t.legendBronze, color: 'var(--bronze)' },
          { label: t.legendSilver, color: 'var(--silver)' },
          { label: t.legendGold, color: 'var(--gold)' },
          { label: t.legendApps, color: 'var(--green)' },
          { label: t.legendInfra, color: 'var(--infra)' },
          { label: t.legendGdpr, color: 'var(--gdpr)' },
          { label: t.legendAlert, color: 'var(--alert)' },
          { label: t.legendQuality, color: 'var(--quality)' },
        ].map((item, i) => (
          <div key={i} className="legend-item">
            <div className="legend-dot" style={{ background: item.color }} />
            {item.label}
          </div>
        ))}
        <div className="legend-sep" />
        <div className="legend-item" style={{ color: 'var(--text-dim)', fontSize: '10px' }}>{t.legendDashed}</div>
      </div>

      {/* Body: sidebar + content */}
      <div className="arch-body">
        <nav className="arch-sidebar">
          <span className="sidebar-section-label">Pipeline</span>
          <button className="sidebar-link" onClick={() => document.getElementById('layer-sources')?.scrollIntoView({ behavior: 'smooth' })}>Sources</button>
          <button className="sidebar-link" onClick={() => document.getElementById('layer-ingestion')?.scrollIntoView({ behavior: 'smooth' })}>Ingestion</button>
          <button className="sidebar-link" onClick={() => document.getElementById('layer-bronze')?.scrollIntoView({ behavior: 'smooth' })}>Bronze (Raw)</button>
          <button className="sidebar-link" onClick={() => document.getElementById('layer-silver')?.scrollIntoView({ behavior: 'smooth' })}>Silver (Clean)</button>
          <button className="sidebar-link" onClick={() => document.getElementById('layer-gold')?.scrollIntoView({ behavior: 'smooth' })}>Gold (Business)</button>
          <button className="sidebar-link" onClick={() => document.getElementById('layer-apps')?.scrollIntoView({ behavior: 'smooth' })}>Applications</button>
          <span className="sidebar-section-label">Sections</span>
          <button className="sidebar-link" onClick={() => document.getElementById('sec-infra')?.scrollIntoView({ behavior: 'smooth' })}>Infrastructure</button>
          <button className="sidebar-link" onClick={() => document.getElementById('sec-flows')?.scrollIntoView({ behavior: 'smooth' })}>Data Flows</button>
          <button className="sidebar-link" onClick={() => document.getElementById('sec-cost')?.scrollIntoView({ behavior: 'smooth' })}>Cost Breakdown</button>
          <button className="sidebar-link" onClick={() => document.getElementById('sec-team')?.scrollIntoView({ behavior: 'smooth' })}>Team Cost</button>
        </nav>
        <div className="arch-content">

      {/* Canvas */}
      <div className="canvas">
        <div className="layers">
          {/* Sources */}
          <div id="layer-sources" className="layer">
            <div className="layer-label label-source">{t.layerSources}</div>
            {n({ variant: 'source', title: isEn ? 'Simplisan ERP' : 'Simplisan ERP', desc: isEn ? 'Primary data source. Crawler extracts patient, business &amp; tenant data.' : 'Primäre Datenquelle. Der Crawler extrahiert Patienten-, Geschäfts- und Mandantendaten.', tag: isEn ? 'BATCH · HOURLY' : 'BATCH · STÜNDLICH', tagVariant: 'infra', tipTitle: isEn ? 'Why Simplisan ERP?' : 'Warum Simplisan ERP?', tip: isEn ? 'The operational system of record — all patient, business, and tenant data originates here. The Crawler extracts on an hourly batch schedule, feeding the entire Bronze layer.' : 'Das operative System der Aufzeichnung — alle Patienten-, Geschäfts- und Mandantendaten stammen von hier. Der Crawler extrahiert stündlich und speist die gesamte Bronze-Schicht.' })}
            {n({ variant: 'source', title: isEn ? 'Simplisan API' : 'Simplisan API', desc: isEn ? 'Future: REST API integration replacing Crawler for direct data fetch.' : 'Zukünftig: REST-API-Integration ersetzt den Crawler für direkten Datenabruf.', tag: isEn ? 'PLANNED' : 'GEPLANT', tagVariant: 'dim', dashed: true, tipTitle: isEn ? 'Why migrate to API later?' : 'Warum später zur API migrieren?', tip: isEn ? 'The Crawler is brittle — it depends on HTML/UI structure that can break silently. A REST API gives stable, versioned contracts. Planned once Simplisan exposes native API endpoints.' : 'Der Crawler ist fragil — er hängt von HTML/UI-Strukturen ab, die ohne Warnung brechen können. Eine REST-API bietet stabile, versionierte Verträge. Geplant, sobald Simplisan native API-Endpunkte bereitstellt.' })}
            {n({ variant: 'source', title: 'Crawler', desc: isEn ? 'Extracts data from Simplisan, runs on schedule via Dagster.' : 'Extrahiert Daten aus Simplisan, läuft planmäßig über Dagster.', tag: isEn ? 'DAGSTER MANAGED' : 'DAGSTER VERWALTET', tagVariant: 'infra', tipTitle: isEn ? 'Why a custom Crawler?' : 'Warum ein eigener Crawler?', tip: isEn ? 'Simplisan ERP has no public API yet. The Crawler runs on a Dagster schedule, extracts structured data, and feeds the Schema Diff sensor before anything lands in Bronze.' : 'Simplisan ERP hat noch keine öffentliche API. Der Crawler läuft nach einem Dagster-Zeitplan und extrahiert strukturierte Daten, bevor etwas in Bronze landet.' })}
            {n({ variant: 'app', title: 'patients_application', desc: isEn ? 'Multi-tenant patient portal with subdomain per tenant (e.g., praxis-mueller.app.com). Emits events on address change, appointment booking.' : 'Multi-Mandanten-Patientenportal mit Subdomain pro Mandant (z.B. praxis-mueller.app.com). Sendet Ereignisse bei Adressänderung und Terminbuchung.', tag: isEn ? 'SUBDOMAIN · EVENT SOURCE' : 'SUBDOMAIN · EREIGNISQUELLE', tagVariant: 'event', mt: true, tipTitle: isEn ? 'Why does the app appear in Sources?' : 'Warum erscheint die App in den Quellen?', tip: isEn ? 'The patient portal generates real-time events (address changes, appointment bookings) that flow into the data platform via Redpanda. It\'s both a consumer of Gold data and a producer of live events.' : 'Das Patientenportal generiert Echtzeitereignisse (Adressänderungen, Terminbuchungen), die über Redpanda in die Datenplattform fließen. Es ist sowohl Verbraucher von Gold-Daten als auch Produzent von Live-Ereignissen.' })}
          </div>

          <div className="section-divider" data-label={t.divIngest} />

          {/* Ingestion */}
          <div id="layer-ingestion" className="layer">
            <div className="layer-label label-event">{t.layerIngestion}</div>
            {n({ variant: 'infra', title: isEn ? 'Hetzner AX41-NVMe #2994113' : 'Hetzner AX41-NVMe #2994113', desc: isEn ? 'Single bare-metal server hosting Dagster, dbt, Crawler, Redpanda, MinIO, and PostHog (ClickHouse + Kafka). Germany, GDPR compliant.' : 'Einzelner Bare-Metal-Server für Dagster, dbt, Crawler, Redpanda, MinIO und PostHog (ClickHouse + Kafka). Deutschland, DSGVO-konform.', tag: isEn ? 'EU · GDPR' : 'EU · DSGVO', tagVariant: 'infra', tipTitle: isEn ? 'Why Hetzner AX41-NVMe?' : 'Warum Hetzner AX41-NVMe?', tip: isEn ? 'Bare-metal server in Germany — significantly cheaper than AWS equivalents. All data stays in the EU, making GDPR compliance structural. No cold-start latency, no noisy-neighbour problem.' : 'Bare-Metal-Server in Deutschland — deutlich günstiger als AWS-Äquivalente. Alle Daten bleiben in der EU, was DSGVO-Konformität strukturell sicherstellt.' })}
            {n({ variant: 'event', title: 'Redpanda', desc: isEn ? 'Kafka-compatible event streaming. Handles patient events in real-time. Includes Schema Registry.' : 'Kafka-kompatibler Ereignis-Stream. Verarbeitet Patientenereignisse in Echtzeit. Enthält Schema Registry.', tag: isEn ? 'NEAR REAL-TIME' : 'NAHEZU ECHTZEIT', tagVariant: 'event', tipTitle: isEn ? 'Why Redpanda?' : 'Warum Redpanda?', tip: isEn ? 'Simpler than Kafka — single binary, no ZooKeeper, no JVM tuning. Built-in Schema Registry. 10x lower operational overhead for small teams. Kafka-compatible so any Kafka client works without code changes.' : 'Einfacher als Kafka — einzelne Binärdatei, kein ZooKeeper, kein JVM-Tuning. Integrierte Schema Registry. 10x geringerer Betriebsaufwand für kleine Teams. Kafka-kompatibel ohne Codeänderungen.' })}
            {n({ variant: 'event', title: 'Schema Registry', desc: isEn ? 'Validates event schemas (Avro/JSON). Rejects unknown schemas to dead-letter topic.' : 'Validiert Ereignisschemata (Avro/JSON). Lehnt unbekannte Schemata an das Dead-Letter-Topic ab.', tag: isEn ? 'BUILT INTO REDPANDA' : 'IN REDPANDA INTEGRIERT', tagVariant: 'event', tipTitle: isEn ? 'Why Schema Registry?' : 'Warum Schema Registry?', tip: isEn ? 'Prevents malformed events from entering the pipeline. Every event must match a registered Avro/JSON schema. Unknown schemas are immediately rejected to the Dead Letter Topic — no silent corruption.' : 'Verhindert, dass fehlerhafte Ereignisse in die Pipeline gelangen. Jedes Ereignis muss mit einem registrierten Schema übereinstimmen. Unbekannte Schemata werden sofort an das Dead-Letter-Topic abgelehnt.' })}
            {n({ variant: 'alert', title: 'Dead Letter Topic', desc: isEn ? 'Failed/rejected events land here. Alerts fire immediately via Grafana.' : 'Fehlgeschlagene/abgelehnte Ereignisse landen hier. Alarme werden sofort über Grafana ausgelöst.', tag: isEn ? 'AUTO-ALERT' : 'AUTO-ALARM', tagVariant: 'alert', tipTitle: isEn ? 'Why a Dead Letter Topic?' : 'Warum ein Dead-Letter-Topic?', tip: isEn ? 'No event is silently dropped. Failed or rejected messages land here so they can be inspected, fixed, and replayed. Grafana fires an alert the moment anything lands here.' : 'Kein Ereignis wird still verworfen. Fehlgeschlagene Nachrichten landen hier, damit sie überprüft, korrigiert und erneut abgespielt werden können. Grafana sendet sofort einen Alarm.' })}
            {n({ variant: 'quality', title: isEn ? 'Schema Diff (Crawler)' : 'Schema Diff (Crawler)', desc: isEn ? 'Compares incoming Simplisan schema vs last known. Additive → auto-accept + log. Breaking → halt + alert.' : 'Vergleicht eingehendes Simplisan-Schema mit dem zuletzt bekannten. Additiv → auto-akzeptieren + protokollieren. Brechend → Anhalten + Alarm.', tag: isEn ? 'DAGSTER SENSOR' : 'DAGSTER-SENSOR', tagVariant: 'alert', mt: true, tipTitle: isEn ? 'Why Schema Diff?' : 'Warum Schema Diff?', tip: isEn ? 'Simplisan can change its schema at any time. New column → auto-accept + log. Renamed/deleted column → halt the pipeline immediately. Requires manual approval before resuming — never silently passes NULLs downstream.' : 'Simplisan kann sein Schema jederzeit ändern. Neue Spalte → automatisch akzeptieren + protokollieren. Umbenannte/gelöschte Spalte → Pipeline sofort anhalten. Erfordert manuelle Genehmigung vor dem Fortsetzen.' })}
          </div>

          <div className="section-divider" data-label={t.divStore} />

          {/* Bronze */}
          <div id="layer-bronze" className="layer">
            <div className="layer-label label-bronze">{t.layerBronze}</div>
            {n({ variant: 'bronze', title: isEn ? 'MinIO (S3-compat)' : 'MinIO (S3-kompatibel)', desc: isEn ? 'Object storage on Hetzner. Stores raw data as Apache Iceberg tables (Parquet).' : 'Objektspeicher auf Hetzner. Speichert Rohdaten als Apache Iceberg-Tabellen (Parquet).', tag: isEn ? 'ICEBERG · SCHEMA-ON-READ' : 'ICEBERG · SCHEMA-BEI-LESEN', tagVariant: 'bronze', tipTitle: isEn ? 'Why MinIO + Iceberg?' : 'Warum MinIO + Iceberg?', tip: isEn ? 'MinIO gives S3-compatible object storage on-prem at €6/mo base instead of €200+ on AWS S3. Apache Iceberg adds native schema evolution and time-travel queries for audits — both critical for GDPR compliance.' : 'MinIO bietet S3-kompatiblen Speicher für ~€6/Monat statt €200+ auf AWS S3. Apache Iceberg fügt native Schema-Evolution und Zeitreise-Abfragen für Audits hinzu — beides kritisch für DSGVO-Konformität.' })}
            {n({ variant: 'bronze', title: 'bronz_data', desc: isEn ? 'All raw data lands here: Crawler batch + Redpanda events. Append-only, immutable. tenant_id column on every record.' : 'Alle Rohdaten landen hier: Crawler-Batch + Redpanda-Ereignisse. Nur-Anhänge, unveränderlich. tenant_id-Spalte in jedem Datensatz.', tag: isEn ? 'APPEND-ONLY' : 'NUR-ANHÄNGE', tagVariant: 'bronze', tipTitle: isEn ? 'Why a single bronz_data table?' : 'Warum eine einzelne bronz_data-Tabelle?', tip: isEn ? 'A single landing zone simplifies ingestion — both the batch Crawler and real-time Redpanda events land here. Append-only design ensures immutability and a full audit history. Every record carries a tenant_id column from day one.' : 'Eine einzelne Landezone vereinfacht die Aufnahme — sowohl der Batch-Crawler als auch Redpanda-Echtzeitereignisse landen hier. Nur-Anhänge-Design gewährleistet Unveränderlichkeit und vollständige Prüfhistorie.' })}
            {n({ variant: 'gdpr', title: isEn ? 'PII Tagging' : 'PII-Markierung', desc: isEn ? 'Columns containing PII are tagged at bronze level. Feeds GDPR deletion pipeline.' : 'Spalten mit personenbezogenen Daten werden auf Bronze-Ebene markiert. Speist die DSGVO-Löschpipeline.', tag: 'GDPR', tagVariant: 'gdpr', mt: true, tipTitle: isEn ? 'Why tag PII at Bronze?' : 'Warum PII auf Bronze-Ebene markieren?', tip: isEn ? 'Tagging PII at the earliest layer ensures it\'s tracked all the way through the pipeline. Under GDPR Article 17, you can\'t delete what you can\'t find. Bronze-level tags feed the automated deletion pipeline for every downstream layer.' : 'Das Markieren von PII auf der frühesten Schicht stellt sicher, dass es durch die gesamte Pipeline verfolgt wird. Gemäß DSGVO Artikel 17 können Sie nicht löschen, was Sie nicht finden können.' })}
            <div className="flow-arrows">
              <span>{t.flowBronz}</span>
              <span>→</span>
              <span style={{ color: 'var(--quality)' }}>{t.flowBronzToSilver}</span>
              <span>→</span>
              <span>{t.flowSilver}</span>
            </div>
            {n({ variant: 'quality', title: 'dbt Tests + Soda', desc: isEn ? 'Schema contracts, null checks, referential integrity, row count anomalies. Fails loudly on violations.' : 'Schema-Verträge, Null-Prüfungen, referenzielle Integrität, Zeilenanzahl-Anomalien. Schlägt laut bei Verstößen fehl.', tag: isEn ? 'GATE: BRONZ→SILVER' : 'GATE: BRONZ→SILBER', tagVariant: 'alert', tipTitle: isEn ? 'Why a quality gate here?' : 'Warum ein Qualitäts-Gate hier?', tip: isEn ? 'Bad data caught at Bronze costs minutes to fix. The same error in production costs days. dbt tests enforce schema contracts; Soda catches row-count anomalies. The pipeline halts loudly — never silently passes garbage downstream.' : 'Schlechte Daten, die bei Bronze abgefangen werden, kosten Minuten zur Behebung. Die Pipeline stoppt laut — nie still.' })}
          </div>

          <div className="section-divider" data-label={t.divTransform} />

          {/* Silver */}
          <div id="layer-silver" className="layer">
            <div className="layer-label label-silver">{t.layerSilver}</div>
            {n({ variant: 'silver', title: 'silver_app', desc: isEn ? 'Cleaned patient &amp; business data. Deduped, type-cast, normalized. dbt models with contracts enforced.' : 'Bereinigte Patienten- und Geschäftsdaten. Dedupliziert, typkonvertiert, normalisiert. dbt-Modelle mit erzwungenen Verträgen.', tag: 'DBT CONTRACTS', tagVariant: 'silver', tipTitle: isEn ? 'Why silver_app?' : 'Warum silver_app?', tip: isEn ? 'App-serving data needs normalized, deduplicated, type-cast records for real-time reads. dbt contracts enforce column-level guarantees — if Simplisan renames a column, the model fails loudly in CI rather than silently passing NULLs to patients.' : 'App-Daten benötigen normalisierte, deduplizierte Datensätze für Echtzeit-Lesezugriffe. dbt-Verträge erzwingen Garantien auf Spaltenebene — wenn Simplisan eine Spalte umbenennt, schlägt das Modell laut in CI fehl.' })}
            {n({ variant: 'silver', title: 'silver_bi', desc: isEn ? 'BI-oriented transforms. Aggregations, joins, pre-computed metrics for analytics.' : 'BI-orientierte Transformationen. Aggregationen, Joins, vorberechnete Metriken für Analysen.', tag: 'DBT CONTRACTS', tagVariant: 'silver', tipTitle: isEn ? 'Why separate silver_bi?' : 'Warum separates silver_bi?', tip: isEn ? 'BI queries need different data shapes than app queries — pre-computed aggregations, multi-table joins, time-series structures. Separating BI silver from app silver prevents analytics workloads from degrading application response times.' : 'BI-Abfragen benötigen andere Datenformen als App-Abfragen. Die Trennung verhindert, dass Analyse-Workloads die Antwortzeiten der Anwendung beeinträchtigen.' })}
            {n({ variant: 'gdpr', title: isEn ? 'Pseudonymization' : 'Pseudonymisierung', desc: isEn ? 'PII fields hashed/masked in silver. Reversible only with key stored in Vault.' : 'PII-Felder werden in Silber gehashed/maskiert. Umkehrbar nur mit dem in Vault gespeicherten Schlüssel.', tag: isEn ? 'GDPR · SILVER' : 'DSGVO · SILBER', tagVariant: 'gdpr', mt: true, tipTitle: isEn ? 'Why pseudonymize at Silver?' : 'Warum in Silber pseudonymisieren?', tip: isEn ? 'GDPR requires minimizing PII exposure in processing layers. Hashing PII here means all downstream consumers never see raw personal data. Reversible only via a key stored in Vault — full audit trail of who accessed it.' : 'Die DSGVO erfordert eine Minimierung der PII-Exposition. Das Hashing von PII hier bedeutet, dass alle nachgelagerten Verbraucher niemals rohe Personendaten sehen. Nur über einen Vault-Schlüssel umkehrbar.' })}
            <div className="flow-arrows">
              <span>{t.flowSilver}</span>
              <span>→</span>
              <span style={{ color: 'var(--quality)' }}>{t.flowBronzToSilver}</span>
              <span>→</span>
              <span>{t.flowGold}</span>
            </div>
            {n({ variant: 'quality', title: 'dbt Tests + Soda', desc: isEn ? 'Business logic validation, cross-table consistency, tenant data isolation checks.' : 'Geschäftslogik-Validierung, tabellenübergreifende Konsistenz, Mandanten-Datenisolationsprüfungen.', tag: isEn ? 'GATE: SILVER→GOLD' : 'GATE: SILBER→GOLD', tagVariant: 'alert', tipTitle: isEn ? 'Why a second quality gate?' : 'Warum ein zweites Qualitäts-Gate?', tip: isEn ? 'This gate catches business logic errors Bronze tests can\'t see — a tenant accidentally seeing another\'s data, broken foreign keys after joins, or impossible metric values. Catches cross-table inconsistencies before Gold.' : 'Dieses Gate fängt Geschäftslogikfehler ab, die Bronze-Tests nicht sehen können — z.B. ein Mandant der Daten eines anderen sieht oder unmögliche Metrikwerte.' })}
          </div>

          <div className="section-divider" data-label={t.divServe} />

          {/* Gold */}
          <div id="layer-gold" className="layer">
            <div className="layer-label label-gold">{t.layerGold}</div>
            {n({ variant: 'gold', title: isEn ? 'Postgres (Ubicloud Managed)' : 'Postgres (Ubicloud Verwaltet)', desc: isEn ? 'Ubicloud on Hetzner Germany. Gold tables served to applications. Schema-per-tenant isolation. Automated backups, PITR, encryption at rest.' : 'Ubicloud auf Hetzner Deutschland. Gold-Tabellen an Anwendungen ausgegeben. Schema-pro-Mandant-Isolation. Automatisierte Backups, PITR, Verschlüsselung im Ruhezustand.', tag: isEn ? 'TENANT ISOLATED · MANAGED' : 'MANDANT ISOLIERT · VERWALTET', tagVariant: 'gold', tipTitle: isEn ? 'Why Ubicloud Managed Postgres?' : 'Warum Ubicloud Managed Postgres?', tip: isEn ? 'Ubicloud provides Postgres-as-a-service on Hetzner Germany — GDPR-compliant, schema-per-tenant isolation, automated backups, PITR, encryption at rest. ~€80–150/mo vs €400+ on AWS RDS.' : 'Ubicloud bietet Postgres-as-a-Service auf Hetzner Deutschland — DSGVO-konform, Schema-pro-Mandant-Isolation, automatisierte Backups, PITR, Verschlüsselung. ~€80–150/Monat vs. €400+ auf AWS RDS.' })}
            <div className="node-group">
              <div className="node-group-label">{t.groupAppGold}</div>
              {n({ variant: 'gold', title: 'gold_app_patients', desc: isEn ? 'Patient records, appointments, addresses. Read-only views per tenant schema.' : 'Patientendatensätze, Termine, Adressen. Schreibgeschützte Ansichten pro Mandantenschema.', tag: isEn ? 'READ ONLY' : 'NUR LESEN', tagVariant: 'gold', tipTitle: isEn ? 'Why gold_app_patients?' : 'Warum gold_app_patients?', tip: isEn ? 'Patient records need fast, low-latency reads for the application layer. Read-only views per tenant schema ensure applications can never write directly to Gold — the pipeline owns all writes.' : 'Patientendatensätze benötigen schnelle Lesezugriffe. Schreibgeschützte Ansichten pro Mandantenschema stellen sicher, dass Anwendungen niemals direkt in Gold schreiben.' })}
              {n({ variant: 'gold', title: 'gold_app_business', desc: isEn ? 'Business/practice data per tenant.' : 'Geschäfts-/Praxisdaten pro Mandant.', tag: isEn ? 'READ ONLY' : 'NUR LESEN', tagVariant: 'gold', tipTitle: isEn ? 'Why gold_app_business?' : 'Warum getrennt von Patienten?', tip: isEn ? 'Business data (practice info, billing, settings) has different access patterns and retention policies than clinical patient data. Separating them prevents a business admin query from ever touching patient records.' : 'Geschäftsdaten haben andere Zugriffsmuster und Aufbewahrungsrichtlinien als klinische Patientendaten. Die Trennung verhindert, dass eine Admin-Abfrage Patientendatensätze berührt.' })}
            </div>
            <div className="node-group" style={{ marginTop: 8 }}>
              <div className="node-group-label">{t.groupBiGold}</div>
              {n({ variant: 'gold', title: 'gold_bi_tennent', desc: isEn ? 'Tenant-level BI metrics and KPIs.' : 'BI-Metriken und KPIs auf Mandantenebene.', tag: isEn ? 'READ ONLY' : 'NUR LESEN', tagVariant: 'gold', tipTitle: isEn ? 'Why gold_bi_tennent?' : 'Warum gold_bi_tennent?', tip: isEn ? 'Tenant BI queries are heavy aggregations that would degrade app performance if run against the same tables. Separate BI Gold tables are pre-shaped for dashboards — tenants get self-service analytics without touching operational tables.' : 'BI-Abfragen sind schwere Aggregationen, die die App-Leistung beeinträchtigen würden. Separate BI-Gold-Tabellen sind für Dashboard-Abfragen vorgeformt.' })}
              {n({ variant: 'gold', title: 'gold_bi_market', desc: isEn ? 'Cross-tenant market analytics (anonymized).' : 'Mandantenübergreifende Marktanalysen (anonymisiert).', tag: isEn ? 'READ ONLY · ANON' : 'NUR LESEN · ANON', tagVariant: 'gold', tipTitle: isEn ? 'Why gold_bi_market?' : 'Warum gold_bi_market?', tip: isEn ? 'Cross-tenant market analytics require aggregation across all practices. Full anonymization ensures GDPR compliance — no individual patient or practice can be identified, but market-wide trends are visible.' : 'Mandantenübergreifende Marktanalysen erfordern Aggregation über alle Praxen. Vollständige Anonymisierung gewährleistet DSGVO-Konformität.' })}
            </div>
          </div>

          <div className="section-divider" data-label={t.divConsume} />

          {/* Applications */}
          <div id="layer-apps" className="layer">
            <div className="layer-label label-app">{t.layerApps}</div>
            {n({ variant: 'app', title: 'patients_application', desc: isEn ? 'Shared app, subdomain per tenant (e.g., praxis-mueller.app.com). Filters by tenant_id internally. Emits events to Redpanda on address change / appointment booking.' : 'Gemeinsame App, Subdomain pro Mandant (z.B. praxis-mueller.app.com). Filtert intern nach tenant_id. Sendet Ereignisse an Redpanda bei Adressänderung / Terminbuchung.', tag: isEn ? 'SUBDOMAIN · MULTI-TENANT · EVENTS' : 'SUBDOMAIN · MULTI-MANDANT · EREIGNISSE', tagVariant: 'event', tipTitle: isEn ? 'Why subdomain multi-tenancy?' : 'Warum Subdomain-Multi-Mandant?', tip: isEn ? 'Each practice gets their own subdomain (praxis-mueller.app.com) for branding and isolation — but it\'s a single shared application filtering by tenant_id internally. No separate deployments needed per tenant.' : 'Jede Praxis erhält ihre eigene Subdomain für Branding und Isolation — aber es ist eine einzelne gemeinsame Anwendung, die intern nach tenant_id filtert. Keine separaten Deployments pro Mandant erforderlich.' })}
            {n({ variant: 'app', title: 'tennent_business_application', desc: isEn ? 'Tenant admin/business dashboard. Reads from gold_app_business.' : 'Mandanten-Admin/Geschäfts-Dashboard. Liest aus gold_app_business.', tag: isEn ? 'READ ONLY' : 'NUR LESEN', tagVariant: 'app', tipTitle: isEn ? 'Why a separate business app?' : 'Warum eine separate Geschäftsapp?', tip: isEn ? 'Practice managers need different data, features, and access controls than patients. The patient app is public-facing; the business app is for internal operations. Reads exclusively from gold_app_business.' : 'Praxismanager benötigen andere Daten und Zugriffskontrollen als Patienten. Die Patientenapp ist öffentlich; die Geschäftsapp ist für interne Abläufe.' })}
            {n({ variant: 'app', title: 'tennent_bi_application', desc: isEn ? 'Tenant BI dashboard. Reads from gold_bi_tennent.' : 'Mandanten-BI-Dashboard. Liest aus gold_bi_tennent.', tag: isEn ? 'READ ONLY' : 'NUR LESEN', tagVariant: 'app', tipTitle: isEn ? 'Why a dedicated tenant BI app?' : 'Warum eine eigene Mandanten-BI-App?', tip: isEn ? 'Self-service analytics for practice managers — appointment trends, patient volume, operational KPIs. Isolating BI in its own app means different auth, different caching, and zero risk of BI queries impacting app response times.' : 'Self-Service-Analytics für Praxismanager — Termintrends, Patientenvolumen, operative KPIs. Isolierung von BI in einer eigenen App bedeutet kein Risiko, dass BI-Abfragen die Patientenapp beeinflussen.' })}
            {n({ variant: 'app', title: 'market_bi_application', desc: isEn ? 'Market analytics. Reads anonymized cross-tenant data from gold_bi_market.' : 'Marktanalysen. Liest anonymisierte mandantenübergreifende Daten aus gold_bi_market.', tag: isEn ? 'READ ONLY · ANON' : 'NUR LESEN · ANON', tagVariant: 'app', tipTitle: isEn ? 'Why market analytics?' : 'Warum Marktanalysen?', tip: isEn ? 'Cross-tenant benchmarking gives each practice context — \'your appointment no-show rate vs. the industry average\'. Fully anonymized so no practice can identify another.' : 'Mandantenübergreifendes Benchmarking gibt jeder Praxis Kontext. Vollständig anonymisiert — keine Praxis kann eine andere identifizieren.' })}
            {n({ variant: 'infra', title: isEn ? 'PostHog (Self-Hosted)' : 'PostHog (Selbst-Gehostet)', desc: isEn ? 'Runs on Hetzner AX41-NVMe #2994113. ClickHouse + Kafka + Postgres internally. Tracks tenant-level feature adoption and patient-level behavior (anonymized). All events tagged with tenant_id.' : 'Läuft auf Hetzner AX41-NVMe #2994113. Intern ClickHouse + Kafka + Postgres. Verfolgt Funktionsnutzung auf Mandantenebene und Patientenverhalten (anonymisiert). Alle Ereignisse mit tenant_id markiert.', tag: isEn ? 'SELF-HOSTED · GDPR · AX41-NVMe #2994113' : 'SELBST-GEHOSTET · DSGVO · AX41-NVMe #2994113', tagVariant: 'gdpr', mt: true, tipTitle: isEn ? 'Why self-hosted PostHog?' : 'Warum selbst gehostetes PostHog?', tip: isEn ? 'PostHog Cloud sends data to US servers. Patient behavior data under GDPR must stay in EU. Self-hosting on Hetzner Germany gives full control over data residency. No external data egress.' : 'PostHog Cloud sendet Daten an US-Server. Patientenverhaltensdaten müssen unter der DSGVO in der EU bleiben. Selbst-Hosting auf Hetzner Deutschland gibt vollständige Kontrolle. Kein externer Datenabfluss.' })}
          </div>
        </div>
      </div>

      {/* Cross-Cutting Infrastructure */}
      <div id="sec-infra" className="section">
        <div className="section-header">
          <div className="section-title">{t.secInfra}</div>
        </div>
        <div className="cross-grid">
          {n({ variant: 'infra', title: 'Dagster (Orchestrator)', desc: isEn ? 'Manages all pipelines: Crawler schedule, dbt runs, quality gates, schema diff sensors. Native dbt integration. Asset lineage shows blast radius of schema changes.' : 'Verwaltet alle Pipelines: Crawler-Zeitplan, dbt-Läufe, Qualitäts-Gates, Schema-Diff-Sensoren. Native dbt-Integration. Asset-Lineage zeigt den Auswirkungsbereich von Schema-Änderungen.', tag: isEn ? 'ORCHESTRATION' : 'ORCHESTRIERUNG', tagVariant: 'infra', tipTitle: isEn ? 'Why Dagster over Airflow?' : 'Warum Dagster statt Airflow?', tip: isEn ? 'Dagster is asset-first — you define data assets, not just tasks. When a Simplisan column is renamed, Dagster\'s asset lineage instantly shows every downstream model affected. Native dbt integration and built-in observability.' : 'Dagster ist Asset-first — Sie definieren Daten-Assets, keine bloßen Tasks. Wenn eine Simplisan-Spalte umbenannt wird, zeigt Dagsters Asset-Lineage sofort jedes betroffene nachgelagerte Modell.' })}
          {n({ variant: 'infra', title: 'Grafana + Alertmanager', desc: isEn ? 'Monitoring dashboards. Alerts on: pipeline failures, schema changes, quality gate failures, dead-letter events, SLA breaches.' : 'Überwachungs-Dashboards. Alarme bei: Pipeline-Fehlern, Schema-Änderungen, Qualitäts-Gate-Fehlern, Dead-Letter-Ereignissen, SLA-Verletzungen.', tag: isEn ? 'MONITORING' : 'ÜBERWACHUNG', tagVariant: 'alert', tipTitle: isEn ? 'Why Grafana + Alertmanager?' : 'Warum Grafana + Alertmanager?', tip: isEn ? 'Open-source, self-hosted, integrates with everything. Alertmanager routes alerts to Slack/Email with escalation policies. Critical alerts fire immediately — the team is never the last to know.' : 'Open-Source, selbst-gehostet, integriert sich mit allem. Alertmanager leitet Alarme an Slack/E-Mail weiter. Kritische Alarme werden sofort ausgelöst.' })}
          {n({ variant: 'gdpr', title: isEn ? 'GDPR Deletion Pipeline' : 'DSGVO-Löschpipeline', desc: isEn ? 'Tenant/patient deletion requests. Traverses all layers (bronze → silver → gold) using PII tags. Dagster-orchestrated. Audit log retained.' : 'Mandanten-/Patientenlöschanfragen. Durchquert alle Schichten (Bronze → Silber → Gold) mit PII-Tags. Dagster-orchestriert. Prüfprotokoll aufbewahrt.', tag: isEn ? 'RIGHT TO ERASURE' : 'RECHT AUF LÖSCHUNG', tagVariant: 'gdpr', tipTitle: isEn ? 'Why a dedicated deletion pipeline?' : 'Warum eine eigene Löschpipeline?', tip: isEn ? 'GDPR Article 17 requires complete erasure within 30 days. Iceberg\'s native row-level deletes handle Bronze without a full rewrite. Silver and Gold are recomputed from the cleaned Bronze. Dagster writes an audit log proving deletion was completed.' : 'DSGVO Artikel 17 erfordert vollständige Löschung innerhalb von 30 Tagen. Icebergs Zeilenebenen-Löschungen verwalten Bronze ohne vollständiges Neuschreiben. Silber und Gold werden dann aus der bereinigten Bronze neu berechnet.' })}
          {n({ variant: 'gdpr', title: isEn ? 'Tenant Isolation' : 'Mandantenisolation', desc: isEn ? 'Bronze/Silver: tenant_id column + row-level security. Gold: schema-per-tenant in Postgres. Verified by cross-cutting dbt tests.' : 'Bronze/Silber: tenant_id-Spalte + Zeilenebenen-Sicherheit. Gold: Schema-pro-Mandant in Postgres. Durch mandantenübergreifende dbt-Tests verifiziert.', tag: isEn ? 'ACCESS CONTROL' : 'ZUGANGSKONTROLLE', tagVariant: 'gdpr', tipTitle: isEn ? 'Why multiple isolation strategies?' : 'Warum mehrere Isolationsstrategien?', tip: isEn ? 'Defense in depth — no single point of failure for tenant isolation. Bronze/Silver: tenant_id column + row-level security. Gold: separate Postgres schema per tenant. Cross-cutting dbt tests verify no tenant sees another\'s data at every layer.' : 'Tiefenverteidigung — kein einzelner Fehlerpunkt für Mandantenisolation. Bronze/Silber: tenant_id + Zeilenebenen-Sicherheit. Gold: separates Postgres-Schema pro Mandant. dbt-Tests verifizieren Isolation bei jedem Schichtübergang.' })}
          {n({ variant: 'infra', title: 'DataHub / OpenLineage', desc: isEn ? 'Data catalog and lineage tracking. Trace any record from Simplisan → bronze → silver → gold → application.' : 'Datenkatalog und Lineage-Tracking. Verfolgen Sie jeden Datensatz von Simplisan → Bronze → Silber → Gold → Anwendung.', tag: 'LINEAGE', tagVariant: 'infra', tipTitle: isEn ? 'Why DataHub / OpenLineage?' : 'Warum DataHub / OpenLineage?', tip: isEn ? 'When Simplisan renames a column, DataHub shows every downstream model affected instantly. Cuts incident response from hours to minutes. Also doubles as the GDPR data inventory: \'where is patient X\'s data stored?\' answered in seconds.' : 'Wenn Simplisan eine Spalte umbenennt, zeigt DataHub sofort jedes betroffene Modell — Reaktionszeit von Stunden auf Minuten verkürzt. Dient auch als DSGVO-Dateninventar für Regulatoren.' })}
          {n({ variant: 'infra', title: isEn ? 'dbt (Transformations)' : 'dbt (Transformationen)', desc: isEn ? 'All bronze→silver→gold transforms. Column-level contracts enforced. If Simplisan renames/deletes a column, dbt fails loudly — never silently passes NULLs.' : 'Alle Bronze→Silber→Gold-Transformationen. Verträge auf Spaltenebene erzwungen. Wenn Simplisan eine Spalte umbenennt/löscht, schlägt dbt laut fehl.', tag: isEn ? 'SCHEMA CONTRACTS' : 'SCHEMA-VERTRÄGE', tagVariant: 'quality', tipTitle: isEn ? 'Why dbt?' : 'Warum dbt?', tip: isEn ? 'SQL-first transformations with version control, testing, and documentation built in. Column-level contracts mean a breaking schema change from Simplisan fails loudly in CI — never silently passes NULLs downstream.' : 'SQL-first-Transformationen mit integrierter Versionskontrolle, Tests und Dokumentation. Verträge auf Spaltenebene bedeuten, dass eine brechende Schema-Änderung laut in CI fehlschlägt — leitet niemals still NULLs weiter.' })}
        </div>
      </div>

      {/* Data Flow Paths */}
      <div id="sec-flows" className="section" style={{ background: 'var(--bg)' }}>
        <div className="section-header">
          <div className="section-title">{t.secFlow}</div>
        </div>
        <div className="cross-grid">
          {n({ variant: 'source', title: isEn ? 'Batch Path (Hourly)' : 'Batch-Pfad (Stündlich)', desc: isEn ? `Simplisan → Crawler → <span style="color:var(--quality)">Schema Diff</span> → bronz_data → <span style="color:var(--quality)">Quality Gate</span> → silver_app / silver_bi → <span style="color:var(--quality)">Quality Gate</span> → gold_* → Applications` : `Simplisan → Crawler → <span style="color:var(--quality)">Schema Diff</span> → bronz_data → <span style="color:var(--quality)">Qualitäts-Gate</span> → silver_app / silver_bi → <span style="color:var(--quality)">Qualitäts-Gate</span> → gold_* → Anwendungen`, tag: isEn ? 'DAGSTER SCHEDULED' : 'DAGSTER GEPLANT', tagVariant: 'infra', tipTitle: isEn ? 'Why hourly batch?' : 'Warum stündlicher Batch?', tip: isEn ? 'Hourly cadence keeps analytics data fresh enough for all business use cases without the complexity of real-time streaming for batch data. Dagster schedules the Crawler, runs Schema Diff, executes dbt models, and enforces quality gates — all in one observable pipeline run.' : 'Stündlicher Rhythmus hält Analysedaten frisch genug ohne die Komplexität von Echtzeit-Streaming für Batch-Daten. Dagster plant den Crawler, führt Schema-Diff und dbt-Modelle aus, und erzwingt Qualitäts-Gates.' })}
          {n({ variant: 'event', title: isEn ? 'Event Path (Real-Time)' : 'Ereignis-Pfad (Echtzeit)', desc: isEn ? `patients_application → Redpanda → <span style="color:var(--quality)">Schema Registry validates</span> → bronz_data → <span style="color:var(--quality)">Quality Gate</span> → silver_app → <span style="color:var(--quality)">Quality Gate</span> → gold_app_patients → patients_application` : `patients_application → Redpanda → <span style="color:var(--quality)">Schema Registry validiert</span> → bronz_data → <span style="color:var(--quality)">Qualitäts-Gate</span> → silver_app → <span style="color:var(--quality)">Qualitäts-Gate</span> → gold_app_patients → patients_application`, tag: isEn ? 'REDPANDA STREAMED' : 'REDPANDA GESTREAMT', tagVariant: 'event', tipTitle: isEn ? 'Why a separate event path?' : 'Warum ein separater Ereignis-Pfad?', tip: isEn ? 'Patient-facing events need to be visible in the app within seconds — not after the next hourly batch. Redpanda streams these through the medallion layers in near real-time, while Schema Registry ensures every event is valid before it touches Bronze.' : 'Patientenseitige Ereignisse müssen innerhalb von Sekunden sichtbar sein — nicht nach dem nächsten stündlichen Batch. Redpanda streamt diese nahezu in Echtzeit, während Schema Registry sicherstellt, dass jedes Ereignis gültig ist.' })}
          {n({ variant: 'alert', title: isEn ? 'Failure Path' : 'Fehlerpfad', desc: isEn ? `Schema violation → Dead Letter Topic / Pipeline Halt → Grafana Alert → Team notification (Slack/Email) → Manual review → Approve or fix → Resume` : `Schema-Verletzung → Dead Letter Topic / Pipeline-Stopp → Grafana-Alarm → Team-Benachrichtigung (Slack/E-Mail) → Manuelle Überprüfung → Genehmigen oder korrigieren → Fortsetzen`, tag: isEn ? 'NEVER SILENT' : 'NIE STILL', tagVariant: 'alert', tipTitle: isEn ? 'Why halt on failure?' : 'Warum bei Fehler stoppen?', tip: isEn ? 'Silent failures are the most dangerous kind in data pipelines — bad data propagates downstream and corrupts reports before anyone notices. Every schema violation or quality gate failure triggers an immediate Grafana alert before bad data can reach Gold.' : 'Stille Fehler sind die gefährlichste Art in Datenpipelines — schlechte Daten korrumpieren Berichte, bevor jemand es bemerkt. Jede Schema-Verletzung löst sofort einen Grafana-Alarm aus.' })}
          {n({ variant: 'gdpr', title: isEn ? 'GDPR Deletion Path' : 'DSGVO-Löschpfad', desc: isEn ? `Deletion request → Dagster triggers traversal → PII-tagged columns in bronze (Iceberg delete) → silver (recompute) → gold (cascade) → Audit log` : `Löschanfrage → Dagster startet Durchquerung → PII-markierte Spalten in Bronze (Iceberg-Löschung) → Silber (Neuberechnung) → Gold (Kaskade) → Prüfprotokoll`, tag: isEn ? 'RIGHT TO ERASURE' : 'RECHT AUF LÖSCHUNG', tagVariant: 'gdpr', tipTitle: isEn ? 'Why this deletion approach?' : 'Warum dieser Löschansatz?', tip: isEn ? 'GDPR Article 17 compliance requires complete erasure. Iceberg\'s native row-level deletes handle Bronze without rewriting entire Parquet files — efficient even at TB scale. Silver and Gold are recomputed from the updated Bronze, cascading the deletion automatically.' : 'Icebergs Zeilenebenen-Löschungen verwalten Bronze, ohne gesamte Parquet-Dateien neu zu schreiben — effizient auch im TB-Maßstab. Silber und Gold werden aus dem aktualisierten Bronze neu berechnet.' })}
        </div>
      </div>

      {/* Cost Breakdown */}
      <div id="sec-cost" className="section">
        <div className="section-header">
          <div className="section-title">{t.secCost}</div>
          <div className="section-subtitle">{t.secCostSub}</div>
        </div>
        <div className="two-col-grid">
          <div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t.colComponent}</th>
                  <th>{t.colService}</th>
                  <th>{t.colCost}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { c: isEn ? 'AX52 #1 — Compute' : 'AX52 #1 — Compute', s: isEn ? 'Dagster, dbt, Crawler' : 'Dagster, dbt, Crawler', v: '€75', color: 'var(--infra)' },
                  { c: isEn ? 'AX52 #2 — Streaming + Storage' : 'AX52 #2 — Streaming + Speicher', s: 'Redpanda, MinIO', v: '€75', color: 'var(--infra)' },
                  { c: isEn ? 'AX52 #3 — Analytics' : 'AX52 #3 — Analytik', s: isEn ? 'PostHog self-hosted (ClickHouse, Kafka, PG)' : 'PostHog selbst-gehostet (ClickHouse, Kafka, PG)', v: '€75', color: 'var(--infra)' },
                  { c: isEn ? 'Object Storage (3 TB)' : 'Objektspeicher (3 TB)', s: isEn ? 'Hetzner Object Storage (Bronze/Silver)' : 'Hetzner Objektspeicher (Bronze/Silber)', v: '€25', color: 'var(--bronze)' },
                  { c: isEn ? 'Managed Postgres' : 'Verwaltetes Postgres', s: isEn ? 'Ubicloud on Hetzner (Gold layer)' : 'Ubicloud auf Hetzner (Gold-Schicht)', v: '€80–150', color: 'var(--gold)' },
                  { c: isEn ? 'All Software' : 'Gesamte Software', s: 'Dagster, dbt, Redpanda, Iceberg, Grafana, Soda, PostHog', v: '€0', color: 'var(--green)' },
                  { c: isEn ? 'DNS + Misc' : 'DNS + Sonstiges', s: isEn ? 'Domain, wildcard SSL (*.app.com), misc' : 'Domain, Wildcard-SSL (*.app.com), Sonstiges', v: '€10', color: undefined },
                  { c: 'Claude AI', s: isEn ? 'Claude Pro — €100/mo plan (AI-assisted dev & ops)' : 'Claude Pro — €100/Monat (KI-gestützte Entwicklung & Betrieb)', v: '€100', color: 'var(--event)' },
                ].map((row, i) => (
                  <tr key={i}>
                    <td>{row.c}</td>
                    <td className="td-muted">{row.s}</td>
                    <td style={{ color: row.color || 'var(--text-muted)' }}>{row.v}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2} style={{ color: 'var(--text)', fontWeight: 700 }}>{t.totalCost}</td>
                  <td className="grad-green" style={{ fontSize: 15 }}>€440–510</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {n({ variant: 'infra', title: isEn ? 'AWS Equivalent: €2,000–4,000/mo' : 'AWS-Äquivalent: €2.000–4.000/Monat', desc: isEn ? 'RDS Postgres (~€400), MSK/Kafka (~€500), EC2 ×3 (~€450), S3 + transfer (~€200), managed Airflow (~€300+), PostHog Cloud (~€450). You\'re saving 5–10×.' : 'RDS Postgres (~€400), MSK/Kafka (~€500), EC2 ×3 (~€450), S3 + Transfer (~€200), verwaltetes Airflow (~€300+), PostHog Cloud (~€450). Sie sparen 5–10×.', tag: isEn ? '5–10× SAVINGS' : '5–10× EINSPARUNGEN', tagVariant: 'app', style: { borderLeftColor: 'var(--green)' }, tipTitle: isEn ? 'Why self-host instead of AWS?' : 'Warum selbst hosten statt AWS?', tip: isEn ? 'AWS equivalent: RDS Postgres (~€400), MSK/Kafka (~€500), EC2 ×3 (~€450), S3 + transfer (~€200), managed Airflow (~€300+), PostHog Cloud (~€450) = €2,000–4,000/mo. Self-hosting on Hetzner delivers the same capability at 5–10x lower cost and keeps data in Germany for GDPR.' : 'AWS-Äquivalent ergibt €2.000–4.000/Monat. Selbst-Hosting auf Hetzner liefert dieselbe Leistung zu 5–10x niedrigeren Kosten und hält Daten in Deutschland.' })}
            {n({ variant: 'infra', title: isEn ? 'Scaling Milestones' : 'Skalierungsmeilensteine', desc: isEn ? '• 5+ TB data → add 4th AX52 (+€75/mo)<br>• Heavy Postgres load → upgrade Ubicloud tier (+€50–100)<br>• Want managed streaming → Redpanda Cloud (+€100–200)<br>• DataHub lineage server → small VM (+€10–15)' : '• 5+ TB Daten → 4. AX52 hinzufügen (+€75/Monat)<br>• Hohe Postgres-Last → Ubicloud-Tier upgraden (+€50–100)<br>• Verwaltetes Streaming → Redpanda Cloud (+€100–200)<br>• DataHub Lineage-Server → kleine VM (+€10–15)', tag: isEn ? 'GROWTH PATH' : 'WACHSTUMSPFAD', tagVariant: 'infra', tipTitle: isEn ? 'When to scale up?' : 'Wann skalieren?', tip: isEn ? 'The architecture scales incrementally — each milestone adds one component rather than requiring a rebuild. You\'ll know it\'s time when query times increase, storage fills up, or streaming throughput saturates the current Redpanda instance.' : 'Die Architektur skaliert inkrementell — jeder Meilenstein fügt eine Komponente hinzu. Sie wissen, wann es Zeit ist, wenn Abfragezeiten steigen, der Speicher sich füllt oder der Streaming-Durchsatz die aktuelle Redpanda-Instanz sättigt.' })}
          </div>
        </div>
      </div>

      {/* Team Cost */}
      <div id="sec-team" className="section" style={{ background: 'var(--bg)' }}>
        <div className="section-header">
          <div className="section-title">{t.secTeam}</div>
        </div>
        <div className="two-col-grid">
          <div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t.colRole}</th>
                  <th style={{ textAlign: 'right' }}>{t.colSalary}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { r: isEn ? 'Head of Product' : 'Head of Product', src: 'Glassdoor DE, 251 submissions — Jan 2026', v: '€88k–140k' },
                  { r: isEn ? 'Senior Fullstack Engineer' : 'Senior Fullstack Engineer', src: 'Glassdoor DE + Levels.fyi DE — 2025/26', v: '€62k–95k' },
                  { r: isEn ? 'Senior Data / Cloud Engineer' : 'Senior Data / Cloud Engineer', src: isEn ? 'TechPays EU + Glassdoor DE — 2025/26 · +20–40% for modern stack (dbt, Dagster)' : 'TechPays EU + Glassdoor DE — 2025/26 · +20–40% für modernen Stack (dbt, Dagster)', v: '€68k–100k' },
                ].map((row, i) => (
                  <tr key={i}>
                    <td>
                      {row.r}
                      <div className="td-source">{row.src}</div>
                    </td>
                    <td className="td-muted">{row.v}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td style={{ color: 'var(--text)', fontWeight: 700 }}>{t.totalTeam}</td>
                  <td className="grad-red" style={{ fontSize: 15 }}>€218k–335k/yr</td>
                </tr>
              </tfoot>
            </table>
            <div className="table-note">
              {isEn
                ? 'Gross salary = full cost to employer, incl. employer social contributions (~21%).\nSources: Glassdoor.de · Levels.fyi/Germany · TechPays.com/europe/germany'
                : 'Bruttogehalt = vollständige Kosten für den Arbeitgeber, inkl. AG-Sozialbeiträge (~21%).\nQuellen: Glassdoor.de · Levels.fyi/Germany · TechPays.com/europe/germany'
              }
            </div>
          </div>
          <div>
            {n({ variant: 'infra', title: isEn ? 'For context' : 'Zum Vergleich', desc: isEn ? `Hiring this team at market rate in Germany runs <strong style="color:var(--text)">€218k–335k/yr</strong> — roughly <strong style="color:var(--text)">€18k–28k/mo</strong> in payroll alone. The full infra stack is <strong style="color:var(--infra)">€440–510/mo</strong>.` : `Einstellung dieses Teams zum Marktpreis in Deutschland kostet <strong style="color:var(--text)">€218k–335k/Jahr</strong> — etwa <strong style="color:var(--text)">€18k–28k/Monat</strong> allein für Gehälter. Der vollständige Infra-Stack kostet <strong style="color:var(--infra)">€440–510/Monat</strong>.`, tag: isEn ? 'MARKET REFERENCE' : 'MARKTVERGLEICH', tagVariant: 'app', style: { borderLeftColor: 'var(--green)' }, tipTitle: isEn ? 'What does this comparison mean?' : 'Was bedeutet dieser Vergleich?', tip: isEn ? 'The infrastructure stack costs €440–510/mo. A 3-person team costs €18k–28k/mo in payroll alone — 40–60x more. This makes the case for automation, open-source tooling, and a lean architecture that a small team can actually operate.' : 'Der Infra-Stack kostet €440–510/Monat. Ein 3-Personen-Team kostet €18k–28k/Monat allein für Gehälter — 40–60× mehr. Dies macht den Fall für Automatisierung, Open-Source-Tools und eine schlanke Architektur.' })}
          </div>
        </div>
      </div>

        </div>{/* arch-content */}
      </div>{/* arch-body */}

      {/* Footer */}
      <div className="page-footer">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{t.footerBy}</span>
            <span style={{ fontSize: 14, color: 'var(--alert)', margin: '0 5px' }}>♥</span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{t.footerBy2}</span>
            <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600, marginLeft: 6, fontFamily: "'JetBrains Mono', monospace" }}>{t.footerAuthor}</span>
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
