import { createContext, useContext, useState, ReactNode } from 'react';
import type { AppState, AppContextType, RenterDetails, RentalContent, ChecklistAnswers, AnalysisResult } from '../utils/types';

// Initial state for the application
const initialState: AppState = {
  renterDetails: {
    userType: '',
    state: '',
    urgency: '',
  },
  rentalContent: {
    contentType: '',
    text: '',
  },
  checklistAnswers: {
    utilitiesMentioned: null,
    bondExplained: null,
    maintenanceClear: null,
    breakLeaseTerms: null,
    unusualPayments: null,
  },
  analysisResult: null,
};

// Create context with undefined default
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  // Update renter details
  const updateRenterDetails = (details: Partial<RenterDetails>) => {
    setState(prev => ({
      ...prev,
      renterDetails: { ...prev.renterDetails, ...details },
    }));
  };

  // Update rental content
  const updateRentalContent = (content: Partial<RentalContent>) => {
    setState(prev => ({
      ...prev,
      rentalContent: { ...prev.rentalContent, ...content },
    }));
  };

  // Update checklist answers
  const updateChecklistAnswers = (answers: Partial<ChecklistAnswers>) => {
    setState(prev => ({
      ...prev,
      checklistAnswers: { ...prev.checklistAnswers, ...answers },
    }));
  };

  // Set analysis result
  const setAnalysisResult = (result: AnalysisResult) => {
    setState(prev => ({ ...prev, analysisResult: result }));
  };

  // Reset app to initial state
  const resetApp = () => {
    setState(initialState);
  };

  return (
    <AppContext.Provider
      value={{
        state,
        updateRenterDetails,
        updateRentalContent,
        updateChecklistAnswers,
        setAnalysisResult,
        resetApp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}