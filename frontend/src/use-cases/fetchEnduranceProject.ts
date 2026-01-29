import { supabase } from "@/lib/supabase";

export const fetchEnduranceProject = async (projectId: string) => {
    const { data, error } = await supabase
        .from("endurance_project_view")
        .select("*")
        .eq("id", projectId)
        .single();

    if (error) throw error;
    return data;
};
