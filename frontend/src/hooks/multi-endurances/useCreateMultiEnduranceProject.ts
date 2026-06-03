import { useQueryClient, useMutation } from "@tanstack/react-query";

import { updateMultiEnduranceProjectQueryData } from "./utils";

import { useAppRuntimeContext } from "@/contexts/app-effect/useAppRuntimeContext";
import type { CreateMultiEnduranceProjectArgs } from "@/domain/multi-endurances/rpcs/CreateMultiEnduranceProject";
import { runEffectWithThrow } from "@/lib/utils";
import { createMultiEnduranceProject } from "@/use-cases/multi-endurances/createMultiEnduranceProject";

export const useCreateMultiEnduranceProject = () => {
    const queryClient = useQueryClient();
    const runtime = useAppRuntimeContext();

    const mutation = useMutation({
        mutationFn: async (args: CreateMultiEnduranceProjectArgs) =>
            await runEffectWithThrow(runtime)(
                createMultiEnduranceProject(args),
            ),
        onSuccess: (createdProject) => {
            updateMultiEnduranceProjectQueryData(queryClient, createdProject);
        },
    });

    return {
        create: mutation.mutate,
        isCreating: mutation.isPending,
        createError: mutation.error,
    };
};
