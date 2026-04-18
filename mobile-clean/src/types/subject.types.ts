export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Hard' | 'Medium' | 'Easy';

export interface Topic {
  _id: string;
  name: string;
  description: string;
  difficulty: DifficultyLevel;
  estimatedHours: number;
  pyqProbability?: 'High' | 'Medium' | 'Low';
  subjectId: string;
}

export interface Subject {
  _id: string;
  name: string;
  code: string;
  professor?: string;
  creditHours: number;
  examDate: string;
  overview?: string;
  topics?: Topic[];
  userId: string;
  completedTopics?: number;
  totalTopics?: number;
}
