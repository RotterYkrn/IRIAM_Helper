import { useQueryClient, useMutation } from "@tanstack/react-query";

import { EnterEnduranceKey } from "../query-keys/enterEndurances";

import { useAppRuntimeContext } from "@/contexts/app-effect/useAppRuntimeContext";
import type { CreateEnterUnitArgs } from "@/domain/enter_endurances/rpcs/CreateEnterUnit";
import { runEffectWithThrow } from "@/lib/utils";
import { createEnterUnit } from "@/use-cases/enter-endurances/createEnterUnit";

export const useCreateEnterUnit = () => {
    const queryClient = useQueryClient();
    const runtime = useAppRuntimeContext();

    const mutation = useMutation({
        mutationFn: async (args: CreateEnterUnitArgs) =>
            await runEffectWithThrow(runtime)(createEnterUnit(args)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: EnterEnduranceKey.list });
        },
    });

    return {
        create: mutation.mutate,
        isCreating: mutation.isPending,
        createError: mutation.error,
    };
};
