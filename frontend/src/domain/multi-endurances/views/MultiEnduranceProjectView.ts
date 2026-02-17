import { Schema } from "effect";

import { MultiEnduranceStatSchema } from "../types/MultiEnduranceStat";

import {
    ProjectIdSchema,
    ProjectStatusSchema,
    ProjectTitleSchema,
    type ProjectSchema,
} from "@/domain/projects/tables/Project";
import type { Database } from "@/lib/database.types";
import { withStrictNullCheck, type RecursiveReadonly } from "@/utils/schema";

export type MultiEnduranceProjectViewEncoded = RecursiveReadonly<
    Database["public"]["Views"]["multi_endurance_project_view"]["Row"]
>;

export const MultiEnduranceStatChunkSchema = Schema.Chunk(
    MultiEnduranceStatSchema,
);

export type MultiEnduranceProjectView = Readonly<{
    id: typeof ProjectSchema.Type.id;
    status: typeof ProjectSchema.Type.status;
    title: typeof ProjectSchema.Type.title;
    endurance_stats: typeof MultiEnduranceStatChunkSchema.Type;
}>;

export const MultiEnduranceProjectStatSchema: Schema.Schema<
    MultiEnduranceProjectView,
    MultiEnduranceProjectViewEncoded
> = Schema.Struct({
    id: withStrictNullCheck(ProjectIdSchema),
    status: withStrictNullCheck(ProjectStatusSchema),
    title: withStrictNullCheck(ProjectTitleSchema),
    endurance_stats: withStrictNullCheck(MultiEnduranceStatChunkSchema),
});
