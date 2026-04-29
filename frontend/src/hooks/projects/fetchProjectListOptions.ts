import { queryOptions } from "@tanstack/react-query";
import { Effect } from "effect";

import { ProjectKey } from "../query-keys/projects";

import { fetchProjects } from "@/use-cases/projects/fetchProjects";

export const fetchProjectListOptions = queryOptions({
    queryKey: ProjectKey.list,
    queryFn: async () => {
        try {
            return await Effect.runPromise(fetchProjects());
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
});
