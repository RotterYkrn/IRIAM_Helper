import { supabase } from "@/lib/supabase";

export const fetchEnduranceSettings = async (projectId: string) => {
    const { data, error } = await supabase
        .from("endurance_settings")
        .select("*")
        .eq("project_id", projectId)
        .single();

    if (error) throw error;
    return data;
};
