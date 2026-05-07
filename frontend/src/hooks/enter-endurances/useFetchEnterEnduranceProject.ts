import { useSuspenseQuery } from "@tanstack/react-query";
import { Effect } from "effect";

import { EnterEnduranceKey } from "../query-keys/enterEndurances";

import type { ProjectSchema } from "@/domain/projects/tables/Project";
import { fetchEnterEnduranceProject } from "@/use-cases/enter-endurances/fetchEnterEnduranceProject";

export const useFetchEnterEnduranceProject = (
    projectId: typeof ProjectSchema.Type.id,
) => {
    return useSuspenseQuery({
        queryKey: EnterEnduranceKey.list,
        queryFn: async () => {
            try {
                const result = await Effect.runPromise(
                    fetchEnterEnduranceProject(projectId),
                );
                return result;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
    });
};
