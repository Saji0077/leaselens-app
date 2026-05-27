-- LeaseLens Database Schema
-- This file contains all SQL commands for setting up the database for rental risk assessment

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create loan_applications table (stores rental submission data)
-- The id field references auth.users(id) to link with Supabase Auth
CREATE TABLE IF NOT EXISTS loan_applications (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    email_address TEXT,
    phone_number TEXT,
    loan_amount DECIMAL(12, 2),
    loan_term INTEGER,
    loan_purpose TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_loan_applications_email ON loan_applications(email_address);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update updated_at on loan_applications updates
DROP TRIGGER IF EXISTS update_loan_applications_updated_at ON loan_applications;
CREATE TRIGGER update_loan_applications_updated_at
    BEFORE UPDATE ON loan_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create a function to handle new user sign-ups
-- This function creates a new row in loan_applications when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.loan_applications (id, email_address)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create loan_applications row on user sign-up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Enable Row Level Security (RLS) on loan_applications
ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only read their own loan application
DROP POLICY IF EXISTS "Users can view own loan application" ON loan_applications;
CREATE POLICY "Users can view own loan application"
    ON loan_applications FOR SELECT
    USING (auth.uid() = id);

-- Create policy: Users can update their own loan application
DROP POLICY IF EXISTS "Users can update own loan application" ON loan_applications;
CREATE POLICY "Users can update own loan application"
    ON loan_applications FOR UPDATE
    USING (auth.uid() = id);

-- Create policy: Users can insert their own loan application (if needed manually)
DROP POLICY IF EXISTS "Users can insert own loan application" ON loan_applications;
CREATE POLICY "Users can insert own loan application"
    ON loan_applications FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Create rental_submissions table (stores rental assessment data)
CREATE TABLE IF NOT EXISTS rental_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_type TEXT,
    state TEXT,
    urgency TEXT,
    rental_method TEXT,
    rental_content TEXT,
    risk_level TEXT,
    red_flags TEXT[],
    positive_signs TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create an index on created_at for faster lookups
CREATE INDEX IF NOT EXISTS idx_rental_submissions_created_at ON rental_submissions(created_at);

-- Create an index on risk_level for filtering
CREATE INDEX IF NOT EXISTS idx_rental_submissions_risk_level ON rental_submissions(risk_level);

-- Enable Row Level Security (RLS) on rental_submissions
ALTER TABLE rental_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy: Allow anonymous read access to rental_submissions
CREATE POLICY "Allow anonymous read access to rental_submissions"
    ON rental_submissions FOR SELECT
    USING (true);

-- Create policy: Allow anonymous insert access to rental_submissions
CREATE POLICY "Allow anonymous insert access to rental_submissions"
    ON rental_submissions FOR INSERT
    WITH CHECK (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON loan_applications TO anon, authenticated;
GRANT ALL ON rental_submissions TO anon, authenticated;
