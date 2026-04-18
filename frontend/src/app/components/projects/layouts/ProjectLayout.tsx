const ProjectLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div
            className="flex flex-col h-full w-full items-center justify-center
                gap-6"
        >
            {children}
        </div>
    );
};

export default ProjectLayout;
