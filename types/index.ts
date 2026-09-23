export type RoleInterest = 'passenger' | 'driver' | 'both';

export interface WaitlistFormData {
  name: string;
  email: string;
  phone?: string;
  role: RoleInterest;
  consent: boolean;
}

export interface FeatureCardItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  icon: string;
  badge?: string;
}

export interface ProblemCardItem {
  id: string;
  category: string;
  question: string;
  description: string;
  icon: string;
}

export interface TimelineStepItem {
  step: number;
  title: string;
  subtitle: string;
  detail: string;
  icon: string;
}

export interface SafetyStageItem {
  stage: 'BEFORE THE RIDE' | 'DURING THE RIDE' | 'AFTER THE RIDE';
  title: string;
  items: string[];
  icon: string;
}
