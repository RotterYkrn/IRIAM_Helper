import { Effect, pipe, Schema } from "effect";

import { ProjectDtoSchema } from "@/domain/projects/dto/ProjectDto";
import { supabase } from "@/lib/supabase";

/**
 * 企画群を取得します。
 *
 * @returns 企画群
 */
export const fetchProjects = () =>
    pipe(
        Effect.tryPromise({
            try: () =>
                supabase
                    .from("projects")
                    .select("id, title, type, status")
                    .order("created_at", { ascending: false }),
            catch: (error) => error,
        }),
        Effect.flatMap(({ data, error }) =>
            error ? Effect.fail(error) : Effect.succeed(data),
        ),
        Effect.flatMap(Schema.decodeEither(Schema.Chunk(ProjectDtoSchema))),
    );
