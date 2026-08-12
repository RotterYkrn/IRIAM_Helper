import { useMutation } from "@tanstack/react-query";

import { EnduranceKey } from "../query-keys/endurances";

import type { GiftCategoryEnduranceUnitDto } from "@/domain/gift-category-endurances/dto/GiftCategoryEnduranceProjectDto";
import type { LogMultiEnduranceActionHistoryArgs } from "@/domain/multi-endurances/rpcs/LogMultiEnduranceActionHistory";
import { runEffectWithThrow } from "@/lib/utils";
import { logMultiEnduranceActionHistory } from "@/use-cases/multi-endurances/logMultiEnduranceActionHistory";
import { ProjectKey } from "../query-keys/projects";

export const useLogGiftCategoryEnduranceActionHistory = () => {
    return useMutation({
        mutationFn: async (args: LogMultiEnduranceActionHistoryArgs) =>
            await runEffectWithThrow(logMultiEnduranceActionHistory(args)),
        onMutate: (args, context) => {
            context.client.setQueryData<GiftCategoryEnduranceUnitDto>(
                EnduranceKey.unit(args.unit_id),
                (oldData) =>
                    oldData && {
                        ...oldData,
                        current_count:
                            oldData.current_count + args.action_count,
                    },
            );
        },
        onError: (_err, vars, _onMutateResult, context) => {
            context.client.setQueryData<GiftCategoryEnduranceUnitDto>(
                EnduranceKey.unit(vars.unit_id),
                (oldData) =>
                    oldData && {
                        ...oldData,
                        current_count:
                            oldData.current_count - vars.action_count,
                    },
            );
        },
        onSettled: (_data, _error, args, _onMutateResult, context) => {
            context.client.invalidateQueries({
                queryKey: ProjectKey.detail(args.project_id),
            });
        },
    });
};
