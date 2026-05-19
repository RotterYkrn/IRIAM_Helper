import { Chunk, pipe, Schema } from "effect";

import {
    EnduranceCurrentCountSchema,
    EnduranceTargetCountSchema,
    EnduranceUnitIdSchema,
    EnduranceUnitLabelSchema,
    EnduranceUnitPositionSchema,
    EnduranceUnitsSchema,
} from "@/domain/endurances/tables/EnduranceUnits";
import { ProjectDtoSchema } from "@/domain/projects/dto/ProjectDto";
import type { ProjectSchema } from "@/domain/projects/tables/Project";
import type { Database } from "@/lib/database.types";
import { withStrictNullCheck, type RecursiveReadonly } from "@/utils/schema";

export const MultiEnduranceUnitSchema = pipe(
    EnduranceUnitsSchema,
    Schema.pick("id", "position", "label", "target_count", "current_count"),
);

export const MultiEnduranceUnitDtoSchema = Schema.Struct({
    id: withStrictNullCheck(EnduranceUnitIdSchema),
    position: withStrictNullCheck(EnduranceUnitPositionSchema),
    label: withStrictNullCheck(EnduranceUnitLabelSchema),
    target_count: withStrictNullCheck(EnduranceTargetCountSchema),
    current_count: withStrictNullCheck(EnduranceCurrentCountSchema),
});

export type MultiEnduranceProjectDtoEncoded = RecursiveReadonly<
    Database["public"]["Views"]["multi_endurance_project_dto"]["Row"]
>;

export type MultiEnduranceProjectDto = Readonly<{
    id: typeof ProjectSchema.Type.id;
    type: typeof ProjectSchema.Type.type;
    title: typeof ProjectSchema.Type.title;
    status: typeof ProjectSchema.Type.status;
    units: Chunk.Chunk<
        Readonly<{
            id: typeof EnduranceUnitsSchema.Type.id;
            position: typeof EnduranceUnitsSchema.Type.position;
            label: typeof EnduranceUnitsSchema.Type.label;
            target_count: typeof EnduranceUnitsSchema.Type.target_count;
            current_count: typeof EnduranceUnitsSchema.Type.current_count;
        }>
    >;
}>;

export const MultiEnduranceProjectDtoSchema: Schema.Schema<
    MultiEnduranceProjectDto,
    MultiEnduranceProjectDtoEncoded
> = pipe(
    ProjectDtoSchema,
    Schema.extend(
        Schema.Struct({
            units: withStrictNullCheck(
                Schema.Chunk(MultiEnduranceUnitDtoSchema),
            ),
        }),
    ),
);
