import { Button } from "@/components/ui/button";
import { useCreateEnterEnduranceProject } from "@/hooks/enter-endurances/useCreateEnterEnduranceProject";
import { errorToast, successToast } from "@/utils/toast";

const CreateEnterEnduranceProjectButton = () => {
    const { create, isCreating } = useCreateEnterEnduranceProject();

    const handleClick = () => {
        create(void 0, {
            onSuccess: () => {
                successToast("企画が正常に作成されました。");
            },
            onError: () => {
                errorToast(
                    "企画の作成中にエラーが発生しました。再度お試しください。",
                );
            },
        });
    };

    return (
        <Button
            variant={"outline"}
            size={"lg"}
            disabled={isCreating}
            onClick={handleClick}
        >
            入室耐久の企画IDを新規作成
        </Button>
    );
};

export default CreateEnterEnduranceProjectButton;
