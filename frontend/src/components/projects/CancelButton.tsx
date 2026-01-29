import ProjectButton from "./ProjectButton";

interface CancelProjectButtonProps {
    onClick: () => void;
}

const CancelProjectButton = ({ onClick }: CancelProjectButtonProps) => {
    return (
        <ProjectButton
            onClick={onClick}
            className="bg-gray-500 hover:bg-gray-600"
        >
            キャンセル
        </ProjectButton>
    );
};

export default CancelProjectButton;
