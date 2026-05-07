import { pipe, Effect, Schema } from "effect";

import {
    type ActivateEnterUnitArgs,
    ActivateEnterUnitArgsSchema,
    ActivateEnterUnitReturnsSchema,
} from "@/domain/enter_endurances/rpcs/ActivateEnterUnit";
import { supabase } from "@/lib/supabase";

export const activateEnterUnit = (args: ActivateEnterUnitArgs) =>
    pipe(
        Effect.tryPromise({
            try: () =>
                supabase.rpc(
                    "activate_enter_unit",
                    Schema.encodeSync(ActivateEnterUnitArgsSchema)(args),
                ),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(Schema.decodeEither(ActivateEnterUnitReturnsSchema)),
    );
