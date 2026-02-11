import { Schema } from "effect";

import {
    EnduranceActionAmountSchema,
    EnduranceActionIdSchema,
    EnduranceActionLabelSchema,
    EnduranceActionPositionSchema,
    EnduranceActionTypeSchema,
    type EnduranceActions,
} from "../tables/EnduranceActions";

import type { Database } from "@/lib/database.types";
import { withStrictNullCheck } from "@/utils/schema";

export type EnduranceActionStatEncoded = Readonly<
    Database["public"]["CompositeTypes"]["endurance_action_stat"]
>;

export const EnduranceActionTimesSchema = Schema.Number.pipe(
    Schema.int(),
    Schema.greaterThanOrEqualTo(0),
    Schema.brand("EnduranceActionTimes"),
);

export type EnduranceActionStat = Pick<
    EnduranceActions,
    "id" | "type" | "position" | "label" | "amount"
> & {
    action_times: typeof EnduranceActionTimesSchema.Type;
};

export const EnduranceActionStatSchema: Schema.Schema<
    EnduranceActionStat,
    EnduranceActionStatEncoded
> = Schema.Struct({
    id: withStrictNullCheck(EnduranceActionIdSchema),
    type: withStrictNullCheck(EnduranceActionTypeSchema),
    position: withStrictNullCheck(EnduranceActionPositionSchema),
    label: withStrictNullCheck(EnduranceActionLabelSchema),
    amount: withStrictNullCheck(EnduranceActionAmountSchema),
    action_times: withStrictNullCheck(EnduranceActionTimesSchema),
});
