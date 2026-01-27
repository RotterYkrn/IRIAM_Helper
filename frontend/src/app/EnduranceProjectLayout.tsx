type Props = {
    title: string;
    currentCount: number;
    targetCount: number;
    isActive: boolean;
    onIncrement: () => void;
};

const EnduranceProjectLayout = ({
    title,
    currentCount,
    targetCount,
    isActive,
    onIncrement,
}: Props) => {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                {/* タイトル */}
                <h1 className="text-3xl font-bold">{title}</h1>

                {/* カウント表示 */}
                <div className="text-4xl font-mono">
                    {currentCount} / {targetCount}
                </div>

                {/* カウントボタン */}
                <button
                    className={` rounded-full px-10 py-4 text-xl font-bold
                        transition ${
                            isActive
                                ? `bg-blue-500 hover:bg-blue-600 active:scale-95
                                    text-white`
                                : "bg-gray-400 cursor-not-allowed"
                        } `}
                    onClick={onIncrement}
                    disabled={!isActive}
                >
                    +1
                </button>
            </div>
        </div>
    );
};

export default EnduranceProjectLayout;
