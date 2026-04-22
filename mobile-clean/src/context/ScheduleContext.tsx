import React, { createContext, useState, ReactNode, useCallback } from 'react';
import api from '../services/api';

interface ScheduleBlock {
  _id: string;
  subjectId: any;
  topicId: any;
  title: string;
  type: 'study' | 'revision' | 'practice';
  startTime: string;
  endTime: string;
  isCompleted: boolean;
  confidenceRating?: number;
}

interface DashboardStats {
  completionStats: Array<{ subjectId: string; name: string; percentage: number }>;
  heatmap: Record<string, number>;
  streak: number;
  totalSubjects: number;
}

interface ScheduleContextProps {
  scheduleBlocks: ScheduleBlock[];
  stats: DashboardStats | null;
  loading: boolean;
  fetchSchedule: () => Promise<void>;
  generateSchedule: () => Promise<void>;
  updateBlock: (blockId: string, data: { isCompleted?: boolean; confidenceRating?: number }) => Promise<void>;
  fetchStats: () => Promise<void>;
}

export const ScheduleContext = createContext<ScheduleContextProps | undefined>(undefined);

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
  const [scheduleBlocks, setScheduleBlocks] = useState<ScheduleBlock[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSchedule = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/schedule');
      if (res.data.success) {
        setScheduleBlocks(res.data.data?.blocks || []);
      }
    } catch (err) {
      console.error('Fetch schedule error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const generateSchedule = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.post('/schedule/generate');
      if (res.data.success) {
        setScheduleBlocks(res.data.data?.blocks || []);
      }
    } catch (err: any) {
      console.error('Generate schedule error:', err);
      const msg = err.response?.data?.message || 'Failed to generate schedule. Please try again.';
      // We'll use Alert in the component or just let it throw if we want it handled there.
      // But for now, let's just make sure we log the right thing and maybe throw so the UI can catch.
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBlock = useCallback(async (blockId: string, data: { isCompleted?: boolean; confidenceRating?: number }) => {
    try {
      const res = await api.patch(`/schedule/block/${blockId}`, data);
      if (res.data.success) {
        setScheduleBlocks(res.data.data?.blocks || []);
        fetchStats(); // Update stats when a block is completed
      }
    } catch (err) {
      console.error('Update block error:', err);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/stats/dashboard');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Fetch stats error:', err);
    }
  }, []);

  return (
    <ScheduleContext.Provider
      value={{
        scheduleBlocks,
        stats,
        loading,
        fetchSchedule,
        generateSchedule,
        updateBlock,
        fetchStats
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};
