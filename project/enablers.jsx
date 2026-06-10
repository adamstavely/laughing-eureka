// Enablers — the capability catalog. Adopt a capability and you're compliant by construction.
const COVERAGE = {
  full:    { label: "Compliant by default", tag: "Full", note: "Adopt this and the standard is met, no extra work." },
  most:    { label: "Most requirements",     tag: "Most", note: "Covers most of the standard automatically; review the rest." },
  partial: { label: "Partial coverage",      tag: "Partial", note: "Covers part of the standard; you supply the specifics." },
};

function CapMeetChips({ meets }) {
  const { getStandard } = window.SP_DATA;
  return (
    <div className="cap-meets">
      {meets.map((m) => {
        const st = getStandard(m.id);
        return (
          <span key={m.id} className={`meet-chip cov-${m.covers}`} title={st ? st.title : m.id}>
            <span className="mc-id mono">{m.id}</span>
            <span className={`mc-dot mcd-${m.covers}`}></span>
          </span>
        );
      })}
    </div>
  );
}

function Enablers({ go }) {
  const { ENABLERS, STANDARDS } = window.SP_DATA;
  const coveredCount = new Set(ENABLERS.flatMap((e) => e.meets.map((m) => m.id))).size;
  const byType = {};
  ENABLERS.forEach((e) => { (byType[e.type] = byType[e.type] || []).push(e); });
  const typeOrder = ["Platform", "Service", "Library", "Template"];
  const typeBlurb = {
    Platform: "Managed services you onboard onto.",
    Service: "Drop-in services and sidecars.",
    Library: "Code you build with.",
    Template: "Scaffolds and pipelines you start from.",
  };

  return (
    <div className="enablers-page">
      <section className="cat-hero">
        <div className="wrap cat-hero-row">
          <div className="cat-hero-text">
          <div className="ch-eyebrow"><Icon name="bolt" size={14} sw={2} /> Enterprise enablers</div>
          <h1>The capability catalog</h1>
          <p>The paved path. Each capability is a managed platform, service, library, or template, adopt it and you meet the relevant standards by construction, instead of building and maintaining the controls yourself.</p>
          <div className="ch-stats">
            <div className="chs"><span className="chs-n">{ENABLERS.length}</span><span className="chs-l">capabilities</span></div>
            <div className="chs"><span className="chs-n">{coveredCount}</span><span className="chs-l">standards covered</span></div>
            <div className="chs"><span className="chs-n">{ENABLERS.filter((e) => e.meets.every((m) => m.covers === "full")).length}</span><span className="chs-l">compliant-by-default</span></div>
          </div>
          </div>
          <div className="cat-hero-art" aria-hidden="true"><Icon name="bolt" size={210} sw={1.3} /></div>
        </div>
      </section>

      <div className="wrap">
        {typeOrder.filter((t) => byType[t]).map((type) => (
          <section className="cap-group" key={type}>
            <div className="cap-group-head">
              <h2>{type}</h2>
              <span className="cgh-sub">{typeBlurb[type]}</span>
            </div>
            <div className="cap-grid">
              {byType[type].map((e) => (
                <article key={e.id} className="cap-card" onClick={() => go({ view: "enabler", id: e.id })}>
                  <div className="cap-top">
                    <span className="cap-ico"><Icon name={CAT_ICON[e.cat] || "package"} size={20} sw={1.9} /></span>
                    <span className="cap-team">{e.team}</span>
                  </div>
                  <h3 className="cap-name">{e.name}</h3>
                  <p className="cap-tagline">{e.tagline}</p>
                  <div className="cap-foot">
                    <div className="cap-owner">
                      <span className="avatar sm">{initials(e.owner.name)}</span>
                      <span className="cap-owner-name">{e.owner.name}</span>
                    </div>
                    <CapMeetChips meets={e.meets} />
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function EnablerDetail({ go, id }) {
  const { getEnabler, getStandard, catName } = window.SP_DATA;
  const e = getEnabler(id);
  useEffect(() => { window.scrollTo(0, 0); }, [id]);
  if (!e) return <div className="wrap" style={{ padding: 60 }}>Capability not found.</div>;

  return (
    <div className="detail">
      <div className="wrap">
        <div className="breadcrumb">
          <a onClick={() => go({ view: "enablers" })}>Enablers</a>
          <span className="sep"><Icon name="chevronRight" size={14} /></span>
          <span style={{ color: "var(--ink-2)" }}>{e.name}</span>
        </div>

        <div className="ed-hero">
          <span className="ed-ico"><Icon name={CAT_ICON[e.cat] || "package"} size={30} sw={1.8} /></span>
          <div className="ed-hero-text">
            <div className="ed-tags">
              <span className="ed-type">{e.type}</span>
              <span className="ed-team"><Icon name="users" size={13} /> {e.team}</span>
            </div>
            <h1>{e.name}</h1>
            <p className="ed-tagline">{e.tagline}</p>
          </div>
          <div className="ed-actions">
            <button className="btn btn-enabler">{e.cta} <Icon name="arrowRight" size={15} /></button>
            <a className="ed-docs mono"><Icon name="book" size={14} /> {e.docs}</a>
          </div>
        </div>

        <div className="detail-body">
          <div className="dcol-main">
            <div className="dblock">
              <h3><Icon name="compass" size={14} /> What it does</h3>
              <div className="prose"><p>{e.what}</p></div>
            </div>

            <div className="dblock">
              <h3><Icon name="check" size={14} /> What you get</h3>
              <ul className="practice-list">
                {e.gets.map((g, i) => (
                  <li key={i}><span className="pk"><Icon name="checkSmall" size={13} sw={2.6} /></span><span>{g}</span></li>
                ))}
              </ul>
            </div>

            <div className="dblock">
              <h3><Icon name="shield" size={14} /> Standards it helps you meet</h3>
              <div className="meets-list">
                {e.meets.map((m) => {
                  const s = getStandard(m.id);
                  if (!s) return null;
                  const C = COVERAGE[m.covers];
                  return (
                    <div key={m.id} className="meets-row" onClick={() => go({ view: "detail", id: m.id })}>
                      <span className="mr-id mono">{s.id}</span>
                      <div className="mr-main">
                        <div className="mr-title">{s.title}</div>
                        <div className="mr-meta">{catName(s.category)} · <ComplianceBadge level={s.compliance} /></div>
                      </div>
                      <div className="mr-cov">
                        <span className={`coverage-tag cov-${m.covers}`}>{C.label}</span>
                        <span className="mr-note">{C.note}</span>
                      </div>
                      <Icon name="chevronRight" size={18} style={{ color: "var(--ink-4)", flexShrink: 0 }} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="dcol-side">
            <div className="rail-card">
              <div className="rc-title" style={{ paddingBottom: 6 }}>Owner</div>
              <div className="owner-card" style={{ paddingTop: 4 }}>
                <div className="owner-id">
                  <div className="avatar">{initials(e.owner.name)}</div>
                  <div><div className="on">{e.owner.name}</div><div className="or">{e.owner.role} · {e.team}</div></div>
                </div>
                <a className="btn btn-ghost btn-sm" href={`mailto:${e.owner.email}`} style={{ justifyContent: "center" }}>
                  <Icon name="mail" size={14} /> Contact owner
                </a>
              </div>
            </div>

            <div className="rail-card">
              <div className="rc-title">Details</div>
              <div className="meta-list" style={{ marginTop: 10 }}>
                <div className="meta-row"><span className="mk">Type</span><span className="mv">{e.type}</span></div>
                <div className="meta-row"><span className="mk">Owning team</span><span className="mv">{e.team}</span></div>
                <div className="meta-row"><span className="mk">Standards met</span><span className="mv">{e.meets.length}</span></div>
                <div className="meta-row"><span className="mk">Docs</span><span className="mv mono">{e.docs}</span></div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Enablers, EnablerDetail });
