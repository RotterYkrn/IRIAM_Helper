import { Schema } from "effect";

import {
    EnduranceActionAmountSchema,
    EnduranceActionIdSchema,
    EnduranceActionsSchema,
} from "./EnduranceActions";

import {
    ProjectIdSchema,
    type ProjectSchema,
} from "@/domain/projects/tables/Project";
import type { Database } from "@/lib/database.types";

export type EnduranceActionHistoriesEncoded = Readonly<
    Database["public"]["Tables"]["endurance_action_histories"]["Row"]
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

export const EnduranceActionHistoryIsReversalSchema = Schema.Boolean.pipe(
    Schema.brand("EnduranceActionHistoryIsReversal"),
);

export type EnduranceActionHistories = Readonly<{
    id: typeof EnduranceActionHistoryIdSchema.Type;
    project_id: typeof ProjectSchema.Type.id;
    action_id: typeof EnduranceActionHistoryActionIdSchema.Type;
    action_type: typeof EnduranceActionHistoryTypeSchema.Type;
    action_amount: typeof EnduranceActionsSchema.Type.amount;
    is_reversal: typeof EnduranceActionHistoryIsReversalSchema.Type;
    created_at: Date;
}>;

export const EnduranceActionHistoriesSchema: Schema.Schema<
    EnduranceActionHistories,
    EnduranceActionHistoriesEncoded
> = Schema.Struct({
    id: EnduranceActionHistoryIdSchema,
    project_id: ProjectIdSchema,
    action_id: EnduranceActionHistoryActionIdSchema,
    action_type: EnduranceActionHistoryTypeSchema,
    action_amount: EnduranceActionAmountSchema,
    is_reversal: EnduranceActionHistoryIsReversalSchema,
    created_at: Schema.Date,
});
