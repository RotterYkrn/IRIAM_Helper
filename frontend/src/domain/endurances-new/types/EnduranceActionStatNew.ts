import { Schema } from "effect";

import {
    EnduranceActionAmountSchema,
    EnduranceActionCountSchema,
    EnduranceActionIdSchema,
    EnduranceActionLabelSchema,
    EnduranceActionPositionSchema,
    EnduranceActionTypeSchema,
    type EnduranceActionsNewSchema,
} from "../tables/EnduranceActionsNew";

import type { Database } from "@/lib/database.types";
import { withStrictNullCheck } from "@/utils/schema";

export type EnduranceActionStatNewEncoded = Readonly<
    Database["public"]["CompositeTypes"]["endurance_action_stat_new"]
>;

export type EnduranceActionStatNew = Readonly<{
    id: typeof EnduranceActionsNewSchema.Type.id;
    type: typeof EnduranceActionsNewSchema.Type.type;
    position: typeof EnduranceActionsNewSchema.Type.position;
    label: typeof EnduranceActionsNewSchema.Type.label;
    amount: typeof EnduranceActionsNewSchema.Type.amount;
    count: typeof EnduranceActionsNewSchema.Type.count;
}>;

export const EnduranceActionStatNewSchema: Schema.Schema<
    EnduranceActionStatNew,
    EnduranceActionStatNewEncoded
> = Schema.Struct({
    id: withStrictNullCheck(EnduranceActionIdSchema),
    type: withStrictNullCheck(EnduranceActionTypeSchema),
    position: withStrictNullCheck(EnduranceActionPositionSchema),
    label: withStrictNullCheck(EnduranceActionLabelSchema),
    amount: withStrictNullCheck(EnduranceActionAmountSchema),
    count: withStrictNullCheck(EnduranceActionCountSchema),
});
