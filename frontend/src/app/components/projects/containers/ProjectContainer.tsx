import ProjectView from "../../ui/ProjectView";

import { useProjectContext } from "@/contexts/projects/useProjectContext";

type Props = {
    /** 各企画固有のコンテンツ */
    children: React.ReactNode;
    isSaveDisabled: boolean;
    onEdit: () => void;
    onSave: () => void;
    onDuplicate: () => void;
};

/** 企画の共通レイアウト */
const ProjectContainer = ({
    children,
    isSaveDisabled,
    onEdit,
    onSave,
    onDuplicate,
}: Props) => {
    const { project, isEdit, setIsEdit } = useProjectContext();

    return (
        <ProjectView
            type={"content"}
            project={project}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
        >
            <ProjectView.Action>
                <ProjectView.EditButton onEdit={onEdit} />
                <ProjectView.CancelButton />
                <ProjectView.SaveButton
                    disabled={isSaveDisabled}
                    onSave={onSave}
                />

                <ProjectView.DuplicateButton onDuplicate={onDuplicate} />
                <ProjectView.DeleteButton />

                <ProjectView.ActivateButton />
                <ProjectView.FinishButton />
            </ProjectView.Action>

            <ProjectView.Body>
                <ProjectView.Title />
                {children}
            </ProjectView.Body>
        </ProjectView>
    );
};

export default ProjectContainer;
