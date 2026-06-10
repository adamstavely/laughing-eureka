# Engineering Standards Portal

_Started 2026-06-06 20:47 UTC_

---

## User

As the CTO of a federated / distributed engineering organization I need a central location to publish standards in a manner that is easily updatable, searchable, understandable for various technical and non technical audiences and most importantly explains the why and the positive business imapct of  meeting the standard.

## Assistant

_[tool: list_files]_

I'll start by exploring the design system, then ask you some focused questions before building.

_[tool: list_files]_

_[tool: questions_v2]_

The attached Design System project is currently empty, so there's no existing visual context or component library to build from. That's important — I'll either need you to point me at design context (a codebase, screenshots, brand assets) or I'll establish an original visual direction for you to react to.

Let me ask a focused round of questions so I build the right thing.

## User

Questions answered:
- design_context: No existing context — establish an original direction for me
- deliverable: Clickable interactive prototype of the whole portal
- audiences: Auditors / compliance, External partners / vendors, Engineering managers & team leads, Engineers / ICs across distributed teams, Non-technical stakeholders (PM, legal, finance, execs)
- standard_anatomy: Plain-language summary (non-technical), The 'why' / rationale & business impact, Compliance level (must / should / may), Owner / maintainer & contacts, Status (draft / active / deprecated) & version history, Related standards & exceptions process
- navigation: Curated 'start here' / featured standards, By compliance level or status, Browse by team / org unit, Browse by category / domain (e.g. Security, Data, Frontend), Powerful global search (search-first homepage)
- business_impact_emphasis: Front and center — it's the headline of every standard
- updatability: Just show the reading experience for now
- vibe: 1
- variations_focus: The standard-detail page specifically

## Assistant

_[tool: update_todos]_

Got it. No existing context, so I'll establish an original visual direction: a clean, light, authoritative portal (matching the tone you picked) — white surfaces, a confident blue accent, editorial serif for the high-gravity "why" statements, and mono for standard IDs/metadata. The **business impact leads every standard**. I'll build a clickable prototype of the whole portal and expose **standard-detail-page variations** as Tweaks.

Let me set up my plan and grab the tweaks scaffold.

_[tool: copy_starter_component]_

_[tool: write_file]_

Now I'll author the standards dataset.

_[tool: str_replace_edit]_

Great addition — an "enterprise enabler" (the paved/golden path: adopt it and you're compliant by construction) is exactly the kind of thing that makes a standards portal actionable rather than just aspirational. I'll add it to the data model and give it a prominent section on the detail page.

_[tool: write_file]_

Now the stylesheet — establishing the full design system (tokens, type scale, compliance/status color coding).

_[tool: write_file]_

Now the shared components (icons, badges, building blocks).

_[tool: write_file]_

Now the Home (search-first landing) screen.Now the Browse/search screen with live filtering.

_[tool: write_file]_

_[tool: write_file]_

Now the centerpiece — the standard detail page, with the enterprise-enabler section and tweakable layout variants.

_[tool: write_file]_

Now the app shell with routing + tweaks, then the main HTML.

_[tool: str_replace_edit]_

Let me fix the enabler-shortcut wiring (Browse needs to honor it, and that wrapper is dead code).

_[tool: str_replace_edit]_

Now the main HTML file that ties it all together.

_[tool: write_file]_

_[tool: show_html]_

_[tool: show_html]_

_[tool: read_file]_

Home looks strong. Now let me add the **About** section — joint leadership letter, mission & vision, guiding principles, and the compliance maturity model. First, the styles.

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

Now the About-page styles, appended to the stylesheet:

_[tool: str_replace_edit]_

Now the About page component:

_[tool: write_file]_

Now wire About into routing, nav, and the HTML script tags.

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: multi_screenshot]_

Let me check the About page and a detail page render.

_[tool: str_replace_edit]_

The signature names overlap their roles. Let me fix that styling.

_[tool: multi_screenshot]_

Now let me verify the maturity model and a detail page (the centerpiece).The maturity model looks great. Now the centerpiece — let me verify a detail page with the enterprise enabler section.

_[tool: multi_screenshot]_

_[tool: str_replace_edit]_

The detail page and enabler section look excellent. A few small wrapping issues to clean up (coverage tag, dates, multi-word tags).

_[tool: update_todos]_

Let me mark progress and verify the enabler header fix plus a layout variant.

_[tool: update_todos]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: done]_

Everything's clean — coverage tag, dates, and tags all render on one line now. Let me finalize and surface it.

_[tool: fork_verifier_agent]_

Done — your engineering standards portal is live. Here's what I built:

**A clickable prototype of the whole portal** — clean, light, authoritative; serif for the high-gravity "why" statements, mono for standard IDs/metadata, with compliance (Must/Should/May) and status color-coded throughout.

- **Home** — search-first with live suggestions, a "Start here" set, browse by domain, and a by-compliance-level lens (including a *Compliant-by-default* count).
- **Browse** — faceted live filtering by domain, level, status, owning team, plus an **enterprise-enabler** filter; sortable results.
- **Standard detail (the centerpiece)** — business impact leads as a dark hero with headline stats, then the **Enterprise Enabler** section ("the paved path" — adopt it and you're compliant by construction, with a coverage tag), then plain-language summary, the why, what-good-looks-like, exceptions, and a side rail with owner/contact, applies-to teams, related standards, and a version-history timeline.
- **About** — mission & vision, a signed **joint leadership letter**, six **guiding principles**, and a 5-stage **compliance maturity model** (Ad hoc → Compliant by default).

**Tweaks** (toolbar): swap the detail page between three layouts — *impact-hero / split-lens (business vs. technical view) / editorial* — move the enabler section, and change the accent color.

A few notes for your next pass:
- Content is realistic placeholder (16 standards, Acme team/owner names) — swap in your real standards, owners, and enabler tools.
- Authoring/editing is reading-only for now per your answer; the "Propose a change" workflow is a stub when you want it.
- Want me to wire the maturity model into a **per-team adoption dashboard**, or build the editing/approval flow next?

