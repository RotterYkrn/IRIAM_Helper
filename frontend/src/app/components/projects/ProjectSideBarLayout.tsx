import ProjectSideBarGroup from "./ProjectSideBarGroup";

import { useFetchProjectForList } from "@/hooks/projects/useFetchProjectForList";

type Props = {
    /** 各企画が選択されたときに、サイドバーを閉じるために使います。 */
    toggleSidebar: () => void;
};

/**
 * サイドバーに表示する企画一覧のレイアウト
 *
 * @description
 * 開催予定、開催中、過去の企画を分類して表示します。
 */
const ProjectSideBarLayout = ({ toggleSidebar }: Props) => {
    const { data, isLoading } = useFetchProjectForList();

    if (isLoading) {
        return <div>読み込み中...</div>;
    }

    if (!data) {
        return <div>企画情報の取得に失敗しました</div>;
    }

    const { active, scheduled, finished } = data;

    return (
        <>
            <ProjectSideBarGroup
                title="開催中の企画"
                projects={active}
                toggleSidebar={toggleSidebar}
            />
            <ProjectSideBarGroup
                title="開催予定の企画"
                projects={scheduled}
                toggleSidebar={toggleSidebar}
            />
            <ProjectSideBarGroup
                title="過去の企画"
                projects={finished}
                toggleSidebar={toggleSidebar}
            />
        </>
    );
};

export default ProjectSideBarLayout;
