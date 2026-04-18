import TopProjectRowPresenter from "../presenters/TopProjectRowPresenter";

import { useFetchProjectForList } from "@/hooks/projects/useFetchProjectForList";

/**
 * トップページ用レイアウト
 *
 * @description
 * Routeにそのまま使用できます。また、以下のコンテンツが含まれます。
 * - 企画新規作成ボタン
 * - 企画一覧
 *   - 開催中の企画
 *   - 開催予定の企画
 *   - 過去の企画
 */
const TopProjectListContainer = () => {
    const { data, isLoading } = useFetchProjectForList();

    if (isLoading) {
        return <div>読み込み中...</div>;
    }

    if (!data) {
        return <div>企画情報の取得に失敗しました</div>;
    }

    const { active, scheduled, finished } = data;

    return (
        <div
            className="flex flex-col w-full items-center justify-center
                space-y-4"
        >
            <TopProjectRowPresenter
                title="開催中の企画"
                projects={active}
            />
            <TopProjectRowPresenter
                title="開催予定の企画"
                projects={scheduled}
            />
            <TopProjectRowPresenter
                title="過去の企画"
                projects={finished}
            />
        </div>
    );
};

export default TopProjectListContainer;
