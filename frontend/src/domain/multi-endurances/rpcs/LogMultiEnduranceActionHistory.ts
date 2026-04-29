import { Schema } from "effect";

import {
    EnduranceActionHistoryActionCountSchema,
    type EnduranceActionHistoriesNewSchema,
} from "@/domain/endurances-new/tables/EnduranceActionHistoriesNew";
import {
    EnduranceUnitIdSchema,
    EnduranceUnitsSchema,
} from "@/domain/endurances-new/tables/EnduranceUnits";
import {
    ProjectIdSchema,
    type ProjectSchema,
} from "@/domain/projects/tables/Project";
import type { Database } from "@/lib/database.types";
import { mapFrom } from "@/utils/schema";

export type LogMultiEnduranceActionHistoryArgsEncoded = Readonly<
    Database["public"]["Functions"]["log_multi_endurance_action_history"]["Args"]
>;
export type LogMultiEnduranceActionHistoryArgs = Readonly<{
    project_id: typeof ProjectSchema.Type.id;
    unit_id: typeof EnduranceUnitsSchema.Type.id;
    action_count: typeof EnduranceActionHistoriesNewSchema.Type.action_count;
}>;
export const LogMultiEnduranceActionHistoryArgsSchema: Schema.Schema<
    LogMultiEnduranceActionHistoryArgs,
    LogMultiEnduranceActionHistoryArgsEncoded
> = Schema.Struct({
    project_id: ProjectIdSchema.pipe(mapFrom("p_project_id")),
    unit_id: EnduranceUnitIdSchema.pipe(mapFrom("p_unit_id")),
    action_count: EnduranceActionHistoryActionCountSchema.pipe(
        mapFrom("p_action_count"),
    ),
});

export type LogMultiEnduranceActionHistoryReturnsEncoded = Readonly<
    Database["public"]["Functions"]["log_endurance_action_history_new"]["Returns"]
>;
export type LogMultiEnduranceActionHistoryReturns =
    typeof EnduranceUnitsSchema.Type.id;
export const LogMultiEnduranceActionHistoryReturnsSchema: Schema.Schema<
    LogMultiEnduranceActionHistoryReturns,
    LogMultiEnduranceActionHistoryReturnsEncoded
> = EnduranceUnitIdSchema;
