import { useNavigate } from "react-router-dom";

import ProjectView from "../../ui/ProjectView";

import { useProjectContext } from "@/contexts/projects/useProjectContext";
import { useActivateProject } from "@/hooks/projects/useActivateProject";
import { useDeleteProject } from "@/hooks/projects/useDeleteProject";
import { useFinishProject } from "@/hooks/projects/useFinishProject";
import { successToast, errorToast } from "@/utils/toast";

type Props = {
    /** 各企画固有のコンテンツ */
    children: React.ReactNode;
    isPendingAction: boolean;
    canSave: boolean;
    isSaving: boolean;
    onEdit: () => void;
    onSave: () => void;
    onDuplicate: () => void;
};

/** 企画の共通レイアウト */
const ProjectContainer = ({
    children,
    isPendingAction,
    canSave,
    isSaving,
    onEdit,
    onSave,
    onDuplicate,
}: Props) => {
    const navigate = useNavigate();

    const { project, isEdit, setIsEdit } = useProjectContext();
    const { activate, isActivating } = useActivateProject();
    const { finish, isFinishing } = useFinishProject();
    const { delete: deleteProject, isDeleting } = useDeleteProject();

    const onActivate = () => {
        if (
            !confirm(
                "企画を開催しますか？（開催すると、開催前に戻せなくなります。）",
            )
        ) {
            return;
        }

        activate(
            { project_id: project.id },
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

    const onFinish = () => {
        if (
            !confirm(
                "企画を終了しますか？（終了すると、終了前に戻せなくなります。）",
            )
        ) {
            return;
        }

        finish(
            { project_id: project.id },
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

        deleteProject(
            { project_id: project.id },
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

    const onCancel = () => {
        if (!confirm("変更を破棄しますか？")) {
            return;
        }
        setIsEdit(false);
    };

    const isPending =
        isPendingAction || isActivating || isFinishing || isDeleting;

    return (
        <ProjectView
            type={"content"}
            project={project}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
        >
            <ProjectView.Action>
                <ProjectView.EditButton
                    disabled={isPending}
                    onEdit={onEdit}
                />
                <ProjectView.CancelButton
                    disabled={isSaving}
                    onClick={onCancel}
                />
                <ProjectView.SaveButton
                    disabled={!canSave || isSaving}
                    onSave={onSave}
                />

                <ProjectView.DuplicateButton
                    disabled={isPending}
                    onDuplicate={onDuplicate}
                />
                <ProjectView.DeleteButton
                    disabled={isPending}
                    onClick={onDelete}
                />

                <ProjectView.ActivateButton
                    disabled={isPending}
                    onClick={onActivate}
                />
                <ProjectView.FinishButton
                    disabled={isPending}
                    onClick={onFinish}
                />
            </ProjectView.Action>

            <ProjectView.Body>
                <ProjectView.Title />
                {children}
            </ProjectView.Body>
        </ProjectView>
    );
};

export default ProjectContainer;
