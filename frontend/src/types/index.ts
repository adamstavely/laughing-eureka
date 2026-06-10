export type ComplianceLevel = 'must' | 'should' | 'may';
export type StatusKey = 'active' | 'draft' | 'deprecated';
export type CoverageLevel = 'full' | 'most' | 'partial';

export interface Category {
  id: string;
  name: string;
  blurb: string;
  count: number;
}

export interface Owner {
  name: string;
  role: string;
  team?: string;
  email: string;
}

export interface ImpactStat {
  stat: string;
  label: string;
}

export interface HistoryEntry {
  v: string;
  date: string;
  note: string;
}

export interface EnablerRef {
  id: string;
  covers: CoverageLevel;
}

export interface AttachedEnabler {
  id: string;
  name: string;
  type: string;
  team: string;
  cat: string;
  owner: { name: string; role: string; email: string };
  tagline: string;
  what: string;
  gets: string[];
  cta: string;
  docs: string;
  meets: EnablerRef[];
  covers: CoverageLevel;
  desc: string;
}

export interface ConformanceCriterion {
  ref: string;
  level: ComplianceLevel;
  text: string;
}

export interface CodeConfig {
  label: string;
  lang: string;
  code: string;
}

export interface NormativeRef {
  label: string;
  note: string;
}

export interface TechContent {
  tagline: string;
  conformance: ConformanceCriterion[];
  config?: CodeConfig;
  verify: string[];
  refs: NormativeRef[];
  deprecated?: boolean;
}

export interface Standard {
  id: string;
  title: string;
  category: string;
  compliance: ComplianceLevel;
  status: StatusKey;
  version: string;
  updated: string;
  owner: Owner;
  appliesTo: string[];
  summary: string;
  impactHeadline: string;
  impact: ImpactStat[];
  why: string;
  practice: string[];
  related: string[];
  exceptions: string;
  history: HistoryEntry[];
  enabler?: AttachedEnabler | null;
  tech?: TechContent | null;
}

export interface Enabler {
  id: string;
  name: string;
  type: string;
  team: string;
  cat: string;
  owner: { name: string; role: string; email: string };
  tagline: string;
  what: string;
  gets: string[];
  cta: string;
  docs: string;
  meets: EnablerRef[];
}

export interface ComplianceInfo {
  label: string;
  short: string;
  desc: string;
}

export type ComplianceMap = Record<ComplianceLevel, ComplianceInfo>;

export interface StatusInfo {
  label: string;
}

export type StatusMap = Record<StatusKey, StatusInfo>;

export const CAT_ICON: Record<string, string> = {
  security: 'shield',
  data: 'database',
  reliability: 'activity',
  frontend: 'layout',
  services: 'server',
  infra: 'cloud',
  ai: 'cpu',
  quality: 'scale',
};

export const APPS: { key: string; name: string; desc: string; icon: string; current?: boolean }[] = [
  { key: 'standards', name: 'Standards', desc: 'Engineering norms', icon: 'layers', current: true },
  { key: 'catalog', name: 'Service Catalog', desc: 'Owned services', icon: 'package' },
  { key: 'incidents', name: 'Incidents', desc: 'On-call & postmortems', icon: 'alert' },
  { key: 'runbooks', name: 'Runbooks', desc: 'Operational guides', icon: 'book' },
  { key: 'metrics', name: 'Dashboards', desc: 'Reliability metrics', icon: 'activity' },
  { key: 'infra', name: 'Infra Console', desc: 'Cloud & compute', icon: 'cloud' },
  { key: 'security', name: 'Security Hub', desc: 'Posture & scans', icon: 'shield' },
  { key: 'platform', name: 'AI Platform', desc: 'Models & evals', icon: 'cpu' },
];
