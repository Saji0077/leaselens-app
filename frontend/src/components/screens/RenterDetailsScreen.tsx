// Screen 2: Renter Details Screen for LeaseLens

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../Layout/AppLayout';
import { StepIndicator } from '../Progress/StepIndicator';
import { Button } from '../common/Button';
import { Select } from '../common/Select';
import { useApp } from '../../context/AppContext';
import type { UserType, AustralianState, UrgencyLevel } from '../../utils/types';

// Dropdown options
const userTypeOptions = [
  { value: 'student', label: 'Student' },
  { value: 'first-time-renter', label: 'First-time renter' },
  { value: 'international-student', label: 'International student' },
  { value: 'young-professional', label: 'Young professional' },
];

const stateOptions = [
  { value: 'VIC', label: 'Victoria (VIC)' },
  { value: 'NSW', label: 'New South Wales (NSW)' },
  { value: 'QLD', label: 'Queensland (QLD)' },
  { value: 'SA', label: 'South Australia (SA)' },
  { value: 'WA', label: 'Western Australia (WA)' },
  { value: 'TAS', label: 'Tasmania (TAS)' },
  { value: 'ACT', label: 'Australian Capital Territory (ACT)' },
  { value: 'NT', label: 'Northern Territory (NT)' },
];

const urgencyOptions = [
  { value: 'low', label: 'Low - Just exploring options' },
  { value: 'medium', label: 'Medium - Moving within 1-2 months' },
  { value: 'high', label: 'High - Need to move soon' },
];

export function RenterDetailsScreen() {
  const navigate = useNavigate();
  const { state, updateRenterDetails } = useApp();
  const { renterDetails } = state;

  // Local form state
  const [userType, setUserType] = useState<UserType | ''>(renterDetails.userType);
  const [selectedState, setSelectedState] = useState<AustralianState | ''>(renterDetails.state);
  const [urgency, setUrgency] = useState<UrgencyLevel | ''>(renterDetails.urgency);

  // Validation errors
  const [errors, setErrors] = useState<{
    userType?: string;
    state?: string;
    urgency?: string;
  }>({});

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!userType) {
      newErrors.userType = 'Please select your renter type';
    }
    if (!selectedState) {
      newErrors.state = 'Please select your state';
    }
    if (!urgency) {
      newErrors.urgency = 'Please select your rental urgency';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle continue
  const handleContinue = () => {
    if (!validateForm()) return;

    // Save to context
    updateRenterDetails({
      userType,
      state: selectedState,
      urgency,
    });

    // Navigate to next screen
    navigate('/rental-input');
  };

  // Check if form is complete
  const isFormComplete = userType && selectedState && urgency;

  return (
    <AppLayout>
      <StepIndicator currentStep={1} totalSteps={4} />

      {/* Page title */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Tell us about yourself
        </h2>
        <p className="text-gray-600">
          This helps us provide more relevant risk assessment for your situation.
        </p>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 mb-6">
        <div className="space-y-6">
          {/* User type dropdown */}
          <Select
            label="What best describes you?"
            options={userTypeOptions}
            value={userType}
            onChange={(value) => setUserType(value as UserType)}
            placeholder="Select your renter type"
            error={errors.userType}
          />

          {/* State dropdown */}
          <Select
            label="Which Australian state are you looking to rent in?"
            options={stateOptions}
            value={selectedState}
            onChange={(value) => setSelectedState(value as AustralianState)}
            placeholder="Select a state"
            error={errors.state}
          />

          {/* Urgency dropdown */}
          <Select
            label="How urgent is your rental search?"
            options={urgencyOptions}
            value={urgency}
            onChange={(value) => setUrgency(value as UrgencyLevel)}
            placeholder="Select urgency level"
            error={errors.urgency}
          />
        </div>

        {/* Info box */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-purple-800 mb-1">
                Why we ask this
              </p>
              <p className="text-sm text-purple-700 leading-relaxed">
                Different renter types face different risks. Students and international renters may encounter specific scams targeting their demographic.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center pb-20">
        <Button
          variant="secondary"
          onClick={() => navigate('/')}
        >
          Back
        </Button>
        
        <Button
          onClick={handleContinue}
          disabled={!isFormComplete}
        >
          Continue
        </Button>
      </div>
    </AppLayout>
  );
}