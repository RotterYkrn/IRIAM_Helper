import { useSuspenseQuery } from "@tanstack/react-query";

import { EnterEnduranceKey } from "../query-keys/enterEndurances";

import type { EnterUnitSchema } from "@/domain/enter_endurances/tables/EnterUnit";
import { runEffectWithThrow } from "@/lib/utils";
import { fetchEnterEnduranceUnit } from "@/use-cases/enter-endurances/fetchEnterEnduranceUnit";

export const useFetchEnterEnduranceUnit = (
    unitId: typeof EnterUnitSchema.Type.id,
) => {
    return useSuspenseQuery({
        queryKey: EnterEnduranceKey.unit(unitId),
        queryFn: async () =>
            await runEffectWithThrow(fetchEnterEnduranceUnit(unitId)),
        staleTime: 60 * 1000,
    });
};
