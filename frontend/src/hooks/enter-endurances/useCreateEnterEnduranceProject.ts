import { useMutation, useQueryClient } from "@tanstack/react-query";

import { EnterEnduranceKey } from "../query-keys/enterEndurances";

import { useAppRuntimeContext } from "@/contexts/app-effect/useAppRuntimeContext";
import { runEffectWithThrow } from "@/lib/utils";
import { createEnterEnduranceProject } from "@/use-cases/enter-endurances/createEnterEnduranceProject";

export const useCreateEnterEnduranceProject = () => {
    const queryClient = useQueryClient();
    const runtime = useAppRuntimeContext();

    const mutation = useMutation({
        mutationFn: async () =>
            await runEffectWithThrow(runtime)(createEnterEnduranceProject()),
        onSuccess: (projectId) => {
            queryClient.setQueryData(EnterEnduranceKey.projectId, projectId);
        },
    });

    return {
        create: mutation.mutate,
        isCreating: mutation.isPending,
        createError: mutation.error,
    };
};
