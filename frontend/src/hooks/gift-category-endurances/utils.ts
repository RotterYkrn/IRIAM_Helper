import type { useQueryClient } from "@tanstack/react-query";
import { Chunk, Option, pipe } from "effect";

import { EnduranceTargetCountSchema } from "@/domain/endurances/tables/EnduranceUnits";
import type { GiftCategoryEnduranceProjectDto } from "@/domain/gift-category-endurances/dto/GiftCategoryEnduranceProjectDto";
import { EnduranceKey } from "../query-keys/endurances";
import { ProjectKey } from "../query-keys/projects";

export const setGiftCategoryEnduranceProjectQueryData = (
    queryClient: ReturnType<typeof useQueryClient>,
    project: GiftCategoryEnduranceProjectDto,
) => {
    Chunk.map(project.units, (unit) => {
        queryClient.setQueryData(EnduranceKey.unit(unit.id), unit);
    });

    return {
        ...project,
        target_count: pipe(
            project.units,
            Chunk.head,
            Option.match({
                onNone: () => EnduranceTargetCountSchema.make(0),
                onSome: (unit) => unit.target_count,
            }),
        ),
        units: Chunk.map(project.units, (unit) => unit.id),
    };
};

export const updateGiftCategoryEnduranceProjectQueryData = (
    queryClient: ReturnType<typeof useQueryClient>,
    project: GiftCategoryEnduranceProjectDto,
) => {
    queryClient.setQueryData(
        ProjectKey.detail(project.id),
        setGiftCategoryEnduranceProjectQueryData(queryClient, project),
    );
    queryClient.invalidateQueries({
        queryKey: ProjectKey.detail(project.id),
    });
    queryClient.invalidateQueries({ queryKey: ProjectKey.list });
};
