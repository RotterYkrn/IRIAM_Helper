import ProjectButton from "./ProjectButton";

interface EditProjectButtonProps {
    onClick: () => void;
}

const EditProjectButton = ({ onClick }: EditProjectButtonProps) => {
    return (
        <ProjectButton
            onClick={onClick}
            className="bg-gray-500 hover:bg-gray-600"
        >
            編集
        </ProjectButton>
    );
};

export default EditProjectButton;
