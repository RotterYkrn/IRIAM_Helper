type NavItemProps = {
    icon: string;
    label: string;
    open: boolean;
};

const NavItem = ({ icon, label, open }: NavItemProps) => {
    return (
        <button
            className="flex w-full items-center gap-3 px-4 py-2
                transition-colors hover:bg-neutral-800"
        >
            <span className="text-lg">{icon}</span>

            <span
                className={`whitespace-nowrap transition-all duration-200
                    ${open ? "ml-0 opacity-100" : "pointer-events-none -ml-4 opacity-0"}
                    `}
            >
                {label}
            </span>
        </button>
    );
};

export default NavItem;
