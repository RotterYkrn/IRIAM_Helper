import SideBarProjectRowPresenter from "../presenters/SideBarProjectRowPresenter";

import { useFetchProjectForList } from "@/hooks/projects/useFetchProjectForList";

/**
 * サイドバーに表示する企画一覧のレイアウト
 *
 * @description
 * 開催予定、開催中、過去の企画を分類して表示します。
 */
const SideBarProjectListContainer = () => {
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
            <SideBarProjectRowPresenter
                title="開催中の企画"
                projects={active}
            />
            <SideBarProjectRowPresenter
                title="開催予定の企画"
                projects={scheduled}
            />
            <SideBarProjectRowPresenter
                title="過去の企画"
                projects={finished}
            />
        </>
    );
};

export default SideBarProjectListContainer;
