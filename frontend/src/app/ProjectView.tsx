import { useAtom, useAtomValue } from "jotai";
import { createContext, useContext } from "react";

import {
    editTitleAtom,
    editTitleErrorAtom,
} from "@/atoms/projects/EditTitleAtom";
import ProjectButton from "@/components/projects/ProjectButton";

type ProjectContextType = {
    projectStatus: "scheduled" | "active" | "finished";
    isEdit: boolean;
};

const ProjectContext = createContext<ProjectContextType | null>(null);

const useProject = () => {
    const ctx = useContext(ProjectContext);
    if (!ctx) {
        throw new Error("Project components must be used within ProjectView");
    }
    return ctx;
};

type Props = ProjectContextType & {
    children: React.ReactNode;
};

const ProjectView = ({ children, ...contextValue }: Props) => {
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

const Header = ({ children }: ChildrenProps) => {
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
    const [state, setState] = useAtom(editTitleAtom);
    const error = useAtomValue(editTitleErrorAtom);

    if (isEdit) {
        return (
            <>
                <input
                    className="text-3xl font-bold text-center w-1/2 outline-none
                        border-b-2 border-gray-300 focus:border-gray-500
                        transition-colors"
                    defaultValue={state}
                    onChange={(e) => setState(e.target.value)}
                />
                {error && <p className="text-red-500">{error}</p>}
            </>
        );
    }

    return <h1 className="text-3xl font-bold">{title}</h1>;
};

const Body = ({ children }: ChildrenProps) => {
    return (
        <div className="mt-5 flex flex-col items-center gap-6">{children}</div>
    );
};

type EditButtonProps = {
    onEdit: () => void;
};

const EditButton = ({ onEdit }: EditButtonProps) => {
    const { projectStatus, isEdit } = useProject();

    if (projectStatus === "finished" || isEdit) {
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
    disabled: boolean;
    onSave: () => void;
}

const SaveButton = ({ disabled, onSave }: SaveButtonProps) => {
    const { isEdit } = useProject();

    if (!isEdit) {
        return null;
    }

    return (
        <ProjectButton
            disabled={disabled}
            onClick={onSave}
            className={
                disabled
                    ? "bg-gray-500 opacity-50"
                    : "bg-gray-500 hover:bg-gray-600"
            }
        >
            保存
        </ProjectButton>
    );
};

type CancelButtonProps = {
    onCancel: () => void;
};

const CancelButton = ({ onCancel }: CancelButtonProps) => {
    const { isEdit } = useProject();

    if (!isEdit) {
        return null;
    }

    return (
        <ProjectButton
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600"
        >
            キャンセル
        </ProjectButton>
    );
};

type DeleteButtonProps = {
    onDelete: () => void;
};

const DeleteButton = ({ onDelete }: DeleteButtonProps) => {
    const { projectStatus, isEdit } = useProject();

    if (projectStatus !== "scheduled" || isEdit) {
        return null;
    }

    return (
        <ProjectButton
            onClick={onDelete}
            className="bg-gray-500 hover:bg-red-600"
        >
            削除
        </ProjectButton>
    );
};

type ActivateButtonProps = {
    onActivate: () => void;
};

const ActivateButton = ({ onActivate }: ActivateButtonProps) => {
    const { projectStatus, isEdit } = useProject();

    if (projectStatus !== "scheduled" || isEdit) {
        return null;
    }

    return (
        <ProjectButton
            onClick={onActivate}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
            企画開始
        </ProjectButton>
    );
};

type FinishButtonProps = {
    onFinish: () => void;
};

const FinishButton = ({ onFinish }: FinishButtonProps) => {
    const { projectStatus, isEdit } = useProject();

    if (projectStatus !== "active" || isEdit) {
        return null;
    }

    return (
        <ProjectButton
            onClick={onFinish}
            className="bg-red-600 hover:bg-red-700"
        >
            企画終了
        </ProjectButton>
    );
};

ProjectView.Action = Action;
ProjectView.Header = Header;
ProjectView.Title = Title;
ProjectView.Body = Body;

ProjectView.EditButton = EditButton;
ProjectView.SaveButton = SaveButton;
ProjectView.CancelButton = CancelButton;
ProjectView.DeleteButton = DeleteButton;
ProjectView.ActivateButton = ActivateButton;
ProjectView.FinishButton = FinishButton;

export default ProjectView;
