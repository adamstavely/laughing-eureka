// Home — search-first landing
function Home({ go, query, setQuery }) {
  const { STANDARDS, CATEGORIES, COMPLIANCE, catName } = window.SP_DATA;
  const [q, setQ] = useState("");
  const inputRef = useRef(null);

  // live suggestions
  const sugg = useMemo(() => {
    if (q.trim().length < 2) return [];
    const t = q.toLowerCase();
    return STANDARDS.filter((s) =>
      s.title.toLowerCase().includes(t) || s.id.toLowerCase().includes(t) ||
      s.summary.toLowerCase().includes(t) || catName(s.category).toLowerCase().includes(t) ||
      (s.enabler && s.enabler.name.toLowerCase().includes(t))
    ).slice(0, 6);
  }, [q]);

  const featured = ["SEC-001", "REL-001", "AI-001"].map((id) => STANDARDS.find((s) => s.id === id));
  const counts = {
    must: STANDARDS.filter((s) => s.compliance === "must" && s.status !== "deprecated").length,
    should: STANDARDS.filter((s) => s.compliance === "should" && s.status !== "deprecated").length,
    active: STANDARDS.filter((s) => s.status === "active").length,
  };

  const submit = (term) => { setQuery(term); go({ view: "browse", q: term }); };

  return (
    <div>
      {/* hero */}
      <section className="hero">
        <div className="wrap hero-row">
          <div className="hero-main">
            <h1 className="serif">Standards that explain <em>why</em>, not just what.</h1>
            <p className="lede">The single source of truth for how we build at Acme. Every standard leads with its business impact, tells you who owns it, and points to the enterprise enabler that makes you compliant by default.</p>

          <div style={{ position: "relative", maxWidth: 660 }}>
            <div className="searchbar">
              <Icon name="search" size={21} style={{ color: "var(--ink-4)" }} />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") submit(q); }}
                placeholder="Search standards, e.g. “encryption”, “SLO”, “SEC-001”…"
                aria-label="Search standards"
              />
              <button className="btn btn-primary" onClick={() => submit(q)}>Search</button>
            </div>

            {sugg.length > 0 && (
              <div style={{
                position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, zIndex: 30,
                background: "#fff", border: "1px solid var(--border-2)", borderRadius: 14,
                boxShadow: "var(--shadow-lg)", overflow: "hidden", padding: 6,
              }}>
                {sugg.map((s) => (
                  <div key={s.id} onClick={() => go({ view: "detail", id: s.id })}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 9, cursor: "pointer" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-sunken)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                    <span className="idtag" style={{ width: 64, flexShrink: 0 }}>{s.id}</span>
                    <span style={{ flex: 1, fontWeight: 600, fontSize: 14.5 }}>{s.title}</span>
                    <ComplianceBadge level={s.compliance} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="search-hints">
            <span className="lbl">Jump to:</span>
            {["Security", "encryption", "SLOs", "accessibility", "API versioning"].map((h) => (
              <span key={h} className="chip" style={{ cursor: "pointer" }} onClick={() => { setQ(h); submit(h); }}>{h}</span>
            ))}
          </div>
          </div>
          <div className="hero-art" aria-hidden="true"><Icon name="layers" size={230} sw={1.3} /></div>
        </div>
      </section>

      {/* Start here / featured */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2>Start here</h2>
              <div className="sub" style={{ marginTop: 4 }}>The standards every team should know first.</div>
            </div>
            <a className="btn btn-ghost btn-sm" onClick={() => go({ view: "browse" })}>Browse all <Icon name="arrowRight" size={15} /></a>
          </div>
          <div className="featured-grid">
            {featured.map((s) => (
              <div key={s.id} className="feat-card" onClick={() => go({ view: "detail", id: s.id })}>
                <div className="fc-top">
                  <span className="idtag">{s.id}</span>
                  <ComplianceBadge level={s.compliance} />
                </div>
                <h3>{s.title}</h3>
                <p>{s.impactHeadline}</p>
                <div className="fc-foot">
                  {s.enabler && <span className="enabler-pill"><Icon name="bolt" size={11} sw={2} />{s.enabler.name}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by domain */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div><h2>Browse by domain</h2></div>
            <div className="sub">{STANDARDS.filter(s => s.status !== "deprecated").length} active standards across {CATEGORIES.length} domains</div>
          </div>
          <div className="cat-grid">
            {CATEGORIES.map((c) => (
              <div key={c.id} className="cat-card" onClick={() => go({ view: "browse", cat: c.id })}>
                <div className="ci"><Icon name={CAT_ICON[c.id]} size={19} /></div>
                <h4>{c.name}</h4>
                <div className="cc-blurb">{c.blurb}</div>
                <div className="cc-count">{c.count} standard{c.count !== 1 ? "s" : ""}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* By compliance lens */}
      <section className="section">
        <div className="wrap">
          <div className="section-head"><div><h2>By compliance level</h2></div></div>
          <div className="lens-row">
            <div className="lens-card" style={{ borderTop: "3px solid var(--must)" }} onClick={() => go({ view: "browse", compliance: "must" })}>
              <div className="lc-n" style={{ color: "var(--must)" }}>{counts.must}</div>
              <div className="lc-l">Must: mandatory</div>
              <div className="lc-d">{COMPLIANCE.must.desc}</div>
            </div>
            <div className="lens-card" style={{ borderTop: "3px solid var(--should)" }} onClick={() => go({ view: "browse", compliance: "should" })}>
              <div className="lc-n" style={{ color: "var(--should)" }}>{counts.should}</div>
              <div className="lc-l">Should: recommended</div>
              <div className="lc-d">{COMPLIANCE.should.desc}</div>
            </div>
            <div className="lens-card" style={{ borderTop: "3px solid var(--enabler)" }} onClick={() => go({ view: "browse" })}>
              <div className="lc-n" style={{ color: "var(--enabler)" }}>{STANDARDS.filter(s => s.enabler && s.enabler.covers === "full" && s.status !== "deprecated").length}</div>
              <div className="lc-l">Compliant-by-default</div>
              <div className="lc-d">Adopt the enterprise enabler and the standard is met for you.</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
window.Home = Home;
