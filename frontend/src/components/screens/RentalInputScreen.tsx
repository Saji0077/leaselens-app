// Screen 3: Rental Content Input Screen for LeaseLens

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../Layout/AppLayout';
import { StepIndicator } from '../Progress/StepIndicator';
import { Button } from '../common/Button';
import { TextArea } from '../common/TextArea';
import { useApp } from '../../context/AppContext';
import type { ContentType } from '../../utils/types';

// Input method options
type InputMethod = 'paste' | 'upload' | 'guided';

export function RentalInputScreen() {
  const navigate = useNavigate();
  const { state, updateRentalContent } = useApp();
  const { rentalContent } = state;

  // Local form state
  const [inputMethod, setInputMethod] = useState<InputMethod | ''>('');
  const [text, setText] = useState(rentalContent.text);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [guidedAnswers, setGuidedAnswers] = useState({
    rentAmount: '',
    bondAmount: '',
    utilitiesIncluded: '',
    leaseTerm: '',
    breakLeaseFee: '',
  });

  // Validation errors
  const [errors, setErrors] = useState<{
    inputMethod?: string;
    text?: string;
    file?: string;
    guided?: string;
  }>({});

  // Consent state
  const [consentGiven, setConsentGiven] = useState(false);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!inputMethod) {
      newErrors.inputMethod = 'Please select an input method';
    }

    if (inputMethod === 'paste') {
      if (!text.trim()) {
        newErrors.text = 'Please paste some rental content to analyze';
      } else if (text.trim().split(/\s+/).length < 5) {
        newErrors.text = 'Please provide more text for a meaningful analysis';
      }
    }

    if (inputMethod === 'upload' && !uploadedFile) {
      newErrors.file = 'Please upload a document';
    }

    if (inputMethod === 'guided') {
      const filledFields = Object.values(guidedAnswers).filter(v => v.trim()).length;
      if (filledFields < 3) {
        newErrors.guided = 'Please fill in at least 3 fields for a meaningful analysis';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle continue
  const handleContinue = () => {
    if (!validateForm() || !consentGiven) return;

    let contentText = '';
    let contentType: ContentType = 'rental-listing';

    if (inputMethod === 'paste') {
      contentText = text.trim();
      contentType = 'rental-listing';
    } else if (inputMethod === 'upload') {
      contentText = `Uploaded document: ${uploadedFile?.name}. This is a demo upload - in a real app, the document would be processed here.`;
      contentType = 'lease-clause';
    } else if (inputMethod === 'guided') {
      contentText = `Rental Details:\nRent: ${guidedAnswers.rentAmount}\nBond: ${guidedAnswers.bondAmount}\nUtilities: ${guidedAnswers.utilitiesIncluded}\nLease Term: ${guidedAnswers.leaseTerm}\nBreak Lease Fee: ${guidedAnswers.breakLeaseFee}`;
      contentType = 'agreement-summary';
    }

    // Save to context
    updateRentalContent({
      contentType,
      text: contentText,
    });

    // Navigate to next screen
    navigate('/checklist');
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  // Check if form is complete
  const isFormComplete = inputMethod && consentGiven && (
    (inputMethod === 'paste' && text.trim().length > 0) ||
    (inputMethod === 'upload' && uploadedFile) ||
    (inputMethod === 'guided' && Object.values(guidedAnswers).filter(v => v.trim()).length >= 3)
  );

  return (
    <AppLayout>
      <StepIndicator currentStep={2} totalSteps={4} />

      {/* Page title */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          How would you like to check your rental?
        </h2>
        <p className="text-gray-600">
          Choose your preferred method to input rental information for analysis.
        </p>
      </div>

      {/* Input method selection cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Paste Rental Listing */}
        <button
          onClick={() => setInputMethod('paste')}
          className={`p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
            inputMethod === 'paste'
              ? 'border-purple-500 bg-purple-50 shadow-lg'
              : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
          }`}
        >
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Paste Rental Listing</h3>
          <p className="text-sm text-gray-600">Copy and paste text from a rental listing or lease document</p>
        </button>

        {/* Upload Lease Document */}
        <button
          onClick={() => setInputMethod('upload')}
          className={`p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
            inputMethod === 'upload'
              ? 'border-purple-500 bg-purple-50 shadow-lg'
              : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
          }`}
        >
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Upload Lease Document</h3>
          <p className="text-sm text-gray-600">Upload a PDF or image of your lease agreement</p>
        </button>

        {/* Quick Guided Check */}
        <button
          onClick={() => setInputMethod('guided')}
          className={`p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
            inputMethod === 'guided'
              ? 'border-purple-500 bg-purple-50 shadow-lg'
              : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
          }`}
        >
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Quick Guided Check</h3>
          <p className="text-sm text-gray-600">Answer a few questions about your rental details</p>
        </button>
      </div>

      {/* Input method error */}
      {errors.inputMethod && (
        <p className="text-red-500 text-sm mb-4">{errors.inputMethod}</p>
      )}

      {/* Conditional content based on selected method */}
      {inputMethod === 'paste' && (
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 mb-6">
          <TextArea
            label="Rental content"
            placeholder="Paste your rental listing or lease text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            error={errors.text}
            helperText="Paste only the relevant rental text. Avoid entering unnecessary personal information."
          />

          {/* Character count */}
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>{text.length} characters</span>
            <span>{text.trim().split(/\s+/).filter(w => w.length > 0).length} words</span>
          </div>

          {/* Example text */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Example listing text:</h3>
            <p className="text-sm text-gray-600 italic">
              "Modern 2-bedroom apartment in Melbourne CBD. Rent: $450/week. Bond: $1800. 
              Water included, tenant pays electricity and gas. 12-month lease. 
              Break lease fee: 2 weeks rent. Contact agent for inspection."
            </p>
          </div>
        </div>
      )}

      {inputMethod === 'upload' && (
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 mb-6">
          <div className="text-center">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-purple-400 transition-colors">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  {uploadedFile ? uploadedFile.name : 'Click to upload document'}
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF, JPG, PNG (Demo mode - file not actually processed)
                </p>
              </label>
            </div>
            {errors.file && (
              <p className="text-red-500 text-sm mt-2">{errors.file}</p>
            )}
          </div>
        </div>
      )}

      {inputMethod === 'guided' && (
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Rental Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Weekly Rent Amount
              </label>
              <input
                type="text"
                value={guidedAnswers.rentAmount}
                onChange={(e) => setGuidedAnswers(prev => ({ ...prev, rentAmount: e.target.value }))}
                placeholder="e.g., $450/week"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 hover:bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bond Amount
              </label>
              <input
                type="text"
                value={guidedAnswers.bondAmount}
                onChange={(e) => setGuidedAnswers(prev => ({ ...prev, bondAmount: e.target.value }))}
                placeholder="e.g., $1800"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 hover:bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Utilities Included
              </label>
              <input
                type="text"
                value={guidedAnswers.utilitiesIncluded}
                onChange={(e) => setGuidedAnswers(prev => ({ ...prev, utilitiesIncluded: e.target.value }))}
                placeholder="e.g., Water included, tenant pays electricity"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 hover:bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Lease Term
              </label>
              <input
                type="text"
                value={guidedAnswers.leaseTerm}
                onChange={(e) => setGuidedAnswers(prev => ({ ...prev, leaseTerm: e.target.value }))}
                placeholder="e.g., 12 months"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 hover:bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Break Lease Fee
              </label>
              <input
                type="text"
                value={guidedAnswers.breakLeaseFee}
                onChange={(e) => setGuidedAnswers(prev => ({ ...prev, breakLeaseFee: e.target.value }))}
                placeholder="e.g., 2 weeks rent"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 hover:bg-white"
              />
            </div>
          </div>

          {errors.guided && (
            <p className="text-red-500 text-sm mt-4">{errors.guided}</p>
          )}
        </div>
      )}

      {/* Privacy and consent */}
      {inputMethod && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
          <div className="p-4 bg-blue-50 rounded-xl">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="consent"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="consent" className="text-sm text-blue-700 cursor-pointer">
                <span className="font-medium">I understand and consent:</span>
                <ul className="mt-2 space-y-1 list-disc list-inside text-blue-600">
                  <li>This is an automated risk scan based on common rental red flags</li>
                  <li>The analysis is not legal advice</li>
                  <li>I have not included unnecessary personal details</li>
                </ul>
              </label>
            </div>
          </div>

          {/* Data minimization guidance */}
          <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-yellow-800 mb-1">
                  Data Minimisation
                </p>
                <p className="text-sm text-yellow-700 leading-relaxed">
                  Please remove any personal information (names, phone numbers, addresses) before pasting. Only include the rental terms and conditions.
                </p>
              </div>
            </div>
          </div>

          {/* Transparency notice */}
          <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  How this works
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Our system scans for common red flag keywords and phrases found in rental scams. It checks for missing important terms and combines this with your checklist answers to assess risk.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between items-center pb-20">
        <Button
          variant="secondary"
          onClick={() => navigate('/renter-details')}
        >
          Back
        </Button>
        
        <Button
          onClick={handleContinue}
          disabled={!isFormComplete}
        >
          Continue to Checklist
        </Button>
      </div>
    </AppLayout>
  );
}
