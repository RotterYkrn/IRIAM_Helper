import { Schema } from "effect";

import {
    ProjectIdSchema,
    type ProjectSchema,
} from "@/domain/projects/tables/Project";
import type { Database } from "@/lib/database.types";

export type EnduranceActionsEncoded = Readonly<
    Database["public"]["Tables"]["endurance_actions"]["Row"]
>;

export const EnduranceActionIdSchema = Schema.UUID.pipe(
    Schema.brand("EnduranceActionId"),
);

export const EnduranceActionTypeSchema = Schema.String.pipe(
    Schema.compose(Schema.Literal("rescue", "sabotage")),
    Schema.brand("EnduranceActionType"),
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

export type EnduranceActions = Readonly<{
    id: typeof EnduranceActionIdSchema.Type;
    project_id: typeof ProjectSchema.Type.id;
    type: typeof EnduranceActionTypeSchema.Type;
    label: typeof EnduranceActionLabelSchema.Type;
    amount: typeof EnduranceActionAmountSchema.Type;
    created_at: Date;
}>;

export const EnduranceActionsSchema: Schema.Schema<
    EnduranceActions,
    EnduranceActionsEncoded
> = Schema.Struct({
    id: EnduranceActionIdSchema,
    project_id: ProjectIdSchema,
    type: EnduranceActionTypeSchema,
    label: EnduranceActionLabelSchema,
    amount: EnduranceActionAmountSchema,
    created_at: Schema.Date,
});
