import React, { createContext, useState, ReactNode } from 'react';

// Stub for AppContext in Phase 1
export const AppContext = createContext<any>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [panicMode, setPanicMode] = useState<boolean>(false);
  const [chatbotSettings, setChatbotSettings] = useState<any>({});
  const [activeSemester, setActiveSemester] = useState<number>(1);

  return (
    <AppContext.Provider value={{ panicMode, setPanicMode, chatbotSettings, setChatbotSettings, activeSemester, setActiveSemester }}>
      {children}
    </AppContext.Provider>
  );
};
