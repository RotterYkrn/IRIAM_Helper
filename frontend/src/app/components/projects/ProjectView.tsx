import { useAtom } from "jotai";
import { createContext, useContext } from "react";

import ProjectActionLayout from "./layouts/ProjectActionLayout";
import ProjectBodyLayout from "./layouts/ProjectBodyLayout";
import {
    ActivateButtonBase,
    CancelButtonBase,
    DeleteButtonBase,
    DuplicateButtonBase,
    EditButtonBase,
    FinishButtonBase,
    SaveButtonBase,
} from "./layouts/ProjectButtons";
import ProjectHeaderLayout from "./layouts/ProjectHeaderLayout";

import { editTitleAtom } from "@/atoms/projects/EditTitleAtom";
import type { ProjectSchema } from "@/domain/projects/tables/Project";

/**
 * コンポーネント描画に必要な状態を共有する Context
 */
type ProjectViewContextType = {
    projectStatus: typeof ProjectSchema.Type.status;
    isEdit: boolean;
};

const ProjectViewContext = createContext<ProjectViewContextType | null>(null);

/**
 * {@link ProjectViewContext} の値を取得するためのカスタムフック
 *
 * @note {@link ProjectView} 内で使用する必要があります。
 *
 * @throws ProjectView 外から呼び出された場合にスローされます。
 *
 * @returns {} {@link ProjectViewContextType}
 */
const useProjectViewContext = () => {
    const ctx = useContext(ProjectViewContext);
    if (!ctx) {
        throw new Error("Project components must be used within ProjectView");
    }
    return ctx;
};

type Props = ProjectViewContextType & {
    children: React.ReactNode;
};

/**
 * 企画共通のコンポーネント群
 *
 * @param contextValue 内部で使用するコンテキスト ({@link ProjectViewContextType})
 *
 * @example
 * ```tsx
 * <ProjectView
 *     projectStatus={project.status}
 *     isEdit={isEdit}
 * >
 *     // 編集、削除など、企画操作に関するコンポーネントを配置する
 *     <ProjectView.Action pageName="">
 *         <ProjectView.EditButton onEdit={onEdit} />
 *         <ProjectView.CancelButton onCancel={onCancel} />
 *         <ProjectView.SaveButton
 *             disabled={isSaveDisabled}
 *             onSave={onSave}
 *         />
 *
 *         <ProjectView.DuplicateButton onDuplicate={onDuplicate} />
 *         <ProjectView.DeleteButton onDelete={onDelete} />
 *
 *         <ProjectView.ActivateButton onActivate={onActivate} />
 *         <ProjectView.FinishButton onFinish={onFinish} />
 *     </ProjectView.Action>
 *
 *     // 企画共通の情報を表示するコンポーネントを配置する
 *     <ProjectView.Header>
 *         <ProjectView.Title title={project.title} />
 *     </ProjectView.Header>
 *
 *     // 各企画固有のコンテンツを配置する
 *     <ProjectView.Body>{children}</ProjectView.Body>
 * </ProjectView>
 * ```
 */
const ProjectView = ({ children, ...contextValue }: Props) => {
    return (
        <ProjectViewContext value={contextValue}>
            <div
                className="flex flex-col h-full w-full items-center
                    justify-center gap-6"
            >
                {children}
            </div>
        </ProjectViewContext>
    );
};

type ChildrenProps = {
    children: React.ReactNode;
};

type ActionProps = {
    children: React.ReactNode;
    /** 表示しているページを説明する用 */
    pageName: string;
};

/** 企画操作に関するコンポーネント群を配置する用 */
const Action = ({ children, pageName }: ActionProps) => {
    return (
        <ProjectActionLayout pageName={pageName}>
            {children}
        </ProjectActionLayout>
    );
};

/** 企画共通の情報を表示するコンポーネント群を配置する用 */
const Header = ({ children }: ChildrenProps) => {
    return <ProjectHeaderLayout>{children}</ProjectHeaderLayout>;
};

type TitleProps = {
    title: string;
};

/**
 * 企画タイトルの表示と、編集中に表示される入力欄を含みます。
 */
const Title = ({ title }: TitleProps) => {
    const { isEdit } = useProjectViewContext();
    const [state, setState] = useAtom(editTitleAtom);

    if (isEdit) {
        return (
            <>
                <label
                    htmlFor="project-title"
                    className="relative flex flex-col items-center"
                >
                    {/* 左上に配置されるキャプション */}
                    <span
                        className="absolute -top-6 left-0 text-md font-medium
                            text-gray-600"
                    >
                        企画タイトル
                    </span>

                    <div className="flex flex-col items-center">
                        <input
                            id="project-title"
                            className="text-3xl font-bold text-center
                                outline-none border-b-2 border-gray-300
                                focus:border-gray-500 transition-colors"
                            defaultValue={state.input}
                            onChange={(e) => setState(e.target.value)}
                        />
                        {state.error && (
                            <p
                                className="absolute top-full mt-1 text-red-500
                                    text-sm whitespace-nowrap"
                            >
                                {state.error}
                            </p>
                        )}
                    </div>
                </label>
            </>
        );
    }

    return <h1 className="text-3xl font-bold">{title}</h1>;
};

/** 各企画固有のコンテンツを配置する用 */
const Body = ({ children }: ChildrenProps) => {
    return <ProjectBodyLayout>{children}</ProjectBodyLayout>;
};

type EditButtonProps = {
    onEdit: () => void;
};

const EditButton = ({ onEdit }: EditButtonProps) => {
    const { projectStatus, isEdit } = useProjectViewContext();

    if (projectStatus !== "scheduled" || isEdit) {
        return null;
    }

    return <EditButtonBase onClick={onEdit} />;
};

type SaveButtonProps = {
    /** バリデーションなどによって、保存ボタンを無効化するかどうかを指定できます */
    disabled: boolean;
    /** 企画の種類によって保存処理が違うので、外部から渡します。 */
    onSave: () => void;
};

const SaveButton = ({ disabled, onSave }: SaveButtonProps) => {
    const { isEdit } = useProjectViewContext();

    if (!isEdit) {
        return null;
    }

    return (
        <SaveButtonBase
            onClick={onSave}
            disabled={disabled}
        />
    );
};

type CancelButtonProps = {
    onCancel: () => void;
};

const CancelButton = ({ onCancel }: CancelButtonProps) => {
    const { isEdit } = useProjectViewContext();

    if (!isEdit) {
        return null;
    }

    return <CancelButtonBase onClick={onCancel} />;
};

type DuplicateButtonProps = {
    /** 企画の種類によって複製処理が違うので、外部から渡します。 */
    onDuplicate: () => void;
};

const DuplicateButton = ({ onDuplicate }: DuplicateButtonProps) => {
    const { projectStatus, isEdit } = useProjectViewContext();

    if (projectStatus === "active" || isEdit) {
        return null;
    }

    return <DuplicateButtonBase onClick={onDuplicate} />;
};

type DeleteButtonProps = {
    onDelete: () => void;
};

const DeleteButton = ({ onDelete }: DeleteButtonProps) => {
    const { projectStatus, isEdit } = useProjectViewContext();

    if (projectStatus === "active" || isEdit) {
        return null;
    }

    return <DeleteButtonBase onClick={onDelete} />;
};

type ActivateButtonProps = {
    onActivate: () => void;
};

const ActivateButton = ({ onActivate }: ActivateButtonProps) => {
    const { projectStatus, isEdit } = useProjectViewContext();

    if (projectStatus !== "scheduled" || isEdit) {
        return null;
    }

    return <ActivateButtonBase onClick={onActivate} />;
};

type FinishButtonProps = {
    onFinish: () => void;
};

const FinishButton = ({ onFinish }: FinishButtonProps) => {
    const { projectStatus, isEdit } = useProjectViewContext();

    if (projectStatus !== "active" || isEdit) {
        return null;
    }

    return <FinishButtonBase onClick={onFinish} />;
};

ProjectView.Action = Action;
ProjectView.Header = Header;
ProjectView.Title = Title;
ProjectView.Body = Body;

ProjectView.EditButton = EditButton;
ProjectView.SaveButton = SaveButton;
ProjectView.CancelButton = CancelButton;
ProjectView.DuplicateButton = DuplicateButton;
ProjectView.DeleteButton = DeleteButton;
ProjectView.ActivateButton = ActivateButton;
ProjectView.FinishButton = FinishButton;

export default ProjectView;
