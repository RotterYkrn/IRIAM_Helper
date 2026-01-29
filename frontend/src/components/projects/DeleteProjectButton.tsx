import { useNavigate } from "react-router-dom";

import ProjectButton from "./ProjectButton";

import { useDeleteProject } from "@/hooks/useDeleteProject";

interface DeleteProjectButtonProps {
    projectId: string;
}

const DeleteProjectButton = ({ projectId }: DeleteProjectButtonProps) => {
    const deleteMutation = useDeleteProject();
    const navigate = useNavigate();

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

export default DeleteProjectButton;
