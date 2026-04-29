import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
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
            <Button
                variant="ghost"
                size="icon"
                className="border-white active:scale-100"
                title="メニュー"
                onClick={() => setIsOpenSideBar(true)}
            >
                ☰
            </Button>
            <Button
                variant="ghost"
                asChild
                className="p-0 text-lg hover:bg-transparent active:scale-100"
            >
                <Link
                    to="/"
                    aria-label="ホームへ戻る"
                >
                    🏠IRIAM企画補助つーるぅ（仮）
                </Link>
            </Button>
        </header>
    );
};

export default MainHeader;
