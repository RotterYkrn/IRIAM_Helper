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

/** {@link EnduranceActionStatNewSchema} */
export type EnduranceActionStatNewEncoded = Readonly<
    Database["public"]["CompositeTypes"]["endurance_action_stat_new"]
>;

/** {@link EnduranceActionStatNewSchema} */
export type EnduranceActionStatNew = Readonly<{
    id: typeof EnduranceActionsNewSchema.Type.id;

    /** {@link EnduranceActionTypeSchema} */
    type: typeof EnduranceActionsNewSchema.Type.type;

    /** {@link EnduranceActionPositionSchema} */
    position: typeof EnduranceActionsNewSchema.Type.position;

    label: typeof EnduranceActionsNewSchema.Type.label;

    /** {@link EnduranceActionAmountSchema} */
    amount: typeof EnduranceActionsNewSchema.Type.amount;

    /** {@link EnduranceActionCountSchema} */
    count: typeof EnduranceActionsNewSchema.Type.count;
}>;

/**
 * 救済・妨害アクションの情報
 * endurance_project_view_new のプロパティ用
 */
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
