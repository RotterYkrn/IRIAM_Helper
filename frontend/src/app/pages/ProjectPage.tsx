// pages/ProjectPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { supabase } from "@/lib/supabase";

const ProjectPage = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const [project, setProject] = useState<any>(null);

    useEffect(() => {
        if (!projectId) return;

        const fetchProject = async () => {
            const { data } = await supabase
                .from("projects")
                .select("*")
                .eq("id", projectId)
                .single();

            setProject(data);
        };

        fetchProject();
    }, [projectId]);

    if (!project) return <div>loading...</div>;

    return (
        <div>
            <h1>{project.title}</h1>
            <p>type: {project.type}</p>
            <p>status: {project.status}</p>

            {/* type に応じて編集画面を切り替える */}
        </div>
    );
};

export default ProjectPage;
