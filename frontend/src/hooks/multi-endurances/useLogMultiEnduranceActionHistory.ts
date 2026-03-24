import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Effect, Schema } from "effect";

import { EnduranceKey } from "../query-keys/endurances";

import { EnduranceCurrentCountSchema } from "@/domain/endurances-new/tables/EnduranceUnits";
import type { MultiEnduranceUnitSchema } from "@/domain/multi-endurances/dto/MultiEnduranceProjectDto";
import type { LogMultiEnduranceActionHistoryArgs } from "@/domain/multi-endurances/rpcs/LogMultiEnduranceActionHistory";
import { logMultiEnduranceActionHistory } from "@/use-cases/multi-endurances/logMultiEnduranceActionHistory";

export const useLogMultiEnduranceActionHistory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (args: LogMultiEnduranceActionHistoryArgs) => {
            try {
                const result = await Effect.runPromise(
                    logMultiEnduranceActionHistory(args),
                );

                return result;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        onMutate: (args) => {
            queryClient.setQueryData<typeof MultiEnduranceUnitSchema.Type>(
                EnduranceKey.unit(args.unit_id),
                (oldData) =>
                    oldData && {
                        ...oldData,
                        current_count: Schema.decodeSync(
                            EnduranceCurrentCountSchema,
                        )(oldData.current_count + args.action_count),
                    },
            );
        },
        onError: (_, args) => {
            queryClient.setQueryData<typeof MultiEnduranceUnitSchema.Type>(
                EnduranceKey.unit(args.unit_id),
                (oldData) =>
                    oldData && {
                        ...oldData,
                        current_count: Schema.decodeSync(
                            EnduranceCurrentCountSchema,
                        )(oldData.current_count - args.action_count),
                    },
            );
        },
    });
};
