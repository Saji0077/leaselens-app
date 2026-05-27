// TypeScript interfaces for LeaseLens application

export type UserType = 'student' | 'first-time-renter' | 'international-student' | 'young-professional';
export type AustralianState = 'VIC' | 'NSW' | 'QLD' | 'SA' | 'WA' | 'TAS' | 'ACT' | 'NT';
export type UrgencyLevel = 'low' | 'medium' | 'high';
export type ContentType = 'rental-listing' | 'lease-clause' | 'agreement-summary';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface RenterDetails {
  userType: UserType | '';
  state: AustralianState | '';
  urgency: UrgencyLevel | '';
}

export interface RentalContent {
  contentType: ContentType | '';
  text: string;
}

export interface ChecklistAnswers {
  utilitiesMentioned: boolean | null;
  bondExplained: boolean | null;
  maintenanceClear: boolean | null;
  breakLeaseTerms: boolean | null;
  unusualPayments: boolean | null;
}

export interface AnalysisResult {
  riskLevel: RiskLevel;
  redFlags: string[];
  positiveSigns: string[];
  nextSteps: string[];
  isSuccessful: boolean;
  message?: string;
}

export interface AppState {
  renterDetails: RenterDetails;
  rentalContent: RentalContent;
  checklistAnswers: ChecklistAnswers;
  analysisResult: AnalysisResult | null;
}

export interface AppContextType {
  state: AppState;
  updateRenterDetails: (details: Partial<RenterDetails>) => void;
  updateRentalContent: (content: Partial<RentalContent>) => void;
  updateChecklistAnswers: (answers: Partial<ChecklistAnswers>) => void;
  setAnalysisResult: (result: AnalysisResult) => void;
  resetApp: () => void;
}