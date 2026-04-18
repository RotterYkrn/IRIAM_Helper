import { useNavigate } from "react-router-dom";

import ProjectView from "../ProjectView";

import { useProjectContext } from "@/contexts/projects/useProjectContext";
import { useActivateProject } from "@/hooks/projects/useActivateProject";
import { useDeleteProject } from "@/hooks/projects/useDeleteProject";
import { useFinishProject } from "@/hooks/projects/useFinishProject";
import { errorToast, successToast } from "@/utils/toast";

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
    const navigate = useNavigate();
    const { project, isEdit, setIsEdit } = useProjectContext();

    const deleteMutation = useDeleteProject();
    const activateMutation = useActivateProject();
    const finishMutation = useFinishProject();

    const handleEdit = () => {
        onEdit();
        setIsEdit(true);
    };

    const onCancel = () => {
        if (!confirm("変更を破棄しますか？")) {
            return;
        }
        setIsEdit(false);
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

    const onActivate = () => {
        if (
            !confirm(
                "企画を開催しますか？（開催すると、開催前に戻せなくなります。）",
            )
        ) {
            return;
        }
        activateMutation.mutate(
            { p_project_id: project.id },
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
        finishMutation.mutate(
            { p_project_id: project.id },
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

    return (
        <ProjectView
            projectStatus={project.status}
            isEdit={isEdit}
        >
            <ProjectView.Action pageName="">
                <ProjectView.EditButton onEdit={handleEdit} />
                <ProjectView.CancelButton onCancel={onCancel} />
                <ProjectView.SaveButton
                    disabled={isSaveDisabled}
                    onSave={onSave}
                />

                <ProjectView.DuplicateButton onDuplicate={onDuplicate} />
                <ProjectView.DeleteButton onDelete={onDelete} />

                <ProjectView.ActivateButton onActivate={onActivate} />
                <ProjectView.FinishButton onFinish={onFinish} />
            </ProjectView.Action>

            <ProjectView.Header>
                <ProjectView.Title title={project.title} />
            </ProjectView.Header>

            <ProjectView.Body>{children}</ProjectView.Body>
        </ProjectView>
    );
};

export default ProjectContainer;
