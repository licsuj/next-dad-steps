DROP POLICY IF EXISTS "Visitors can join the newsletter" ON public.newsletter_signups;

CREATE POLICY "Visitors can join the newsletter"
ON public.newsletter_signups
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(trim(email)) BETWEEN 3 AND 255
  AND email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  AND fatherhood_stage IN (
    'just_found_out',
    'pregnancy_months',
    'newborn',
    'baby_months',
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