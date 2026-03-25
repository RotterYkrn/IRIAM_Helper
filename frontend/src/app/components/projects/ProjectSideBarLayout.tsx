import ProjectSideBarGroup from "./ProjectSideBarGroup";

import { useFetchProjectForList } from "@/hooks/projects/useFetchProjectForList";

/**
 * サイドバーに表示する企画一覧のレイアウト
 *
 * @description
 * 開催予定、開催中、過去の企画を分類して表示します。
 */
const ProjectSideBarLayout = () => {
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
            />
            <ProjectSideBarGroup
                title="開催予定の企画"
                projects={scheduled}
            />
            <ProjectSideBarGroup
                title="過去の企画"
                projects={finished}
            />
        </>
    );
};

export default ProjectSideBarLayout;
