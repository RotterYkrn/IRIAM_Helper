import { useQueryClient, useMutation } from "@tanstack/react-query";

import { EnduranceKey } from "../query-keys/endurances";

import type { MultiEnduranceUnitSchema } from "@/domain/multi-endurances/dto/MultiEnduranceProjectDto";
import type { LogMultiEnduranceActionHistoryArgs } from "@/domain/multi-endurances/rpcs/LogMultiEnduranceActionHistory";
import { runEffectWithThrow } from "@/lib/utils";
import { logMultiEnduranceActionHistory } from "@/use-cases/multi-endurances/logMultiEnduranceActionHistory";

export const useLogMultiEnduranceActionHistory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (args: LogMultiEnduranceActionHistoryArgs) =>
            await runEffectWithThrow(logMultiEnduranceActionHistory(args)),
        onMutate: (args) => {
            queryClient.setQueryData<typeof MultiEnduranceUnitSchema.Type>(
                EnduranceKey.unit(args.unit_id),
                (oldData) =>
                    oldData && {
                        ...oldData,
                        current_count:
                            oldData.current_count + args.action_count,
                    },
            );
        },
        onError: (_, args) => {
            queryClient.setQueryData<typeof MultiEnduranceUnitSchema.Type>(
                EnduranceKey.unit(args.unit_id),
                (oldData) =>
                    oldData && {
                        ...oldData,
                        current_count:
                            oldData.current_count - args.action_count,
                    },
            );
        },
    });
};
