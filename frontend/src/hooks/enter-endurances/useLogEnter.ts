import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Chunk } from "effect";

import { EnterEnduranceKey } from "../query-keys/enterEndurances";

import { useAppRuntimeContext } from "@/contexts/app-effect/useAppRuntimeContext";
import type { EnterUnitDto } from "@/domain/enter_endurances/dto/EnterUnitDto";
import type { LogEnterArgs } from "@/domain/enter_endurances/rpcs/LogEnter";
import { runEffectWithThrow } from "@/lib/utils";
import { logEnter } from "@/use-cases/enter-endurances/logEnter";

export const useLogEnter = () => {
    const queryClient = useQueryClient();
    const runtime = useAppRuntimeContext();

    const mutation = useMutation({
        mutationFn: async (args: Omit<LogEnterArgs, "entered_at">) =>
            await runEffectWithThrow(runtime)(
                logEnter({
                    ...args,
                    entered_at: new Date(),
                }),
            ),
        onSuccess: async (_, args) => {
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
    });

    return {
        logEnter: mutation.mutate,
        isLoggingEnter: mutation.isPending,
        logEnterError: mutation.error,
    };
};
