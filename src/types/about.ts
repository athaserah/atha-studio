export interface Achievement {
  id?: string;
  icon_name: string;
  value: string;
  label: string;
  sort_order: number;
}

export interface Skill {
  id?: string;
  skill_name: string;
  percentage: number;
  sort_order: number;
}

export interface Service {
  id?: string;
  title: string;
  description: string;
  specialties: string[];
  sort_order: number;
}

export interface Content {
  section_key: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  button_text: string | null;
}
