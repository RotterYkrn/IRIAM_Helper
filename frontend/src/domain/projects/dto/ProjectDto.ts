import { Schema } from "effect";

import {
    ProjectIdSchema,
    ProjectStatusSchema,
    ProjectTitleSchema,
    ProjectTypeSchema,
} from "../tables/Project";

import { withStrictNullCheck } from "@/utils/schema";

/**
 * 一覧表示用の企画情報
 */
export const ProjectDtoSchema = Schema.Struct({
    id: withStrictNullCheck(ProjectIdSchema),
    type: withStrictNullCheck(ProjectTypeSchema),
    status: withStrictNullCheck(ProjectStatusSchema),
    title: withStrictNullCheck(ProjectTitleSchema),
});
