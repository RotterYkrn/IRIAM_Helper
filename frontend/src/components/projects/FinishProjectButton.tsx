import ProjectButton from "./ProjectButton";

import { useFinishProject } from "@/hooks/useFinishProject";

interface FinishProjectButtonProps {
    projectId: string;
}

const FinishProjectButton = ({ projectId }: FinishProjectButtonProps) => {
    const finishMutation = useFinishProject();

    return (
        <ProjectButton
            onClick={() => finishMutation.mutate(projectId)}
            disabled={finishMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
        >
            配信終了
        </ProjectButton>
    );
};

export default FinishProjectButton;
