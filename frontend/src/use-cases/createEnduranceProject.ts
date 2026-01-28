import { supabase } from "@/lib/supabase";

type CreateEnduranceProjectParams = {
    title: string;
    targetCount: number;
};

export const createEnduranceProject = async ({
    title,
    targetCount,
}: CreateEnduranceProjectParams) => {
    const { data, error } = await supabase.rpc("create_endurance_project", {
        p_title: title,
        p_target_count: targetCount,
    });

    if (error) {
        throw error;
    }

    return data as string;
};
