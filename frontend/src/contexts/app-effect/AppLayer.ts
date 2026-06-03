import { Layer } from "effect";

import { EnduranceSupabase } from "@/repositories/endurances/endurance.supabase";
import { EnterEnduranceSupabase } from "@/repositories/enter-endurances/enter-endurance.supabase";
import { MultiEnduranceSupabase } from "@/repositories/multi-endurances/multi-endurance.supabase";
import { ProjectSupabase } from "@/repositories/projects/project.supabase";

export const AppLayer = Layer.mergeAll(
    ProjectSupabase,
    EnduranceSupabase,
    MultiEnduranceSupabase,
    EnterEnduranceSupabase,
);
