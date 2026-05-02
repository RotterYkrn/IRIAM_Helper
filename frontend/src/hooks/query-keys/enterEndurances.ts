import type { EnterUnitSchema } from "@/domain/enter_endurances/tables/EnterUnit";

export const EnterEnduranceKey = {
    projectId: ["enter-endurance-project-id"] as const,
    list: ["enter-endurance-list"] as const,
    unit: (unitId: typeof EnterUnitSchema.Type.id) =>
        ["enter-unit", unitId] as const,
};
