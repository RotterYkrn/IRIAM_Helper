import { useSuspenseQuery } from "@tanstack/react-query";

import { EnterEnduranceKey } from "../query-keys/enterEndurances";

import type { ProjectSchema } from "@/domain/projects/tables/Project";
import { runEffectWithThrow } from "@/lib/utils";
import { fetchEnterEnduranceProject } from "@/use-cases/enter-endurances/fetchEnterEnduranceProject";

export const useFetchEnterEnduranceProject = (
    projectId: typeof ProjectSchema.Type.id,
) => {
    return useSuspenseQuery({
        queryKey: EnterEnduranceKey.list,
        queryFn: async () =>
            await runEffectWithThrow(fetchEnterEnduranceProject(projectId)),
    });
};
