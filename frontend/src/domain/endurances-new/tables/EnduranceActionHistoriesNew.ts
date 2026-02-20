import { Schema } from "effect";

import {
    EnduranceActionIdSchema,
    EnduranceActionAmountSchema,
} from "./EnduranceActionsNew";
import {
    EnduranceUnitIdSchema,
    type EnduranceUnitsSchema,
} from "./EnduranceUnits";

import type { EnduranceActionsSchema } from "@/domain/endurances/tables/EnduranceActions";
import {
    ProjectIdSchema,
    type ProjectSchema,
} from "@/domain/projects/tables/Project";
import type { Database } from "@/lib/database.types";

export type EnduranceActionHistoriesNewEncoded = Readonly<
    Database["public"]["Tables"]["endurance_action_histories_new"]["Row"]
>;

export const EnduranceActionHistoryIdSchema = Schema.UUID.pipe(
    Schema.brand("EnduranceActionHistoryId"),
);

export const EnduranceActionHistoryTypeSchema = Schema.String.pipe(
    Schema.compose(Schema.Literal("normal", "rescue", "sabotage")),
    Schema.brand("EnduranceActionHistoryType"),
);

export const EnduranceActionHistoryActionIdSchema = Schema.NullOr(
    EnduranceActionIdSchema,
);

export const EnduranceActionHistoryActionCountSchema = Schema.Int.pipe(
    Schema.brand("EnduranceActionHistoryActionCount"),
);

export type EnduranceActionHistoriesNew = Readonly<{
    id: typeof EnduranceActionHistoryIdSchema.Type;
    project_id: typeof ProjectSchema.Type.id;
    unit_id: typeof EnduranceUnitsSchema.Type.id;
    action_id: typeof EnduranceActionHistoryActionIdSchema.Type;
    action_type: typeof EnduranceActionHistoryTypeSchema.Type;
    action_amount: typeof EnduranceActionsSchema.Type.amount;
    action_count: typeof EnduranceActionHistoryActionCountSchema.Type;
    created_at: Date;
}>;

export const EnduranceActionHistoriesNewSchema: Schema.Schema<
    EnduranceActionHistoriesNew,
    EnduranceActionHistoriesNewEncoded
> = Schema.Struct({
    id: EnduranceActionHistoryIdSchema,
    project_id: ProjectIdSchema,
    unit_id: EnduranceUnitIdSchema,
    action_id: EnduranceActionHistoryActionIdSchema,
    action_type: EnduranceActionHistoryTypeSchema,
    action_amount: EnduranceActionAmountSchema,
    action_count: EnduranceActionHistoryActionCountSchema,
    created_at: Schema.Date,
});
