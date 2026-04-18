import TopProjectListContainer from "../components/projects/containers/TopProjectListContainer";
import SelectProjectTypeDialog from "../components/projects/presenters/SelectProjectTypeDialog";

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
                <TopProjectListContainer />
            </div>
        </div>
    );
};

export default TopPage;
