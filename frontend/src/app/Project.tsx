import { useAtom } from "jotai";
import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { editProjectAtom } from "@/atoms/EditProjectAtom";
import ProjectButton from "@/components/projects/ProjectButton";
import { useActivateProject } from "@/hooks/useActivateProject";
import { useDeleteProject } from "@/hooks/useDeleteProject";
import { useFinishProject } from "@/hooks/useFinishProject";

type ProjectContextType = {
    projectId: string;
    projectStatus: "scheduled" | "active" | "finished";
    isEdit: boolean;
    setIsEdit: (v: boolean) => void;
};

const ProjectContext = createContext<ProjectContextType | null>(null);

const useProject = () => {
    const ctx = useContext(ProjectContext);
    if (!ctx) {
        throw new Error("Project components must be used within Project");
    }
    return ctx;
};

type Props = ProjectContextType & {
    children: React.ReactNode;
};

const Project = ({ children, ...contextValue }: Props) => {
    return (
        <ProjectContext value={contextValue}>
            <div
                className="flex flex-col h-full w-full items-center
                    justify-center gap-6"
            >
                {children}
            </div>
        </ProjectContext>
    );
};

type ChildrenProps = {
    children: React.ReactNode;
};

const Action = ({ children }: ChildrenProps) => {
    return (
        <div className="flex w-full items-start justify-end gap-2">
            {children}
        </div>
    );
};

type HeaderProps = {
    children: React.ReactNode;
};

const Header = ({ children }: HeaderProps) => {
    return (
        <div className="flex flex-col w-full items-center justify-center gap-2">
            {children}
        </div>
    );
};

type TitleProps = {
    title: string;
};

const Title = ({ title }: TitleProps) => {
    const { isEdit } = useProject();
    const [state, setState] = useAtom(editProjectAtom);

    if (isEdit) {
        return (
            <input
                className="text-3xl font-bold text-center w-full"
                value={state.title}
                onChange={(e) =>
                    setState({
                        ...state,
                        title: e.target.value,
                    })
                }
            />
        );
    }

    return <h1 className="text-3xl font-bold">{title}</h1>;
};

const Body = ({ children }: ChildrenProps) => {
    return (
        <div className="mt-10 flex flex-col items-center gap-6">{children}</div>
    );
};

type EditButtonProps = {
    onEdit: () => void;
};

const EditButton = ({ onEdit }: EditButtonProps) => {
    const { isEdit } = useProject();

    if (isEdit) {
        return null;
    }

    return (
        <ProjectButton
            onClick={onEdit}
            className="bg-gray-500 hover:bg-gray-600"
        >
            編集
        </ProjectButton>
    );
};

interface SaveButtonProps {
    onSave: () => void;
}

const SaveButton = ({ onSave }: SaveButtonProps) => {
    const { isEdit } = useProject();

    if (!isEdit) {
        return null;
    }

    return (
        <ProjectButton
            onClick={onSave}
            className="bg-gray-500 hover:bg-gray-600"
        >
            保存
        </ProjectButton>
    );
};

const CancelButton = () => {
    const { isEdit, setIsEdit } = useProject();

    if (!isEdit) {
        return null;
    }

    return (
        <ProjectButton
            onClick={() => setIsEdit(false)}
            className="bg-gray-500 hover:bg-gray-600"
        >
            キャンセル
        </ProjectButton>
    );
};

const DeleteButton = () => {
    const { projectId, projectStatus, isEdit } = useProject();
    const deleteMutation = useDeleteProject();
    const navigate = useNavigate();

    if (projectStatus !== "scheduled" || isEdit) {
        return null;
    }

    const onClick = () => {
        if (!confirm("この企画を削除しますか？")) return;
        deleteMutation.mutate(projectId, {
            onSuccess: () => {
                navigate("/");
            },
        });
    };

    return (
        <ProjectButton
            onClick={onClick}
            className="bg-gray-500 hover:bg-red-600"
        >
            削除
        </ProjectButton>
    );
};

const ActivateButton = () => {
    const { projectId, projectStatus, isEdit } = useProject();
    const activateMutation = useActivateProject();

    if (projectStatus !== "scheduled" || isEdit) {
        return null;
    }

    return (
        <ProjectButton
            onClick={() => activateMutation.mutate(projectId)}
            disabled={activateMutation.isPending}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
            配信開始
        </ProjectButton>
    );
};

const FinishButton = () => {
    const { projectId, projectStatus, isEdit } = useProject();
    const finishMutation = useFinishProject();

    if (projectStatus !== "active" || isEdit) {
        return null;
    }

    return (
        <ProjectButton
            onClick={() => finishMutation.mutate(projectId)}
            disabled={finishMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
        >
            配信終了
        </ProjectButton>
    );
};

Project.Action = Action;
Project.Header = Header;
Project.Title = Title;
Project.Body = Body;

Project.EditButton = EditButton;
Project.SaveButton = SaveButton;
Project.CancelButton = CancelButton;
Project.DeleteButton = DeleteButton;
Project.ActivateButton = ActivateButton;
Project.FinishButton = FinishButton;

export default Project;
