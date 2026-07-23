import { GiftCategoryMappingChunk } from "@/domain/gifts/tables/GiftCategoryMappings";
import { supabase } from "@/lib/supabase";
import { queryAndDecode } from "@/utils/api";
import { Layer } from "effect";
import { GiftCategoryMappingRepository } from "./gift-category-mapping.repository";

export const GiftCategoryMappingSupabase = Layer.succeed(
    GiftCategoryMappingRepository,
    GiftCategoryMappingRepository.of({
        getAll: () =>
            queryAndDecode(
                () => supabase.from("gift_category_mappings").select("*"),
                GiftCategoryMappingChunk,
            ),
    }),
);
