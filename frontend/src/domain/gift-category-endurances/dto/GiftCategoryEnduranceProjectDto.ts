import { Chunk, pipe, Schema } from "effect";

import {
    EnduranceCurrentCountSchema,
    EnduranceTargetCountSchema,
    EnduranceUnitIdSchema,
    EnduranceUnitPositionSchema,
    EnduranceUnitsSchema,
} from "@/domain/endurances/tables/EnduranceUnits";
import { GiftDto } from "@/domain/gifts/dto/GiftDto";
import { ProjectDtoSchema } from "@/domain/projects/dto/ProjectDto";
import type { ProjectSchema } from "@/domain/projects/tables/Project";
import type { Database } from "@/lib/database.types";
import { withStrictNullCheck, type RecursiveReadonly } from "@/utils/schema";

export const GiftCategoryEnduranceUnitDto = Schema.Struct({
    id: withStrictNullCheck(EnduranceUnitIdSchema),
    position: withStrictNullCheck(EnduranceUnitPositionSchema),
    gift: withStrictNullCheck(GiftDto),
    target_count: withStrictNullCheck(EnduranceTargetCountSchema),
    current_count: withStrictNullCheck(EnduranceCurrentCountSchema),
});
export type GiftCategoryEnduranceUnitDto =
    typeof GiftCategoryEnduranceUnitDto.Type;

export type GiftCategoryEnduranceProjectDtoEncoded = RecursiveReadonly<
    Database["public"]["Views"]["gift_category_endurance_project_dto"]["Row"]
>;
export type GiftCategoryEnduranceProjectDto = Readonly<{
    id: typeof ProjectSchema.Type.id;
    type: typeof ProjectSchema.Type.type;
    title: typeof ProjectSchema.Type.title;
    status: typeof ProjectSchema.Type.status;
    units: Chunk.Chunk<
        Readonly<{
            id: typeof EnduranceUnitsSchema.Type.id;
            position: typeof EnduranceUnitsSchema.Type.position;
            gift: GiftDto;
            target_count: typeof EnduranceUnitsSchema.Type.target_count;
            current_count: typeof EnduranceUnitsSchema.Type.current_count;
        }>
    >;
}>;
export const GiftCategoryEnduranceProjectDto: Schema.Schema<
    GiftCategoryEnduranceProjectDto,
    GiftCategoryEnduranceProjectDtoEncoded
> = pipe(
    ProjectDtoSchema,
    Schema.extend(
        Schema.Struct({
            units: withStrictNullCheck(
                Schema.Chunk(GiftCategoryEnduranceUnitDto),
            ),
        }),
    ),
);
