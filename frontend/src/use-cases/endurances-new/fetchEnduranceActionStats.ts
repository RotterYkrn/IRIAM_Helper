import { pipe, Schema, Effect } from "effect";

import { EnduranceActionStatsViewNewSchema } from "@/domain/endurances-new/views/EnduranceActionStatsViewNew";
import {
    type ProjectIdEncoded,
    ProjectIdSchema,
} from "@/domain/projects/tables/Project";
import { supabase } from "@/lib/supabase";

/**
 * 耐久企画（単体）の、救済・妨害の各要素の状態を取得する
 * @param projectId 企画ID
 * @returns 救済・妨害の各要素の状態
 */
export const fetchEnduranceActionStatsNew = (projectId: ProjectIdEncoded) =>
    pipe(
        projectId,
        Schema.decodeEither(ProjectIdSchema),
        Effect.tryMapPromise({
            try: (id) =>
                supabase
                    .from("endurance_action_stats_view_new")
                    .select("*")
                    .eq("project_id", id)
                    .single(),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(
            Schema.decodeUnknownEither(EnduranceActionStatsViewNewSchema),
        ),
    );
