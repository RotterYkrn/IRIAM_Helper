import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Effect } from "effect";

import { EnterEnduranceKey } from "../query-keys/enterEndurances";

import type { CreateEnterUnitArgs } from "@/domain/enter_endurances/rpcs/CreateEnterUnit";
import { createEnterUnit } from "@/use-cases/enter-endurances/createEnterUnit";

export const useCreateEnterUnit = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (args: CreateEnterUnitArgs) => {
            try {
                const result = await Effect.runPromise(createEnterUnit(args));
                return result;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: EnterEnduranceKey.list });
        },
    });
};
