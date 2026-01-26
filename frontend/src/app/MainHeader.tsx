type MainHeaderProps = {
    onToggle: () => void;
};

const MainHeader = ({ onToggle }: MainHeaderProps) => {
    return (
        <header
            className="flex h-12 items-center gap-2 border-b bg-pink-200 px-4"
        >
            <button
                onClick={onToggle}
                className="flex h-8 w-8 items-center justify-center rounded-md
                    border border-white transition hover:bg-pink-100"
                title="メニュー"
            >
                ☰
            </button>
            <button
                onClick={() => (window.location.href = "/")}
                className="flex items-center justify-center"
            >
                🏠企画管理
            </button>
        </header>
    );
};

export default MainHeader;
