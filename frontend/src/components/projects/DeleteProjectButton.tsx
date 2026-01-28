import { useNavigate } from "react-router-dom";

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
        <button
            onClick={onClick}
            className="rounded bg-gray-500 px-4 py-2 text-white
                hover:bg-gray-600"
        >
            削除
        </button>
    );
};

export default DeleteProjectButton;
