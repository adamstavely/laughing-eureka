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
  owner: Omit<Owner, 'team'>;
  tagline: string;
  what: string;
  gets: string[];
  cta: string;
  docs: string;
  meets: EnablerRef[];
  covers: CoverageLevel;
  desc: string;
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

export interface Enabler {
  id: string;
  name: string;
  type: string;
  team: string;
  cat: string;
  owner: Omit<Owner, 'team'>;
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

export type Compliance = Record<ComplianceLevel, ComplianceInfo>;

export interface StatusInfo {
  label: string;
}

export type StatusMap = Record<StatusKey, StatusInfo>;
