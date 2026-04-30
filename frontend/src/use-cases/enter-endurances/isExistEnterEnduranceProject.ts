import { pipe, Effect, Schema, Option } from "effect";

import { ProjectIdSchema } from "@/domain/projects/tables/Project";
import { supabase } from "@/lib/supabase";

export const isExistEnterEnduranceProjects = () =>
    pipe(
        Effect.tryPromise({
            try: () =>
                supabase
                    .from("projects")
                    .select("id")
                    .eq("type", "enter-endurance")
                    .maybeSingle(),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap((data) =>
            data
                ? pipe(
                      data.id,
                      Schema.decodeEither(ProjectIdSchema),
                      Effect.map(Option.some),
                  )
                : Effect.succeed(Option.none()),
        ),
    );
