// Standard detail — the centerpiece. Layout variants driven by tweaks.
function ImpactHero({ s, variant }) {
  const cols = s.impact.length === 3 ? "" : s.impact.length === 2 ? "cols-2" : "cols-1";
  if (variant === "editorial") {
    return (
      <div style={{ marginBottom: 34, paddingBottom: 30, borderBottom: "1px solid var(--border)" }}>
        <div className="dblock" style={{ margin: 0 }}>
          <h3><Icon name="bolt" size={14} sw={2} style={{ color: "var(--blue)" }} /> Why this matters</h3>
        </div>
        <h2 className="serif" style={{ fontSize: 32, fontWeight: 500, lineHeight: 1.22, letterSpacing: "-.015em", margin: "0 0 28px", maxWidth: "24ch", color: "var(--ink)" }}>
          {s.impactHeadline}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${s.impact.length}, 1fr)`, gap: 28 }}>
          {s.impact.map((it, i) => (
            <div key={i} style={{ borderLeft: "3px solid var(--blue)", paddingLeft: 16 }}>
              <div className="mono" style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1.1 }}>{it.stat}</div>
              <div style={{ fontSize: 13.5, color: "var(--ink-3)", marginTop: 7, lineHeight: 1.45 }}>{it.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  // impact-hero (dark) — default
  return (
    <div className="impact">
      <div className="ix">
        <div className="ilabel"><Icon name="bolt" size={13} sw={2} /> Business impact</div>
        <h2>{s.impactHeadline}</h2>
        <div className={`impact-stats ${cols}`}>
          {s.impact.map((it, i) => (
            <div key={i} className="istat"><div className="n">{it.stat}</div><div className="l">{it.label}</div></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EnablerCard({ enabler, go }) {
  if (!enabler) return null;
  const covLabel = { full: "Fully compliant", most: "Mostly compliant", partial: "Partial coverage" }[enabler.covers];
  return (
    <div className="enabler-card">
      <div className="ec-head">
        <div className="ec-icon"><Icon name="bolt" size={24} sw={2} /></div>
        <div style={{ flex: 1 }}>
          <div className="ec-eyebrow"><Icon name="sparkles" size={12} sw={2} /> Enterprise enabler · the paved path</div>
          <h3 className="ec-name">{enabler.name}</h3>
          <div className="ec-type">{enabler.type} · maintained by {enabler.team}</div>
        </div>
        <span className={`coverage-tag cov-${enabler.covers}`}>{covLabel}</span>
      </div>
      <p className="ec-desc">{enabler.desc}</p>
      <ul className="enabler-gets">
        {enabler.gets.map((g, i) => (
          <li key={i}><span className="ck"><Icon name="checkSmall" size={12} sw={3} /></span>{g}</li>
        ))}
      </ul>
      <div className="enabler-foot">
        <span className="ef-note">
          <Icon name="shield" size={15} sw={2} />
          {enabler.covers === "full" ? "Adopt this and you are compliant by default, no extra work." :
           enabler.covers === "most" ? "Covers most requirements automatically; review the rest." :
           "Covers part of this standard; you supply the specifics."}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="mono" style={{ fontSize: 12, color: "var(--enabler-700)" }}>{enabler.docs}</span>
          <button className="btn btn-enabler btn-sm">{enabler.cta} <Icon name="arrowRight" size={14} /></button>
        </div>
      </div>
    </div>
  );
}

function SideRail({ s, go }) {
  const { catName, getStandard } = window.SP_DATA;
  return (
    <>
      <div className="rail-card">
        <div className="rc-title">Details</div>
        <div className="meta-list" style={{ marginTop: 10 }}>
          <div className="meta-row"><span className="mk">Standard ID</span><span className="mv mono">{s.id}</span></div>
          <div className="meta-row"><span className="mk">Compliance</span><span className="mv"><ComplianceBadge level={s.compliance} /></span></div>
          <div className="meta-row"><span className="mk">Status</span><span className="mv"><StatusBadge status={s.status} /></span></div>
          <div className="meta-row"><span className="mk">Domain</span><span className="mv">{catName(s.category)}</span></div>
          <div className="meta-row"><span className="mk">Version</span><span className="mv mono">v{s.version}</span></div>
          <div className="meta-row"><span className="mk">Updated</span><span className="mv">{fmtDate(s.updated)}</span></div>
        </div>
      </div>

      <div className="rail-card">
        <div className="rc-title" style={{ paddingBottom: 6 }}>Owner</div>
        <div className="owner-card" style={{ paddingTop: 4 }}>
          <div className="owner-id">
            <div className="avatar">{initials(s.owner.name)}</div>
            <div><div className="on">{s.owner.name}</div><div className="or">{s.owner.role}</div></div>
          </div>
          <a className="btn btn-ghost btn-sm" href={`mailto:${s.owner.email}`} style={{ justifyContent: "center" }}>
            <Icon name="mail" size={14} /> Contact owner
          </a>
        </div>
      </div>

      <div className="rail-card">
        <div className="rc-title" style={{ paddingBottom: 8 }}>Applies to</div>
        <div className="applies-tags">
          {s.appliesTo.map((t) => <span key={t} className="tg">{t}</span>)}
        </div>
      </div>

      {s.related.length > 0 && (
        <div className="rail-card">
          <div className="rc-title" style={{ paddingBottom: 6 }}>Related standards</div>
          <div className="related-list" style={{ marginTop: 6 }}>
            {s.related.map((rid) => {
              const r = getStandard(rid); if (!r) return null;
              return (
                <div key={rid} className="related-row" onClick={() => go({ view: "detail", id: rid })}>
                  <span className="rr-id">{r.id}</span>
                  <span className="rr-t">{r.title}</span>
                  <Icon name="chevronRight" size={16} style={{ color: "var(--ink-4)", marginLeft: "auto", flexShrink: 0 }} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

function TechDeepDive({ s, open, setOpen, anchorRef }) {
  const tech = s.tech;
  if (!tech) return null;
  const lvl = { must: "MUST", should: "SHOULD", may: "MAY" };
  return (
    <section className={"techdive" + (open ? " is-open" : "")} ref={anchorRef}>
      <button className="td-bar" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="td-bar-ic"><Icon name="server" size={18} sw={2} /></span>
        <span className="td-bar-text">
          <span className="td-bar-title">Technical deep dive</span>
          <span className="td-bar-sub">{tech.tagline}</span>
        </span>
        <span className="td-bar-tag">For implementers</span>
        <Icon name="chevronDown" size={18} className="td-chev" />
      </button>

      {open && (
        <div className="td-body">
          <div className="td-section">
            <div className="td-head"><Icon name="scale" size={14} /> Conformance criteria</div>
            <div className="conf-list">
              {tech.conformance.map((c) => (
                <div key={c.ref} className="conf-row">
                  <span className="conf-ref mono">{c.ref}</span>
                  <span className={`conf-lvl cl-${c.level}`}>{lvl[c.level]}</span>
                  <span className="conf-text">{c.text}</span>
                </div>
              ))}
            </div>
          </div>

          {tech.config && (
            <div className="td-section">
              <div className="td-head"><Icon name="layout" size={14} /> Reference configuration</div>
              <div className="code-block">
                <div className="cb-head">
                  <span className="cb-label">{tech.config.label}</span>
                  <span className="cb-lang mono">{tech.config.lang}</span>
                </div>
                <pre className="cb-pre"><code>{tech.config.code}</code></pre>
              </div>
            </div>
          )}

          <div className="td-grid">
            <div className="td-section">
              <div className="td-head"><Icon name="checkSmall" size={15} sw={2.4} /> How compliance is verified</div>
              <ul className="verify-list">
                {tech.verify.map((v, i) => (
                  <li key={i}><span className="vk"><Icon name="checkSmall" size={12} sw={3} /></span><span>{v}</span></li>
                ))}
              </ul>
            </div>
            <div className="td-section">
              <div className="td-head"><Icon name="book" size={14} /> Normative references</div>
              <div className="refs-list">
                {tech.refs.map((r, i) => (
                  <div key={i} className="ref-row">
                    <span className="ref-label">{r.label}</span>
                    <span className="ref-note mono">{r.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Detail({ go, id, tweaks }) {
  const { getStandard, catName, COMPLIANCE } = window.SP_DATA;
  const s = getStandard(id);
  const [lens, setLens] = useState("business");
  const [techOpen, setTechOpen] = useState(false);
  const techRef = useRef(null);
  useEffect(() => { window.scrollTo(0, 0); setLens("business"); setTechOpen(false); }, [id]);
  if (!s) return <div className="wrap" style={{ padding: 60 }}>Standard not found.</div>;

  const openDeepDive = () => {
    setTechOpen(true);
    requestAnimationFrame(() => {
      if (techRef.current) {
        const y = techRef.current.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    });
  };

  const layout = tweaks.detailLayout || "impact-hero";
  const enablerTop = tweaks.enablerPlacement !== "after-why";
  const isSplit = layout === "split-lens";

  const Why = () => (
    <div className="dblock">
      <h3><Icon name="book" size={14} /> Why it matters</h3>
      <div className="prose"><p>{s.why}</p></div>
    </div>
  );
  const Practice = () => (
    <div className="dblock">
      <h3><Icon name="check" size={14} /> What good looks like</h3>
      <ul className="practice-list">
        {s.practice.map((p, i) => (
          <li key={i}><span className="pk"><Icon name="checkSmall" size={13} sw={2.6} /></span><span>{p}</span></li>
        ))}
      </ul>
    </div>
  );
  const Exceptions = () => (
    <div className="dblock">
      <h3><Icon name="flag" size={14} /> Exceptions & deviations</h3>
      <div className="callout">
        <span className="co-ic"><Icon name="alert" size={20} /></span>
        <div><h4>How to request an exception</h4><p>{s.exceptions}</p></div>
      </div>
    </div>
  );

  return (
    <div className="detail">
      <div className="wrap">
        <div className="breadcrumb">
          <a onClick={() => go({ view: "home" })}>Standards</a>
          <span className="sep"><Icon name="chevronRight" size={14} /></span>
          <a onClick={() => go({ view: "browse", cat: s.category })}>{catName(s.category)}</a>
          <span className="sep"><Icon name="chevronRight" size={14} /></span>
          <span className="mono" style={{ color: "var(--ink-2)" }}>{s.id}</span>
        </div>

        <div className="detail-hero">
          <div className="dh-tags">
            <span className="idtag">{s.id}</span>
            <ComplianceBadge level={s.compliance} size="lg" />
            <StatusBadge status={s.status} />
            <span style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
              {s.enabler && s.status !== "deprecated" && (
                <button className="btn btn-enabler btn-sm"><Icon name="bolt" size={14} sw={2} /> {s.enabler.cta}</button>
              )}
              {s.tech && (
                <button className="btn btn-ghost btn-sm" onClick={openDeepDive}><Icon name="server" size={14} /> Technical deep dive</button>
              )}
              <button className="btn btn-ghost btn-sm"><Icon name="link" size={14} /> Share</button>
            </span>
          </div>
          <h1>{s.title}</h1>
          <p className="dh-summary">{s.summary}</p>
        </div>

        <div className="detail-body">
          <div className="dcol-main">
            {s.status === "deprecated" && (
              <div className="dep-banner">
                <span className="db-ic"><Icon name="alert" size={18} /></span>
                <span><b>This standard is deprecated.</b> {s.exceptions}</span>
              </div>
            )}

            {isSplit && (
              <div style={{ display: "inline-flex", background: "var(--bg-sunken)", border: "1px solid var(--border)", borderRadius: 10, padding: 4, marginBottom: 26 }}>
                {[["business", "Business view", "bolt"], ["technical", "Technical view", "server"]].map(([k, lbl, ic]) => (
                  <button key={k} onClick={() => setLens(k)}
                    style={{
                      display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 7, border: "none",
                      fontSize: 13.5, fontWeight: 650,
                      background: lens === k ? "#fff" : "transparent",
                      color: lens === k ? "var(--ink)" : "var(--ink-3)",
                      boxShadow: lens === k ? "var(--shadow-sm)" : "none",
                    }}>
                    <Icon name={ic} size={14} /> {lbl}
                  </button>
                ))}
              </div>
            )}

            {/* IMPACT */}
            {(!isSplit || lens === "business") && <ImpactHero s={s} variant={layout} />}

            {/* ENABLER (top placement) */}
            {enablerTop && s.enabler && (!isSplit || lens === "business") && (
              <div className="dblock"><EnablerCard enabler={s.enabler} go={go} /></div>
            )}

            {/* content by lens */}
            {isSplit ? (
              lens === "business" ? <><Why /><Exceptions /></> : <><Practice />{!enablerTop && s.enabler && <div className="dblock"><EnablerCard enabler={s.enabler} go={go} /></div>}<Exceptions /></>
            ) : (
              <>
                <Why />
                <Practice />
                {!enablerTop && s.enabler && <div className="dblock"><EnablerCard enabler={s.enabler} go={go} /></div>}
                <Exceptions />
              </>
            )}

            <TechDeepDive s={s} open={techOpen} setOpen={setTechOpen} anchorRef={techRef} />
          </div>

          <aside className="dcol-side">
            <SideRail s={s} go={go} />
            <div className="rail-card">
              <div className="rc-title" style={{ paddingBottom: 10 }}>Version history</div>
              <div style={{ padding: "4px 16px 18px" }}>
                <div className="timeline">
                  {s.history.map((h, i) => (
                    <div key={i} className={`tl-item ${i === 0 ? "cur" : ""}`}>
                      <div className="tl-head"><span className="tl-v">v{h.v}</span><span className="tl-date">{fmtDate(h.date)}</span></div>
                      <div className="tl-note">{h.note}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
window.Detail = Detail;
