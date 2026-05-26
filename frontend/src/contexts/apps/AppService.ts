import { Effect, Layer, Runtime } from "effect";

import { ProjectSupabase } from "@/repositories/projects/project.supabase";

const AppLayer = Layer.mergeAll(ProjectSupabase);

export type AppService =
    typeof AppLayer extends Layer.Layer<infer R> ? R : never;

const runtime = Effect.runSync(Layer.toRuntime(AppLayer).pipe(Effect.scoped));

export const AppEffect = {
    runPromiseExit: <A, E>(effect: Effect.Effect<A, E, AppService>) =>
        Runtime.runPromiseExit(runtime)(effect),
};
