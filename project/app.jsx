// App shell — routing + top bar + tweaks
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "detailLayout": "impact-hero",
  "enablerPlacement": "top",
  "accent": "#2353e6",
  "showEnablerOnCards": true
}/*EDITMODE-END*/;

const APPS = [
  { key: "standards", name: "Standards", desc: "Engineering norms", icon: "layers", current: true },
  { key: "catalog",   name: "Service Catalog", desc: "Owned services", icon: "package" },
  { key: "incidents", name: "Incidents", desc: "On-call & postmortems", icon: "alert" },
  { key: "runbooks",  name: "Runbooks", desc: "Operational guides", icon: "book" },
  { key: "metrics",   name: "Dashboards", desc: "Reliability metrics", icon: "activity" },
  { key: "infra",     name: "Infra Console", desc: "Cloud & compute", icon: "cloud" },
  { key: "security",  name: "Security Hub", desc: "Posture & scans", icon: "shield" },
  { key: "platform",  name: "AI Platform", desc: "Models & evals", icon: "cpu" },
];

function usePopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);
  return [open, setOpen, ref];
}

function AppPicker() {
  const [open, setOpen, ref] = usePopover();
  return (
    <div className="popwrap" ref={ref}>
      <button className={"icon-btn" + (open ? " is-open" : "")} aria-label="Open app picker"
        aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Icon name="grid" size={18} sw={1.9} />
      </button>
      {open && (
        <div className="popover apps-pop" role="menu">
          <div className="pop-head">Acme Engineering</div>
          <div className="apps-grid">
            {APPS.map((a) => (
              <a key={a.key} className={"app-tile" + (a.current ? " is-current" : "")}
                onClick={() => setOpen(false)}>
                <span className="app-ico"><Icon name={a.icon} size={19} sw={1.9} /></span>
                <span className="app-name">{a.name}</span>
                <span className="app-desc">{a.desc}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AvatarMenu() {
  const [open, setOpen, ref] = usePopover();
  const user = { name: "Dana Okafor", email: "dana.okafor@acme.dev", role: "Staff Engineer · Platform" };
  return (
    <div className="popwrap" ref={ref}>
      <button className={"avatar-btn" + (open ? " is-open" : "")} aria-label="Account menu"
        aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span className="avatar">{initials(user.name)}</span>
      </button>
      {open && (
        <div className="popover account-pop" role="menu">
          <div className="account-id">
            <span className="avatar lg">{initials(user.name)}</span>
            <div className="account-meta">
              <div className="account-name">{user.name}</div>
              <div className="account-email">{user.email}</div>
              <div className="account-role">{user.role}</div>
            </div>
          </div>
          <div className="pop-sep"></div>
          <a className="pop-item" onClick={() => setOpen(false)}><Icon name="users" size={16} /> Your profile</a>
          <a className="pop-item" onClick={() => setOpen(false)}><Icon name="star" size={16} /> Saved standards</a>
          <a className="pop-item" onClick={() => setOpen(false)}><Icon name="flag" size={16} /> Your proposals</a>
          <div className="pop-sep"></div>
          <a className="pop-item" onClick={() => setOpen(false)}><Icon name="x" size={16} /> Sign out</a>
        </div>
      )}
    </div>
  );
}

function TopBar({ route, go }) {
  return (
    <header className="topbar">
      <div className="wrap topbar-inner">
        <div className="brand" onClick={() => go({ view: "home" })}>
          <div className="brand-mark"><Icon name="layers" size={17} sw={2} /></div>
          <div className="brand-name">Acme Standards<small>Engineering · Build the right way</small></div>
        </div>
        <nav className="topnav">
          <a className={route.view === "about" ? "active" : ""} onClick={() => go({ view: "about" })}>About</a>
          <a className={route.view === "browse" ? "active" : ""} onClick={() => go({ view: "browse" })}>Browse</a>
          <a className={route.view === "enablers" || route.view === "enabler" ? "active" : ""} onClick={() => go({ view: "enablers" })}>Enablers</a>
        </nav>
        <div className="topbar-spacer"></div>
        {route.view !== "home" && (
          <div className="top-search" onClick={() => go({ view: "browse" })}>
            <Icon name="search" size={15} /> Search standards <kbd>/</kbd>
          </div>
        )}
        <div className="topbar-actions">
          <AppPicker />
          <AvatarMenu />
        </div>
      </div>
    </header>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = useState({ view: "home" });
  const [query, setQuery] = useState("");

  // accent applied to brand blue tokens
  useEffect(() => {
    document.documentElement.style.setProperty("--blue", t.accent);
  }, [t.accent]);

  const go = (r) => {
    if (r.view === "browse" && r.enabler) { setRoute({ view: "browse", enablerOnly: true }); }
    else setRoute(r);
    window.scrollTo(0, 0);
  };

  return (
    <div className="shell">
      <TopBar route={route} go={go} />
      <main style={{ flex: 1 }}>
        {route.view === "home" && <Home go={go} query={query} setQuery={setQuery} />}
        {route.view === "browse" && <Browse go={go} initial={route} key={JSON.stringify(route)} />}
        {route.view === "detail" && <Detail go={go} id={route.id} tweaks={t} />}
        {route.view === "enablers" && <Enablers go={go} />}
        {route.view === "enabler" && <EnablerDetail go={go} id={route.id} />}
        {route.view === "about" && <About go={go} />}
      </main>
      <footer className="footer">
        <div className="wrap footer-inner">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="brand-mark" style={{ width: 24, height: 24, borderRadius: 6 }}><Icon name="layers" size={13} sw={2} /></div>
            <span>Acme Engineering Standards · Maintained by the Architecture Guild</span>
          </div>
          <div className="fl">
            <a onClick={() => go({ view: "browse" })}>All standards</a>
            <a onClick={() => go({ view: "enablers" })}>Enablers</a>
            <a onClick={() => go({ view: "about" })}>About</a>
            <a>Propose a change</a>
          </div>
        </div>
      </footer>

      <TweaksPanel>
        <TweakSection label="Standard detail page" />
        <TweakRadio label="Layout" value={t.detailLayout}
          options={["impact-hero", "split-lens", "editorial"]}
          onChange={(v) => setTweak("detailLayout", v)} />
        <TweakRadio label="Enabler placement" value={t.enablerPlacement}
          options={["top", "after-why"]}
          onChange={(v) => setTweak("enablerPlacement", v)} />
        <TweakSection label="Brand" />
        <TweakColor label="Accent" value={t.accent}
          options={["#2353e6", "#0e7c6b", "#6936d3", "#b3431f", "#0d1320"]}
          onChange={(v) => setTweak("accent", v)} />
        <div style={{ padding: "10px 4px 4px", fontSize: 12, color: "var(--ink-3)", lineHeight: 1.5 }}>
          Tip: open any standard (e.g. <b>SEC-001</b>) to compare detail-page layouts.
        </div>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
