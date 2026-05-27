// Keyword-based rental risk analysis logic for LeaseLens

import type { ChecklistAnswers, AnalysisResult, RiskLevel } from './types';


// Terms that should be present for positive signs
const REQUIRED_TERMS = {
  bond: ['bond', 'security deposit', 'security bond'],
  utilities: ['utilities', 'electricity', 'gas', 'water', 'internet', 'bills included'],
  maintenance: ['maintenance', 'repairs', 'property condition', 'landlord responsibilities'],
  breakLease: ['break lease', 'early termination', 'lease break', 'notice period', 'vacate'],
  rent: ['rent', 'weekly', 'monthly', 'fortnightly', 'per week', 'per month'],
};

// Check if text contains any of the keywords
function containsKeyword(text: string, keywords: string[]): boolean {
  const lowerText = text.toLowerCase();
  return keywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
}

// Find all red flags in the text
function findRedFlags(text: string): string[] {
  const flags: string[] = [];

  // Check for red flag keywords
  if (containsKeyword(text, ['cash only', 'cash payment'])) {
    flags.push('Cash-only payment requested - this is unusual and risky');
  }
  if (containsKeyword(text, ['urgent payment', 'pay immediately'])) {
    flags.push('Urgent payment pressure - legitimate rentals allow time to decide');
  }
  if (containsKeyword(text, ['non-refundable', 'no refund'])) {
    flags.push('Non-refundable payments mentioned - bonds should be refundable');
  }
  if (containsKeyword(text, ['extra fees', 'hidden charges'])) {
    flags.push('Extra or hidden fees mentioned - ask for complete fee breakdown');
  }
  if (containsKeyword(text, ['no lease', 'informal agreement'])) {
    flags.push('No formal lease offered - always get a written lease');
  }
  if (containsKeyword(text, ['wire transfer', 'western union', 'moneygram'])) {
    flags.push('Wire transfer requested - common in rental scams');
  }
  if (containsKeyword(text, ['money order', 'prepaid card', 'cryptocurrency'])) {
    flags.push('Unusual payment method requested - be cautious');
  }
  if (containsKeyword(text, ['pay before viewing', 'application fee upfront'])) {
    flags.push('Payment requested before viewing - never pay without seeing the property');
  }
  if (containsKeyword(text, ['below market', 'below market rate', 'too good to be true'])) {
    flags.push('Price seems too low - could be a scam');
  }

  return flags;
}

// Find positive signs in the text
function findPositiveSigns(text: string, checklist: ChecklistAnswers): string[] {
  const signs: string[] = [];

  if (containsKeyword(text, REQUIRED_TERMS.rent)) {
    signs.push('Clear rent amount mentioned');
  }
  if (containsKeyword(text, REQUIRED_TERMS.bond) || checklist.bondExplained) {
    signs.push('Bond/security deposit information provided');
  }
  if (containsKeyword(text, REQUIRED_TERMS.utilities) || checklist.utilitiesMentioned) {
    signs.push('Utility responsibilities clarified');
  }
  if (containsKeyword(text, REQUIRED_TERMS.maintenance) || checklist.maintenanceClear) {
    signs.push('Maintenance responsibilities stated');
  }
  if (containsKeyword(text, REQUIRED_TERMS.breakLease) || checklist.breakLeaseTerms) {
    signs.push('Break-lease terms included');
  }

  return signs;
}

// Generate smart next steps based on analysis
function generateNextSteps(redFlags: string[], checklist: ChecklistAnswers): string[] {
  const steps: string[] = [];

  // Always recommend these
  steps.push('Visit the property in person before making any payments');
  steps.push('Verify the landlord or agent\'s identity and contact details');

  // Conditional steps based on missing info
  if (!checklist.bondExplained) {
    steps.push('Ask for written confirmation of bond amount and return process');
  }
  if (!checklist.utilitiesMentioned) {
    steps.push('Clarify which utilities are included and which you\'ll pay');
  }
  if (!checklist.maintenanceClear) {
    steps.push('Request clear documentation of maintenance responsibilities');
  }
  if (!checklist.breakLeaseTerms) {
    steps.push('Ask about break-lease fees and notice periods');
  }
  if (checklist.unusualPayments) {
    steps.push('Avoid unusual payment methods - use bank transfer or cheque');
  }

  // If there are red flags
  if (redFlags.length > 0) {
    steps.push('Consider seeking advice from your state\'s tenancy authority');
  }

  return steps;
}

// Calculate overall risk level
function calculateRiskLevel(redFlags: string[], positiveSigns: string[], checklist: ChecklistAnswers): RiskLevel {
  let riskScore = 0;

  // Red flags increase risk significantly
  riskScore += redFlags.length * 2;

  // Positive signs decrease risk
  riskScore -= positiveSigns.length * 0.5;

  // Negative checklist answers increase risk
  if (checklist.unusualPayments) riskScore += 2;
  if (!checklist.utilitiesMentioned) riskScore += 1;
  if (!checklist.bondExplained) riskScore += 1;
  if (!checklist.maintenanceClear) riskScore += 1;
  if (!checklist.breakLeaseTerms) riskScore += 1;

  // Determine risk level
  if (riskScore >= 5) return 'high';
  if (riskScore >= 2) return 'medium';
  return 'low';
}

// Main analysis function
export function analyzeRental(text: string, checklist: ChecklistAnswers): AnalysisResult {
  // Check if enough text was provided
  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
  
  if (wordCount < 10) {
    return {
      riskLevel: 'medium',
      redFlags: [],
      positiveSigns: [],
      nextSteps: ['Please provide more detailed rental information for a better analysis'],
      isSuccessful: false,
      message: 'Analysis Unsuccessful: More rental information is needed. Please paste a more detailed rental listing or lease clause.',
    };
  }

  // Perform analysis
  const redFlags = findRedFlags(text);
  const positiveSigns = findPositiveSigns(text, checklist);
  const nextSteps = generateNextSteps(redFlags, checklist);
  const riskLevel = calculateRiskLevel(redFlags, positiveSigns, checklist);

  return {
    riskLevel,
    redFlags,
    positiveSigns,
    nextSteps,
    isSuccessful: true,
    message: 'Analysis Successful',
  };
}