import { supabase } from "@/lib/supabase";

export const fetchProjectsByStatus = async () => {
    const { data, error } = await supabase
        .from("projects")
        .select("id, title, type, status")
        .order("created_at", { ascending: false });

    if (error) {
        throw error;
    }

    return {
        scheduled: data.filter((p) => p.status === "scheduled") ?? [],
        active: data.filter((p) => p.status === "active") ?? [],
        finished: data.filter((p) => p.status === "finished") ?? [],
    };
};
