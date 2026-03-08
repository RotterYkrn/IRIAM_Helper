import { Schema } from "effect";

import {
    ProjectIdSchema,
    type ProjectSchema,
} from "@/domain/projects/tables/Project";
import type { Database } from "@/lib/database.types";

/** {@link EnduranceUnitsSchema} */
export type EnduranceUnitsEncoded = Readonly<
    Database["public"]["Tables"]["endurance_units"]["Row"]
>;

export const EnduranceUnitIdSchema = Schema.UUID.pipe(
    Schema.brand("EnduranceUnitId"),
);

export const EnduranceUnitLabelSchema = Schema.String.pipe(
    Schema.minLength(1, {
        message: () => "1文字以上入力してください",
    }),
    Schema.brand("EnduranceUnitLabel"),
);

export const EnduranceTargetCountSchema = Schema.Number.pipe(
    Schema.positive({
        message: () => "0より大きいの数を入力してください",
    }),
    Schema.brand("EnduranceTargetCount"),
);

export const EnduranceCurrentCountSchema = Schema.Number.pipe(
    Schema.brand("EnduranceCurrentCount"),
);

/** {@link EnduranceUnitsSchema} */
export type EnduranceUnits = Readonly<{
    id: typeof EnduranceUnitIdSchema.Type;
    project_id: typeof ProjectSchema.Type.id;
    label: typeof EnduranceUnitLabelSchema.Type;
    target_count: typeof EnduranceTargetCountSchema.Type;
    current_count: typeof EnduranceCurrentCountSchema.Type;
    created_at: Date;
    updated_at: Date;
}>;

/**
 * endurance_units テーブル
 * 耐久するものごとの設定
 */
export const EnduranceUnitsSchema: Schema.Schema<
    EnduranceUnits,
    EnduranceUnitsEncoded
> = Schema.Struct({
    id: EnduranceUnitIdSchema,
    project_id: ProjectIdSchema,
    label: EnduranceUnitLabelSchema,
    target_count: EnduranceTargetCountSchema,
    current_count: EnduranceCurrentCountSchema,
    created_at: Schema.Date,
    updated_at: Schema.Date,
});
