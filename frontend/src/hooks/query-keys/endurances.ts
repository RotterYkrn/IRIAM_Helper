import type { EnduranceActionsSchema } from "@/domain/endurances/tables/EnduranceActions";
import type { EnduranceUnitsSchema } from "@/domain/endurances/tables/EnduranceUnits";
import type { ProjectSchema } from "@/domain/projects/tables/Project";

export const EnduranceKey = {
    unit: (unitId: typeof EnduranceUnitsSchema.Encoded.id) =>
        ["unit", unitId] as const,

    /** 救済・妨害アクションのIDの配列 */
    actionStat: (projectId: typeof ProjectSchema.Encoded.id) =>
        ["actionStat", projectId] as const,
    /**
     * 救済・妨害アクションの各要素
     * @param actionId 救済・妨害アクションのID
     * @returns QueryKey `["action", actionId]`
     */
    action: (actionId: typeof EnduranceActionsSchema.Encoded.id) =>
        ["action", actionId] as const,
};
