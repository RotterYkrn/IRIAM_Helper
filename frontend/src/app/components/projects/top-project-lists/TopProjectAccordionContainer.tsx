import TopProjectAccordionItemPresenter from "./TopProjectAccordionItemPresenter";

import { Accordion } from "@/components/ui/accordion";
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
const TopProjectAccordionContainer = () => {
    const { data, isLoading } = useFetchProjectForList();

    if (isLoading) {
        return <div>読み込み中...</div>;
    }

    if (!data) {
        return <div>企画情報の取得に失敗しました</div>;
    }

    const { active, scheduled, finished } = data;

    const itemProps = [
        { title: "開催中の企画", projects: active },
        { title: "開催予定の企画", projects: scheduled },
        { title: "過去の企画", projects: finished },
    ];

    return (
        <Accordion
            type="multiple"
            defaultValue={itemProps.map((item) => item.title)}
            className="w-full space-y-4"
        >
            {itemProps.map((props) => (
                <TopProjectAccordionItemPresenter
                    key={props.title}
                    title={props.title}
                    projects={props.projects}
                />
            ))}
        </Accordion>
    );
};

export default TopProjectAccordionContainer;
