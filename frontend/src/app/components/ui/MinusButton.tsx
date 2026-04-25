import { Button } from "@/components/ui/button";

/**
 * 回数カウントを減らすためのボタン
 * @param props 標準のHTMLボタンの全プロパティを継承します
 */
const MinusButton = ({
    children,
    ...props
}: React.ComponentPropsWithoutRef<"button">) => {
    return (
        <Button
            {...props}
            className={`size-7 rounded-full text-xl text-white bg-red-500
                hover:bg-red-500/80 disabled:bg-gray-400 `}
        >
            {children}
        </Button>
    );
};

export default MinusButton;
