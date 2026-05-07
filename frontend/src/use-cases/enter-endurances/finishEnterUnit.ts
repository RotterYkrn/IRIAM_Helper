import { pipe, Effect, Schema } from "effect";

import {
    type FinishEnterUnitArgs,
    FinishEnterUnitArgsSchema,
    FinishEnterUnitReturnsSchema,
} from "@/domain/enter_endurances/rpcs/FinishEnterUnit";
import { supabase } from "@/lib/supabase";

export const finishEnterUnit = (args: FinishEnterUnitArgs) =>
    pipe(
        Effect.tryPromise({
            try: () =>
                supabase.rpc(
                    "finish_enter_unit",
                    Schema.encodeSync(FinishEnterUnitArgsSchema)(args),
                ),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(Schema.decodeEither(FinishEnterUnitReturnsSchema)),
    );
