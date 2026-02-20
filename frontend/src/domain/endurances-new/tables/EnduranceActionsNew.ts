import { Schema } from "effect";

import {
    EnduranceUnitIdSchema,
    type EnduranceUnitsSchema,
} from "./EnduranceUnits";

import {
    ProjectIdSchema,
    type ProjectSchema,
} from "@/domain/projects/tables/Project";
import type { Database } from "@/lib/database.types";

export type EnduranceActionsEncoded = Readonly<
    Database["public"]["Tables"]["endurance_actions_new"]["Row"]
>;

export const EnduranceActionIdSchema = Schema.UUID.pipe(
    Schema.brand("EnduranceActionId"),
);

export const EnduranceActionTypeSchema = Schema.String.pipe(
    Schema.compose(Schema.Literal("rescue", "sabotage")),
    Schema.brand("EnduranceActionType"),
);

export const EnduranceActionPositionSchema = Schema.NonNegativeInt.pipe(
    Schema.brand("EnduranceActionPosition"),
);

export const EnduranceActionLabelSchema = Schema.String.pipe(
    Schema.minLength(1, {
        message: () => "1文字以上入力してください",
    }),
    Schema.brand("EnduranceActionLabel"),
);

export const EnduranceActionAmountSchema = Schema.Number.pipe(
    Schema.int({ message: () => "整数で入力してください" }),
    Schema.greaterThanOrEqualTo(1, {
        message: () => "1以上の数を入力してください",
    }),
    Schema.brand("EnduranceActionAmount"),
);

export const EnduranceActionCountSchema = Schema.NonNegativeInt.pipe(
    Schema.brand("EnduranceActionCount"),
);

export type EnduranceActionsNew = Readonly<{
    id: typeof EnduranceActionIdSchema.Type;
    project_id: typeof ProjectSchema.Type.id;
    unit_id: typeof EnduranceUnitsSchema.Type.id;
    type: typeof EnduranceActionTypeSchema.Type;
    position: typeof EnduranceActionPositionSchema.Type;
    label: typeof EnduranceActionLabelSchema.Type;
    amount: typeof EnduranceActionAmountSchema.Type;
    count: typeof EnduranceActionCountSchema.Type;
    created_at: Date;
    updated_at: Date;
}>;

export const EnduranceActionsNewSchema: Schema.Schema<
    EnduranceActionsNew,
    EnduranceActionsEncoded
> = Schema.Struct({
    id: EnduranceActionIdSchema,
    project_id: ProjectIdSchema,
    unit_id: EnduranceUnitIdSchema,
    type: EnduranceActionTypeSchema,
    position: EnduranceActionPositionSchema,
    label: EnduranceActionLabelSchema,
    amount: EnduranceActionAmountSchema,
    count: EnduranceActionCountSchema,
    created_at: Schema.Date,
    updated_at: Schema.Date,
});
