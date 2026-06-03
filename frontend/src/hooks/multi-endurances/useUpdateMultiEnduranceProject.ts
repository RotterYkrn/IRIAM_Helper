import { useQueryClient, useMutation } from "@tanstack/react-query";

import { updateMultiEnduranceProjectQueryData } from "./utils";

import { useAppRuntimeContext } from "@/contexts/app-effect/useAppRuntimeContext";
import type { UpdateMultiEnduranceProjectArgs } from "@/domain/multi-endurances/rpcs/UpdateMultiEnduranceProject";
import { runEffectWithThrow } from "@/lib/utils";
import { updateMultiEnduranceProject } from "@/use-cases/multi-endurances/updateMultiEnduranceProject";

export const useUpdateMultiEnduranceProject = () => {
    const queryClient = useQueryClient();
    const runtime = useAppRuntimeContext();

    const mutation = useMutation({
        mutationFn: async (args: UpdateMultiEnduranceProjectArgs) =>
            await runEffectWithThrow(runtime)(
                updateMultiEnduranceProject(args),
            ),
        onSuccess: (updatedProject) => {
            updateMultiEnduranceProjectQueryData(queryClient, updatedProject);
        },
    });

    return {
        update: mutation.mutate,
        isUpdating: mutation.isPending,
        updateError: mutation.error,
    };
};
