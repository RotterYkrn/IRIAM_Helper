import { supabase } from "@/lib/supabase";

export const fetchProject = async (projectId: string) => {
    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

    if (error) throw error;
    return data;
};
