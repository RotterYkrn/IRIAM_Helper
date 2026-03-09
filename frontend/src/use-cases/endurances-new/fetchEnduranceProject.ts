import { Effect, pipe, Schema } from "effect";

import { EnduranceProjectDtoSchema } from "@/domain/endurances-new/dto/EnduranceProjectDto";
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
                    .from("projects")
                    .select(
                        `
                            id,
                            type,
                            title,
                            status,
                            unit:endurance_units (
                                id,
                                target_count,
                                current_count
                            ),
                            action_count:endurance_action_counts (
                                normal_count,
                                rescue_count,
                                sabotage_count
                            )
                        `,
                    )
                    .eq("id", id)
                    .eq("type", "endurance") // ViewのWHERE句の内容
                    .single(),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(Schema.decodeEither(EnduranceProjectDtoSchema)),
    );
