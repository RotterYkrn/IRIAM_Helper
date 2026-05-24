import { Layer } from "effect";

import { ProjectSupabase } from "@/repositories/projects/project.supabase";

export const AppLayer = Layer.mergeAll(ProjectSupabase);

export type AppService =
    typeof AppLayer extends Layer.Layer<infer R> ? R : never;
