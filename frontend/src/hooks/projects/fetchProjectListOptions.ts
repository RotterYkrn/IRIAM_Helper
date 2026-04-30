import { queryOptions } from "@tanstack/react-query";
import { Effect } from "effect";
import { Chunk } from "effect";

import { ProjectKey } from "../query-keys/projects";

import { fetchProjects } from "@/use-cases/projects/fetchProjects";

export const fetchProjectListOptions = queryOptions({
    queryKey: ProjectKey.list,
    queryFn: async () => {
        try {
            return await Effect.runPromise(
                fetchProjects().pipe(
                    Effect.map(
                        Chunk.filter(
                            (project) => project.type !== "enter-endurance",
                        ),
                    ),
                ),
            );
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
});
