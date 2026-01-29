import ProjectButton from "./ProjectButton";

import { useActivateProject } from "@/hooks/useActivateProject";

interface ActivateProjectButtonProps {
    projectId: string;
}

const ActivateProjectButton = ({ projectId }: ActivateProjectButtonProps) => {
    const activateMutation = useActivateProject();

    return (
        <ProjectButton
            onClick={() => activateMutation.mutate(projectId)}
            disabled={activateMutation.isPending}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
            配信開始
        </ProjectButton>
    );
};

export default ActivateProjectButton;
