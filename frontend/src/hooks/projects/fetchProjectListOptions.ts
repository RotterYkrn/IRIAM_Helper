import { queryOptions } from "@tanstack/react-query";
import { Chunk, Effect, pipe, Runtime } from "effect";

import { ProjectKey } from "../query-keys/projects";

import type { AppService } from "@/contexts/app-effect/AppLayer";
import { runEffectWithThrow } from "@/lib/utils";
import { fetchProjects } from "@/use-cases/projects/fetchProjects";

export const fetchProjectListOptions = (runtime: Runtime.Runtime<AppService>) =>
    queryOptions({
        queryKey: ProjectKey.list,
        queryFn: async () =>
            await runEffectWithThrow(runtime)(
                pipe(
                    fetchProjects(),
                    Effect.map(
                        Chunk.filter((p) => p.type !== "enter-endurance"),
                    ),
                ),
            ),
    });
