import React, { createContext, useState, ReactNode } from 'react';

// Stub for SubjectContext in Phase 1
export const SubjectContext = createContext<any>(undefined);

export const SubjectProvider = ({ children }: { children: ReactNode }) => {
  const [subjects, setSubjects] = useState([]);

  return (
    <SubjectContext.Provider value={{ subjects, setSubjects }}>
      {children}
    </SubjectContext.Provider>
  );
};
