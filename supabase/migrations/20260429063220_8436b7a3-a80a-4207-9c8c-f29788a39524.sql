ALTER TABLE public.newsletter_signups
ADD CONSTRAINT newsletter_signups_email_valid
CHECK (
  char_length(email) <= 255
  AND email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
);

ALTER TABLE public.newsletter_signups
ADD CONSTRAINT newsletter_signups_fatherhood_stage_valid
CHECK (
  fatherhood_stage IN ('thinking_about_it', 'just_found_out', 'pregnancy_months', 'newborn', 'baby_months')
);

ALTER TABLE public.newsletter_signups
ADD CONSTRAINT newsletter_signups_source_valid
CHECK (
  char_length(source) <= 64
  AND source IN ('landing_page', 'pro_page')
);