import { useSuspenseQuery } from "@tanstack/react-query";

import { EnterEnduranceKey } from "../query-keys/enterEndurances";

import { useAppRuntimeContext } from "@/contexts/app-effect/useAppRuntimeContext";
import { runEffectWithThrow } from "@/lib/utils";
import { isExistEnterEnduranceProjects } from "@/use-cases/enter-endurances/isExistEnterEnduranceProject";

export const useIsExistEnterEnduranceProject = () => {
    const runtime = useAppRuntimeContext();

    return useSuspenseQuery({
        queryKey: EnterEnduranceKey.projectId,
        queryFn: async () =>
            await runEffectWithThrow(runtime)(isExistEnterEnduranceProjects()),
    });
};
