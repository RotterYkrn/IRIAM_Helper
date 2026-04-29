import SelectProjectTypeDialog from "../components/projects/presenters/SelectProjectTypeDialog";
import TopProjectAccordionContainer from "../components/projects/top-project-lists/TopProjectAccordionContainer";

/**
 * トップページ用レイアウト
 * Routeにそのまま使用できます。
 *
 * @note URLが`/`である必要があります。
 */
const TopPage = () => {
    return (
        <div className="flex items-center justify-center">
            <div
                className="flex flex-col w-150 items-center justify-center
                    space-y-4"
            >
                <h1 className="text-3xl font-bold">企画一覧</h1>
                <div className="flex w-full justify-start">
                    <SelectProjectTypeDialog />
                </div>
                <TopProjectAccordionContainer />
            </div>
        </div>
    );
};

export default TopPage;
