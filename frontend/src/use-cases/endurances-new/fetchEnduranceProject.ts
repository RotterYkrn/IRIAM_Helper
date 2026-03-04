import { Effect, pipe, Schema } from "effect";

import { EnduranceProjectViewNewSchema } from "@/domain/endurances-new/views/EnduranceProjectViewNew";
import {
    ProjectIdSchema,
    type ProjectIdEncoded,
} from "@/domain/projects/tables/Project";
import { supabase } from "@/lib/supabase";

/**
 * 耐久企画（単体）の基本情報を取得する
 * @param projectId 企画ID
 * @returns 耐久企画（単体）の基本情報
 */
export const fetchEnduranceProjectNew = (projectId: ProjectIdEncoded) =>
    pipe(
        projectId,
        Schema.decodeEither(ProjectIdSchema),
        Effect.tryMapPromise({
            try: (id) =>
                supabase
                    .from("endurance_project_view_new")
                    .select("*")
                    .eq("id", id)
                    .single(),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(
            Schema.decodeUnknownEither(EnduranceProjectViewNewSchema),
        ),
    );
