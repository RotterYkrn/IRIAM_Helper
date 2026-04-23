import { useAtom } from "jotai";
import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

import ProjectActionLayout from "../projects/layouts/ProjectActionLayout";
import ProjectBodyLayout from "../projects/layouts/ProjectBodyLayout";
import ProjectHeaderLayout from "../projects/layouts/ProjectHeaderLayout";

import {
    ActivateButtonBase,
    CancelButtonBase,
    DeleteButtonBase,
    DuplicateButtonBase,
    EditButtonBase,
    FinishButtonBase,
    SaveButtonBase,
} from "./ProjectButtons";
import TitleInput from "./TitleInput";

import { editTitleAtom } from "@/atoms/projects/EditTitleAtom";
import type { ProjectDtoSchema } from "@/domain/projects/dto/ProjectDto";
import { ProjectStatus } from "@/domain/projects/tables/Project";
import { useActivateProject } from "@/hooks/projects/useActivateProject";
import { useDeleteProject } from "@/hooks/projects/useDeleteProject";
import { useFinishProject } from "@/hooks/projects/useFinishProject";
import { successToast, errorToast } from "@/utils/toast";

/**
 * コンポーネント描画に必要な状態を共有する Context
 */
type ProjectViewContextType =
    | { type: "create" }
    | {
          type: "content";
          project: typeof ProjectDtoSchema.Type;
          isEdit: boolean;
          setIsEdit: (isEdit: boolean) => void;
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
 *         <ProjectView.Title />
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
    pageName?: string;
};

/** 企画操作に関するコンポーネント群を配置する用 */
const Action = ({ children, pageName }: ActionProps) => {
    return (
        <ProjectActionLayout pageName={pageName || ""}>
            {children}
        </ProjectActionLayout>
    );
};

/** 企画共通の情報を表示するコンポーネント群を配置する用 */
const Header = ({ children }: ChildrenProps) => {
    return <ProjectHeaderLayout>{children}</ProjectHeaderLayout>;
};

/**
 * 企画タイトルの表示と、編集中に表示される入力欄を含みます。
 */
const Title = () => {
    const context = useProjectViewContext();
    const [state, setState] = useAtom(editTitleAtom);

    if (context.type === "create" || context.isEdit) {
        return (
            <TitleInput
                titleState={state}
                setTitle={setState}
            />
        );
    }

    return <h1 className="text-3xl font-bold">{context.project.title}</h1>;
};

/** 各企画固有のコンテンツを配置する用 */
const Body = ({ children }: ChildrenProps) => {
    return <ProjectBodyLayout>{children}</ProjectBodyLayout>;
};

type EditButtonProps = {
    onEdit: () => void;
};

const EditButton = ({ onEdit }: EditButtonProps) => {
    const context = useProjectViewContext();

    if (
        context.type === "create" ||
        context.project.status !== ProjectStatus.SCHEDULED ||
        context.isEdit
    ) {
        return null;
    }

    const handleEdit = () => {
        onEdit();
        context.setIsEdit(true);
    };

    return <EditButtonBase onClick={handleEdit} />;
};

type SaveButtonProps = {
    /** バリデーションなどによって、保存ボタンを無効化するかどうかを指定できます */
    disabled: boolean;
    /** 企画の種類によって保存処理が違うので、外部から渡します。 */
    onSave: () => void;
};

const SaveButton = ({ disabled, onSave }: SaveButtonProps) => {
    const context = useProjectViewContext();

    if (context.type === "content" && !context.isEdit) {
        return null;
    }

    return (
        <SaveButtonBase
            onClick={onSave}
            disabled={disabled}
        />
    );
};

const CancelButton = () => {
    const context = useProjectViewContext();
    const navigate = useNavigate();

    if (context.type === "content" && !context.isEdit) {
        return null;
    }

    const handleCancel = () => {
        if (!confirm("変更を破棄しますか？")) {
            return;
        }
        switch (context.type) {
            case "create":
                navigate("/");
                break;
            case "content":
                context.setIsEdit(false);
                break;
        }
    };

    return <CancelButtonBase onClick={handleCancel} />;
};

type DuplicateButtonProps = {
    /** 企画の種類によって複製処理が違うので、外部から渡します。 */
    onDuplicate: () => void;
};

const DuplicateButton = ({ onDuplicate }: DuplicateButtonProps) => {
    const context = useProjectViewContext();

    if (
        context.type === "create" ||
        context.project.status === ProjectStatus.ACTIVE ||
        context.isEdit
    ) {
        return null;
    }

    return <DuplicateButtonBase onClick={onDuplicate} />;
};

type DeleteButtonProps = {
    onDelete: () => void;
};

const DeleteButton = () => {
    const context = useProjectViewContext();
    const deleteMutation = useDeleteProject();
    const navigate = useNavigate();

    if (
        context.type === "create" ||
        context.project.status === ProjectStatus.ACTIVE ||
        context.isEdit
    ) {
        return null;
    }

    const project = context.project;

    const onDelete = () => {
        if (!confirm("この企画を削除しますか？")) {
            return;
        }
        // 開催済みの場合は 2 重で確認します。
        if (
            project.status === "finished" &&
            !confirm("開催済みの企画です。本当に削除しますか？")
        ) {
            return;
        }
        deleteMutation.mutate(
            { p_project_id: project.id },
            {
                onSuccess: () => {
                    successToast(`「${project.title}」が削除されました`);
                    navigate("/");
                },
                onError: (error) => {
                    console.error(error);
                    errorToast(`「${project.title}」の削除に失敗しました`);
                },
            },
        );
    };

    return <DeleteButtonBase onClick={onDelete} />;
};

const ActivateButton = () => {
    const context = useProjectViewContext();
    const activateMutation = useActivateProject();

    if (
        context.type === "create" ||
        context.project.status !== ProjectStatus.SCHEDULED ||
        context.isEdit
    ) {
        return null;
    }

    const onActivate = () => {
        if (
            !confirm(
                "企画を開催しますか？（開催すると、開催前に戻せなくなります。）",
            )
        ) {
            return;
        }
        activateMutation.mutate(
            { p_project_id: context.project.id },
            {
                onSuccess: () => {
                    successToast("企画が開催されました");
                },
                onError: (error) => {
                    console.error(error);
                    errorToast("企画の開催に失敗しました");
                },
            },
        );
    };

    return <ActivateButtonBase onClick={onActivate} />;
};

const FinishButton = () => {
    const context = useProjectViewContext();
    const finishMutation = useFinishProject();

    if (
        context.type === "create" ||
        context.project.status !== ProjectStatus.ACTIVE ||
        context.isEdit
    ) {
        return null;
    }

    const onFinish = () => {
        if (
            !confirm(
                "企画を終了しますか？（終了すると、終了前に戻せなくなります。）",
            )
        ) {
            return;
        }
        finishMutation.mutate(
            { p_project_id: context.project.id },
            {
                onSuccess: () => {
                    successToast("企画が終了しました");
                },
                onError: (error) => {
                    console.error(error);
                    errorToast("企画の終了に失敗しました");
                },
            },
        );
    };

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
