ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS current_fatherhood_stage text NOT NULL DEFAULT 'thinking_about_it';

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_current_fatherhood_stage_valid
CHECK (current_fatherhood_stage IN ('thinking_about_it', 'just_found_out', 'pregnancy_months', 'newborn', 'baby_months'));