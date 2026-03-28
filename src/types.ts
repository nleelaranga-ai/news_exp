
export interface Entity {
  id: string;
  name: string;
  type: 'company' | 'person' | 'sector' | 'government' | 'other';
  description?: string;
}

export interface Relationship {
  source: string;
  target: string;
  type: 'influence' | 'dependency' | 'competition' | 'partnership' | 'ownership';
  description?: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

export interface CausalLink {
  cause: string;
  effect: string;
  description: string;
}

export interface Scenario {
  type: 'likely' | 'risk' | 'opportunity';
  title: string;
  description: string;
  probability: number; // 0 to 1
  triggers: string[];
}

export interface IntelligenceReport {
  coreInsight: string;
  timeline: TimelineEvent[];
  causalChain: CausalLink[];
  entities: Entity[];
  relationships: Relationship[];
  personalizedInsight: string;
  scenarios: Scenario[];
  signals: string[];
  uncertainties: string[];
}

export type UserRole = 'student' | 'investor' | 'founder';
