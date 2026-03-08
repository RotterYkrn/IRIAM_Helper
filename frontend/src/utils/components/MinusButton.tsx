/**
 * 回数カウントを減らすためのボタン
 * @param props 標準のHTMLボタンの全プロパティを継承します
 */
const MinusButton = ({
    children,
    ...props
}: React.ComponentPropsWithoutRef<"button">) => {
    return (
        <button
            {...props}
            className={`w-7 h-7 flex items-center justify-center rounded-full
                text-xl font-bold transition text-white bg-red-500
                hover:bg-red-600 active:scale-95 cursor-pointer
                disabled:bg-gray-400 disabled:active:scale-100
                disabled:cursor-not-allowed`}
        >
            {children}
        </button>
    );
};

export default MinusButton;
