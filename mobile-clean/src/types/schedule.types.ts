export interface ScheduleBlock {
  _id: string;
  topicId: string;
  topicName: string;
  subjectId: string;
  subjectName: string;
  startTime: string;
  endTime: string;
  date: string;
  type: 'study' | 'revision' | 'test';
  isCompleted: boolean;
  confidenceScore?: number;
}

export interface WeeklySchedule {
  weekStart: string;
  blocks: ScheduleBlock[];
}
