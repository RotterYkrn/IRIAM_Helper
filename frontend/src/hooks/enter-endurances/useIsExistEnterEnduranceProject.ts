import { useSuspenseQuery } from "@tanstack/react-query";
import { Effect } from "effect";

import { EnterEnduranceKey } from "../query-keys/enterEndurances";

import { isExistEnterEnduranceProjects } from "@/use-cases/enter-endurances/isExistEnterEnduranceProject";

export const useIsExistEnterEnduranceProject = () => {
    return useSuspenseQuery({
        queryKey: EnterEnduranceKey.projectId,
        queryFn: async () => {
            try {
                const result = await Effect.runPromise(
                    isExistEnterEnduranceProjects(),
                );
                return result;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
    });
};
