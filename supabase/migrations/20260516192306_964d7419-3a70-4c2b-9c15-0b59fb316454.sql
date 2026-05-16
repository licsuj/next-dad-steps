
CREATE TABLE public.user_routine_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  stage text NOT NULL,
  week_number int NOT NULL,
  routine_key text NOT NULL,
  step_key text NOT NULL,
  step_label text NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, stage, routine_key, step_key)
);

ALTER TABLE public.user_routine_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own routine progress"
  ON public.user_routine_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own routine progress"
  ON public.user_routine_progress FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own routine progress"
  ON public.user_routine_progress FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own routine progress"
  ON public.user_routine_progress FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_user_routine_progress_user_stage
  ON public.user_routine_progress (user_id, stage);

CREATE TRIGGER update_user_routine_progress_updated_at
  BEFORE UPDATE ON public.user_routine_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
