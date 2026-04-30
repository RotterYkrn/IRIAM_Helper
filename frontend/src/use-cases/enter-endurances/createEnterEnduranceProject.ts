import { pipe, Effect, Schema } from "effect";

import { CreateEnterEnduranceResultSchema } from "@/domain/enter_endurances/rpcs/CreateEnterEndurance";
import { supabase } from "@/lib/supabase";

export const createEnterEnduranceProject = () =>
    pipe(
        Effect.tryPromise({
            try: () => supabase.rpc("create_enter_endurance_project"),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(Schema.decodeEither(CreateEnterEnduranceResultSchema)),
    );
