import { useNavigate } from "react-router-dom";

import ProjectView from "./ProjectView";

import type { ProjectSchema } from "@/domain/projects/tables/Project";

type CreateProjectLayoutProps = {
    children: React.ReactNode;
    disabled: boolean;
    onSave: () => void;
};

const CreateProjectLayout = ({
    children,
    disabled,
    onSave,
}: CreateProjectLayoutProps) => {
    const navigate = useNavigate();

    const onCancel = () => {
        navigate("/");
    };

    return (
        <ProjectView
            projectStatus={"scheduled" as typeof ProjectSchema.Type.status}
            isEdit={true}
        >
            <ProjectView.Action>
                <ProjectView.CancelButton onCancel={onCancel} />
                <ProjectView.SaveButton
                    disabled={disabled}
                    onSave={onSave}
                />
            </ProjectView.Action>

            <ProjectView.Header>
                <ProjectView.Title title={""} />
            </ProjectView.Header>

            <ProjectView.Body>{children}</ProjectView.Body>
        </ProjectView>
    );
};

export default CreateProjectLayout;
