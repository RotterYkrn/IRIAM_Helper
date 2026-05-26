import { useSuspenseQuery } from "@tanstack/react-query";

import { EnterEnduranceKey } from "../query-keys/enterEndurances";

import { runEffectWithThrow } from "@/lib/utils";
import { isExistEnterEnduranceProjects } from "@/use-cases/enter-endurances/isExistEnterEnduranceProject";

export const useIsExistEnterEnduranceProject = () => {
    return useSuspenseQuery({
        queryKey: EnterEnduranceKey.projectId,
        queryFn: async () =>
            await runEffectWithThrow(isExistEnterEnduranceProjects()),
    });
};
