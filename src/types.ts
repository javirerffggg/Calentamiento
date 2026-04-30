export enum RoutineType {
  PUSH = 'Empuje',
  PULL = 'Tirón',
  LEGS = 'Pierna'
}

export interface Exercise {
  name: string;
  duration?: number; // In seconds
  reps?: string;
  notes: string;
  instruction?: string;
  tempo?: string;
  weightPercent?: number; // percentage (e.g., 30 for 30%)
}

export interface Section {
  title: string;
  exercises: Exercise[];
  restBetweenSets?: string;
}

export interface DayRoutine {
  id: RoutineType;
  days: string;
  title: string;
  initialActivity?: {
    name: string;
    duration: string;
    notes: string;
  };
  sections: Section[];
}
