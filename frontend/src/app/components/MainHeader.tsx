import { useAppContext } from "@/contexts/apps/useAppContext";

/**
 * ページのヘッダー部分のレイアウトを定義します。
 */
const MainHeader = () => {
    const { setIsOpenSideBar } = useAppContext();

    return (
        <header
            className="sticky top-0 z-1 w-full flex h-12 items-center gap-2
                bg-pink-200 px-4"
        >
            <button
                onClick={() => setIsOpenSideBar(true)}
                className="flex h-8 w-8 items-center justify-center rounded-md
                    border border-white transition hover:bg-pink-100
                    cursor-pointer"
                title="メニュー"
            >
                ☰
            </button>
            <button
                onClick={() => (window.location.href = "/")}
                className="flex items-center justify-center text-xl font-black
                    cursor-pointer"
            >
                🏠IRIAM企画補助つーるぅ（仮）
            </button>
        </header>
    );
};

export default MainHeader;
