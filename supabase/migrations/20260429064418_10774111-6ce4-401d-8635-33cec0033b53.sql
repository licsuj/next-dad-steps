CREATE TABLE IF NOT EXISTS public.subscription_cancellation_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  reason text,
  status text NOT NULL DEFAULT 'requested',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT subscription_cancellation_reason_length CHECK (reason IS NULL OR char_length(reason) <= 500),
  CONSTRAINT subscription_cancellation_status_valid CHECK (status IN ('requested', 'processing', 'completed'))
);

ALTER TABLE public.subscription_cancellation_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cancellation requests"
ON public.subscription_cancellation_requests
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can request their own cancellation"
ON public.subscription_cancellation_requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND status = 'requested');

CREATE INDEX IF NOT EXISTS idx_subscription_cancellation_requests_user_id_created_at
ON public.subscription_cancellation_requests (user_id, created_at DESC);