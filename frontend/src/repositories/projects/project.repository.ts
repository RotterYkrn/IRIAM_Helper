import { Effect, Chunk, Context } from "effect";

import type { ProjectDto } from "@/domain/projects/dto/ProjectDto";
import type {
    ActivateProjectArgs,
    ActivateProjectReturns,
} from "@/domain/projects/rpcs/ActivateProject";
import type {
    DeleteProjectArgs,
    DeleteProjectReturns,
} from "@/domain/projects/rpcs/DeleteProject";
import type {
    FinishProjectArgs,
    FinishProjectReturns,
} from "@/domain/projects/rpcs/FinishProject";

export interface ProjectRepository {
    readonly getAll: () => Effect.Effect<Chunk.Chunk<ProjectDto>, Error>;
    readonly activate: (
        args: ActivateProjectArgs,
    ) => Effect.Effect<ActivateProjectReturns, Error>;
    readonly finish: (
        args: FinishProjectArgs,
    ) => Effect.Effect<FinishProjectReturns, Error>;
    readonly delete: (
        args: DeleteProjectArgs,
    ) => Effect.Effect<DeleteProjectReturns, Error>;
}

export const ProjectRepository = Context.GenericTag<ProjectRepository>(
    "@repository/ProjectRepository",
);
