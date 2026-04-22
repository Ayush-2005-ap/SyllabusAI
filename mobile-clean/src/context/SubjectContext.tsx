import React, { createContext, useState, ReactNode, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { Subject, Topic } from '../types/subject.types';

interface SubjectContextProps {
  subjects: Subject[];
  topics: Record<string, Topic[]>;
  loading: boolean;
  fetchSubjects: () => Promise<void>;
  addSubject: (data: Partial<Subject>) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
  uploadSyllabus: (subjectId: string, uri: string, name: string, type: string) => Promise<void>;
  fetchTopics: (subjectId: string) => Promise<void>;
}

export const SubjectContext = createContext<SubjectContextProps | undefined>(undefined);

export const SubjectProvider = ({ children }: { children: ReactNode }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Record<string, Topic[]>>({});
  const [loading, setLoading] = useState(false);

  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/subjects');
      setSubjects(res.data.data || res.data);
      await AsyncStorage.setItem('subjectsData', JSON.stringify(res.data.data || res.data));
    } catch (err) {
      console.error('Fetch subjects error:', err);
      // Fallback to offline cache
      const cached = await AsyncStorage.getItem('subjectsData');
      if (cached) setSubjects(JSON.parse(cached));
    } finally {
      setLoading(false);
    }
  }, []);

  const addSubject = useCallback(async (data: Partial<Subject>) => {
    const res = await api.post('/subjects', data);
    setSubjects(prev => [...prev, res.data.data || res.data]);
    fetchSubjects();
  }, [fetchSubjects]);

  const deleteSubject = useCallback(async (id: string) => {
    await api.delete(`/subjects/${id}`);
    setSubjects(prev => prev.filter(s => s._id !== id));
    fetchSubjects();
  }, [fetchSubjects]);

  const uploadSyllabus = useCallback(async (subjectId: string, uri: string, name: string, type: string) => {
    const formData = new FormData();
    formData.append('syllabus', {
      uri,
      name,
      type
    } as any);

    const res = await api.post(`/topics/extract/${subjectId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    setTopics(prev => ({
      ...prev,
      [subjectId]: res.data.data || res.data
    }));
    fetchSubjects(); // Refresh subjects to get updated completedTopics/totalTopics
  }, [fetchSubjects]);

  const fetchTopics = useCallback(async (subjectId: string) => {
    try {
      const res = await api.get(`/topics/${subjectId}`);
      setTopics(prev => ({
        ...prev,
        [subjectId]: res.data.data || res.data
      }));
    } catch (err) {
      console.error('Fetch topics error:', err);
    }
  }, []);

  return (
    <SubjectContext.Provider value={{ subjects, topics, loading, fetchSubjects, addSubject, deleteSubject, uploadSyllabus, fetchTopics }}>
      {children}
    </SubjectContext.Provider>
  );
};
