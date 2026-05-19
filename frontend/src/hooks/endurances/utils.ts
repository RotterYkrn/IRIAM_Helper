import { useQueryClient } from "@tanstack/react-query";
import { Chunk } from "effect";

import { EnduranceKey } from "../query-keys/endurances";
import { ProjectKey } from "../query-keys/projects";

import type { EnduranceProjectDto } from "@/domain/endurances/dto/EnduranceProjectDto";

export const setEnduranceProjectQueryData = (
    queryClient: ReturnType<typeof useQueryClient>,
    project: EnduranceProjectDto,
) => {
    Chunk.map(project.rescue_actions, (action) => {
        queryClient.setQueryData(EnduranceKey.action(action.id), action);
    });
    Chunk.map(project.sabotage_actions, (action) => {
        queryClient.setQueryData(EnduranceKey.action(action.id), action);
    });

    return {
        ...project,
        rescue_actions: Chunk.map(
            project.rescue_actions,
            (action) => action.id,
        ),
        sabotage_actions: Chunk.map(
            project.sabotage_actions,
            (action) => action.id,
        ),
    };
};

export const updateEnduranceProjectQueryData = (
    queryClient: ReturnType<typeof useQueryClient>,
    project: EnduranceProjectDto,
) => {
    queryClient.setQueryData(
        ProjectKey.detail(project.id),
        setEnduranceProjectQueryData(queryClient, project),
    );
    queryClient.invalidateQueries({
        queryKey: ProjectKey.detail(project.id),
    });
    queryClient.invalidateQueries({ queryKey: ProjectKey.list });
};
