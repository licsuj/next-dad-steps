CREATE TABLE public.newsletter_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  fatherhood_stage TEXT NOT NULL DEFAULT 'not_sure',
  source TEXT NOT NULL DEFAULT 'landing_page',
  pro_interest BOOLEAN NOT NULL DEFAULT true,
  onboarding_sequence TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX newsletter_signups_email_lower_idx
ON public.newsletter_signups (lower(email));

CREATE INDEX newsletter_signups_stage_idx
ON public.newsletter_signups (fatherhood_stage);

ALTER TABLE public.newsletter_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visitors can join the newsletter"
ON public.newsletter_signups
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(trim(email)) BETWEEN 3 AND 255
  AND email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  AND fatherhood_stage IN (
    'just_found_out',
    'pregnancy_1_3',
    'pregnancy_4_6',
    'pregnancy_7_9',
    'birth_week',
    'newborn_0_3',
    'baby_3_6',
    'baby_6_12',
    'not_sure'
  )
  AND source IN ('landing_page', 'pro_preview', 'newsletter_section')
);