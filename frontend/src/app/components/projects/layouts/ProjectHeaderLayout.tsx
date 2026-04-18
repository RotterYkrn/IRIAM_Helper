type Props = {
    children: React.ReactNode;
};

/** 企画共通の情報を表示するコンポーネント群を配置する用 */
const ProjectHeaderLayout = ({ children }: Props) => {
    return (
        <div className="flex flex-col w-full items-center justify-between gap-2">
            {children}
        </div>
    );
};

export default ProjectHeaderLayout;
