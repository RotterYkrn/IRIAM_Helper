import type { useQueryClient } from "@tanstack/react-query";
import { Chunk } from "effect";

import { EnduranceKey } from "../query-keys/endurances";
import { ProjectKey } from "../query-keys/projects";

import type { MultiEnduranceProjectDto } from "@/domain/multi-endurances/dto/MultiEnduranceProjectDto";

export const setMultiEnduranceProjectQueryData = (
    queryClient: ReturnType<typeof useQueryClient>,
    project: MultiEnduranceProjectDto,
) => {
    Chunk.map(project.units, (unit) => {
        queryClient.setQueryData(EnduranceKey.unit(unit.id), unit);
    });

    return {
        ...project,
        units: Chunk.map(project.units, (unit) => unit.id),
    };
};

export const updateMultiEnduranceProjectQueryData = (
    queryClient: ReturnType<typeof useQueryClient>,
    project: MultiEnduranceProjectDto,
) => {
    queryClient.setQueryData(
        ProjectKey.detail(project.id),
        setMultiEnduranceProjectQueryData(queryClient, project),
    );
    queryClient.invalidateQueries({
        queryKey: ProjectKey.detail(project.id),
    });
    queryClient.invalidateQueries({ queryKey: ProjectKey.list });
};
