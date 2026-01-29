import Project from "./Project";

type ProjectLayoutProps = {
    children: React.ReactNode;
    project: any;
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
        <Project
            projectId={project.id}
            projectStatus={project.status}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
        >
            <Project.Action>
                <Project.EditButton onEdit={onEdit} />
                <Project.CancelButton />
                <Project.SaveButton onSave={onSave} />

                <Project.DeleteButton />

                <Project.ActivateButton />
                <Project.FinishButton />
            </Project.Action>

            <Project.Header>
                <Project.Title title={project.title} />
            </Project.Header>

            <Project.Body>{children}</Project.Body>
        </Project>
    );
};

export default ProjectLayout;
