import { Button } from "@/components/ui/button";

type Props = {
    onClick: () => void;
};

const AddUnitButton = ({ onClick }: Props) => {
    return (
        <Button
            variant="outline"
            className="h-40 w-40 border-2 border-dashed"
            onClick={onClick}
        >
            <span className="text-xl font-bold text-gray-400">⊕追加</span>
        </Button>
    );
};

export default AddUnitButton;
