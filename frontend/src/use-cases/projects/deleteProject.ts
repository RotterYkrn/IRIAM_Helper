import { Effect, pipe, Schema } from "effect";

import {
    DeleteProjectArgsSchema,
    type DeleteProjectArgsEncoded,
} from "@/domain/projects/rpcs/DeleteProject";
import { supabase } from "@/lib/supabase";

/**
 * 企画を削除します。
 * @param args rpcに渡す引数
 */
export const deleteProject = (args: DeleteProjectArgsEncoded) =>
    pipe(
        args,
        Schema.decodeEither(DeleteProjectArgsSchema),
        Effect.tryMapPromise({
            try: (args) =>
                supabase.rpc(
                    "delete_project",
                    Schema.encodeSync(DeleteProjectArgsSchema)(args),
                ),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(Schema.decodeUnknownEither(Schema.Void)),
    );
