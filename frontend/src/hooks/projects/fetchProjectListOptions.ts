import { queryOptions } from "@tanstack/react-query";
import { Chunk, Effect } from "effect";

import { ProjectKey } from "../query-keys/projects";

import { runEffectWithThrow } from "@/lib/utils";
import { fetchProjects } from "@/use-cases/projects/fetchProjects";

export const fetchProjectListOptions = queryOptions({
    queryKey: ProjectKey.list,
    queryFn: async () =>
        await runEffectWithThrow(
            fetchProjects().pipe(
                Effect.map(Chunk.filter((p) => p.type !== "enter-endurance")),
            ),
        ),
});
