import { useNavigate } from "react-router-dom";

import ProjectView from "./ProjectView";

import type { Project } from "@/domain/projects/tables/Project";
import { useActivateProject } from "@/hooks/projects/useActivateProject";
import { useDeleteProject } from "@/hooks/projects/useDeleteProject";
import { useFinishProject } from "@/hooks/projects/useFinishProject";
import { errorToast, successToast } from "@/utils/toast";

type ProjectLayoutProps = {
    children: React.ReactNode;
    project: Omit<Project, "created_at" | "updated_at">;
    isEdit: boolean;
    setIsEdit: (v: boolean) => void;
    isSaveDisabled: boolean;
    onEdit: () => void;
    onSave: () => void;
    onDuplicate: () => void;
};

const ProjectLayout = ({
    children,
    project,
    isEdit,
    setIsEdit,
    isSaveDisabled,
    onEdit,
    onSave,
    onDuplicate,
}: ProjectLayoutProps) => {
    const navigate = useNavigate();
    const deleteMutation = useDeleteProject();
    const activateMutation = useActivateProject();
    const finishMutation = useFinishProject();

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
                <ProjectView.EditButton onEdit={onEdit} />
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

export default ProjectLayout;
