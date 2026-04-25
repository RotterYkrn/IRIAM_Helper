import { Button } from "@/components/ui/button";

/**
 * 回数カウントを増やすためのボタン
 * @param props 標準のHTMLボタンの全プロパティを継承します
 */
const PlusButton = ({
    children,
    ...props
}: React.ComponentPropsWithoutRef<"button">) => {
    return (
        <Button
            {...props}
            className={`size-7 rounded-full text-xl text-white bg-blue-500
                hover:bg-blue-500/80 `}
        >
            {children}
        </Button>
    );
};

export default PlusButton;
