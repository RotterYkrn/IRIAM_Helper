import { Effect, pipe, Schema } from "effect";

import {
    CreateEnduranceProjectArgsSchema,
    CreateEnduranceProjectReturnsSchema,
    type CreateEnduranceProjectArgs,
} from "@/domain/endurances/rpcs/CreateEnduranceProject";
import { supabase } from "@/lib/supabase";

export const createEnduranceProject = (args: CreateEnduranceProjectArgs) =>
    pipe(
        Effect.tryPromise({
            try: () =>
                supabase.rpc(
                    "create_endurance_project",
                    Schema.encodeSync(CreateEnduranceProjectArgsSchema)(
                        args,
                    ) as any,
                ),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(
            Schema.decodeUnknownEither(CreateEnduranceProjectReturnsSchema),
        ),
    );
