import { useNavigate } from "react-router-dom";

import ProjectView from "./ProjectView";

import type { Project } from "@/domain/projects/tables/Project";
import { useActivateProject } from "@/hooks/projects/useActivateProject";
import { useDeleteProject } from "@/hooks/projects/useDeleteProject";
import { useFinishProject } from "@/hooks/projects/useFinishProject";

type ProjectLayoutProps = {
    children: React.ReactNode;
    project: Omit<Project, "type" | "created_at" | "updated_at">;
    isEdit: boolean;
    setIsEdit: (v: boolean) => void;
    onEdit: () => void;
    onSave: () => void;
};

const ProjectLayout = ({
    children,
    project,
    isEdit,
    setIsEdit,
    onEdit,
    onSave,
}: ProjectLayoutProps) => {
    const navigate = useNavigate();
    const deleteMutation = useDeleteProject();
    const activateMutation = useActivateProject();
    const finishMutation = useFinishProject();

    const onCancel = () => {
        setIsEdit(false);
    };

    const onDelete = () => {
        if (!confirm("この企画を削除しますか？")) return;
        deleteMutation.mutate(
            { p_project_id: project.id },
            {
                onSuccess: () => {
                    navigate("/");
                },
            },
        );
    };

    const onActivate = () => {
        activateMutation.mutate({ p_project_id: project.id });
    };

    const onFinish = () => {
        finishMutation.mutate({ p_project_id: project.id });
    };

    return (
        <ProjectView
            projectStatus={project.status}
            isEdit={isEdit}
        >
            <ProjectView.Action>
                <ProjectView.EditButton onEdit={onEdit} />
                <ProjectView.CancelButton onCancel={onCancel} />
                <ProjectView.SaveButton onSave={onSave} />

                <ProjectView.DeleteButton onDelete={onDelete} />

                <ProjectView.ActivateButton onActivate={onActivate} />
                <ProjectView.FinishButton onFinish={onFinish} />
            </ProjectView.Action>

            <ProjectView.Header>
                <ProjectView.Title title={project.title} />
            </ProjectView.Header>

            <ProjectView.Body>{children}</ProjectView.Body>
        </ProjectView>
    );
};

export default ProjectLayout;
