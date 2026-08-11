import { GiftCategoryEnduranceProjectDto } from "@/domain/gift-category-endurances/dto/GiftCategoryEnduranceProjectDto";
import {
    CreateGiftCategoryEnduranceProjectArgs,
    CreateGiftCategoryEnduranceProjectReturns,
} from "@/domain/gift-category-endurances/rpcs/CreateGiftCategoryEnduranceProject";
import {
    UpdateGiftCategoryEnduranceProjectArgs,
    UpdateGiftCategoryEnduranceProjectReturns,
} from "@/domain/gift-category-endurances/rpcs/UpdateGiftCategoryEnduranceProject";
import { supabase } from "@/lib/supabase";
import { queryAndDecode } from "@/utils/api";
import { Layer, Schema } from "effect";
import { GiftCategoryEnduranceRepository } from "./gift-category-endurance.repository";

export const GiftCategoryEnduranceSupabase = Layer.succeed(
    GiftCategoryEnduranceRepository,
    GiftCategoryEnduranceRepository.of({
        getById: (projectId) =>
            queryAndDecode(
                () =>
                    supabase
                        .from("gift_category_endurance_project_dto")
                        .select("*")
                        .eq("id", projectId)
                        .single(),
                GiftCategoryEnduranceProjectDto,
            ),
        create: (args) =>
            queryAndDecode(
                () =>
                    supabase.rpc(
                        "create_gift_category_endurance_project",
                        // 要求される型に readonly がついておらず渡すことができないため、
                        // encodeSync を通したうえで any を使っています。
                        Schema.encodeSync(
                            CreateGiftCategoryEnduranceProjectArgs,
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        )(args) as any,
                    ),
                CreateGiftCategoryEnduranceProjectReturns,
            ),
        update: (args) =>
            queryAndDecode(
                () =>
                    supabase.rpc(
                        "update_gift_category_endurance_project",
                        // 要求される型に readonly がついておらず渡すことができないため、
                        // encodeSync を通したうえで any を使っています。
                        Schema.encodeSync(
                            UpdateGiftCategoryEnduranceProjectArgs,
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        )(args) as any,
                    ),
                UpdateGiftCategoryEnduranceProjectReturns,
            ),
        // duplicate: (args) =>
        //     queryAndDecode(
        //         () =>
        //             supabase.rpc(
        //                 "duplicate_gift_category_endurance_project",
        //                 Schema.encodeSync(
        //                     DuplicateGiftCategoryEnduranceProjectArgsSchema,
        //                 )(args),
        //             ),
        //         DuplicateGiftCategoryEnduranceProjectReturnsSchema,
        //     ),
        // logActionHistory: (args) =>
        //     queryAndDecode(
        //         () =>
        //             supabase.rpc(
        //                 "log_gift_category_endurance_action_history",
        //                 Schema.encodeSync(
        //                     LogGiftCategoryEnduranceActionHistoryArgsSchema,
        //                 )(args),
        //             ),
        //         LogGiftCategoryEnduranceActionHistoryReturnsSchema,
        //     ),
    }),
);
