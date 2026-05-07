import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Chunk, Effect } from "effect";

import { EnterEnduranceKey } from "../query-keys/enterEndurances";

import type { EnterUnitDto } from "@/domain/enter_endurances/dto/EnterUnitDto";
import type { LogEnterArgs } from "@/domain/enter_endurances/rpcs/LogEnter";
import { logEnter } from "@/use-cases/enter-endurances/logEnter";

export const useLogEnter = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (args: Omit<LogEnterArgs, "entered_at">) => {
            try {
                const result = await Effect.runPromise(
                    logEnter({
                        ...args,
                        entered_at: new Date(),
                    }),
                );
                return result;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        onMutate: async (args) => {
            await queryClient.setQueryData<EnterUnitDto>(
                EnterEnduranceKey.unit(args.unit_id),
                (old) =>
                    old && {
                        ...old,
                        logs: Chunk.append(old.logs, {
                            user_name: args.user_name,
                            user_number: args.user_number,
                            entered_at: new Date(),
                        }),
                    },
            );
        },
        onSettled: (_, __, { unit_id }) => {
            queryClient.invalidateQueries({
                queryKey: EnterEnduranceKey.unit(unit_id),
            });
        },
    });
};
