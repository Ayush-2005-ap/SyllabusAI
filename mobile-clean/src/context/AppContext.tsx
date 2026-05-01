import React, { createContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AcademicSettings {
  targetGpa: string;
  dailyHours: string;
  semesterWeeks: string;
  personality: string;
}

export interface SemesterArchive {
  id: string;
  name: string;
  gpa: string;
  subjectsCount: number;
}

interface AppContextType {
  panicMode: boolean;
  setPanicMode: (val: boolean) => Promise<void>;
  settings: AcademicSettings;
  updateSettings: (newSettings: Partial<AcademicSettings>) => Promise<void>;
  semesters: SemesterArchive[];
  addSemester: (sem: Omit<SemesterArchive, 'id'>) => Promise<void>;
  deleteSemester: (id: string) => Promise<void>;
  updateSemester: (id: string, sem: Partial<SemesterArchive>) => Promise<void>;
  activeSemester: number;
  setActiveSemester: (val: number) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [panicMode, setPanicMode] = useState<boolean>(false);
  const [settings, setSettings] = useState<AcademicSettings>({
    targetGpa: '3.8',
    dailyHours: '4',
    semesterWeeks: '16',
    personality: 'socratic',
  });
  const [semesters, setSemesters] = useState<SemesterArchive[]>([]);
  const [activeSemester, setActiveSemester] = useState<number>(1);

  useEffect(() => {
    const loadAppData = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem('@academic_settings');
        if (savedSettings) setSettings(JSON.parse(savedSettings));

        const savedSemesters = await AsyncStorage.getItem('@semester_archive');
        if (savedSemesters) setSemesters(JSON.parse(savedSemesters));

        const savedPanic = await AsyncStorage.getItem('@panic_mode');
        if (savedPanic) setPanicMode(savedPanic === 'true');
      } catch (e) {
        console.error('Failed to load app data', e);
      }
    };
    loadAppData();
  }, []);

  const updateSettings = async (newSettings: Partial<AcademicSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    await AsyncStorage.setItem('@academic_settings', JSON.stringify(updated));
  };

  const togglePanic = async (val: boolean) => {
    setPanicMode(val);
    await AsyncStorage.setItem('@panic_mode', val.toString());
  };

  const addSemester = async (sem: Omit<SemesterArchive, 'id'>) => {
    const newSem = { ...sem, id: Date.now().toString() };
    const updated = [newSem, ...semesters];
    setSemesters(updated);
    await AsyncStorage.setItem('@semester_archive', JSON.stringify(updated));
  };

  const deleteSemester = async (id: string) => {
    const updated = semesters.filter(s => s.id !== id);
    setSemesters(updated);
    await AsyncStorage.setItem('@semester_archive', JSON.stringify(updated));
  };

  const updateSemester = async (id: string, sem: Partial<SemesterArchive>) => {
    const updated = semesters.map(s => s.id === id ? { ...s, ...sem } : s);
    setSemesters(updated);
    await AsyncStorage.setItem('@semester_archive', JSON.stringify(updated));
  };

  return (
    <AppContext.Provider value={{ 
      panicMode, 
      setPanicMode: togglePanic, 
      settings, 
      updateSettings,
      semesters,
      addSemester,
      deleteSemester,
      updateSemester,
      activeSemester, 
      setActiveSemester 
    }}>
      {children}
    </AppContext.Provider>
  );
};
