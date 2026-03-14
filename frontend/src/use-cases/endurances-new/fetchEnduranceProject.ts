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
 * @returns 耐久企画（単体）の情報
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
                            ),
                            all_actions:endurance_actions_new (
                                id,
                                type,
                                position,
                                label,
                                amount,
                                count
                            )
                        `,
                    )
                    .eq("id", id)
                    .eq("type", "endurance")
                    .order("position", {
                        referencedTable: "endurance_actions_new",
                        ascending: true,
                    })
                    .single(),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.map((project) => ({
            ...project,
            rescue_actions: project.all_actions.filter(
                (a) => a.type === "rescue",
            ),
            sabotage_actions: project.all_actions.filter(
                (a) => a.type === "sabotage",
            ),
        })),
        Effect.flatMap(Schema.decodeEither(EnduranceProjectDtoSchema)),
    );
