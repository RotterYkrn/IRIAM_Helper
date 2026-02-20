import { pipe, Schema, Effect } from "effect";

import { EnduranceActionStatsViewNewSchema } from "@/domain/endurances-new/views/EnduranceActionStatsViewNew";
import {
    type ProjectIdEncoded,
    ProjectIdSchema,
} from "@/domain/projects/tables/Project";
import { supabase } from "@/lib/supabase";

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
