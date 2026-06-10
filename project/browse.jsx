// Browse — faceted search & filtering
function Browse({ go, initial }) {
  const { STANDARDS, CATEGORIES, TEAMS, COMPLIANCE, catName } = window.SP_DATA;
  const [q, setQ] = useState(initial.q || "");
  const [cats, setCats] = useState(new Set(initial.cat ? [initial.cat] : []));
  const [comps, setComps] = useState(new Set(initial.compliance ? [initial.compliance] : []));
  const [stats, setStats] = useState(new Set(["active", "draft"]));
  const [team, setTeam] = useState(initial.team || null);
  const [enablerOnly, setEnablerOnly] = useState(initial.enablerOnly || false);
  const [sort, setSort] = useState("relevance");

  const toggle = (set, setter, val) => {
    const n = new Set(set); n.has(val) ? n.delete(val) : n.add(val); setter(n);
  };

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    let r = STANDARDS.filter((s) => {
      if (cats.size && !cats.has(s.category)) return false;
      if (comps.size && !comps.has(s.compliance)) return false;
      if (stats.size && !stats.has(s.status)) return false;
      if (team && !s.appliesTo.includes(team)) return false;
      if (enablerOnly && !(s.enabler && s.enabler.covers === "full")) return false;
      if (t) {
        const hay = (s.title + " " + s.id + " " + s.summary + " " + s.impactHeadline + " " + catName(s.category) + " " + (s.enabler ? s.enabler.name : "")).toLowerCase();
        if (!hay.includes(t)) return false;
      }
      return true;
    });
    if (sort === "az") r = [...r].sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === "updated") r = [...r].sort((a, b) => b.updated.localeCompare(a.updated));
    else if (sort === "level") { const ord = { must: 0, should: 1, may: 2 }; r = [...r].sort((a, b) => ord[a.compliance] - ord[b.compliance]); }
    return r;
  }, [q, cats, comps, stats, team, enablerOnly, sort]);

  const countFor = (key, val) => STANDARDS.filter((s) => s[key] === val).length;
  const clearAll = () => { setCats(new Set()); setComps(new Set()); setStats(new Set(["active", "draft"])); setTeam(null); setEnablerOnly(false); setQ(""); };
  const activeFilters = cats.size + comps.size + (team ? 1 : 0) + (enablerOnly ? 1 : 0);

  return (
    <div>
      <section className="cat-hero">
        <div className="wrap cat-hero-row">
          <div className="cat-hero-text">
            <div className="ch-eyebrow"><Icon name="search" size={14} sw={2} /> Browse</div>
            <h1>All standards</h1>
            <p>Filter by domain, compliance level, owning team, or jump straight to the standards you get for free by adopting an enterprise enabler.</p>
          </div>
          <div className="cat-hero-art" aria-hidden="true"><Icon name="search" size={200} sw={1.3} /></div>
        </div>
      </section>

      <div className="wrap">
      <div className="browse">
        {/* filters */}
        <aside className="filters">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <span style={{ fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 7 }}><Icon name="filter" size={15} /> Filters</span>
            {activeFilters > 0 && <button onClick={clearAll} style={{ background: "none", border: "none", color: "var(--blue)", fontSize: 12.5, fontWeight: 600, padding: 0 }}>Clear ({activeFilters})</button>}
          </div>

          <div className="filter-group">
            <h5>Enterprise enabler</h5>
            <div className={`facet ${enablerOnly ? "on" : ""}`} onClick={() => setEnablerOnly(!enablerOnly)}>
              <span className="cbx">{enablerOnly && <Icon name="checkSmall" size={12} sw={2.6} />}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="bolt" size={13} sw={2} style={{ color: "var(--enabler)" }} /> Compliant-by-default</span>
            </div>
          </div>

          <div className="filter-group">
            <h5>Compliance level</h5>
            {["must", "should", "may"].map((c) => (
              <div key={c} className={`facet ${comps.has(c) ? "on" : ""}`} onClick={() => toggle(comps, setComps, c)}>
                <span className="cbx">{comps.has(c) && <Icon name="checkSmall" size={12} sw={2.6} />}</span>
                {COMPLIANCE[c].label}
                <span className="ct">{countFor("compliance", c)}</span>
              </div>
            ))}
          </div>

          <div className="filter-group">
            <h5>Domain</h5>
            {CATEGORIES.map((c) => (
              <div key={c.id} className={`facet ${cats.has(c.id) ? "on" : ""}`} onClick={() => toggle(cats, setCats, c.id)}>
                <span className="cbx">{cats.has(c.id) && <Icon name="checkSmall" size={12} sw={2.6} />}</span>
                {c.name}
                <span className="ct">{countFor("category", c.id)}</span>
              </div>
            ))}
          </div>

          <div className="filter-group">
            <h5>Status</h5>
            {["active", "draft", "deprecated"].map((s) => (
              <div key={s} className={`facet ${stats.has(s) ? "on" : ""}`} onClick={() => toggle(stats, setStats, s)}>
                <span className="cbx">{stats.has(s) && <Icon name="checkSmall" size={12} sw={2.6} />}</span>
                <span style={{ textTransform: "capitalize" }}>{s}</span>
                <span className="ct">{countFor("status", s)}</span>
              </div>
            ))}
          </div>

          <div className="filter-group">
            <h5>Owning team</h5>
            <select className="sortsel" style={{ width: "100%" }} value={team || ""} onChange={(e) => setTeam(e.target.value || null)}>
              <option value="">All teams</option>
              {TEAMS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </aside>

        {/* results */}
        <div>
          <div className="results-top">
            <div className="browse-search">
              <Icon name="search" size={17} style={{ color: "var(--ink-4)" }} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search within results…" aria-label="Search" />
              {q && <button onClick={() => setQ("")} style={{ background: "none", border: "none", color: "var(--ink-4)", padding: 0, display: "flex" }}><Icon name="x" size={15} /></button>}
            </div>
            <select className="sortsel" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="relevance">Sort: Relevance</option>
              <option value="updated">Recently updated</option>
              <option value="level">Compliance level</option>
              <option value="az">A–Z</option>
            </select>
          </div>

          <div className="results-count" style={{ marginBottom: 16 }}><b>{results.length}</b> standard{results.length !== 1 ? "s" : ""}{activeFilters > 0 ? " match your filters" : ""}</div>

          {results.length === 0 ? (
            <div className="empty">
              <Icon name="search" size={34} sw={1.5} />
              <div style={{ fontWeight: 700, color: "var(--ink-2)", fontSize: 16, marginBottom: 6 }}>No standards found</div>
              <div>Try removing a filter or searching a different term.</div>
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 16 }} onClick={clearAll}>Clear all filters</button>
            </div>
          ) : (
            <div className="std-list">
              {results.map((s) => (
                <div key={s.id} className="std-row" onClick={() => go({ view: "detail", id: s.id })}>
                  <div>
                    <div className="sr-head">
                      <span className="idtag">{s.id}</span>
                      <ComplianceBadge level={s.compliance} />
                      <StatusBadge status={s.status} />
                    </div>
                    <h3 style={s.status === "deprecated" ? { color: "var(--ink-3)" } : null}>{s.title}</h3>
                    <p className="sr-sum">{s.summary}</p>
                    <div className="sr-meta">
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name={CAT_ICON[s.category]} size={14} /> {catName(s.category)}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="users" size={14} /> {s.owner.team}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Icon name="clock" size={14} /> {fmtDate(s.updated)}</span>
                    </div>
                  </div>
                  <div className="sr-right">
                    {s.enabler && s.status !== "deprecated" && <EnablerPill enabler={s.enabler} />}
                    <Icon name="chevronRight" size={20} style={{ color: "var(--ink-4)" }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
window.Browse = Browse;
