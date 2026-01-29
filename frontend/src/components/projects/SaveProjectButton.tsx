import ProjectButton from "./ProjectButton";

interface SaveProjectButtonProps {
    projectId: string;
    onSave: () => void;
}

const SaveProjectButton = ({ onSave }: SaveProjectButtonProps) => {
    return (
        <ProjectButton
            onClick={onSave}
            className="bg-gray-500 hover:bg-gray-600"
        >
            保存
        </ProjectButton>
    );
};

export default SaveProjectButton;
