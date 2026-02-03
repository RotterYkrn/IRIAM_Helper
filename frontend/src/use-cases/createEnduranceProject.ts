import { Effect, pipe, Schema } from "effect";

import {
    CreateEnduranceProjectArgsSchema,
    CreateEnduranceProjectReturnsSchema,
    type CreateEnduranceProjectArgsEncoded,
} from "@/domain/endurances/rpcs/CreateEnduranceProject";
import { supabase } from "@/lib/supabase";

export const createEnduranceProject = (
    args: CreateEnduranceProjectArgsEncoded,
) =>
    pipe(
        args,
        Schema.decodeEither(CreateEnduranceProjectArgsSchema),
        Effect.tryMapPromise({
            try: (args) =>
                supabase.rpc(
                    "create_endurance_project",
                    Schema.encodeSync(CreateEnduranceProjectArgsSchema)(args),
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
