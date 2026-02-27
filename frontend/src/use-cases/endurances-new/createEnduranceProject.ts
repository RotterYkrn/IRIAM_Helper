import { Effect, pipe, Schema } from "effect";

import {
    type CreateEnduranceProjectNewArgs,
    CreateEnduranceProjectNewArgsSchema,
    CreateEnduranceProjectNewReturnsSchema,
} from "@/domain/endurances-new/rpcs/CreateEnduranceProjectNew";
import { supabase } from "@/lib/supabase";

/**
 * 耐久企画（単体）を新規作成します。
 * @param args rpcに渡す引数
 * @returns 新規作成した企画のID
 */
export const createEnduranceProjectNew = (
    args: CreateEnduranceProjectNewArgs,
) =>
    pipe(
        Effect.tryPromise({
            try: () =>
                supabase.rpc(
                    "create_endurance_project_new",
                    Schema.encodeSync(CreateEnduranceProjectNewArgsSchema)(
                        args,
                    ) as any,
                ),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(
            Schema.decodeUnknownEither(CreateEnduranceProjectNewReturnsSchema),
        ),
    );
