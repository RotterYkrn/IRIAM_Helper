type Props = {
    children: React.ReactNode;
    /** 表示しているページを説明する用 */
    pageName: string;
};

/** 企画操作に関するコンポーネント群を配置する用 */
const ProjectActionLayout = ({ children, pageName }: Props) => {
    return (
        <div className="flex w-full items-start justify-between gap-2">
            <div className="flex flex-col gap-2">
                <span className="text-2xl font-bold">{pageName}</span>
            </div>
            <div className="flex gap-2">{children}</div>
        </div>
    );
};

export default ProjectActionLayout;
