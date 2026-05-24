import { queryOptions } from "@tanstack/react-query";
import { Effect } from "effect";
import { Chunk } from "effect";

import { ProjectKey } from "../query-keys/projects";

import type { ProjectRepository } from "@/repositories/projects/project.repository";
import { fetchProjects } from "@/use-cases/projects/fetchProjects";

export const fetchProjectListOptions = (
    runPromise: <A, E>(
        effect: Effect.Effect<A, E, ProjectRepository>,
    ) => Promise<A>,
) => {
    return queryOptions({
        queryKey: ProjectKey.list,
        queryFn: async () => {
            try {
                return await runPromise(
                    fetchProjects().pipe(
                        Effect.map(
                            Chunk.filter((p) => p.type !== "enter-endurance"),
                        ),
                    ),
                );
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
    });
};
