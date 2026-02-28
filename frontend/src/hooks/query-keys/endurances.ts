import type { EnduranceActionsNewSchema } from "@/domain/endurances-new/tables/EnduranceActionsNew";

export const EnduranceKey = {
    /** 救済・妨害アクションのIDの配列 */
    actionStat: ["actionStat"] as const,
    /**
     * 救済・妨害アクションの各要素
     * @param actionId 救済・妨害アクションのID
     * @returns QueryKey `["action", actionId]`
     */
    action: (actionId: typeof EnduranceActionsNewSchema.Type.id) =>
        ["action", actionId] as const,
};
