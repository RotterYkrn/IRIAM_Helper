const PlusButton = ({
    children,
    ...props
}: React.ComponentPropsWithoutRef<"button">) => {
    return (
        <button
            {...props}
            className={`w-7 h-7 flex items-center justify-center rounded-full
                text-xl font-bold transition bg-blue-500 hover:bg-blue-600
                active:scale-95 text-white cursor-pointer`}
        >
            {children}
        </button>
    );
};

export default PlusButton;
