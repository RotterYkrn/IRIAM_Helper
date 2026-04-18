type Props = {
    children: React.ReactNode;
};

/** 各企画固有のコンテンツを配置する用 */
const ProjectBodyLayout = ({ children }: Props) => {
    return (
        <div className="mt-5 flex flex-col items-center gap-6">{children}</div>
    );
};

export default ProjectBodyLayout;
