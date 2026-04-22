import { useContext } from 'react';
import { ScheduleContext } from '../context/ScheduleContext';

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};
