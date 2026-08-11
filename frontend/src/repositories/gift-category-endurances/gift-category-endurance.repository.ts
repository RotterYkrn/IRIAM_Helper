import { Context, Effect } from "effect";

import type { GiftCategoryEnduranceProjectDto } from "@/domain/gift-category-endurances/dto/GiftCategoryEnduranceProjectDto";
import type {
    CreateGiftCategoryEnduranceProjectArgs,
    CreateGiftCategoryEnduranceProjectReturns,
} from "@/domain/gift-category-endurances/rpcs/CreateGiftCategoryEnduranceProject";
import type {
    UpdateGiftCategoryEnduranceProjectArgs,
    UpdateGiftCategoryEnduranceProjectReturns,
} from "@/domain/gift-category-endurances/rpcs/UpdateGiftCategoryEnduranceProject";
import type { ProjectId } from "@/domain/projects/tables/Project";

export interface GiftCategoryEnduranceRepository {
    readonly getById: (
        projectId: ProjectId,
    ) => Effect.Effect<GiftCategoryEnduranceProjectDto, Error>;
    readonly create: (
        args: CreateGiftCategoryEnduranceProjectArgs,
    ) => Effect.Effect<CreateGiftCategoryEnduranceProjectReturns, Error>;
    readonly update: (
        args: UpdateGiftCategoryEnduranceProjectArgs,
    ) => Effect.Effect<UpdateGiftCategoryEnduranceProjectReturns, Error>;
    // readonly duplicate: (
    //     args: DuplicateMultiEnduranceProjectArgs,
    // ) => Effect.Effect<DuplicateMultiEnduranceProjectReturns, Error>;
    // readonly logActionHistory: (
    //     args: LogMultiEnduranceActionHistoryArgs,
    // ) => Effect.Effect<LogMultiEnduranceActionHistoryReturns, Error>;
}

export const GiftCategoryEnduranceRepository =
    Context.GenericTag<GiftCategoryEnduranceRepository>(
        "@repository/GiftCategoryEnduranceRepository",
    );
