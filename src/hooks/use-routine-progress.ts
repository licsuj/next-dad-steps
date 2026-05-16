import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export type ProgressKey = string; // `${routineKey}::${stepKey}`

export const slugify = (input: string) =>
  input.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

export const makeKey = (routineKey: string, stepKey: string): ProgressKey => `${routineKey}::${stepKey}`;

type Row = {
  stage: string;
  week_number: number;
  routine_key: string;
  step_key: string;
  step_label: string;
  completed_at: string;
};

export const useRoutineProgress = (userId: string | null, stage: string | null, enabled: boolean) => {
  const [rows, setRows] = useState<Row[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [busyKey, setBusyKey] = useState<ProgressKey | null>(null);

  useEffect(() => {
    if (!enabled || !userId || !stage) {
      setRows([]);
      return;
    }
    let active = true;
    setIsLoading(true);
    (supabase as any)
      .from("user_routine_progress")
      .select("stage,week_number,routine_key,step_key,step_label,completed_at")
      .eq("user_id", userId)
      .eq("stage", stage)
      .then(({ data, error }: { data: Row[] | null; error: { message: string } | null }) => {
        if (!active) return;
        if (error) toast.error("Could not load your progress.");
        setRows(data ?? []);
        setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [userId, stage, enabled]);

  const completedSet = new Set(rows.map((r) => makeKey(r.routine_key, r.step_key)));

  const toggle = useCallback(
    async (params: { weekNumber: number; routineKey: string; stepKey: string; stepLabel: string }) => {
      if (!userId || !stage) return;
      const key = makeKey(params.routineKey, params.stepKey);
      setBusyKey(key);
      const isDone = completedSet.has(key);
      if (isDone) {
        const { error } = await (supabase as any)
          .from("user_routine_progress")
          .delete()
          .eq("user_id", userId)
          .eq("stage", stage)
          .eq("routine_key", params.routineKey)
          .eq("step_key", params.stepKey);
        if (error) toast.error("Could not update progress.");
        else setRows((prev) => prev.filter((r) => !(r.routine_key === params.routineKey && r.step_key === params.stepKey)));
      } else {
        const { error } = await (supabase as any).from("user_routine_progress").insert({
          user_id: userId,
          stage,
          week_number: params.weekNumber,
          routine_key: params.routineKey,
          step_key: params.stepKey,
          step_label: params.stepLabel,
        });
        if (error && error.code !== "23505") toast.error("Could not save progress.");
        else
          setRows((prev) => [
            ...prev,
            {
              stage,
              week_number: params.weekNumber,
              routine_key: params.routineKey,
              step_key: params.stepKey,
              step_label: params.stepLabel,
              completed_at: new Date().toISOString(),
            },
          ]);
      }
      setBusyKey(null);
    },
    [userId, stage, completedSet],
  );

  return { rows, completedSet, isLoading, busyKey, toggle };
};
