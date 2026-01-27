import { supabase } from "@/lib/supabase";

type CreateEnduranceProjectParams = {
    title: string;
    targetCount: number;
};

export const createEnduranceProject = async ({
    title,
    targetCount,
}: CreateEnduranceProjectParams) => {
    const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
            title,
            type: "endurance",
            status: "scheduled",
        })
        .select()
        .single();

    if (projectError) {
        throw projectError;
    }

    const { error: settingsError } = await supabase
        .from("endurance_settings")
        .insert({
            project_id: project.id,
            target_count: targetCount,
            increment_per_action: 1,
        });

    if (settingsError) {
        throw settingsError;
    }

    const { error: progressError } = await supabase
        .from("endurance_progress")
        .insert({
            project_id: project.id,
            current_count: 0,
        });

    if (progressError) {
        throw progressError;
    }

    return project.id;
};
