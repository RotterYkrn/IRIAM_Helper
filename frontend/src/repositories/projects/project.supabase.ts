import { Layer, Schema } from "effect";

import { ProjectRepository } from "./project.repository";

import { ProjectDtoSchema } from "@/domain/projects/dto/ProjectDto";
import {
    ActivateProjectArgsSchema,
    ActivateProjectReturnsSchema,
} from "@/domain/projects/rpcs/ActivateProject";
import { DeleteProjectReturnsSchema } from "@/domain/projects/rpcs/DeleteProject";
import { FinishProjectReturnsSchema } from "@/domain/projects/rpcs/FinishProject";
import { supabase } from "@/lib/supabase";
import { queryAndDecode } from "@/utils/api";

export const ProjectSupabase = Layer.succeed(
    ProjectRepository,
    ProjectRepository.of({
        getAll: () =>
            queryAndDecode(
                () =>
                    supabase
                        .from("projects")
                        .select("id, title, type, status")
                        .order("created_at", { ascending: false }),
                Schema.Chunk(ProjectDtoSchema),
            ),
        activate: (args) =>
            queryAndDecode(
                () =>
                    supabase.rpc(
                        "activate_project",
                        Schema.encodeSync(ActivateProjectArgsSchema)(args),
                    ),
                ActivateProjectReturnsSchema,
            ),
        finish: (args) =>
            queryAndDecode(
                () =>
                    supabase.rpc(
                        "finish_project",
                        Schema.encodeSync(ActivateProjectArgsSchema)(args),
                    ),
                FinishProjectReturnsSchema,
            ),
        delete: (args) =>
            queryAndDecode(
                () =>
                    supabase.rpc(
                        "delete_project",
                        Schema.encodeSync(ActivateProjectArgsSchema)(args),
                    ),
                DeleteProjectReturnsSchema,
            ),
    }),
);
