import { Chunk, Effect, pipe, Schema } from "effect";

import { ProjectForSideBerSchema } from "@/domain/projects/tables/Project";
import { supabase } from "@/lib/supabase";

export const fetchProjectsByStatus = () =>
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
        Effect.flatMap(
            Schema.decodeEither(Schema.Chunk(ProjectForSideBerSchema)),
        ),
        Effect.map((projects) => {
            return {
                scheduled:
                    Chunk.filter(projects, (p) => p.status === "scheduled") ??
                    [],
                active:
                    Chunk.filter(projects, (p) => p.status === "active") ?? [],
                finished:
                    Chunk.filter(projects, (p) => p.status === "finished") ??
                    [],
            };
        }),
    );
