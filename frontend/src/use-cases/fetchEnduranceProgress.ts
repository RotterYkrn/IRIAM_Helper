import { supabase } from "@/lib/supabase";

export const fetchEnduranceProgress = async (projectId: string) => {
    const { data, error } = await supabase
        .from("endurance_progress")
        .select("*")
        .eq("project_id", projectId)
        .single();

    if (error) throw error;
    return data;
};
