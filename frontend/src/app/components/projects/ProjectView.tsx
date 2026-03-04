import { useAtom, useAtomValue } from "jotai";
import { createContext, useContext } from "react";

import {
    editTitleAtom,
    editTitleErrorAtom,
} from "@/atoms/projects/EditTitleAtom";
import type { ProjectSchema } from "@/domain/projects/tables/Project";
import ProjectButton from "@/utils/components/ProjectButton";

/**
 * コンポーネント描画に必要な状態を共有する Context
 */
type ProjectContextType = {
    projectStatus: typeof ProjectSchema.Type.status;
    isEdit: boolean;
};

const ProjectContext = createContext<ProjectContextType | null>(null);

/**
 * {@link ProjectContext} の値を取得するためのカスタムフック
 *
 * @note {@link ProjectView} 内で使用する必要があります。
 *
 * @throws ProjectView 外から呼び出された場合にスローされます。
 *
 * @returns {} {@link ProjectContextType}
 */
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

/**
 * 企画共通のコンポーネント群
 *
 * @param contextValue 内部で使用するコンテキスト ({@link ProjectContextType})
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

type ActionProps = {
    children: React.ReactNode;
    /** 表示しているページを説明する用 */
    pageName: string;
};

/** 企画操作に関するコンポーネント群を配置する用 */
const Action = ({ children, pageName }: ActionProps) => {
    return (
        <div className="flex w-full items-start justify-between gap-2">
            <div className="flex flex-col gap-2">
                <span className="text-2xl font-bold">{pageName}</span>
            </div>
            <div className="flex gap-2">{children}</div>
        </div>
    );
};

/** 企画共通の情報を表示するコンポーネント群を配置する用 */
const Header = ({ children }: ChildrenProps) => {
    return (
        <div className="flex flex-col w-full items-center justify-between gap-2">
            {children}
        </div>
    );
};

type TitleProps = {
    title: string;
};

/**
 * 企画タイトルの表示と、編集中に表示される入力欄を含みます。
 */
const Title = ({ title }: TitleProps) => {
    const { isEdit } = useProject();
    const [state, setState] = useAtom(editTitleAtom);
    const error = useAtomValue(editTitleErrorAtom);

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
                            className="text-3xl font-bold text-center
                                outline-none border-b-2 border-gray-300
                                focus:border-gray-500 transition-colors"
                            defaultValue={state}
                            onChange={(e) => setState(e.target.value)}
                        />
                        {error && (
                            <p
                                className="absolute top-full mt-1 text-red-500
                                    text-sm whitespace-nowrap"
                            >
                                {error}
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
    return (
        <div className="mt-5 flex flex-col items-center gap-6">{children}</div>
    );
};

type EditButtonProps = {
    onEdit: () => void;
};

const EditButton = ({ onEdit }: EditButtonProps) => {
    const { projectStatus, isEdit } = useProject();

    if (projectStatus !== "scheduled" || isEdit) {
        return null;
    }

    return (
        <ProjectButton
            onClick={onEdit}
            className="bg-gray-500 enabled:hover:bg-gray-600"
        >
            編集
        </ProjectButton>
    );
};

type SaveButtonProps = {
    /** バリデーションなどによって、保存ボタンを無効化するかどうかを指定できます */
    disabled: boolean;
    /** 企画の種類によって保存処理が違うので、外部から渡します。 */
    onSave: () => void;
};

const SaveButton = ({ disabled, onSave }: SaveButtonProps) => {
    const { isEdit } = useProject();

    if (!isEdit) {
        return null;
    }

    return (
        <ProjectButton
            disabled={disabled}
            onClick={onSave}
            className="bg-gray-500 enabled:hover:bg-gray-600"
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
            className="bg-gray-500 enabled:hover:bg-gray-600"
        >
            キャンセル
        </ProjectButton>
    );
};

type DuplicateButtonProps = {
    /** 企画の種類によって複製処理が違うので、外部から渡します。 */
    onDuplicate: () => void;
};

const DuplicateButton = ({ onDuplicate }: DuplicateButtonProps) => {
    const { projectStatus, isEdit } = useProject();

    if (projectStatus === "active" || isEdit) {
        return null;
    }

    return (
        <ProjectButton
            onClick={onDuplicate}
            className="bg-gray-500 enabled:hover:bg-gray-600"
        >
            コピー
        </ProjectButton>
    );
};

type DeleteButtonProps = {
    onDelete: () => void;
};

const DeleteButton = ({ onDelete }: DeleteButtonProps) => {
    const { projectStatus, isEdit } = useProject();

    if (projectStatus === "active" || isEdit) {
        return null;
    }

    return (
        <ProjectButton
            onClick={onDelete}
            className="bg-gray-500 enabled:hover:bg-red-600"
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
            className="bg-green-600 enabled:hover:bg-green-700"
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
            className="bg-red-600 enabled:hover:bg-red-700"
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
ProjectView.DuplicateButton = DuplicateButton;
ProjectView.DeleteButton = DeleteButton;
ProjectView.ActivateButton = ActivateButton;
ProjectView.FinishButton = FinishButton;

export default ProjectView;
