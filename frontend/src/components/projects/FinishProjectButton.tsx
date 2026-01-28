import { useFinishProject } from "@/hooks/useFinishProject";

interface FinishProjectButtonProps {
    projectId: string;
}

const FinishProjectButton = ({ projectId }: FinishProjectButtonProps) => {
    const finishMutation = useFinishProject();

    return (
        <button
            onClick={() => finishMutation.mutate(projectId)}
            disabled={finishMutation.isPending}
            className="rounded bg-red-600 px-6 py-2 text-white hover:bg-red-700"
        >
            配信終了
        </button>
    );
};

export default FinishProjectButton;
