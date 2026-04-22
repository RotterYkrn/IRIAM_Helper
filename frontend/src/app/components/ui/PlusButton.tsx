/**
 * 回数カウントを増やすためのボタン
 * @param props 標準のHTMLボタンの全プロパティを継承します
 */
const PlusButton = ({
    children,
    ...props
}: React.ComponentPropsWithoutRef<"button">) => {
    return (
        <button
            {...props}
            className={`size-7 rounded-full text-xl f bg-blue-500
                hover:bg-blue-600 text-white`}
        >
            {children}
        </button>
    );
};

export default PlusButton;
