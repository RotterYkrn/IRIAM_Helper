import { useSuspenseQuery } from "@tanstack/react-query";

import { EnterEnduranceKey } from "../query-keys/enterEndurances";

import { useAppRuntimeContext } from "@/contexts/app-effect/useAppRuntimeContext";
import type { EnterUnitSchema } from "@/domain/enter_endurances/tables/EnterUnit";
import { runEffectWithThrow } from "@/lib/utils";
import { fetchEnterEnduranceUnit } from "@/use-cases/enter-endurances/fetchEnterEnduranceUnit";

export const useFetchEnterEnduranceUnit = (
    unitId: typeof EnterUnitSchema.Type.id,
) => {
    const runtime = useAppRuntimeContext();

    return useSuspenseQuery({
        queryKey: EnterEnduranceKey.unit(unitId),
        queryFn: async () =>
            await runEffectWithThrow(runtime)(fetchEnterEnduranceUnit(unitId)),
        staleTime: 60 * 1000,
    });
};
