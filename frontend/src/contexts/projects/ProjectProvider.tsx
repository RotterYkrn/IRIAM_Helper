import { useQuery } from "@tanstack/react-query";
import { Chunk, Option, pipe } from "effect";
import { useState } from "react";

import ProjectContext from "./ProjectContext";

import { type ProjectSchema } from "@/domain/projects/tables/Project";
import { fetchProjectListOptions } from "@/hooks/projects/fetchProjectListOptions";

type Props = {
    projectId: typeof ProjectSchema.Type.id;
    children: React.ReactNode;
};

export const ProjectProvider = ({ children, projectId }: Props) => {
    const [isEdit, setIsEdit] = useState(false);
    const { data: project } = useQuery({
        ...fetchProjectListOptions,
        select: (data) =>
            pipe(
                data,
                Chunk.findFirst((p) => p.id === projectId),
                Option.getOrThrowWith(
                    () => new Error("project not found: " + projectId),
                ),
            ),
    });

    if (!project) {
        return null;
    }

    return (
        <ProjectContext value={{ project, isEdit, setIsEdit }}>
            {children}
        </ProjectContext>
    );
};
