import { pipe, Effect, Schema } from "effect";

import {
    CreateEnterUnitArgsSchema,
    CreateEnterUnitReturnsSchema,
    type CreateEnterUnitArgs,
} from "@/domain/enter_endurances/rpcs/CreateEnterUnit";
import { supabase } from "@/lib/supabase";

export const createEnterUnit = (args: CreateEnterUnitArgs) =>
    pipe(
        Effect.tryPromise({
            try: () =>
                supabase.rpc(
                    "create_enter_unit",
                    Schema.encodeSync(CreateEnterUnitArgsSchema)(args),
                ),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(Schema.decodeEither(CreateEnterUnitReturnsSchema)),
    );
