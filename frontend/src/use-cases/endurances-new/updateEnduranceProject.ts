import { Schema, Effect, pipe } from "effect";

import {
    type UpdateEnduranceProjectNewArgs,
    UpdateEnduranceProjectNewArgsSchema,
    UpdateEnduranceProjectNewReturnsSchema,
} from "@/domain/endurances-new/rpcs/UpdateEnduranceProjectNew";
import { type ProjectId } from "@/domain/projects/tables/Project";
import { supabase } from "@/lib/supabase";

/**
 * 耐久企画（単体）の設定を更新します。
 * @param args rpcに渡す引数
 * @returns 更新した企画のID
 */
export const updateEnduranceProjectNew = (
    args: UpdateEnduranceProjectNewArgs,
): Effect.Effect<ProjectId, unknown> =>
    pipe(
        Effect.tryPromise({
            try: () =>
                supabase.rpc(
                    "update_endurance_project_new",
                    Schema.encodeSync(UpdateEnduranceProjectNewArgsSchema)(
                        args,
                    ) as any,
                ),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(
            Schema.decodeUnknownEither(UpdateEnduranceProjectNewReturnsSchema),
        ),
    );
