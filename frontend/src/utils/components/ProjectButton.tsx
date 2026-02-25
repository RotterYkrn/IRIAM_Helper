import type React from "react";

const ProjectButton = ({
    children,
    className,
    ...props
}: React.ComponentPropsWithoutRef<"button">) => {
    return (
        <button
            {...props}
            className={`rounded px-4 py-2 text-white active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
                ${className ?? ""}`}
        >
            {children}
        </button>
    );
};

export default ProjectButton;
