// About — mission/vision, leadership letter, guiding principles, maturity model
const PRINCIPLES = [
  { t: "Lead with the why", d: "Every standard opens with its business impact. If we can't explain why it matters, it isn't ready to publish, and teams won't adopt what they don't understand." },
  { t: "Paved paths, not policing", d: "The fastest way to compliance is a great default. Each standard points to an enterprise enabler that makes the right way the easy way, adopt it and you're compliant by construction." },
  { t: "Mandate sparingly", d: "Must, Should, May means something. We reserve “Must” for what genuinely protects customers and the business, so a mandate always carries weight." },
  { t: "Federated ownership, central coherence", d: "Standards are owned by the guilds closest to the work, published in one place with one voice. Local expertise, global consistency." },
  { t: "Living documents", d: "A standard is versioned, dated, and owned. It evolves with the technology and the threat landscape, a stale standard is a liability, not an asset." },
  { t: "Exceptions are data", d: "A well-reasoned exception isn't failure, it's a signal. Repeated exceptions tell us a standard needs to change, or an enabler needs to improve." },
];

const MATURITY = [
  { lvl: 0, name: "Ad hoc", tag: "Unmanaged", color: "#9aa3b5",
    desc: "No awareness of the standard. Practices vary team to team and depend on individuals.",
    signals: ["No shared approach", "Tribal knowledge", "Invisible risk"] },
  { lvl: 1, name: "Aware", tag: "Informed", color: "#b3431f",
    desc: "Teams know the standard exists and understand why it matters, but adoption is manual and inconsistent.",
    signals: ["Read the standard", "Understands the why", "Manual effort"] },
  { lvl: 2, name: "Adopting", tag: "In progress", color: "#9a6206",
    desc: "Teams are actively implementing the requirements, with gaps tracked and a remediation plan in place.",
    signals: ["Plan in place", "Gaps tracked", "Partial coverage"] },
  { lvl: 3, name: "Compliant", tag: "Meets the bar", color: "#1b7a4b",
    desc: "The standard is fully met and evidenced. Compliance is verified and any deviations carry an approved exception.",
    signals: ["Fully met", "Evidenced", "Exceptions documented"] },
  { lvl: 4, name: "Compliant by default", tag: "Paved path", color: "#2353e6",
    desc: "The team has adopted the enterprise enabler, so compliance is automatic and continuous, it can't regress without active effort.",
    signals: ["Enabler adopted", "Continuous & automatic", "Drift-proof"] },
];

const EA_TEAM = [
  { name: "Elena Vasquez", initials: "EV", role: "Head of Enterprise Architecture", focus: "Chairs the Architecture Review Board and owns the overall standards & compliance program.", color: "#2353e6" },
  { name: "Tomas Berg", initials: "TB", role: "Principal Architect, Standards", focus: "Owns the standards framework, taxonomy, and the bar for what earns a “Must.”", color: "#1c43bd" },
  { name: "Aisha Rahman", initials: "AR", role: "Compliance & Governance Lead", focus: "Runs the maturity reviews and tracks adoption across every team and standard.", color: "#6936d3" },
  { name: "Jordan Lee", initials: "JL", role: "Standards Program Manager", focus: "Coordinates publishing, versioning, and the exceptions process end to end.", color: "#b3431f" },
];

function About({ go }) {
  const sigColors = ["#2353e6", "#1c43bd", "#6936d3", "#b3431f"];
  const signers = [
    { name: "Maya Chen", role: "Chief Technology Officer", initials: "MC" },
    { name: "David Okafor", role: "Chief Information Officer", initials: "DO" },
    { name: "Priya Nair", role: "Chief Data & AI Officer", initials: "PN" },
    { name: "Sofia Reyes", role: "Chief Information Security Officer", initials: "SR" },
  ];

  return (
    <div>
      <section className="about-hero">
        <div className="wrap ax about-hero-row">
          <div className="about-hero-text">
            <div className="eyebrow"><Icon name="compass" size={15} sw={2} /> About these standards</div>
            <h1 className="serif">Why we hold a shared bar, and how we help you clear it.</h1>
            <p>Acme is a federated engineering organization: many teams, one set of expectations. These standards exist to make the right way the obvious way, explained in plain language, grounded in business impact, and backed by tools that do the heavy lifting for you.</p>
          </div>
          <div className="about-hero-art"><Icon name="scale" size={150} sw={1.3} /></div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="about-section">
        <div className="wrap">
          <div className="about-eyebrow">Our purpose</div>
          <h2 className="serif">Mission &amp; vision</h2>
          <div className="mv-grid" style={{ marginTop: 28 }}>
            <div className="mv-card">
              <div className="mv-ic" style={{ background: "var(--blue)" }}><Icon name="flag" size={22} sw={2} /></div>
              <h3>Mission</h3>
              <p>Enable every team to ship software that is secure, reliable, and worthy of our customers' trust, fast, by making the right way the easy way.</p>
            </div>
            <div className="mv-card">
              <div className="mv-ic" style={{ background: "var(--enabler)" }}><Icon name="sparkles" size={22} sw={2} /></div>
              <h3>Vision</h3>
              <p>A federated organization where standards are understood by all, adopted by default, and trusted by engineers, partners, and regulators alike.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Joint letter */}
      <section className="about-section" style={{ background: "var(--bg-sunken)" }}>
        <div className="wrap">
          <div className="about-eyebrow" style={{ textAlign: "center" }}>A note from leadership</div>
          <h2 className="serif" style={{ textAlign: "center", marginBottom: 36 }}>A joint letter from your engineering leaders</h2>
          <div className="letter">
            <p className="salutation serif">To every engineer, manager, and partner who builds with us,</p>
            <p className="lead-line">We wrote these standards for one reason: so that doing excellent work doesn't depend on knowing the right person or having been here the longest.</p>
            <p>In a distributed organization, good intentions don't scale, shared, well-explained expectations do. The standards in this portal are not a compliance checklist handed down from above. They are the hard-won lessons of our guilds, written down, so the whole company can move faster without relearning them the hard way.</p>
            <p className="pull">“We will never ask you to meet a standard we can't explain, and wherever we can, we'll give you a tool that meets it for you.”</p>
            <p>That is our commitment to you. Every standard leads with its business impact, names a real owner you can talk to, and points to an enterprise enabler, the paved path that makes compliance the default, not a chore. When a standard gets in your way, tell us; an exception is a signal we take seriously, and often the start of a better standard.</p>
            <p>Hold the bar. Help us raise it. And build things you're proud of.</p>
            <div className="signatures">
              {signers.map((s, i) => (
                <div key={s.name} className="sig">
                  <div className="savatar" style={{ background: `linear-gradient(135deg, ${sigColors[i]}, ${sigColors[i]}cc)` }}>{s.initials}</div>
                  <div>
                    <div className="sig-script">{s.name}</div>
                    <div className="srole">{s.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Architecture team */}
      <section className="about-section">
        <div className="wrap">
          <div className="about-eyebrow">Who oversees this</div>
          <h2 className="serif">The Enterprise Architecture team</h2>
          <p style={{ fontSize: 16.5, color: "var(--ink-2)", maxWidth: "64ch", margin: "0 0 8px" }}>A small, central team stewards the standards and compliance program, not by writing every standard, but by holding the framework together. They chair the <b>Architecture Review Board</b>, run the quarterly maturity reviews, and shepherd exceptions into better standards and enablers.</p>
          <div className="team-grid">
            {EA_TEAM.map((m) => (
              <div key={m.name} className="team-card">
                <div className="team-av" style={{ background: `linear-gradient(135deg, ${m.color}, ${m.color}cc)` }}>{m.initials}</div>
                <div className="tc-name">{m.name}</div>
                <div className="tc-role">{m.role}</div>
                <p className="tc-focus">{m.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guiding principles */}
      <section className="about-section">
        <div className="wrap">
          <div className="about-eyebrow">How we write standards</div>
          <h2 className="serif">Guiding principles</h2>
          <p style={{ fontSize: 16.5, color: "var(--ink-2)", maxWidth: "62ch", margin: "0 0 30px" }}>Six principles shape every standard in this portal, what we choose to mandate, how we explain it, and how we help you meet it.</p>
          <div className="principles">
            {PRINCIPLES.map((p, i) => (
              <div key={i} className="principle">
                <div className="pn">{String(i + 1).padStart(2, "0")}</div>
                <div><h4>{p.t}</h4><p>{p.d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Maturity model */}
      <section className="about-section" style={{ background: "var(--bg-sunken)" }}>
        <div className="wrap">
          <div className="about-eyebrow">Measuring adoption</div>
          <h2 className="serif">The compliance maturity model</h2>
          <p style={{ fontSize: 16.5, color: "var(--ink-2)", maxWidth: "64ch", margin: "0 0 28px" }}>We measure each team against every applicable standard on a five-stage scale. The goal isn't just to reach <b>Compliant</b>, it's to reach <b>Compliant by default</b>, where adopting the enterprise enabler makes compliance automatic and impossible to silently regress.</p>
          <div className="mat-bar">
            {MATURITY.map((m) => <span key={m.lvl} style={{ background: m.color }}></span>)}
          </div>
          <div className="maturity">
            {MATURITY.map((m) => (
              <div key={m.lvl} className="mat-row">
                <div className="mat-left">
                  <div className="mat-level" style={{ background: m.color }}>{m.lvl}</div>
                  <div>
                    <div className="ml-name">{m.name}</div>
                    <div className="ml-tag">{m.tag}</div>
                  </div>
                </div>
                <div className="mat-right">
                  <p className="mr-desc">{m.desc}</p>
                  <div className="mr-signals">
                    {m.signals.map((sg, i) => <span key={i} className="sg">{sg}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 28, alignItems: "center", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={() => go({ view: "browse" })}>Browse the standards <Icon name="arrowRight" size={15} /></button>
            <button className="btn btn-ghost" onClick={() => go({ view: "enablers" })}><Icon name="bolt" size={15} sw={2} /> See compliant-by-default enablers</button>
          </div>
        </div>
      </section>
    </div>
  );
}
window.About = About;
