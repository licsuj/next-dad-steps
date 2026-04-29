DROP POLICY IF EXISTS "Visitors can join the newsletter" ON public.newsletter_signups;

CREATE POLICY "Visitors can join the newsletter"
ON public.newsletter_signups
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(trim(email)) >= 3
  AND length(trim(email)) <= 255
  AND email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  AND fatherhood_stage = ANY (ARRAY[
    'thinking_about_it',
    'just_found_out',
    'pregnancy_months',
    'newborn',
    'baby_months',
    'not_sure',
    'pregnancy_1_3',
    'pregnancy_4_6',
    'pregnancy_7_9',
    'birth_week',
    'newborn_0_3',
    'baby_3_6',
    'baby_6_12'
  ])
  AND source = ANY (ARRAY[
    'landing_page',
    'pro_page',
    'pro_preview',
    'newsletter_section'
  ])
);