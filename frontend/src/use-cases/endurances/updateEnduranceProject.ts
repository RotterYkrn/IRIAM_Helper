import { Schema, Effect, pipe } from "effect";

import {
    type UpdateEnduranceProjectArgs,
    UpdateEnduranceProjectArgsSchema,
    UpdateEnduranceProjectReturnsSchema,
} from "@/domain/endurances/rpcs/UpdateEnduranceProject";
import { type ProjectId } from "@/domain/projects/tables/Project";
import { supabase } from "@/lib/supabase";

/**
 * 耐久企画（単体）の設定を更新します。
 * @param args rpcに渡す引数
 * @returns 更新した企画のID
 */
export const updateEnduranceProject = (
    args: UpdateEnduranceProjectArgs,
): Effect.Effect<ProjectId, unknown> =>
    pipe(
        Effect.tryPromise({
            try: () =>
                supabase.rpc(
                    "update_endurance_project_new",
                    // 要求される型に readonly がついておらず渡すことができないため、
                    // encodeSync を通したうえで any を使っています。
                    Schema.encodeSync(UpdateEnduranceProjectArgsSchema)(
                        args,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ) as any,
                ),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(
            Schema.decodeUnknownEither(UpdateEnduranceProjectReturnsSchema),
        ),
    );
