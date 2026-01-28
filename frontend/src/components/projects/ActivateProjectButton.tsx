import { useActivateProject } from "@/hooks/useActivateProject";

interface ActivateProjectButtonProps {
    projectId: string;
}

const ActivateProjectButton = ({ projectId }: ActivateProjectButtonProps) => {
    const activateMutation = useActivateProject();

    return (
        <button
            onClick={() => activateMutation.mutate(projectId)}
            disabled={activateMutation.isPending}
            className="rounded bg-green-600 px-6 py-2 text-white
                hover:bg-green-700 disabled:opacity-50"
        >
            配信開始
        </button>
    );
};

export default ActivateProjectButton;
