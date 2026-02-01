import ProjectView from "./ProjectView";

import type { Project } from "@/domain/projects/Project";

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
    return (
        <ProjectView
            projectId={project.id}
            projectStatus={project.status}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
        >
            <ProjectView.Action>
                <ProjectView.EditButton onEdit={onEdit} />
                <ProjectView.CancelButton />
                <ProjectView.SaveButton onSave={onSave} />

                <ProjectView.DeleteButton />

                <ProjectView.ActivateButton />
                <ProjectView.FinishButton />
            </ProjectView.Action>

            <ProjectView.Header>
                <ProjectView.Title title={project.title} />
            </ProjectView.Header>

            <ProjectView.Body>{children}</ProjectView.Body>
        </ProjectView>
    );
};

export default ProjectLayout;
