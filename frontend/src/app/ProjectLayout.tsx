import { useAtomValue } from "jotai";

import Project from "./Project";

import { editEnduranceAtom } from "@/atoms/EditEnduranceAtom";
import ActivateProjectButton from "@/components/projects/ActivateProjectButton";
import CancelProjectButton from "@/components/projects/CancelButton";
import DeleteProjectButton from "@/components/projects/DeleteProjectButton";
import EditProjectButton from "@/components/projects/EditProjectButton";
import FinishProjectButton from "@/components/projects/FinishProjectButton";
import SaveProjectButton from "@/components/projects/SaveProjectButton";
import { supabase } from "@/lib/supabase";

type ProjectLayoutProps = {
    children: React.ReactNode;
    project: any;
    isEdit: boolean;
    setIsEdit: (v: boolean) => void;
    onSave: () => void;
};

const ProjectLayout = ({
    children,
    project,
    isEdit,
    setIsEdit,
}: ProjectLayoutProps) => {
    const state = useAtomValue(editEnduranceAtom);

    const save = async () => {
        await supabase.rpc("update_endurance_project", {
            p_project_id: project.id,
            p_title: state.title,
            p_target_count: state.targetCount,
        });

        setIsEdit(false);
    };

    return (
        <Project>
            <Project.Header>
                {!isEdit ? (
                    <EditProjectButton onClick={() => setIsEdit(true)} />
                ) : (
                    <>
                        <CancelProjectButton onClick={() => setIsEdit(false)} />
                        <SaveProjectButton
                            projectId={project.id}
                            onSave={save}
                        />
                    </>
                )}
                {project.status === "scheduled" && !isEdit && (
                    <DeleteProjectButton projectId={project.id} />
                )}
                {project.status === "scheduled" && !isEdit && (
                    <ActivateProjectButton projectId={project.id} />
                )}
                {project.status === "active" && !isEdit && (
                    <FinishProjectButton projectId={project.id} />
                )}
            </Project.Header>
            <Project.Title
                title={project.title}
                isEditing={isEdit}
            />

            <Project.Body>{children}</Project.Body>
        </Project>
    );
};

export default ProjectLayout;
